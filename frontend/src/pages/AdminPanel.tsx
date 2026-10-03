// frontend/src/pages/AdminPanel.tsx
import { useEffect, useState, useContext, useMemo, type ReactNode } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import axios from "axios";
import {
    Earth,
    Trash,
    Settings,
    UserCheck,
    UserPlus,
    RefreshCw,
    Search,
    Shield,
    CheckCircle2,
    XCircle,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import {
    FiUsers,
    FiDatabase,
    FiTrash2,
    FiActivity,
    FiAlertTriangle,
    FiSettings,
    FiExternalLink,
} from "react-icons/fi";
import { HiOutlineChartBar, HiOutlineUserGroup } from "react-icons/hi";
import Loader from "@/components/common/Loader";
import { useAlert, useTheme, useTitle } from "@/hooks/customHooks";
import { useLocation, useNavigate } from "react-router-dom";
import { MdBlock } from "react-icons/md";
import { FaRocket } from "react-icons/fa";

type AdminSettings = {
    isLoginEnabled: boolean | null;
    isSignupEnabled: boolean | null;
    isHistoryCreationEnabled: boolean | null;
};

type AdminStats = {
    users: number;
    records: number;
    isPublic: number;
    isDeleted: number;
};

type AdminUser = {
    _id: string;
    username: string;
    email: string;
    role: string;
    createdAt?: string;
    historyCount?: number;
    isDeleted?: boolean;
    [key: string]: any;
};

type AdminHistoryItem = {
    _id: string;
    title?: string;
    type?: string;
    createdAt?: string;
    isPublic?: boolean;
    isDeleted?: boolean;
    shareId?: string;
    userId?: { email?: string; username?: string };
    [key: string]: any;
};

const AdminPanel = () => {
    const [stats, setStats] = useState<AdminStats>({
        users: 0,
        records: 0,
        isPublic: 0,
        isDeleted: 0,
    });
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [history, setHistory] = useState<AdminHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [settings, setSettings] = useState<AdminSettings>({
        isLoginEnabled: null,
        isSignupEnabled: null,
        isHistoryCreationEnabled: null,
    });
    const [activeTab, setActiveTab] = useState<"users" | "history" | "stats" | "settings">("users");

    // Search and Filtering State
    const [userSearch, setUserSearch] = useState("");
    const [userFilter, setUserFilter] = useState<"all" | "active" | "disabled">("all");
    const [historySearch, setHistorySearch] = useState("");
    const [historyFilter, setHistoryFilter] = useState<"all" | "public" | "private" | "deleted">(
        "all",
    );

    // Pagination State
    const [userPage, setUserPage] = useState(1);
    const [historyPage, setHistoryPage] = useState(1);
    const pageSize = 15;

    const { user: currentUser, token } = useContext(AuthContext);
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const location = useLocation();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    useTitle("Admin Command Center");

    const fetchData = async (quiet = false) => {
        if (!quiet) setLoading(true);
        if (quiet) setIsRefreshing(true);
        if (!token) return;

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const [statsRes, usersRes, historyRes, settingsRes] = await Promise.all([
                axios.get("/api/admin/stats", config),
                axios.get("/api/admin/users", config),
                axios.get("/api/admin/history", config),
                axios.get("/api/admin/settings", config),
            ]);

            setStats(statsRes.data);
            setUsers(usersRes.data);
            setHistory(historyRes.data);
            setSettings(settingsRes.data);
        } catch (err: any) {
            showAlert(
                err.response?.data?.message || "Could not load administrative data.",
                "Access Error",
                1,
            );
            navigate("/", { state: { from: location }, replace: true });
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    const handleLoad = (item: AdminHistoryItem | AdminUser) => {
        navigate("/visualize", {
            state: {
                config: item,
                forceLoad: true,
            },
        });
    };

    const handleToggle = async (field: keyof AdminSettings) => {
        const updatedValue = !settings[field];
        const originalValue = settings[field];
        setSettings({ ...settings, [field]: updatedValue });

        try {
            const response = await fetch("/api/admin/settings/auth", {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...settings, [field]: updatedValue }),
            });

            const data = await response.json();
            if (!response.ok) {
                showAlert(data?.message || "Update failed", "Error", 1);
                setSettings({ ...settings, [field]: originalValue });
                return;
            }

            const fieldName =
                field === "isLoginEnabled"
                    ? "User Login"
                    : field === "isHistoryCreationEnabled"
                      ? "History Generation"
                      : "New Sign-ups";
            const status = updatedValue ? "Enabled" : "Disabled";
            showAlert(`${fieldName} has been ${status}`, "Setting Updated", updatedValue ? 2 : 3);
        } catch {
            setSettings({ ...settings, [field]: originalValue });
            showAlert("Failed to update server settings", "Error", 1);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (
            !window.confirm(
                "Are you sure you want to permanently delete this user and all their records?",
            )
        )
            return;
        try {
            await axios.delete(`/api/admin/user/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers((prev) => prev.filter((u) => u._id !== id));
            setStats((prev) => ({ ...prev, users: Math.max(0, prev.users - 1) }));
            showAlert("User account removed successfully", "Deleted", 2);
        } catch {
            showAlert("Failed to delete user.", "Error", 1);
        }
    };

    const handleDeleteAllHistoryOfUser = async (id: string) => {
        if (
            !window.confirm(
                "Are you sure you want to clear ALL visualization records for this user?",
            )
        )
            return;
        try {
            const res: any = await axios.delete(`/api/admin/users/history/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 204) {
                showAlert("User has no associated records to delete.", "No Changes", 3);
                return;
            }
            showAlert("User records purged successfully", "Success", 2);
            fetchData(true);
        } catch {
            showAlert("Failed to purge user history.", "Error", 1);
        }
    };

    const handleToggleStatus = async (id: string) => {
        try {
            const res = await fetch(`/api/history/${id}/toggle`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setHistory((prev) =>
                    prev.map((item) =>
                        item._id === id ? { ...item, isPublic: data.isPublic } : item,
                    ),
                );
                setStats((prev) => ({
                    ...prev,
                    isPublic: data.isPublic ? prev.isPublic + 1 : Math.max(0, prev.isPublic - 1),
                }));
            } else {
                showAlert("Failed to update visibility.", "Error", 1);
            }
        } catch {
            showAlert("Network error while updating visibility", "Error", 1);
        }
    };

    const handledisableuser = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/user/${id}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setUsers((prev) =>
                    prev.map((item) =>
                        item._id === id ? { ...item, isDeleted: data.isDeleted } : item,
                    ),
                );
                showAlert(
                    `User account ${data.isDeleted ? "deactivated" : "reactivated"}`,
                    "Status Changed",
                    2,
                );
            } else {
                showAlert("Failed to update user status.", "Error", 1);
            }
        } catch {
            showAlert("Failed to toggle user status.", "Error", 1);
        }
    };

    const handleSoftDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/history/${id}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setHistory((prev) =>
                    prev.map((item) =>
                        item._id === id ? { ...item, isDeleted: data.isDeleted } : item,
                    ),
                );
                setStats((prev) => ({
                    ...prev,
                    isDeleted: data.isDeleted
                        ? prev.isDeleted + 1
                        : Math.max(0, prev.isDeleted - 1),
                }));
            }
        } catch {
            showAlert("Failed to toggle record deletion state.", "Error", 1);
        }
    };

    const handleDeleteHistoryItem = async (id: string) => {
        if (!window.confirm("Permanently delete this visualization record?")) return;
        try {
            await axios.delete(`/api/history/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setHistory((prev) => prev.filter((h) => h._id !== id));
            setStats((prev) => ({ ...prev, records: Math.max(0, prev.records - 1) }));
            showAlert("Visualization record deleted", "Removed", 2);
        } catch {
            showAlert("Failed to delete record.", "Error", 1);
        }
    };

    const handleDeleteAllHistory = async () => {
        if (
            !window.confirm(
                "WARNING: This will permanently delete ALL visualization history for EVERY user. This cannot be undone.",
            )
        )
            return;
        try {
            const res = await fetch("/api/admin/history", {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                showAlert(data.message || "All history purged", "Success", 2);
                setHistory([]);
                setStats((prev) => ({ ...prev, records: 0, isPublic: 0, isDeleted: 0 }));
            }
        } catch {
            showAlert("Failed to delete all history.", "Error", 1);
        }
    };

    // Filtered Users Pipeline
    const filteredUsers = useMemo(() => {
        return users.filter((u) => {
            const matchesQuery =
                u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
                u.email?.toLowerCase().includes(userSearch.toLowerCase());
            if (!matchesQuery) return false;
            if (userFilter === "active") return !u.isDeleted;
            if (userFilter === "disabled") return u.isDeleted;
            return true;
        });
    }, [users, userSearch, userFilter]);

    // Filtered History Pipeline
    const filteredHistory = useMemo(() => {
        return history.filter((h) => {
            const matchesQuery =
                h.title?.toLowerCase().includes(historySearch.toLowerCase()) ||
                h.userId?.email?.toLowerCase().includes(historySearch.toLowerCase()) ||
                h.type?.toLowerCase().includes(historySearch.toLowerCase());
            if (!matchesQuery) return false;
            if (historyFilter === "public") return h.isPublic && !h.isDeleted;
            if (historyFilter === "private") return !h.isPublic && !h.isDeleted;
            if (historyFilter === "deleted") return h.isDeleted;
            return true;
        });
    }, [history, historySearch, historyFilter]);

    // Paginated Slices
    const paginatedUsers = useMemo(() => {
        const start = (userPage - 1) * pageSize;
        return filteredUsers.slice(start, start + pageSize);
    }, [filteredUsers, userPage]);

    const paginatedHistory = useMemo(() => {
        const start = (historyPage - 1) * pageSize;
        return filteredHistory.slice(start, start + pageSize);
    }, [filteredHistory, historyPage]);

    const totalUserPages = Math.ceil(filteredUsers.length / pageSize) || 1;
    const totalHistoryPages = Math.ceil(filteredHistory.length / pageSize) || 1;

    const fmtDate = (d: string | undefined) => {
        if (!d) return "—";
        return new Date(d).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return <Loader data="Loading Admin Command Center..." />;
    }

    const pieData = [
        {
            name: "Active Users",
            value: Math.max(0, stats.users - stats.isDeleted),
            color: "#6366f1",
        },
        { name: "Public Viz", value: stats.isPublic || 0, color: "#10b981" },
        {
            name: "Private Viz",
            value: Math.max(0, stats.records - stats.isPublic),
            color: "#f59e0b",
        },
        { name: "Deleted Viz", value: stats.isDeleted || 0, color: "#ef4444" },
    ];

    const StatMetricCard = ({
        icon,
        title,
        value,
        subtext,
        colorClass,
    }: {
        icon: ReactNode;
        title: string;
        value: number | string;
        subtext: string;
        colorClass: string;
    }) => (
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-all hover:shadow-md hover:border-indigo-500/30">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                        {title}
                    </p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">
                        {value}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                        {subtext}
                    </p>
                </div>
                <div className={`p-3.5 rounded-2xl ${colorClass}`}>{icon}</div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-[#07090E] pt-20 pb-16 px-4 sm:px-6 lg:px-10 xl:px-12 transition-colors">
            {/* Global Top Banner */}
            <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200 dark:border-slate-800/80">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 shrink-0">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                System Administration
                            </h1>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                                Superadmin
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            Real-time overview of users, database records, telemetry, and platform
                            permissions.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => fetchData(true)}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs transition-all active:scale-95 disabled:opacity-60"
                        title="Sync latest database statistics"
                    >
                        <RefreshCw
                            className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-indigo-500" : ""}`}
                        />
                        <span>{isRefreshing ? "Syncing..." : "Sync Live Data"}</span>
                    </button>
                </div>
            </div>

            {/* Quick KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatMetricCard
                    icon={<FiUsers className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
                    title="Total Registered Users"
                    value={stats.users}
                    subtext="Platform accounts"
                    colorClass="bg-indigo-50 dark:bg-indigo-950/40"
                />
                <StatMetricCard
                    icon={<FiDatabase className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
                    title="Total Visualizations"
                    value={stats.records}
                    subtext="Stored datasets"
                    colorClass="bg-amber-50 dark:bg-amber-950/40"
                />
                <StatMetricCard
                    icon={<Earth className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
                    title="Public Share Links"
                    value={stats.isPublic}
                    subtext="Accessible globally"
                    colorClass="bg-emerald-50 dark:bg-emerald-950/40"
                />
                <StatMetricCard
                    icon={<Trash className="w-6 h-6 text-rose-600 dark:text-rose-400" />}
                    title="Archived / Deleted"
                    value={stats.isDeleted}
                    subtext="In trash bin"
                    colorClass="bg-rose-50 dark:bg-rose-950/40"
                />
            </div>

            {/* Navigation Tabs Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="inline-flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    {[
                        {
                            id: "users",
                            label: "Users Registry",
                            icon: <HiOutlineUserGroup className="w-4 h-4" />,
                        },
                        {
                            id: "history",
                            label: "Visualizations",
                            icon: <FiActivity className="w-4 h-4" />,
                        },
                        {
                            id: "stats",
                            label: "Analytics & Breakdown",
                            icon: <HiOutlineChartBar className="w-4 h-4" />,
                        },
                        {
                            id: "settings",
                            label: "Platform Policy",
                            icon: <FiSettings className="w-4 h-4" />,
                        },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                activeTab === tab.id
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                            }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {activeTab === "history" && history.length > 0 && (
                    <button
                        onClick={handleDeleteAllHistory}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/40 active:scale-95 transition-all"
                    >
                        <FiTrash2 className="w-3.5 h-3.5" />
                        <span>Purge All Platform History</span>
                    </button>
                )}
            </div>

            {/* Main Full-Width Content Container */}
            <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                {/* 1. USERS TAB */}
                {activeTab === "users" && (
                    <div className="p-4 sm:p-6 flex flex-col gap-4">
                        {/* Users Search & Filter Controls */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Filter by username or email..."
                                    value={userSearch}
                                    onChange={(e) => {
                                        setUserSearch(e.target.value);
                                        setUserPage(1);
                                    }}
                                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                />
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <select
                                    value={userFilter}
                                    onChange={(e) => {
                                        setUserFilter(e.target.value as any);
                                        setUserPage(1);
                                    }}
                                    className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-none"
                                >
                                    <option value="all">All Accounts ({users.length})</option>
                                    <option value="active">Active Only</option>
                                    <option value="disabled">Disabled Only</option>
                                </select>
                            </div>
                        </div>

                        {/* Full Width Users Table */}
                        <div className="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                        <th className="py-3 px-4">User</th>
                                        <th className="py-3 px-4">Email</th>
                                        <th className="py-3 px-4">Role</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4 text-center">Visualizations</th>
                                        <th className="py-3 px-4">Joined Date</th>
                                        <th className="py-3 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                                    {paginatedUsers.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="py-12 text-center text-slate-400"
                                            >
                                                No users matching current filters
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedUsers.map((u) => {
                                            const isSelf = currentUser?.id === u._id;
                                            return (
                                                <tr
                                                    key={u._id}
                                                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                                                >
                                                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-black flex items-center justify-center text-xs shrink-0">
                                                                {u.username
                                                                    ? u.username[0].toUpperCase()
                                                                    : "U"}
                                                            </div>
                                                            <span className="truncate">
                                                                {u.username}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-mono">
                                                        {u.email}
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <span
                                                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                                                u.role === "admin"
                                                                    ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
                                                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                                            }`}
                                                        >
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                                u.isDeleted
                                                                    ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                                                                    : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                                                            }`}
                                                        >
                                                            {u.isDeleted ? (
                                                                <>
                                                                    <XCircle className="w-3 h-3" />{" "}
                                                                    Disabled
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <CheckCircle2 className="w-3 h-3" />{" "}
                                                                    Active
                                                                </>
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-center">
                                                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                            {u.historyCount || 0}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                                                        {fmtDate(u.createdAt)}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right">
                                                        {!isSelf && u.role !== "admin" ? (
                                                            <div className="flex items-center justify-end gap-1">
                                                                <button
                                                                    onClick={() =>
                                                                        handleDeleteAllHistoryOfUser(
                                                                            u._id,
                                                                        )
                                                                    }
                                                                    className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                                                                    title="Purge user's history records"
                                                                >
                                                                    <FiTrash2 className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handledisableuser(u._id)
                                                                    }
                                                                    className={`p-1.5 rounded-lg transition-colors ${
                                                                        u.isDeleted
                                                                            ? "text-rose-600 bg-rose-50 dark:bg-rose-950/30"
                                                                            : "text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                                    }`}
                                                                    title={
                                                                        u.isDeleted
                                                                            ? "Reactivate account"
                                                                            : "Deactivate account"
                                                                    }
                                                                >
                                                                    <MdBlock className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleDeleteUser(u._id)
                                                                    }
                                                                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                                                    title="Permanently delete user"
                                                                >
                                                                    <Trash className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-[11px] text-slate-400 italic">
                                                                Protected
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Bar */}
                        {totalUserPages > 1 && (
                            <div className="flex items-center justify-between pt-2">
                                <span className="text-xs text-slate-500">
                                    Page {userPage} of {totalUserPages} ({filteredUsers.length}{" "}
                                    total)
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                                        disabled={userPage === 1}
                                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button
                                        onClick={() =>
                                            setUserPage((p) => Math.min(totalUserPages, p + 1))
                                        }
                                        disabled={userPage === totalUserPages}
                                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 2. HISTORY / VISUALIZATIONS TAB */}
                {activeTab === "history" && (
                    <div className="p-4 sm:p-6 flex flex-col gap-4">
                        {/* History Search & Filters */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by title, owner email, or type..."
                                    value={historySearch}
                                    onChange={(e) => {
                                        setHistorySearch(e.target.value);
                                        setHistoryPage(1);
                                    }}
                                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                />
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <select
                                    value={historyFilter}
                                    onChange={(e) => {
                                        setHistoryFilter(e.target.value as any);
                                        setHistoryPage(1);
                                    }}
                                    className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-none"
                                >
                                    <option value="all">All Records ({history.length})</option>
                                    <option value="public">Public Links Only</option>
                                    <option value="private">Private Records</option>
                                    <option value="deleted">Archived / Deleted</option>
                                </select>
                            </div>
                        </div>

                        {/* Full Width History Table */}
                        <div className="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                        <th className="py-3 px-4">Title</th>
                                        <th className="py-3 px-4">Owner</th>
                                        <th className="py-3 px-4">Visual Mode</th>
                                        <th className="py-3 px-4 text-center">Visibility</th>
                                        <th className="py-3 px-4 text-center">Archive Status</th>
                                        <th className="py-3 px-4">Created Date</th>
                                        <th className="py-3 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                                    {paginatedHistory.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="py-12 text-center text-slate-400"
                                            >
                                                No visualization records found matching current
                                                query
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedHistory.map((h) => (
                                            <tr
                                                key={h._id}
                                                className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                                            >
                                                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                                                    {h.title || "Untitled Visualization"}
                                                </td>
                                                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-mono">
                                                    {h.userId?.email || "Unknown"}
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-200 dark:border-indigo-800">
                                                        {h.type}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-center">
                                                    <button
                                                        onClick={() => handleToggleStatus(h._id)}
                                                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                                                            h.isPublic
                                                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                                                                : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                                        }`}
                                                        title="Toggle Public / Private"
                                                    >
                                                        {h.isPublic ? "Public" : "Private"}
                                                    </button>
                                                </td>
                                                <td className="py-3.5 px-4 text-center">
                                                    <button
                                                        onClick={() => handleSoftDelete(h._id)}
                                                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                                                            h.isDeleted
                                                                ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                                                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                                        }`}
                                                    >
                                                        {h.isDeleted ? "In Trash" : "Active"}
                                                    </button>
                                                </td>
                                                <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                                                    {fmtDate(h.createdAt)}
                                                </td>
                                                <td className="py-3.5 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            onClick={() => handleLoad(h)}
                                                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[11px] font-bold hover:bg-blue-100 transition-colors"
                                                            title="Mount visualization in editor"
                                                        >
                                                            <FaRocket size={12} />
                                                            <span>Launch</span>
                                                        </button>

                                                        {h.shareId && h.isPublic && (
                                                            <button
                                                                onClick={() =>
                                                                    window.open(
                                                                        `/view/${h.shareId}`,
                                                                        "_blank",
                                                                    )
                                                                }
                                                                className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                                                                title="Open shareable public URL"
                                                            >
                                                                <FiExternalLink className="w-4 h-4" />
                                                            </button>
                                                        )}

                                                        <button
                                                            onClick={() =>
                                                                handleDeleteHistoryItem(h._id)
                                                            }
                                                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                                            title="Permanently delete record"
                                                        >
                                                            <FiTrash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Bar */}
                        {totalHistoryPages > 1 && (
                            <div className="flex items-center justify-between pt-2">
                                <span className="text-xs text-slate-500">
                                    Page {historyPage} of {totalHistoryPages} (
                                    {filteredHistory.length} total records)
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                                        disabled={historyPage === 1}
                                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button
                                        onClick={() =>
                                            setHistoryPage((p) =>
                                                Math.min(totalHistoryPages, p + 1),
                                            )
                                        }
                                        disabled={historyPage === totalHistoryPages}
                                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 3. STATS & ANALYTICS TAB */}
                {activeTab === "stats" && (
                    <div className="p-6 sm:p-10 flex flex-col items-center">
                        <div className="text-center max-w-md mb-8">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                Platform Entity Distribution
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Breakdown of records, active configurations, and user distribution
                            </p>
                        </div>

                        <div className="w-full max-w-2xl h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                                stroke="none"
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: isDark ? "#0f172a" : "#ffffff",
                                            borderRadius: "12px",
                                            border: "1px solid rgba(148, 163, 184, 0.2)",
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                        }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        formatter={(val) => (
                                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                                                {val}
                                            </span>
                                        )}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* 4. SETTINGS TAB */}
                {activeTab === "settings" && (
                    <div className="p-6 sm:p-8 max-w-4xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                                <Settings className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Global Authentication & Access Guard
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Emergency switches to control new account creation and platform
                                    ingress.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 mt-0.5">
                                        <UserCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-slate-900 dark:text-white">
                                            User Login Ingress
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                            When disabled, existing non-admin users cannot
                                            authenticate. Admins bypass this guard.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleToggle("isLoginEnabled")}
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                                        settings.isLoginEnabled
                                            ? "bg-indigo-600"
                                            : "bg-slate-300 dark:bg-slate-700"
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                                            settings.isLoginEnabled
                                                ? "translate-x-6"
                                                : "translate-x-1"
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 mt-0.5">
                                        <UserPlus className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-slate-900 dark:text-white">
                                            Public User Registration
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                            When disabled, the registration endpoint will reject new
                                            user sign-ups.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleToggle("isSignupEnabled")}
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                                        settings.isSignupEnabled
                                            ? "bg-amber-500"
                                            : "bg-slate-300 dark:bg-slate-700"
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                                            settings.isSignupEnabled
                                                ? "translate-x-6"
                                                : "translate-x-1"
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 mt-0.5">
                                        <FiDatabase className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-slate-900 dark:text-white">
                                            Visualization Generation & Saving
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                            When disabled, non-admin users cannot save new
                                            visualizations to the database.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleToggle("isHistoryCreationEnabled")}
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                                        settings.isHistoryCreationEnabled !== false
                                            ? "bg-indigo-600"
                                            : "bg-slate-300 dark:bg-slate-700"
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                                            settings.isHistoryCreationEnabled !== false
                                                ? "translate-x-6"
                                                : "translate-x-1"
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 flex items-center gap-3 text-xs text-indigo-700 dark:text-indigo-300">
                            <FiAlertTriangle className="w-4 h-4 shrink-0" />
                            <span>
                                Toggles update in MongoDB immediately. All live sessions will
                                respect these changes on their next request.
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
