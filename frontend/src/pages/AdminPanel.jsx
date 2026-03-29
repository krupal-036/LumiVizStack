import React, { useEffect, useState, useContext } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from "axios";
import { Earth, Trash, Settings, UserCheck, UserPlus } from 'lucide-react';
import { AuthContext } from "../context/AuthContext";
import { FiUsers, FiDatabase, FiTrash2, FiActivity, FiUser, FiAlertTriangle, FiEye, FiSettings, FiExternalLink } from "react-icons/fi";
import { HiOutlineChartBar, HiOutlineUserGroup } from "react-icons/hi";
import Loader from "../components/common/Loader";
import { useAlert } from "../hooks/customHooks";
import { useLocation, useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [stats, setStats] = useState({ users: 0, records: 0, isPublic: 0, isDeleted: 0 });
  const [users, setUsers] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    isLoginEnabled: null,
    isSignupEnabled: null
  });
  const [activeTab, setActiveTab] = useState("users");
  const [isDark, setIsDark] = useState(false);
  const { user: currentUser } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async () => {
    setLoading(true);
    if (!token) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [statsRes, usersRes, historyRes] = await Promise.all([
        axios.get("/api/admin/stats", config),
        axios.get("/api/admin/users", config),
        axios.get("/api/admin/allhistory", config),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setHistory(historyRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err.message);
      showAlert(err.response?.data?.message || "Could not load administrative data.", "Error...", 1);
      navigate("/", { state: { from: location }, replace: true });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setSettings(data);
      } catch (err) {
        showAlert(err?.message || "Could not load administrative data.", "Invalid Role", 1);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [token]);

  const handleToggle = async (field) => {
    const updatedValue = !settings[field];
    const originalValue = settings[field];
    setSettings({ ...settings, [field]: updatedValue });
    try {
      const response = await fetch('/api/admin/settings/auth', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...settings, [field]: updatedValue })
      });
      const data = await response.json();
      if (!response.ok) {
        showAlert(data?.message || 'Update failed', "Error", 1);
      }
      const fieldName = field === 'isLoginEnabled' ? 'Login' : 'Sign-up';
      const status = updatedValue ? 'Enabled' : 'Disabled';
      const type = updatedValue ? 2 : 3;
      showAlert(`${fieldName} has been successfully ${status}`, "Success", type);
    } catch (err) {
      setSettings({ ...settings, [field]: originalValue });
      showAlert("Failed to update server settings", "Error", 1);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/api/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
      setStats((prev) => ({ ...prev, users: prev.users - 1 }));
    } catch (err) {
      console.error(err);
      showAlert("Failed to delete user.");
    }
  };

  const handleDeleteAllHistoryOfUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete all History of this user?")) return;
    try {
      await axios.delete(`/api/admin/users/allhistory/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error(err);
      showAlert("Failed to delete All History.", "Error", 1);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await fetch(`/api/history/${id}/toggle`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setHistory(prevHistory =>
          prevHistory.map(item =>
            item._id === id ? { ...item, isPublic: data.isPublic } : item
          )
        );
      } else {
        showAlert("Failed to Update Status.", "Error", 1);
      }
    } catch (err) {
      showAlert(err || "Fail to Toggle", "Toggle error");
    }
  };

  const handleSoftDelete = async (id) => {
    try {
      const res = await fetch(`/api/history/${id}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setHistory(prevHistory =>
          prevHistory.map(item =>
            item._id === id ? { ...item, isDeleted: data.isDeleted } : item
          )
        );
      } else {
        showAlert("Failed to Update Status.");
      }
    } catch (err) {
      showAlert(err || "Fail to toggle", "Toggle error");
    }
  };

  const handleDeleteHistoryItem = async (id) => {
    if (!window.confirm("Delete this visualization record?")) return;
    try {
      await axios.delete(`/api/history/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(history.filter((h) => h._id !== id));
      setStats((prev) => ({ ...prev, records: prev.records - 1 }));
    } catch (err) {
      console.error(err);
      showAlert("Failed to delete record.", "Error...");
    }
  };

  const handleDeleteAllHistory = async () => {
    if (!window.confirm("WARNING: This will permanently delete ALL visualization history for EVERY user. This cannot be undone.")) return;
    try {
      const res = await fetch("/api/admin/history/all", {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        showAlert(data.message, "Success", 2);
      }
      setHistory([]);
      setStats((prev) => ({ ...prev, records: 0 }));
    } catch (err) {
      console.error(err);
      showAlert("Failed to delete all history.", "Error", 1);
    }
  };

  const StatCard = ({ icon, label, value, iconBg }) => (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/6 p-5 group hover:shadow-xl hover:shadow-black/4 dark:hover:shadow-black/20 transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-center justify-between pl-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mb-1.5">{label}</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${iconBg} transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <Loader data={"Loading Admin Panel..."} />;
  }

  const tabs = [
    { id: "users", label: "Users", icon: <HiOutlineUserGroup className="w-4 h-4" /> },
    { id: "history", label: "History", icon: <FiActivity className="w-4 h-4" /> },
    { id: "stats", label: "Stats", icon: <HiOutlineChartBar className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <FiSettings className="w-4 h-4" /> },
  ];

  const pieData = [
    { name: 'Users', value: stats.users || 0, color: '#0d9488' },
    { name: 'Records', value: stats.records || 0, color: '#f59e0b' },
    { name: 'Public', value: stats.isPublic || 0, color: '#10b981' },
    { name: 'Deleted', value: stats.isDeleted || 0, color: '#f43f5e' },
  ];

  const totalItems = pieData.reduce((s, d) => s + d.value, 0);

  const CenterLabel = ({ viewBox }) => {
    const { cx, cy } = viewBox;
    return (
      <text x={cx} y={cy - 8} textAnchor="middle" dominantBaseline="middle">
        <tspan style={{ fontSize: '28px', fontWeight: 900, fill: isDark ? '#f1f5f9' : '#0f172a' }}>{totalItems}</tspan>
        <tspan x={cx} dy="22" style={{ fontSize: '10px', fontWeight: 700, fill: isDark ? '#64748b' : '#94a3b8', letterSpacing: '0.15em' }}>TOTAL</tspan>
      </text>
    );
  };

  const fmtDate = (d) =>
    new Date(d).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c0e14] relative">

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[550px] h-[550px] bg-indigo-400/8 dark:bg-indigo-500/4 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 -left-40 w-[480px] h-[480px] bg-blue-400/6 dark:bg-blue-500/3 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-amber-300/3 dark:bg-amber-500/2 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-3 dark:opacity-[0.05]"
          style={{ backgroundImage: 'radial-linear(#94a3b8 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

        <header className="mb-10">
          <div className="flex items-center gap-3.5 mb-2">
            <div className="w-11 h-11 rounded-xl bg-linear-to-br from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 dark:shadow-indigo-500/10">
              <FiSettings className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Admin Panel
              </h1>
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] bg-indigo-50 dark:bg-indigo-900/25 text-indigo-700 dark:text-indigo-400 rounded-md border border-indigo-200/60 dark:border-indigo-700/30">
                Admin
              </span>
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm ml-[58px]">
            Monitor activity, manage users, and configure system settings.
          </p>
        </header>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8" aria-label="Statistics overview">
          <StatCard
            icon={<FiUsers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
            label="Total Users"
            value={stats.users}
            iconBg="bg-indigo-50 dark:bg-indigo-900/20"
          />
          <StatCard
            icon={<FiDatabase className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
            label="Total Records"
            value={stats.records}
            iconBg="bg-amber-50 dark:bg-amber-900/20"
          />
          <StatCard
            icon={<Earth className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            label="Public Records"
            value={stats.isPublic}
            iconBg="bg-blue-50 dark:bg-blue-900/20"
          />
          <StatCard
            icon={<Trash className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
            label="Deleted Records"
            value={stats.isDeleted}
            iconBg="bg-rose-50 dark:bg-rose-900/20"
          />
        </section>

        <nav className="flex items-center justify-between gap-4 mb-4 flex-wrap" aria-label="Admin panel tabs">
          <div className="inline-flex items-center gap-1 p-1.5 bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200/80 dark:border-white/6 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === tab.id
                    ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 dark:shadow-indigo-500/15"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/4"
                  }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {activeTab === "history" && history.length > 0 && (
            <button
              onClick={handleDeleteAllHistory}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40 bg-rose-50 dark:bg-rose-900/10 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/20 active:scale-[0.97] transition-all duration-200"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
              Delete All History
            </button>
          )}
        </nav>

        <main className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/80 dark:border-white/6 rounded-2xl overflow-hidden shadow-xl shadow-black/3 dark:shadow-black/20">

          {activeTab === "users" && (
            <div className="p-4 sm:p-6">
              <div className="hidden md:block overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800/60">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/80 dark:bg-slate-800/30 border-b border-slate-200/60 dark:border-slate-700/40">
                        <th className="py-3.5 px-5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">User</th>
                        <th className="py-3.5 px-5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Email</th>
                        <th className="py-3.5 px-5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Role</th>
                        <th className="py-3.5 px-5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Joined</th>
                        <th className="py-3.5 px-5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500 text-center">Viz</th>
                        <th className="py-3.5 px-5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                      {users.map((u) => (
                        <tr key={u._id} className="hover:bg-slate-50/60 dark:hover:bg-white/2 transition-colors">
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 shrink-0 rounded-full bg-linear-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                {u.username ? u.username[0].toUpperCase() : "U"}
                              </div>
                              <span className="font-semibold text-slate-800 dark:text-slate-100">{u.username}</span>
                            </div>
                          </td>
                          <td className="py-4 px-5 text-sm text-slate-500 dark:text-slate-400">{u.email}</td>
                          <td className="py-4 px-5">
                            <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider ${u.role === "admin"
                                ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-700/30"
                                : "bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/30"
                              }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4 px-5">
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{fmtDate(u.createdAt)}</span>
                          </td>
                          <td className="py-4 px-5 text-center">
                            <span className="inline-flex items-center justify-center min-w-[32px] px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/30">
                              {u.historyCount}
                            </span>
                          </td>
                          <td className="py-4 px-5">
                            <div className="flex items-center justify-end gap-1">
                              {currentUser?.id !== u._id && u.role !== "admin" && (
                                <>
                                  <button
                                    onClick={() => handleDeleteAllHistoryOfUser(u._id)}
                                    className="p-2 rounded-lg text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors"
                                    title="Delete user's history"
                                  >
                                    <FiTrash2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(u._id)}
                                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors"
                                    title="Delete user"
                                  >
                                    <Trash className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:hidden">
                {users.map((u) => (
                  <div key={u._id} className="bg-slate-50/80 dark:bg-white/2 p-4 rounded-full border border-slate-200/60 dark:border-white/4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-linear-to-br from-indigo-800 to-blue-500 flex items-center justify-center text-white font-bold shadow-sm shrink-0">
                          {u.username ? u.username[0].toUpperCase() : "U"}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 dark:text-slate-100 truncate">{u.username}</span>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 ${u.role === "admin"
                                ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400"
                                : "bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400"
                              }`}>
                              {u.role}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{u.email}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 px-2.5 py-1 rounded-lg shrink-0">
                        {u.historyCount} viz
                      </span>
                    </div>
                    {currentUser?.id !== u._id && u.role !== "admin" && (
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 dark:border-white/4">
                        <button
                          onClick={() => handleDeleteAllHistoryOfUser(u._id)}
                          className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400 text-xs font-bold active:scale-[0.97] transition-all border border-amber-200/60 dark:border-amber-800/30"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                          Clear History
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 text-xs font-bold active:scale-[0.97] transition-all border border-rose-200/60 dark:border-rose-800/30"
                        >
                          <Trash className="w-3.5 h-3.5" />
                          Delete User
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="p-4 sm:p-6">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/40 flex items-center justify-center mb-4">
                    <FiDatabase className="w-7 h-7" />
                  </div>
                  <p className="font-semibold text-slate-500 dark:text-slate-400">No history records found</p>
                  <p className="text-sm mt-1 text-slate-400 dark:text-slate-500">Records will appear here as users create visualizations.</p>
                </div>
              ) : (
                <>
                  <div className="hidden md:block overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800/60">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50/80 dark:bg-slate-800/30 border-b border-slate-200/60 dark:border-slate-700/40">
                            <th className="py-3.5 px-5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Title</th>
                            <th className="py-3.5 px-5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">User</th>
                            <th className="py-3.5 px-5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Type</th>
                            <th className="py-3.5 px-5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Created</th>
                            <th className="py-3.5 px-5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500 text-center">Visibility</th>
                            <th className="py-3.5 px-5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500 text-center">Link</th>
                            <th className="py-3.5 px-5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500 text-right">Delete</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                          {history.map((h) => (
                            <tr key={h._id} className="hover:bg-slate-50/60 dark:hover:bg-white/2 transition-colors">
                              <td className="py-4 px-5">
                                <span className="font-medium text-slate-800 dark:text-slate-100">{h.title || "Untitled Record"}</span>
                              </td>
                              <td className="py-4 px-5">
                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                  <FiUser className="w-3.5 h-3.5 opacity-40 shrink-0" />
                                  <span className="truncate max-w-[160px]">{h.userId?.email || "Unknown"}</span>
                                </div>
                              </td>
                              <td className="py-4 px-5">
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/60 text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/30">
                                  {h.type}
                                </span>
                              </td>
                              <td className="py-4 px-5">
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{fmtDate(h.createdAt)}</span>
                              </td>
                              <td className="py-4 px-5">
                                <div className="flex items-center justify-center gap-3">
                                  <label className="inline-flex items-center cursor-pointer">
                                    <div className="relative">
                                      <input type="checkbox" className="sr-only peer" checked={h.isPublic} onChange={() => handleToggleStatus(h._id)} />
                                      <div className="w-8 h-4 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-blue-500 transition-colors" />
                                      <div className="absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full shadow-sm transition-transform peer-checked:translate-x-4" />
                                    </div>
                                    <span className={`ml-1.5 text-[10px] font-bold uppercase ${h.isPublic ? 'text-emerald-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'}`}>
                                      {h.isPublic ? "On" : "Off"}
                                    </span>
                                  </label>
                                  <label className="inline-flex items-center cursor-pointer">
                                    <div className="relative">
                                      <input type="checkbox" className="sr-only peer" checked={h.isDeleted} onChange={() => handleSoftDelete(h._id)} />
                                      <div className="w-8 h-4 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-rose-500 transition-colors" />
                                      <div className="absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full shadow-sm transition-transform peer-checked:translate-x-4" />
                                    </div>
                                    <span className={`ml-1.5 text-[10px] font-bold uppercase ${h.isDeleted ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'}`}>
                                      {h.isDeleted ? "Del" : "Act"}
                                    </span>
                                  </label>
                                </div>
                              </td>
                              <td className="py-4 px-5 text-center">
                                {h.shareId && h.isPublic ? (
                                  <button
                                    onClick={() => window.open(`/view/${h.shareId}`, '_blank', 'noopener,noreferrer')}
                                    className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors inline-flex"
                                    title="Open public link"
                                  >
                                    <FiExternalLink className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <span className="text-slate-300 dark:text-slate-600">&mdash;</span>
                                )}
                              </td>
                              <td className="py-4 px-5 text-right">
                                <button
                                  onClick={() => handleDeleteHistoryItem(h._id)}
                                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors inline-flex"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:hidden">
                    {history.map((h) => (
                      <div key={h._id} className="bg-slate-50/80 dark:bg-white/2 p-4 rounded-xl border border-slate-200/60 dark:border-white/4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate">{h.title || "Untitled Record"}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/60 text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400">
                                {h.type}
                              </span>
                              <span className="text-xs text-slate-400 truncate">{h.userId?.email}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteHistoryItem(h._id)}
                            className="p-2 rounded-lg bg-rose-50 dark:bg-rose-900/10 text-rose-500 shrink-0 active:scale-90 transition-transform"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4 pt-2 border-t border-slate-200/60 dark:border-white/4">
                          <label className="inline-flex items-center cursor-pointer">
                            <div className="relative">
                              <input type="checkbox" className="sr-only peer" checked={h.isPublic} onChange={() => handleToggleStatus(h._id)} />
                              <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-blue-500 transition-colors" />
                              <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full shadow-sm transition-transform peer-checked:translate-x-4" />
                            </div>
                            <span className={`ml-2 text-[10px] font-bold uppercase tracking-wide ${h.isPublic ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                              Public
                            </span>
                          </label>
                          <label className="inline-flex items-center cursor-pointer">
                            <div className="relative">
                              <input type="checkbox" className="sr-only peer" checked={h.isDeleted} onChange={() => handleSoftDelete(h._id)} />
                              <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-rose-500 transition-colors" />
                              <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full shadow-sm transition-transform peer-checked:translate-x-4" />
                            </div>
                            <span className={`ml-2 text-[10px] font-bold uppercase tracking-wide ${h.isDeleted ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}`}>
                              Deleted
                            </span>
                          </label>
                          {h.shareId && h.isPublic && (
                            <button
                              onClick={() => window.open(`/view/${h.shareId}`, '_blank', 'noopener,noreferrer')}
                              className="ml-auto p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                              <FiExternalLink className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "stats" && (
            <div className="p-6 sm:p-10">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 text-center mb-2">
                Platform Distribution
              </h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 text-center mb-8">
                Breakdown of all platform entities by category
              </p>
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={90}
                      outerRadius={125}
                      paddingAngle={4}
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={1200}
                      animationEasing="ease-out"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                      <text
                        x="50%"
                        y="46%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: '28px', fontWeight: 900, fill: isDark ? '#f1f5f9' : '#0f172a' }}
                      >
                        {totalItems}
                      </text>
                      <text
                        x="50%"
                        y="55%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: '10px', fontWeight: 700, fill: isDark ? '#64748b' : '#94a3b8', letterSpacing: '0.15em' }}
                      >
                        TOTAL
                      </text>
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.96)',
                        borderRadius: '12px',
                        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
                        boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.5)' : '0 20px 40px rgba(0,0,0,0.08)',
                        backdropFilter: 'blur(12px)',
                        color: isDark ? '#e2e8f0' : '#1e293b',
                        fontSize: '13px',
                        fontWeight: 600,
                      }}
                      itemStyle={{ color: isDark ? '#e2e8f0' : '#1e293b' }}
                      cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={40}
                      iconType="circle"
                      iconSize={10}
                      formatter={(value) => (
                        <span style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '13px', fontWeight: 600, marginLeft: '4px' }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center">
                  <Settings className="w-[18px] h-[18px] text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Site Control</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Manage authentication and access settings</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-slate-50/80 dark:bg-white/2 border border-slate-200/60 dark:border-white/4 rounded-xl hover:border-indigo-200/60 dark:hover:border-indigo-800/30 transition-colors gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl h-fit shrink-0">
                      <UserCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-100">User Login</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Allow existing users to authenticate. Admins are always permitted.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('isLoginEnabled')}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 shrink-0 ${settings.isLoginEnabled ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    role="switch"
                    aria-checked={settings.isLoginEnabled}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${settings.isLoginEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-slate-50/80 dark:bg-white/2 border border-slate-200/60 dark:border-white/4 rounded-xl hover:border-amber-200/60 dark:hover:border-amber-800/30 transition-colors gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-xl h-fit shrink-0">
                      <UserPlus className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-100">New Signups</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Allow new users to create accounts on the platform.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('isSignupEnabled')}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 shrink-0 ${settings.isSignupEnabled ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    role="switch"
                    aria-checked={settings.isSignupEnabled}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${settings.isSignupEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-white/2 border border-slate-200/60 dark:border-white/4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-slate-200/60 dark:bg-slate-700/40 rounded-lg h-fit shrink-0 mt-0.5">
                    <FiAlertTriangle className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Disabling login will prevent all non-admin users from accessing the platform. Disabling signup closes registration while keeping existing accounts active.
                  </p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminPanel;