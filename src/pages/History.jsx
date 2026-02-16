import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiEye, FiCalendar, FiAlertCircle } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";

export default function History() {
  const [history, setHistory] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.email) {
      const allHistory = JSON.parse(localStorage.getItem("vizHistory") || "[]");
      
      const userHistory = allHistory.filter((item) => item.owner === user.email);
      setHistory(userHistory);
    }
  }, [user]);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this visualization?")) return;

    const allHistory = JSON.parse(localStorage.getItem("vizHistory") || "[]");
    const updatedHistory = allHistory.filter((item) => item.id !== id);
    localStorage.setItem("vizHistory", JSON.stringify(updatedHistory));

    // Update state
    setHistory(history.filter((item) => item.id !== id));
  };

  const handleLoad = (item) => {
    // Navigate to visualizer with state
    navigate("/visualize", { state: { config: item } });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Your History</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">{history.length} saved items</span>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <FiAlertCircle className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">No Visualizations Found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Save a visualization from the Editor to see it here.
          </p>
          <button 
            onClick={() => navigate("/visualize")}
            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
          >
            Create New
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div 
              key={item.id} 
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
            >
              <div className="mb-3 sm:mb-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300">
                    {item.type || "chart"}
                  </span>
                  <h3 className="font-medium text-gray-800 dark:text-white">{item.title || "Untitled Visualization"}</h3>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <FiCalendar className="w-3 h-3" />
                    {new Date(item.savedAt).toLocaleDateString()}
                  </span>
                  <span>{item.dataLength || 0} records</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button 
                  onClick={() => handleLoad(item)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-xs"
                >
                  <FiEye size={14} /> Load
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/40 text-xs"
                >
                  <FiTrash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}