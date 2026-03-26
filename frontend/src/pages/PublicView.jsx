import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import TableView from "../components/visualizations/TableView";
import CardView from "../components/visualizations/CardView";
import ChartView from "../components/visualizations/ChartView";
import TreeView from "../components/visualizations/TreeView";
import GraphView from "../components/visualizations/GraphView";
import Loader from "../components/common/Loader.jsx"
import { renderValue } from "../components/Features.jsx";
import { FiAlertCircle, FiArrowLeft, FiBarChart2, FiCalendar, FiClock, FiCode, FiEye, FiGrid, FiHome, FiSearch, FiShare, FiShare2, FiTable, FiWatch } from "react-icons/fi";
import { useAlert } from "../hooks/customHooks.jsx";

const PublicView = () => {
  const { historyId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { showAlert } = useAlert();
  const [historyData, setHistoryData] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [forceImages, setForceImages] = useState({});

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const res = await fetch(`/api/history/public/${historyId}`);

        const data = await res.json();
        if (res.ok) {
          setHistoryData(data);
        } else {
          showAlert(data?.message || "Failed to load visualization");
          setError(data.message || "Visualization not available");
        }
      } catch (err) {
        showAlert("Visualization not available", "Server Error");
        setError("Visualization not available");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicData();
  }, [historyId]);

  const filteredData = useMemo(() => {
    if (!historyData?.data || !searchTerm) return historyData?.data || [];
    return historyData.data.filter(item =>
      Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [historyData, searchTerm]);

  if (loading) {
    return (
      <Loader data={"Loading Visualization..."} />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-black flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-200 dark:border-gray-700">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <FiAlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Oops!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
          >
            <FiArrowLeft /> Go Home
          </button>
        </div>
      </div>
    );
  }

  const { type, title, createdAt } = historyData;
  const viewModes = [
    { id: 'table', icon: FiTable, label: 'Table' },
    { id: 'card', icon: FiGrid, label: 'Grid' },
    { id: 'chart', icon: FiBarChart2, label: 'Charts' },
    { id: 'tree', icon: FiCode, label: 'JSON' },
    { id: 'graph', icon: FiShare2, label: 'Graph' },
  ];
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100  p-4 pt-20 md:pt-24">
      <div className="max-w-screen-2xl mx-auto">

        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-linear-to-br from-indigo-100 to-blue-50 dark:from-indigo-900/40 dark:to-blue-900/40 rounded-xl text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-500/20 shadow-sm">
              <FiClock className="w-6 h-6 stroke-[2.5px]" />
            </div>

            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
                <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-cyan-400">
                  {title || "Public Visualization"}
                </span>
              </h1>

              <div className="flex flex-wrap items-center gap-2 mt-0.5 text-sm text-slate-500 dark:text-zinc-400">
                <div className="flex items-center gap-1.5 font-medium">
                  <FiCalendar className="w-3.5 h-3.5" />
                  <span>{new Date(createdAt).toLocaleDateString()}</span>
                </div>

                <span className="px-2.5 py-0.5 border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {type}
                </span>
              </div>
            </div>
          </div>


          <div className="flex p-1 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto max-w-full">
            {viewModes.map(v => (
              <button
                key={v.id}
                onClick={() => setViewMode(v.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 mr-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap
            ${viewMode === v.id
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                  }`}
              >
                <v.icon size={16} />
                <span className="hidden sm:inline">{v.label}</span>
              </button>
            ))}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              <FiArrowLeft /> <span className="hidden sm:inline">Back to Home</span> <FiHome />
            </button>
          </div>
        </div>

        <div className="mb-4 relative">
          {viewMode !== 'tree' && viewMode !== 'graph' && (
            <>
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
            </>
          )}
        </div>


        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden p-4">
          {viewMode === 'table' && (
            <TableView
              data={filteredData}
              renderValue={renderValue}
              forceImages={forceImages}
              setForceImages={setForceImages}
            />
          )}
          {viewMode === 'card' && (
            <CardView
              data={filteredData}
              renderValue={renderValue}
              forceImages={forceImages}
              setForceImages={setForceImages}
            />
          )}
          {viewMode === 'chart' && <ChartView data={filteredData} />}
          {viewMode === 'tree' && <TreeView data={historyData.data} />}
          {viewMode === 'graph' && <GraphView data={historyData.data} />}
        </div>

      </div>
    </div>
  );
};

export default PublicView;