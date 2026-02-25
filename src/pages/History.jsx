import React, { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FiTrash2, FiEye, FiCalendar, FiPlus, FiBarChart2,
  FiTable, FiLayout, FiSearch, FiClock, FiHash
} from "react-icons/fi";

const History = () => {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Load History from LocalStorage
  useEffect(() => {
    if (user?.email) {
      const all = JSON.parse(localStorage.getItem("vizHistory") || "[]");
      // Sort by newest first
      const userHistory = all.filter((item) => item.owner === user.email);
      userHistory.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
      setHistory(userHistory);
    }
  }, [user]);

  // Filter History based on search
  const filteredHistory = useMemo(() => {
    return history.filter(item =>
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [history, searchTerm]);

  const deleteItem = (id) => {
    if (!window.confirm("Are you sure you want to delete this visualization?")) return;

    // Update LocalStorage
    const all = JSON.parse(localStorage.getItem("vizHistory") || "[]");
    const updatedAll = all.filter((item) => item.id !== id);
    localStorage.setItem("vizHistory", JSON.stringify(updatedAll));

    // Update State
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleLoad = (item) => {
    navigate("/visualize", {
      state: {
        config: item,
        forceLoad: true
      }
    });
  };

  // Helper to determine card styling based on view type
  const getVisualConfig = (type) => {
    switch (type) {
      case 'card':
        return {
          icon: FiLayout,
          gradient: 'from-rose-500 to-orange-400',
          bgPattern: 'bg-gradient-to-br opacity-20'
        };
      case 'chart':
        return {
          icon: FiBarChart2,
          gradient: 'from-violet-500 to-purple-400',
          bgPattern: 'bg-gradient-to-br opacity-20'
        };
      case 'table':
      default:
        return {
          icon: FiTable,
          gradient: 'from-cyan-500 to-blue-400',
          bgPattern: 'bg-gradient-to-br opacity-20'
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        { /* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 relative ">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent z-20">
              History
            </h1>
            <p className="text-slate-500 dark:text-zinc-400 flex items-center gap-2 z-10">
              <FiClock /> Your recent data visualizations
            </p>
          </div>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4 relative ">
            {/* Search Bar */}
            <div className="relative flex-1 md:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 focus:border-none outline-none text-sm transition-all"
              />
            </div>

            {/* Create Button */}
            <button
              onClick={() => navigate("/visualize")}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all font-semibold text-sm whitespace-nowrap"
            >
              <FiPlus className="text-lg" /> New Visualization
            </button>
          </div>
        </div>

        {/* Grid Layout */}
        {filteredHistory.length === 0 ? (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHistory.map((item) => {
              const config = getVisualConfig(item.type);
              const Icon = config.icon;

              return (
                <div
                  key={item.id}
                  className="group relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border-2 border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                >
                  {/* Visual Header */}
                  <div className={`h-36 relative flex items-center justify-center overflow-hidden bg-linear-to-br ${config.gradient}`}>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PC9zdmc+')] opacity-30"></div>

                    {/* Animated Icon */}
                    <div className="relative z-10 p-6 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                      <Icon className="text-white text-4xl" />
                    </div>

                    {/* Type Badge */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-black/20 text-white backdrop-blur-sm">
                      {item.type || 'Data'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 relative">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-zinc-100 truncate pr-4">
                        {item.title || "Untitled Visualization"}
                      </h3>
                    </div>

                    {/* Meta Tags */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
                        <FiCalendar className="text-indigo-400" /> {new Date(item.savedAt).toLocaleDateString()}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
                        <FiHash className="text-indigo-400" /> {item.dataLength || 0} Records
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 border-t border-slate-100 dark:border-zinc-800 pt-4">
                      <button
                        onClick={() => handleLoad(item)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-colors shadow-sm"
                      >
                        <FiEye /> Load
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-2.5 text-slate-400 border-2 border-gray-300 dark:border-gray-600 hover:border-red-500 hover:text-red-500 dark:hover:text-red-500  hover:bg-red-100 dark:hover:bg-red-900/20 dark:hover:border-red-500 rounded-lg transition-colors"
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