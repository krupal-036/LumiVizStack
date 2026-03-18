import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Earth, Trash } from 'lucide-react';
import { AuthContext } from "../context/AuthContext";
import {
  FiUsers,
  FiDatabase,
  FiTrash2,
  FiActivity,
  FiUser,
  FiAlertTriangle,
  FiEye,
} from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi";
import Loader from "../components/common/Loader";



const AdminPanel = () => {
  const [stats, setStats] = useState({ users: 0, records: 0, isPublic: 0, isDeleted: 0 });
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
        axios.get("/api/admin/allhistory", config),
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
  const handleDeleteAllHistoryOfUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete all History of this user?")) return;
    try {
      await axios.delete(`/api/admin/users/allhistory/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("token");
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
        alert("Failed to Update Status.");
      }
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const handleSoftDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
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
        alert("Failed to Update Status.");
      }
    } catch (err) {
      console.error("Toggle error:", err);
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] py-10 px-4 sm:px-6 lg:px-8 text-slate-800 dark:text-slate-100">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-600/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-violet-500/10 dark:bg-violet-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Admin Control Panel
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Monitor system activity, manage users, and oversee data records.
          </p>
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
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 px-6 pt-4">
            <div className="flex">
              <button
                onClick={() => setActiveTab("users")}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === "users"
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
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === "history"
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
                <span className="hidden sm:flex"> Delete All </span>
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
                          <td className="py-4 px-6 text-right">
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
                          <td className="py-4 px-6 text-right">
                            {currentUser?._id !== u._id && (
                              <button
                                onClick={() => handleDeleteAllHistoryOfUser(u._id)}
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
                      {/* Header: Profile Info */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md shrink-0">
                          {u.username ? u.username[0].toUpperCase() : "U"}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-slate-800 dark:text-slate-100 truncate">
                            {u.username}
                          </span>
                          <span className={`w-fit px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mt-1 ${u.role === "admin"
                            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800"
                            }`}>
                            {u.role}
                          </span>
                        </div>
                      </div>

                      {/* Details Section */}
                      <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Email Address</span>
                          <span className="text-sm text-slate-600 dark:text-slate-300 break-all">
                            {u.email}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons: Full width for mobile tap-friendliness */}
                      {currentUser?._id !== u._id && (
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
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminPanel;
