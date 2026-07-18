import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
    FiTrash2, FiEye, FiEyeOff, FiClock, FiActivity,
    FiLoader, FiAlertCircle, FiBarChart2, FiLink, FiExternalLink, FiCheck,
    FiRefreshCw,
} from "react-icons/fi";
import { FaRocket } from 'react-icons/fa';
import { useAlert, useTitle } from "../hooks/customHooks";

interface HistoryItem {
  _id: string;
  isDeleted?: boolean;
  isPublic?: boolean;
  title?: string;
  type?: string;
  createdAt?: string;
  shareId?: string;
  userId?: { email?: string };
  [key: string]: any;
}

export default function History() {
    const { showAlert } = useAlert();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setErrors] = useState<string>("");
    const [actionId, setActionId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [toast, setToast] = useState<string>("");
    const navigate = useNavigate();
    const clearError = (sec: number) => {
        setTimeout(() => {
            setErrors("");
        }, sec * 1000);
    }
    useTitle("History");
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
        setErrors("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/history/user", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setHistory(data);
            } else {
                showAlert(data.message || "Failed to fetch history", "History Error", 1);
            }
        } catch (err) {
            setErrors("Server connection failed");
            clearError(3);
        }
        finally {
            setLoading(false);
        }
    };

    const handleLoad = (item: HistoryItem) => {
        navigate("/visualize", {
            state: {
                config: item,
                forceLoad: true
            }
        });
    };

    const handleToggleStatus = async (id: string) => {
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
                const nextState = updatedItem?.isPublic;
                const message = `Visualization is now ${nextState ? 'Public' : 'Private'}`;
                const alertType = nextState ? 2 : 3;
                showAlert(message, "Visibility Update", alertType);
            } else {
                showAlert(updatedItem.message || "Failed to Update Status", "Toggle Error", 1);
                clearError(3);
            }
        } catch (err) {
            const errorText = err instanceof Error ? err.message : String(err);
            showAlert(errorText || "Failed to Update Status", "Toggle Error", 1);
        } finally {
            setActionId(null);
        }
    };

    const handleDelete = async (id: string) => {
        setActionId(id);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/history/${id}`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const updatedItem = await res.json();

            if (res.ok) {
                setHistory(prev =>
                    prev.map(item => item._id === id ? updatedItem : item)
                );
                const nextState = updatedItem?.isDeleted;
                const message = `Visualization is now ${nextState ? 'Deleted' : 'Restored'}`;
                const alertType = nextState ? 1 : 2;
                showAlert(message, "History Update", alertType);

            } else {
                showAlert(updatedItem.message || "Failed to Update Status", "Toggle Error", 1);
                clearError(3);
            }
        } catch (err) {
            const errorText = err instanceof Error ? err.message : String(err);
            showAlert(errorText || "Failed to Update Status", "Toggle Error", 1);
        } finally {
            setActionId(null);
        }
    };

    const handleDeleteAll = async () => {
        if (!window.confirm("Are you sure? This will delete ALL history.")) {
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/history/delete-all", {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                setHistory(prev => prev.map(item => ({ ...item, isDeleted: true })));
                showAlert("All History items Deleted", "History Delete", 3);
            } else {
                const data = await res.json();
                showAlert(data.message || "Failed to delete all history", "History Error", 1);
            }
        } catch (err) {
            const errorText = err instanceof Error ? err.message : String(err);
            showAlert(errorText || "Failed to delete all history", "History Error", 1);
        }
    };

    const handleCopyLink = (id?: string) => {
        if (!id) return;
        const publicUrl = `${window.location.origin}/view/${id}`;

        navigator.clipboard.writeText(publicUrl).then(() => {
            setCopiedId(id);
            showAlert("Link copied to clipboard!", "Success", 2);
            setTimeout(() => setCopiedId(null), 2000);
        }).catch(err => {
            console.error("Failed to copy:", err);
            const errorText = err instanceof Error ? err.message : String(err);
            showAlert(errorText || "Failed to copy link", "Copy error", 1);
        });
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Unknown date";
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return "Unknown date";
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4 bg-gray-100 dark:bg-[#0B0F19] transition-colors duration-300">

            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-5%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-indigo-500/10 dark:bg-indigo-600/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-violet-500/10 dark:bg-violet-600/10 blur-[100px] rounded-full" />
            </div>
            {toast && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-full shadow-xl flex items-center gap-2 animate-bounce font-medium">
                    <FiCheck /> {toast}
                </div>
            )}

            <div className="max-w-7xl mx-auto">

                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col items-center md:items-start md:text-left">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center justify-center md:justify-start gap-3 w-full tracking-tight">
                            <div className="p-2.5 bg-linear-to-br from-indigo-100 to-blue-50 dark:from-indigo-900/40 dark:to-blue-900/40 rounded-xl text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-200/50 dark:border-indigo-500/20">
                                <FiClock className="w-6 h-6 stroke-[2.5px]" />
                            </div><span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-cyan-400">
                                Visualization History
                            </span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                            Your recent activity and saved charts
                        </p>
                    </div>



                    {history.length > 0 && (() => {
                        const savedItems = history.filter(item => !item.isDeleted);
                        const savedCount = history.length;
                        const publicCount = savedItems.filter(item => item.isPublic).length;
                        const privateCount = savedItems.filter(item => !item.isPublic).length;
                        const deletedCount = history.filter(item => item.isDeleted).length;

                        const limit = 10;

                        return (
                            <div className="grid grid-cols-2 md:flex md:flex-row items-center gap-3 w-full sm:w-auto">

                                <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm justify-center">
                                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Saved</span>
                                    <div className="flex items-center gap-1">
                                        <span className={`text-sm font-bold ${savedCount >= limit ? "text-red-500" : "text-indigo-600 dark:text-indigo-400"}`}>
                                            {savedCount}
                                        </span>
                                        <span className="text-gray-300 dark:text-gray-700">/</span>
                                        <span className="text-sm font-bold text-gray-400">{limit}</span>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm justify-center">
                                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Public</span>
                                    <span className="text-sm font-bold text-green-600 dark:text-green-400">{publicCount}</span>
                                </div>

                                <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm justify-center">
                                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Private</span>
                                    <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{privateCount}</span>
                                </div>

                                <div className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm justify-center">
                                    <span className="text-[10px] font-bold text-red-500 dark:text-red-400 uppercase">Trash</span>
                                    <span className="text-sm font-bold text-red-600 dark:text-red-400">{deletedCount}</span>
                                </div>

                            </div>
                        );
                    })()}

                </div>

                <div className="mb-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <FiLink className="text-indigo-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-indigo-700 dark:text-indigo-300">
                            <strong>Public Links:</strong> Toggle your chart to "Public" to enable sharing and open links.
                        </p>
                    </div>

                    <button
                        onClick={() => handleDeleteAll()}
                        className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors dark:bg-red-900/10 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                        Delete All
                    </button>
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
                        <Link
                            to="/visualize"
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/20"
                        >
                            Create Visualization
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {history.map((item) => (
                            <div key={item._id} className="group bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden flex flex-col" >
                                <div className={`p-5 border-b border-gray-50 dark:border-gray-800/50 flex-grow transition-colors ${item.isDeleted ? "bg-red-50/50 dark:bg-red-900/10" : ""
                                    }`} title={item.isDeleted ? "Click on recover button to recover your visualization" : undefined} >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className={`p-2.5 rounded-lg ${item.isDeleted
                                                ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
                                                : "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500"
                                                }`}>
                                                {item.isDeleted ? <FiTrash2 size={20} /> : <FiActivity size={20} />}
                                            </div>
                                            <div className="overflow-hidden">
                                                <h3 className={`font-bold truncate transition-all ${item.isDeleted
                                                    ? "text-red-700 dark:text-red-400 line-through opacity-70"
                                                    : "text-gray-900 dark:text-white"
                                                    }`} title={item.title}>
                                                    {item.title || "Untitled Visualization"}
                                                </h3>
                                                <p className={`text-xs mt-0.5 ${item.isDeleted
                                                    ? "text-red-500/70 dark:text-red-500/70"
                                                    : "text-gray-500 dark:text-gray-500"
                                                    }`}>
                                                    {item.isDeleted ? "Deleted Visualization" : (item.type || "Chart")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-5 py-3.5 bg-gray-50/50 dark:bg-gray-900/30 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 truncate">
                                        <FiClock />
                                        <span className="truncate min-w-0">{formatDate(item.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {item.isDeleted ? (
                                            <button onClick={() => handleDelete(item._id)} disabled={actionId === item._id} className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/40 rounded-lg text-xs font-medium transition-all" >
                                                {actionId === item._id ? (
                                                    <FiLoader className="animate-spin" />
                                                ) : (
                                                    <>
                                                        <FiRefreshCw size={14} />
                                                        Recover Item
                                                    </>
                                                )}
                                            </button>
                                        ) : (
                                            <>
                                                {item.isPublic && item.shareId && (
                                                    <>
                                                        <button onClick={() => handleCopyLink(item.shareId)} className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/20 rounded-lg transition-all relative group" title="Copy Public Link" >
                                                            {copiedId === item.shareId ? <FiCheck className="text-green-500" /> : <FiLink size={16} />}
                                                        </button>

                                                        <Link to={`/view/${item.shareId}`} className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/20 rounded-lg transition-all" title="Open Public Page" >
                                                            <FiExternalLink size={16} />
                                                        </Link>
                                                    </>
                                                )}
                                                <button onClick={() => handleToggleStatus(item._id)} disabled={actionId === item._id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${item.isPublic
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/60"
                                                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                                                    }`} title={item.isPublic ? `Switch to Private` : "Switch to Public"} >
                                                    {actionId === item._id ? (
                                                        <FiLoader className="animate-spin" />
                                                    ) : (
                                                        <>
                                                            {item.isPublic ? <FiEye size={14} /> : <FiEyeOff size={14} />}
                                                            {item.isPublic ? "Public" : "Private"}
                                                        </>
                                                    )}
                                                </button>
                                                <button onClick={() => handleLoad(item)} className="p-2 bg-blue-100 text-blue-400 dark:bg-blue-800  hover:text-blue-500 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg transition-all" title="Load this Visualization" >
                                                    <FaRocket size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(item._id)} disabled={actionId === item._id} className="p-2 text-red-700 bg-red-400 dark:text-red-800 dark:bg-red-400 hover:text-red-400 hover:bg-red-700 dark:hover:bg-red-900/50 rounded-lg transition-all" title="Delete" >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </>
                                        )}
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