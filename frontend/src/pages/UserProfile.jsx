import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { FiUser, FiMail, FiSave, FiLoader, FiCheckCircle, FiAlertCircle, FiTrash2, FiRotateCcw } from "react-icons/fi";

export default function UserProfile() {
    const { user, setUser, logout } = useContext(AuthContext);
    const [username, setUsername] = useState(user?.name || "");
    const [email] = useState(user?.email || "");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [isDeleting, setIsDeleting] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const timerRef = useRef(null);

    useEffect(() => {
        if (user?.name) setUsername(user.name);
    }, [user]);

    const validateUsername = (name) => {
        const regex = /^[A-Za-z][A-Za-z0-9]*$/;
        if (!regex.test(name)) {
            return "Username must start with a letter and contain only letters/numbers (no spaces).";
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

        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const token = localStorage.getItem("token");
            const response = await fetch('/api/profile/update', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ username }),
            });
            const data = await response.json();
            if (response.ok) {
                const updatedUser = { ...user, name: data.user.name };
                setUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
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

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-[#0B0F19] transition-colors duration-300">
            <div className="max-w-xl mx-auto">
                <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="h-32 bg-linear-to-r from-indigo-600 to-violet-600 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-2xl">
                            <FiUser size={40} />
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="mb-8 text-center">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
                            <p className="text-gray-500 dark:text-gray-400">Manage your public profile and account details</p>
                        </div>

                        {message.text && (
                            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${message.type === "success"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                }`}>
                                {message.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
                                <span className="text-sm font-medium">{message.text}</span>
                            </div>
                        )}

                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                        type="text" 
                                        value={username} 
                                        onChange={(e) => setUsername(e.target.value)} 
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" 
                                        placeholder="Enter your name" 
                                        required 
                                        disabled={isDeleting}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                        type="email" 
                                        value={email} 
                                        disabled 
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-gray-500 cursor-not-allowed italic" 
                                    />
                                </div>
                                <p className="mt-1.5 text-xs text-gray-400">Email cannot be changed after registration.</p>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading || isDeleting || (username === user?.name)} 
                                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 dark:disabled:bg-gray-800 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98]" 
                            >
                                {loading ? (
                                    <FiLoader className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <FiSave size={20} />
                                        Save Profile Changes
                                    </>
                                )}
                            </button>

                            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                                {!isDeleting ? (
                                    <button 
                                        type="button" 
                                        onClick={startDeletionProcess} 
                                        className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 px-4 py-3 rounded-xl transition text-sm font-medium border border-transparent hover:border-red-200 dark:hover:border-red-800" 
                                    >
                                        <FiTrash2 size={16} /> Delete My Profile & History
                                    </button>
                                ) : (
                                    <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl border border-red-200 dark:border-red-900/30 animate-pulse">
                                        <p className="text-red-600 dark:text-red-400 text-sm font-bold text-center mb-3">
                                            Account deletion in progress: {countdown}s
                                        </p>
                                        <button 
                                            type="button" 
                                            onClick={cancelDeletion} 
                                            className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2.5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 transition font-bold"
                                        >
                                            <FiRotateCcw size={16} /> UNDO DELETION
                                        </button>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
