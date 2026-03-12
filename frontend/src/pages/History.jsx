import React, { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FiTrash2, FiEye, FiCalendar, FiPlus, FiBarChart2,
  FiTable, FiLayout, FiSearch, FiClock, FiHash, FiGlobe, FiLock, FiCopy, FiCheck
} from "react-icons/fi";

const History = () => {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchHistory();
    } else {
      setHistory([]);
      setLoading(false);
    }
  }, [user]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://localhost:3000/api/history/user", {
        headers: { "x-auth-token": token }
      });

      const data = await res.json();
      const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setHistory(sorted);
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = useMemo(() => {
    return history.filter(item =>
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [history, searchTerm]);

  const deleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this visualization?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/history/${id}`, {
        method: "DELETE",
        headers: { "x-auth-token": token }
      });

      if (res.ok) {
        setHistory(prev => prev.filter(item => item._id !== id));
      } else {
        alert("Failed to delete item");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoad = (item) => {
    navigate("/visualize", {
      state: {
        config: {
          data: item.data,
          type: item.type,
          rawInput: item.rawInput,
          urlInput: item.urlInput,
          inputType: item.inputType
        },
        forceLoad: true
      }
    });
  };

  const handleCopyLink = (id) => {
    const url = `${window.location.origin}/view/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getVisualConfig = (type) => {
    switch (type) {
      case 'card':
        return { icon: FiLayout, gradient: 'from-rose-500 to-orange-400' };
      case 'chart':
        return { icon: FiBarChart2, gradient: 'from-violet-500 to-purple-400' };
      case 'tree':
        return { icon: FiTable, gradient: 'from-green-500 to-teal-400' };
      default:
        return { icon: FiTable, gradient: 'from-cyan-500 to-blue-400' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 transition-colors duration-300">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <FiClock className="w-6 h-6" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
                  Visualization History
                </h1>
              </div>
              <p className="text-slate-500 dark:text-zinc-400 text-sm md:text-base max-w-md">
                Browse, load, and manage your previously saved data visualizations.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
              <div className="relative flex-1 lg:w-72">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by title or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl 
                             bg-white dark:bg-zinc-900 
                             border border-slate-200 dark:border-zinc-800 
                             focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 
                             outline-none text-sm transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600"
                />
              </div>
              <button
                onClick={() => navigate("/visualize")}
                className="flex items-center justify-center gap-2 px-5 py-2.5 
                           bg-indigo-600 hover:bg-indigo-700 
                           text-white rounded-xl 
                           shadow-md shadow-indigo-500/20 
                           transition-all font-medium text-sm whitespace-nowrap"
              >
                <FiPlus className="text-lg" /> New Visualization
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading history...</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-32 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400 mb-4">
              <FiBarChart2 size={32} />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-zinc-200">No Visualizations Found</h3>
            <p className="text-slate-400 mt-2 mb-6">
              {searchTerm ? "Nothing matches your search." : "Start by creating your first visualization."}
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigate("/visualize")}
                className="px-6 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
              >
                Get Started
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredHistory.map((item) => {
              const config = getVisualConfig(item.type);
              const Icon = config.icon;
              const itemId = item._id;

              return (
                <div
                  key={itemId}
                  className="group relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border-2 border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col"
                >
                  <div className={`h-36 relative flex items-center justify-center overflow-hidden bg-linear-to-br ${config.gradient}`}>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PC9zdmc+')] opacity-30"></div>

                    <div className="relative z-10 p-6 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                      <Icon className="text-white text-4xl" />
                    </div>

                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 backdrop-blur-sm ${item.isPublic ? 'bg-green-100/80 text-green-800' : 'bg-gray-100/80 text-gray-600'}`}>
                        {item.isPublic ? <FiGlobe size={10} /> : <FiLock size={10} />}
                        {item.isPublic ? "Public" : "Private"}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-black/20 text-white backdrop-blur-sm">
                      {item.type || 'Data'}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-zinc-100 truncate pr-4">
                        {item.title || "Untitled Visualization"}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-5">
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
                        <FiCalendar className="text-indigo-400" /> {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
                        <FiHash className="text-indigo-400" /> {item.data?.length || 0} Records
                      </span>
                    </div>

                    <div className="mt-auto flex items-center gap-2 border-t border-slate-100 dark:border-zinc-800 pt-4">
                      <button
                        onClick={() => handleLoad(item)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-colors shadow-sm"
                      >
                        <FiEye /> Load
                      </button>

                      {item.isPublic && (
                        <button
                          onClick={() => handleCopyLink(itemId)}
                          className="p-2.5 text-slate-400 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Copy Public Link"
                        >
                          {copiedId === itemId ? <FiCheck className="text-green-500" /> : <FiCopy />}
                        </button>
                      )}

                      <button
                        onClick={() => deleteItem(itemId)}
                        className="p-2.5 text-slate-400 border-2 border-gray-300 dark:border-gray-600 hover:border-red-500 hover:text-red-500 dark:hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 dark:hover:border-red-500 rounded-lg transition-colors"
                        aria-label="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;