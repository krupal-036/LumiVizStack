import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  FiUsers,
  FiDatabase,
  FiTrash2,
  FiActivity,
  FiUser,
  FiAlertTriangle,
} from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi";
import Loader from "../components/common/Loader";

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
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

const AdminPanel = () => {
  const [stats, setStats] = useState({ users: 0, records: 0 });
  const [users, setUsers] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const { user: currentUser } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    if (!token) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [statsRes, usersRes, historyRes] = await Promise.all([
        axios.get("/api/admin/stats", config),
        axios.get("/api/admin/users", config),
        axios.get("/api/history/admin", config), 
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setHistory(historyRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

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
      alert("Failed to delete user.");
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
      alert("Failed to delete record.");
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
      await axios.delete("/api/history/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory([]);
      setStats((prev) => ({ ...prev, records: 0 }));
      alert("All history deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete all history.");
    }
  };

  if (loading) {
    return (
      <Loader data={"Loading Admin Panel..."}/>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] py-10 px-4 sm:px-6 lg:px-8 text-slate-800 dark:text-slate-100">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-600/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-violet-500/10 dark:bg-violet-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Admin Control Panel
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Monitor system activity, manage users, and oversee data records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
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
        </div>

        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-xl overflow-hidden backdrop-blur-md">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 px-6 pt-4">
            <div className="flex">
              <button
                onClick={() => setActiveTab("users")}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === "users"
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                <HiOutlineUserGroup className="w-5 h-5" />
                Users
                {activeTab === "users" && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === "history"
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                <FiActivity className="w-5 h-5" />
                History
                {activeTab === "history" && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full"></div>
                )}
              </button>
            </div>

            {activeTab === "history" && history.length > 0 && (
              <button
                onClick={handleDeleteAllHistory}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              >
                <FiTrash2 className="w-4 h-4" />
                Delete All
              </button>
            )}
          </div>

          <div className="p-6">
            {activeTab === "users" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {users.map((u) => (
                      <tr
                        key={u._id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                              {u.username ? u.username[0].toUpperCase() : "U"}
                            </div>
                            <span className="font-medium text-slate-800 dark:text-slate-100">
                              {u.username}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-600 dark:text-slate-300 text-sm">
                          {u.email}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              u.role === "admin"
                                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                                : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          {currentUser?._id !== u._id && (
                            <button
                              onClick={() => handleDeleteUser(u._id)}
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
            )}

            {activeTab === "history" && (
              <div className="overflow-x-auto">
                {history.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                    <FiDatabase className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    No history records found.
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                        <th className="py-3 px-4">Title</th>
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">IS_Public</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {history.map((h) => (
                        <tr
                          key={h._id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="py-4 px-4 font-medium text-slate-800 dark:text-slate-100">
                            {h.title || "Untitled"}
                          </td>
                          <td className="py-4 px-4 text-slate-600 dark:text-slate-300 text-sm flex items-center gap-2">
                            <FiUser className="w-4 h-4 opacity-50" />
                            {h.userId?.email || "Unknown"}
                          </td>
                          <td className="py-4 px-4 text-slate-600 dark:text-slate-300 text-sm">
                            <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">
                              {h.type}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-600 dark:text-slate-300 text-sm">
                            <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">
                              {h.isPublic ? "True" : "False"}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-500 text-sm">
                            {new Date(h.createdAt).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => handleDeleteHistoryItem(h._id)}
                              className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              title="Delete Record"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
