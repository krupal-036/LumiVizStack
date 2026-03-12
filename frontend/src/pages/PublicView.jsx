import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiAlertCircle, FiBarChart2, FiArrowLeft, FiCalendar, FiEye, FiSearch
} from "react-icons/fi";
import TableView from "../components/visualizations/TableView";
import CardView from "../components/visualizations/CardView";
import ChartView from "../components/visualizations/ChartView";
import TreeView from "../components/visualizations/TreeView";
import GraphView from "../components/visualizations/GraphView";
import { renderValue } from "../components/Features.jsx";

const PublicView = () => {
  const { historyId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [historyData, setHistoryData] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [forceImages, setForceImages] = useState({});

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/history/public/${historyId}`);

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to load visualization");
        }

        const data = await res.json();
        setHistoryData(data);
      } catch (err) {
        setError(err.message || "Visualization not available");
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
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading Visualization...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4">
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 p-4 md:p-8">
      <div className="max-w-screen-2xl mx-auto">

        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
              <FiEye className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{title || "Public Visualization"}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiCalendar size={12} />
                <span>{new Date(createdAt).toLocaleDateString()}</span>
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-full text-xs font-medium uppercase">
                  {type}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
          >
            <FiArrowLeft /> Back to Home
          </button>
        </div>

        <div className="mb-4 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden p-4">
          {type === 'table' && (
            <TableView
              data={filteredData}
              renderValue={renderValue}
              forceImages={forceImages}
              setForceImages={setForceImages}
            />
          )}
          {type === 'card' && (
            <CardView
              data={filteredData}
              renderValue={renderValue}
              forceImages={forceImages}
              setForceImages={setForceImages}
            />
          )}
          {type === 'chart' && <ChartView data={filteredData} />}
          {type === 'tree' && <TreeView data={historyData.data} />}
          {type === 'graph' && <GraphView data={historyData.data} />}
        </div>

      </div>
    </div>
  );
};

export default PublicView;