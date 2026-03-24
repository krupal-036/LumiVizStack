import React, { useEffect, useState, useContext } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from "axios";
import { Earth, Trash, Settings, UserCheck, UserPlus } from 'lucide-react';
import { AuthContext } from "../context/AuthContext";
import {
  FiUsers,
  FiDatabase,
  FiTrash2,
  FiActivity,
  FiUser,
  FiAlertTriangle,
  FiEye,
  FiSettings,
  FiExternalLink,
} from "react-icons/fi";
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
        showAlert("Could not load administrative data.", "Invalid Role", 1);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [token]);


  const handleToggle = async (field) => {
    const updatedValue = !settings[field];
    const originalValue = settings[field];

    // Optimistic UI update
    setSettings({ ...settings, [field]: updatedValue });

    try {
      const response = await fetch('/api/admin/settings/auth', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...settings,
          [field]: updatedValue
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error('Update failed');

      const fieldName = field === 'isLoginEnabled' ? 'Login' : 'Sign-up';
      const status = updatedValue ? 'Enabled' : 'Disabled';
      const type = updatedValue ? 2 : 3;
      showAlert(`${fieldName} has been successfully ${status}`, "Success", type);
    } catch (err) {
      // Revert state if the server call fails
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
            item._id === id
              ? { ...item, isPublic: data.isPublic }
              : item
          )
        );

      } else {
        showAlert("Failed to Update Status.", "Error", 1);
      }
    } catch (err) {
      showAlert(err || "Fail tot Toggle", "Toggle error");
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
            item._id === id
              ? { ...item, isDeleted: data.isDeleted }
              : item
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
    if (
      !window.confirm(
        "⚠️ WARNING: This will permanently delete ALL visualization history for EVERY user. This cannot be undone.",
      )
    )
      return;

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

  const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-2 sm:p-1 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-xl`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          {label}
        </p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Loader data={"Loading Admin Panel..."} />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0B0F19] py-4 sm:py-10 px-4 sm:px-6 lg:px-8 text-slate-800 dark:text-slate-100">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-600/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-violet-500/10 dark:bg-violet-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-full mx-auto">

        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col items-center md:items-start md:text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center justify-center md:justify-start gap-3 w-full tracking-tight">
              <div className="p-2.5 bg-linear-to-br from-indigo-100 to-blue-50 dark:from-indigo-900/40 dark:to-blue-900/40 rounded-xl text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-200/50 dark:border-indigo-500/20">
                <FiSettings className="w-6 h-6 stroke-[2.5px]" />
              </div>
              <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-cyan-400">
                Admin Control Panel
              </span>
            </h1>
            <p className="text-gray-500 text-center dark:text-gray-400 mt-1 text-sm">
              Monitor system activity, manage users, and oversee data records.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-6 my-4 sm:mb-8">
          <StatCard
            icon={<FiUsers className="w-6 h-6" />}
            label="Total Users"
            value={stats.users}
            color="text-indigo-600 bg-indigo-100 dark:bg-indigo-900/40"
          />

          <StatCard
            icon={<FiDatabase className="w-6 h-6" />}
            label="Total Records"
            value={stats.records}
            color="text-violet-600 bg-violet-100 dark:bg-violet-900/40"
          />
          <StatCard
            icon={<Earth className="w-6 h-6" />}
            label="Total Public Records"
            value={stats.isPublic}
            color="text-violet-600 bg-violet-100 dark:bg-violet-900/40"
          />
          <StatCard
            icon={<Trash className="w-6 h-6" />}
            label="Total Deleted Records"
            value={stats.isDeleted}
            color="text-violet-600 bg-violet-100 dark:bg-violet-900/40"
          />
        </div>

        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-xl overflow-hidden backdrop-blur-md">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 pt-4 gap-4">
            <div className="flex flex-wrap items-center">
              <button
                onClick={() => setActiveTab("users")}
                className={`flex items-center gap-2 px-3 sm:px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === "users"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
              >
                <HiOutlineUserGroup className="w-5 h-5" />
                <span>Users</span>
                {activeTab === "users" && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full"></div>
                )}
              </button>

              <button
                onClick={() => setActiveTab("history")}
                className={`flex items-center gap-2 px-3 sm:px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === "history"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
              >
                <FiActivity className="w-5 h-5" />
                <span>History</span>
                {activeTab === "history" && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full"></div>
                )}
              </button>

              <button
                onClick={() => setActiveTab("stats")}
                className={`flex items-center gap-2 px-3 sm:px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === "stats"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
              >
                <HiOutlineChartBar className="w-5 h-5" />
                <span>Stats</span>
                {activeTab === "stats" && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full"></div>
                )}
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-2 px-3 sm:px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === "settings"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
              >
                <FiSettings className="w-5 h-5" />
                <span>Settings</span>
                {activeTab === "settings" && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full"></div>
                )}
              </button>
            </div>

            {activeTab === "history" && history.length > 0 && (
              <button
                onClick={handleDeleteAllHistory}
                className="hidden md:flex items-center gap-2 px-4 py-2 mb-3 sm:mb-0 text-xs font-bold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              >
                <FiTrash2 className="w-4 h-4" />
                <span> Delete All </span>
              </button>
            )}
          </div>


          <div className="p-6">
            {activeTab === "users" && (
              <div className="w-full">
                <div className="hidden md:block overflow-hidden border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/50">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                        <th className="py-4 px-6 font-semibold">User</th>
                        <th className="py-4 px-6 font-semibold">Email</th>
                        <th className="py-4 px-6 font-semibold">Role</th>
                        <th className="py-4 px-6 font-semibold">Total_Viz</th>
                        <th className="py-4 px-6 font-semibold text-right">Delete User</th>
                        <th className="py-4 px-6 font-semibold text-right">Delete History</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {users.map((u) => (
                        <tr
                          key={u._id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 shrink-0 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                {u.username ? u.username[0].toUpperCase() : "U"}
                              </div>
                              <span className="font-medium text-slate-800 dark:text-slate-100">
                                {u.username}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-slate-600 dark:text-slate-300 text-sm">
                            {u.email}
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-block ${u.role === "admin"
                                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                                : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                                }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-block ${u.role === "admin"
                                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                                : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                                }`}
                            >
                              {u.historyCount}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            {currentUser?.id !== u._id && (
                              <button
                                onClick={() => handleDeleteUser(u._id)}
                                disabled={u.role === "admin" ? true : false}
                                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                title="Delete User"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                          <td className="py-4 px-6 text-right">
                            {currentUser?.id !== u._id && (
                              <button
                                onClick={() => handleDeleteAllHistoryOfUser(u._id)}
                                disabled={u.role == "admin" ? true : false}
                                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                title="Delete User"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {users.map((u) => (
                    <div
                      key={u._id}
                      className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md shrink-0">
                          {u.username ? u.username[0].toUpperCase() : "U"}
                        </div>
                        <div className="flex flex justify-center gap-2 min-w-0">
                          <span className="font-bold text-slate-800 dark:text-slate-100 truncate">
                            {u.username}
                          </span>
                          <span className={`w-fit px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mt-1 ${u.role === "admin"
                            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800"
                            }`}>
                            {u.role}
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-100">
                            {u.historyCount}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Email Address</span>
                          <span className="text-sm text-slate-600 dark:text-slate-300 break-all">
                            {u.email}
                          </span>
                        </div>
                      </div>
                      {currentUser?.id !== u._id && (
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <button
                            onClick={() => handleDeleteAllHistoryOfUser(u._id)}
                            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 text-amber-600 text-xs font-bold active:scale-95 transition-transform border border-amber-100 dark:border-amber-900/20"
                          >
                            <FiTrash2 className="w-4 h-4" />
                            <span>Clear History</span>
                          </button>

                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-500 text-xs font-bold active:scale-95 transition-transform border border-red-100 dark:border-red-900/20"
                          >
                            <FiTrash2 className="w-4 h-4" />
                            <span>Delete User</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}


            {activeTab === "history" && (
              <div className="w-full">
                {history.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                    <FiDatabase className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    No history records found.
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="hidden md:block overflow-hidden border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/50">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                            <th className="py-4 px-6 font-semibold">Title</th>
                            <th className="py-4 px-6 font-semibold">User</th>
                            <th className="py-4 px-6 font-semibold">Type</th>
                            <th className="py-4 px-6 font-semibold text-center">Status</th>
                            <th className="py-4 px-6 font-semibold text-center">Public Link</th>
                            <th className="py-4 px-6 font-semibold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {history.map((h) => (
                            <tr key={h._id} className="hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors">
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 shrink-0 rounded-full bg-linear-to-tr from-slate-400 to-slate-600 flex items-center justify-center text-white shadow-md">
                                    <FiDatabase className="w-5 h-5" />
                                  </div>

                                  <span className="font-medium text-slate-800 dark:text-slate-100 italic">
                                    {h.title || "Untitled Record"}
                                  </span>
                                </div>
                              </td>

                              <td className="py-4 px-6 text-slate-600 dark:text-slate-300 text-sm">
                                <div className="flex items-center gap-2">
                                  <FiUser className="w-5 h-5 opacity-50" />
                                  {h.userId?.email || "Unknown"}
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400">
                                  {h.type}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex flex-col items-center gap-2">
                                  <label className="inline-flex items-center cursor-pointer group">
                                    <div className="relative">
                                      <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={h.isPublic}
                                        onChange={() => handleToggleStatus(h._id)}
                                      />
                                      <div className="w-7 h-3.5 bg-slate-200 rounded-full peer peer-checked:bg-green-500 transition-colors"></div>
                                      <div className="absolute left-[2px] top-[2px] bg-white w-2.5 h-2.5 rounded-full transition-transform peer-checked:translate-x-3.5"></div>
                                    </div>
                                    <span className={`ml-2 text-[9px] font-bold uppercase w-10 text-left ${h.isPublic ? 'text-green-700' : 'text-slate-500'}`}>
                                      {h.isPublic ? "Public" : "Private"}
                                    </span>
                                  </label>

                                  <label className="inline-flex items-center cursor-pointer group">
                                    <div className="relative">
                                      <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={h.isDeleted}
                                        onChange={() => handleSoftDelete(h._id)}
                                      />
                                      <div className="w-7 h-3.5 bg-slate-200 rounded-full peer peer-checked:bg-red-500 transition-colors"></div>
                                      <div className="absolute left-[2px] top-[2px] bg-white w-2.5 h-2.5 rounded-full transition-transform peer-checked:translate-x-3.5"></div>
                                    </div>
                                    <span className={`ml-2 text-[9px] font-bold uppercase w-10 text-left ${h.isDeleted ? 'text-red-700' : 'text-slate-500'}`}>
                                      {h.isDeleted ? "Deleted" : "Active"}
                                    </span>
                                  </label>
                                </div>
                              </td>

                              {h.shareId && h.isPublic ? (
                                <td className="py-4 px-6 text-center">
                                  <button
                                    onClick={() => window.open(`/view/${h.shareId}`, '_blank', 'noopener,noreferrer')}
                                    className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                    title="View Public Link"
                                  >
                                    <FiExternalLink className="w-4 h-4" />
                                  </button>
                                </td>
                              ) : (
                                <td className="py-4 px-6 text-center text-slate-500 italic">Private</td>
                              )}

                              <td className="py-4 px-6 text-right">
                                <button
                                  onClick={() => handleDeleteHistoryItem(h._id)}
                                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:hidden">
                      {activeTab === "history" && history.length > 0 && (
                        <button
                          onClick={handleDeleteAllHistory}
                          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors mx-auto"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          <span className=""> Delete All </span>
                        </button>
                      )}
                      {history.map((h) => (
                        <div key={h._id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-linear-to-tr from-slate-400 to-slate-600 flex items-center justify-center text-white shadow-md">
                                <FiDatabase className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-100">{h.title || "Untitled"}</h3>
                                <p className="text-xs text-slate-500">{h.type}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteHistoryItem(h._id)}
                              className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-500 active:scale-95 transition-transform"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Creator</span>
                              <span className="text-sm text-slate-600 dark:text-slate-300 truncate">{h.userId?.email}</span>
                            </div>
                            <div className="flex gap-4 items-center">
                              <label className="flex items-center cursor-pointer group">
                                <div className="relative">
                                  <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={h.isPublic}
                                    onChange={() => handleToggleStatus(h._id)}
                                  />
                                  <div className="w-8 h-4 bg-slate-200 rounded-full peer peer-checked:bg-green-500 transition-colors"></div>
                                  <div className="absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform peer-checked:translate-x-4"></div>
                                </div>
                                <span className="ml-2 text-[10px] font-bold uppercase tracking-tight text-slate-600">
                                  {h.isPublic ? "Public" : "Private"}
                                </span>
                              </label>

                              <label className="flex items-center cursor-pointer group">
                                <div className="relative">
                                  <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={h.isDeleted}
                                    onChange={() => handleSoftDelete(h._id)}
                                  />
                                  <div className="w-8 h-4 bg-slate-200 rounded-full peer peer-checked:bg-red-500 transition-colors"></div>
                                  <div className="absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform peer-checked:translate-x-4"></div>
                                </div>
                                <span className="ml-2 text-[10px] font-bold uppercase tracking-tight text-slate-600">
                                  {h.isDeleted ? "Deleted" : "Active"}
                                </span>
                              </label>
                            </div>

                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === "stats" && (
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-6 text-slate-800 dark:text-slate-100 text-center">
                  Platform Distribution
                </h3>

                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Users', value: stats.users || 0, color: '#6366f1' },
                          { name: 'Records', value: stats.records || 0, color: '#8b5cf6' },
                          { name: 'Public', value: stats.isPublic || 0, color: '#10b981' },
                          { name: 'Deleted', value: stats.isDeleted || 0, color: '#ef4444' },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={1200}
                      >
                        {[
                          { name: 'Users', color: '#6366f1' },
                          { name: 'Records', color: '#8b5cf6' },
                          { name: 'Public', color: '#10b981' },
                          { name: 'Deleted', color: '#ef4444' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>

                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: '12px',
                          border: 'none',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                          backdropFilter: 'blur(4px)'
                        }}
                      />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            {activeTab === "settings" && (
              <div className="p-0">
                <div className="max-w-full mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">

                  <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex items-center gap-3">
                    <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Site Control Panel</h2>
                  </div>

                  <div className="p-6 space-y-4">

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-colors gap-4">
                      <div className="flex gap-4">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg h-fit">
                          <UserCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">User Login</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Allow existing users to log in (Admins always allowed)</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggle('isLoginEnabled')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.isLoginEnabled ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                          }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.isLoginEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                      </button>
                    </div>


                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-colors gap-4">
                      <div className="flex gap-4">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg h-fit">
                          <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">New Signups</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Allow new users to create accounts</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggle('isSignupEnabled')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.isSignupEnabled ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                          }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.isSignupEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminPanel;
