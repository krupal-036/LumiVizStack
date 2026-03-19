import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { FiUser, FiMail, FiSave, FiLoader, FiCheckCircle, FiAlertCircle, FiTrash2, FiRotateCcw, FiBarChart2, FiEye, FiEyeOff, FiHash, FiToggleRight, FiToggleLeft, FiTrash, FiKey, FiLock } from "react-icons/fi";

export default function UserProfile() {
    const { user, setUser, logout } = useContext(AuthContext);
    const [username, setUsername] = useState(user?.name || "");
    const [password, setPassword] = useState("");
    const [actionId, setActionId] = useState(null);
    const [email] = useState(user?.email || "");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeletingHistory, setIsDeletingHistory] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const timerRef = useRef(null);

    const [visualizations, setVisualizations] = useState([]);
    const [loadingVis, setLoadingVis] = useState(true);

    useEffect(() => {
        if (user?.name) setUsername(user.name);
    }, [user]);

    useEffect(() => {
        const fetchVisualizations = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch('/api/history/user', {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    setVisualizations(data);
                }
            } catch (err) {
                console.error("Failed to fetch visualizations:", err);
            } finally {
                setLoadingVis(false);
            }
        };

        fetchVisualizations();
    }, []);

    const validateUsername = (name) => {
        const reservedWords = ["admin", "root", "support", "help", "official", "moderator"];
        if (reservedWords.includes(name.toLowerCase())) {
            return "This username is reserved and cannot be used.";
        }
        const regex = /^[a-z][a-z0-9]*$/;
        if (!regex.test(name)) {
            return "Username must be lowercase, start with a letter, and contain only letters/numbers (no spaces).";
        }
        if (name.length < 3 || name.length > 20) {
            return "Username must be between 3 and 20 characters.";
        }
        return null;
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const error = validateUsername(username);
        if (error) {
            setMessage({ type: "error", text: error });
            return;
        }




        if (password) {
            let passwordError = "";
            if (password.length < 8) {
                passwordError = "Password must be at least 8 characters";
            } else if (!/[A-Z]/.test(password)) {
                passwordError = "Must include at least one uppercase letter";
            } else if (!/[a-z]/.test(password)) {
                passwordError = "Must include at least one lowercase letter";
            } else if (!/[0-9]/.test(password)) {
                passwordError = "Must include at least one number";
            } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                passwordError = "Must include at least one special symbol";
            }

            if (passwordError) {
                setMessage({ type: "error", text: passwordError });
                setTimeout(() => setMessage({ type: "", text: "" }), 4000);
                return;
            }
        }

        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const token = localStorage.getItem("token");
            const payload = { username };
            if (password) payload.password = password;
            const response = await fetch('/api/profile/update', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (response.ok) {
                const updatedUser = { ...user, name: data.user.name };
                setUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setPassword("");
                setMessage({ type: "success", text: "Profile updated successfully!" });
            } else {
                setMessage({ type: "error", text: data.message || "Failed to update profile." });
            }
        } catch (err) {
            console.error("Update error:", err);
            setMessage({ type: "error", text: "Server connection failed." });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage({ type: "", text: "" }), 4000);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/history/${id}/toggle`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const updatedItem = await res.json();

            if (res.ok) {
                setVisualizations(prev =>
                    prev.map(v => v._id === id ? updatedItem : v)
                );
            }
        } catch (err) {
            console.error("Toggle failed", err);
        }
    };

    const startDeletionProcess = () => {
        setIsDeleting(true);
        setCountdown(30);
        timerRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    confirmDelete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const cancelDeletion = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsDeleting(false);
        setCountdown(30);
        setMessage({ type: "success", text: "Deletion cancelled safely." });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const confirmDelete = async () => {
        try {
            const res = await fetch('/api/profile/delete', {
                method: "PUT",
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            if (res.ok) {
                alert("Account deactivated.");
                logout();
            }
        } catch (err) {
            console.error("Delete failed", err);
            setIsDeleting(false);
            setMessage({ type: "error", text: "Critical error during deactivation." });
        }
    };

    const handleDeleteAll = async () => {
        if (!window.confirm("Are you sure? This will permanently delete ALL history.")) {
            return;
        }

        setIsDeletingHistory(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/history/delete-all", {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                setVisualizations([]);
                alert("All history deleted successfully");
            } else {
                const data = await res.json();
                alert(data.message || "Failed to delete all history");
            }
        } catch (err) {
            console.error("Delete all error:", err);
        } finally {
            setIsDeletingHistory(false);
        }
    };
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this visualization?")) {
            return;
        }

        setActionId(id);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/history/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                setVisualizations(prev => prev.filter(item => item._id !== id));
            } else {
                const data = await res.json();
                alert(data.message || "Delete failed");
            }
        } catch (err) {
            console.error("Delete error:", err);
        } finally {
            setActionId(null);
        }
    };

    return (
        <div className="min-h-screen py-10 px-4 bg-gray-100 dark:bg-[#0B0F19] transition-colors duration-300">
            <div className="max-w-5xl mx-auto">

                {message.text && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${message.type === "success"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                        }`}>
                        {message.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
                        <span className="text-sm font-medium">{message.text}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col">
                        <div className="h-24 bg-linear-to-r from-indigo-600 to-violet-600 flex items-center justify-around space-x-auto gap-4">

                            <div className="w-20 h-20 rounded-2xl bg-white dark:bg-gray-900 flex items-center justify-center text-indigo-600 border-4 border-white dark:border-gray-800 shadow-xl">
                                <FiUser size={32} />
                            </div>

                            <div className="text-right item-end">
                                <h1 className="text-2xl font-bold text-white">Account Settings</h1>
                                <p className="text-indigo-100 text-sm">Manage your details</p>
                            </div>
                        </div>


                        <div className="p-8 flex-grow">


                            <form onSubmit={handleUpdate} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" placeholder="Enter your name" required disabled={isDeleting} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                                        Update Password
                                    </label>
                                    <div className="relative">
                                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                            placeholder="••••••••••••••••"
                                            disabled={isDeleting}
                                        />
                                    </div>
                                    <p className="mt-1 text-[12px] text-gray-500 italic">Leave blank to keep current password</p>
                                </div>


                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                                        Email Address
                                    </label>
                                    <div className="relative border border-gray-300 dark:border-gray-700 rounded-xl">
                                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="email" value={email} disabled className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-gray-500 cursor-not-allowed italic" />
                                    </div>
                                </div>


                                <button type="submit" disabled={loading || isDeleting || (username === user?.name && !password)} className="relative w-full flex items-center justify-center gap-2 px-6 py-3  bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white disabled:text-slate-500 font-semibold rounded-xl transition-all duration-200 ease-in-out active:scale-95 disabled:scale-100 disabled:shadow-none" >
                                    {loading ? (
                                        <FiLoader className="animate-spin" size={18} />
                                    ) : (
                                        <>
                                            <FiSave size={18} className="opacity-90" />
                                            <span>Save Changes</span>
                                        </>
                                    )}
                                </button>
                                <div>
                                    {!isDeleting ? (
                                        <button type="button" onClick={startDeletionProcess} className="group w-full flex items-center justify-center gap-2 px-4 py-3.5  rounded-xl text-sm font-semibold transition-all duration-200 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 border border-red-200 dark:border-red-400 dark:hover:border-red-900/30" >
                                            <FiTrash2 size={16} className="transition-transform group-hover:scale-110" />
                                            <span>Delete My Profile</span>
                                        </button>
                                    ) : (
                                        <div className="relative overflow-hidden rounded-2xl border border-red-200 dark:border-red-900/40 bg-slate-50 dark:bg-slate-900/20 p-4 sm:p-5">

                                            <div className="absolute inset-0 bg-red-100 dark:bg-red-950/30 transition-all duration-1000 ease-linear origin-left" style={{ width: `${(countdown / 30) * 100}%` }} />

                                            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
                                                <div className="text-center sm:text-left">
                                                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-0.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                                        <p className="text-red-600 dark:text-red-400 text-[10px] uppercase tracking-widest font-black">
                                                            Deletion Active
                                                        </p>
                                                    </div>
                                                    <p className="text-slate-600 dark:text-slate-300 text-xs font-medium">
                                                        Permanent removal in <span className="font-bold tabular-nums text-red-600">{countdown}s</span>
                                                    </p>
                                                </div>

                                                <button type="button" onClick={cancelDeletion} className="w-full sm:w-auto flex items-center justify-center gap-2  bg-white dark:bg-slate-900 text-slate-900 dark:text-white  px-6 py-2.5 rounded-xl shadow-sm border border-slate-200  dark:border-slate-700 hover:shadow-md hover:border-slate-300 active:scale-95 transition-all font-bold text-xs tracking-tight" >
                                                    <FiRotateCcw size={14} className="text-red-500" />
                                                    STOP DELETION
                                                </button>
                                            </div>

                                            <div className="absolute bottom-0 left-0 h-0.5 bg-red-500/20 w-full">
                                                <div className="h-full bg-red-500 transition-all duration-1000 ease-linear" style={{ width: `${(countdown / 30) * 100}%` }} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </form>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col">
                        <div className="p-4 md:p-8 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="w-auto sm:w-full space-y-1">
                                    <div className="flex items-center justify-between gap-8 sm:gap-3 ">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                            My Visualizations
                                        </h2>
                                        <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full font-bold text-sm flex items-center gap-2">
                                            <FiHash /> {visualizations.length}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Permanent delete your saved visualizations
                                    </p>
                                </div>

                                <div className="flex items-center shrink-0">
                                    {visualizations.length > 0 && (
                                        <button
                                            onClick={handleDeleteAll}
                                            disabled={isDeletingHistory}
                                            className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-red-200 text-red-600 hover:bg-red-400 hover:text-red-800 rounded-lg transition-all border border-red-400 disabled:opacity-50 text-xs font-medium"
                                        >
                                            {isDeletingHistory ? <FiLoader className="animate-spin" /> : <FiTrash2 />}
                                            Delete All <span className=" sm:hidden">Visualization</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex-grow p-6 overflow-y-auto custom-scrollbar" style={{ maxHeight: '500px' }}>
                            {loadingVis ? (
                                <div className="flex justify-center items-center h-full py-10">
                                    <FiLoader className="animate-spin text-indigo-500" size={32} />
                                </div>
                            ) : visualizations.length === 0 ? (
                                <div className="text-center py-10 text-gray-400 dark:text-gray-600">
                                    <FiBarChart2 className="mx-auto mb-3" size={40} />
                                    <p>No visualizations found.</p>
                                </div>
                            ) : (
                                <ul className="space-y-3">
                                    {visualizations.map((viz) => (
                                        <li key={viz._id} className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all group" >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className={`p-2 rounded-lg shadow-sm border ${viz.isDeleted
                                                    ? "bg-red-200 border-red-600 dark:bg-red-900/30 dark:border-red-700"
                                                    : "bg-indigo-200 border-indigo-600 dark:bg-indigo-300 dark:border-indigo-700"
                                                    }`}>
                                                    <FiBarChart2 className={viz.isDeleted ? "text-red-600" : "text-indigo-600"} size={20} />
                                                </div>

                                                <div className="overflow-hidden">
                                                    <h3 className={`font-semibold truncate ${viz.isDeleted
                                                        ? "text-gray-400 line-through decoration-red-500"
                                                        : "text-gray-800 dark:text-gray-200"
                                                        }`}>
                                                        {viz.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 dark:text-gray-500 capitalize">
                                                        {viz.type} • {new Date(viz.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>

                                            </div>

                                            <div className="flex items-center gap-2">


                                                {viz.isDeleted ? (
                                                    <button title="Click to Delete Permenantly" disabled={actionId === viz._id} onClick={() => handleDelete(viz._id)} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-200 bg-red-50 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                                                        <FiTrash2 size={14} />
                                                        <span className="text-xs font-semibold uppercase tracking-wide">Deleted</span>
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleToggleStatus(viz._id)}
                                                        className={`group relative flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full border transition-all duration-200 ${viz.isPublic
                                                            ? "bg-emerald-50/50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-800 dark:text-emerald-400"
                                                            : "bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                                                            } hover:shadow-sm`}
                                                        title={viz.isPublic ? "Switch to Private" : "Switch to Public"}
                                                    >
                                                        <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
                                                            {viz.isPublic ? (
                                                                <>
                                                                    <FiEye size={14} className="animate-pulse" />
                                                                    Public
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FiEyeOff size={14} />
                                                                    Private
                                                                </>
                                                            )}
                                                        </span>
                                                        <div className="ml-1 border-l border-current/20 pl-2">
                                                            {viz.isPublic ? (
                                                                <FiToggleRight size={20} className="text-emerald-500 dark:text-emerald-400" />
                                                            ) : (
                                                                <FiToggleLeft size={20} className="text-gray-400" />
                                                            )}
                                                        </div>
                                                    </button>
                                                )}


                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}