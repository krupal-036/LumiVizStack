import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import {
    FiTrash2, FiEye, FiEyeOff, FiClock, FiActivity,
    FiLoader, FiAlertCircle, FiBarChart2, FiLink, FiExternalLink, FiCheck
} from "react-icons/fi";

export default function History() {
    const { user } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionId, setActionId] = useState(null);
    const [copiedId, setCopiedId] = useState(null);
    const [toast, setToast] = useState("");

    useEffect(() => {
        fetchHistory();
    }, []);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(""), 2000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const fetchHistory = async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/history/user", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setHistory(data);
            } else {
                throw new Error(data.message || "Failed to fetch history");
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id) => {
        setActionId(id);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/history/${id}/toggle`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const updatedItem = await res.json();

            if (res.ok) {
                setHistory(prev =>
                    prev.map(item => item._id === id ? updatedItem : item)
                );
            } else {
                alert("Failed to update status");
            }
        } catch (err) {
            console.error("Toggle error:", err);
        } finally {
            setActionId(null);
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
                setHistory(prev => prev.filter(item => item._id !== id));
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

    const handleCopyLink = (id) => {
        const publicUrl = `${window.location.origin}/view/${id}`;

        navigator.clipboard.writeText(publicUrl).then(() => {
            setCopiedId(id);
            setToast("Link copied to clipboard!");
            setTimeout(() => setCopiedId(null), 2000);
        }).catch(err => {
            console.error("Failed to copy:", err);
            alert("Failed to copy link");
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen pt-10 pb-12 px-4 bg-gray-50 dark:bg-[#0B0F19] transition-colors duration-300">

            {toast && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-full shadow-xl flex items-center gap-2 animate-bounce font-medium">
                    <FiCheck /> {toast}
                </div>
            )}

            <div className="max-w-5xl mx-auto">

                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <FiClock className="text-indigo-500" />
                            Visualization History
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                            Your recent activity and saved charts
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm">
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Saved</span>
                            <span className={`text-lg font-bold ${history.length === 5 ? "text-red-600" : "text-indigo-600"} dark:text-indigo-400`}>{history.length}</span>
                            <span className="text-gray-300 dark:text-gray-700">/</span>
                            <span className="text-sm font-medium text-gray-400 dark:text-gray-600">5</span>
                        </div>
                    </div>
                </div>

                <div className="mb-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-4 flex items-start gap-3">
                    <FiLink className="text-indigo-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-indigo-700 dark:text-indigo-300">
                        <strong>Public Links:</strong> Toggle your chart to "Public" to enable sharing and open links.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 flex items-center gap-3">
                        <FiAlertCircle /> {error}
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 animate-pulse">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2 mb-6"></div>
                                <div className="flex justify-between">
                                    <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded-lg w-20"></div>
                                    <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded-lg w-24"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : history.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <FiBarChart2 size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">No History Yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                            Your saved visualizations will appear here once you create them.
                        </p>
                        <a
                            href="/dashboard"
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/20"
                        >
                            Create Visualization
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {history.map((item) => (
                            <div
                                key={item._id}
                                className="group bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden flex flex-col"
                            >
                                <div className="p-5 border-b border-gray-50 dark:border-gray-800/50 flex-grow">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-500">
                                                <FiActivity size={20} />
                                            </div>
                                            <div className="overflow-hidden">
                                                <h3 className="font-bold text-gray-900 dark:text-white truncate" title={item.title}>
                                                    {item.title || "Untitled Visualization"}
                                                </h3>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                                    {item.type || "Chart"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-5 py-3.5 bg-gray-50/50 dark:bg-gray-900/30 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                                        <FiClock />
                                        <span>{formatDate(item.createdAt)}</span>
                                    </div>

                                    <div className="flex items-center gap-2">

                                        {item.isPublic && (
                                            <>
                                                <button
                                                    onClick={() => handleCopyLink(item._id)}
                                                    className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/20 rounded-lg transition-all relative group"
                                                    title="Copy Public Link"
                                                >
                                                    {copiedId === item._id ? (
                                                        <FiCheck className="text-green-500" />
                                                    ) : (
                                                        <FiLink size={16} />
                                                    )}
                                                </button>

                                                <a
                                                    href={`/view/${item._id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                                                    title="Open Public Page"
                                                >
                                                    <FiExternalLink size={16} />
                                                </a>
                                            </>
                                        )}

                                        <button
                                            onClick={() => handleToggleStatus(item._id)}
                                            disabled={actionId === item._id}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${item.isPublic
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/60"
                                                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                                                }`}
                                        >
                                            {actionId === item._id ? (
                                                <FiLoader className="animate-spin" />
                                            ) : (
                                                <>
                                                    {item.isPublic ? <FiEye size={14} /> : <FiEyeOff size={14} />}
                                                    {item.isPublic ? "Public" : "Private"}
                                                </>
                                            )}
                                        </button>

                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            disabled={actionId === item._id}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                                            title="Delete"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}