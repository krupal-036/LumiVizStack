import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiPlay, FiCode, FiUploadCloud, FiLink, FiX, FiGrid, FiTable, FiBarChart2, FiSave, FiCheck } from "react-icons/fi";
import { parseData } from "../utils/dataParser";
import { AuthContext } from "../context/AuthContext";
import TableView from "../components/visualizations/TableView";
import CardView from "../components/visualizations/CardView";
import ChartView from "../components/visualizations/ChartView";

const Visualizer = () => {
  // Hooks
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // State
  const [inputType, setInputType] = useState("paste");
  const [rawInput, setRawInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [data, setData] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [savedNotification, setSavedNotification] = useState(false);

  // Effect to Load History Item if navigated from History page
  useEffect(() => {
    if (location.state?.config) {
      const config = location.state.config;
      setData(config.data || []);
      setViewMode(config.type || "table");
      setRawInput(config.rawInput || "");
      setUrlInput(config.urlInput || "");
      setInputType(config.inputType || "paste");
      
      // Clear location state to prevent re-loading on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleProcess = async () => {
    setLoading(true);
    setError("");
    try {
      let rawData = "";
      if (inputType === "paste") rawData = rawInput;
      else if (inputType === "url") {
        if (!urlInput) throw new Error("URL missing");
        const res = await fetch(urlInput);
        rawData = await res.text();
      } else if (inputType === "file") {
        rawData = rawInput; 
      }

      const parsed = parseData(rawData);
      if (parsed.length === 0) throw new Error("No valid data found");
      setData(parsed);
      setIsPanelOpen(false); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setRawInput(ev.target.result); setInputType("paste"); };
    reader.readAsText(file);
  };

  // Save Feature Implementation
  const handleSave = () => {
    if (!user || data.length === 0) return;

    const newHistoryItem = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      owner: user.email,
      title: `Visualization ${new Date().toLocaleDateString()}`,
      type: viewMode,
      savedAt: new Date().toISOString(),
      dataLength: data.length,
      // Store necessary state to reconstruct
      data: data, 
      rawInput: rawInput,
      urlInput: urlInput,
      inputType: inputType
    };

    const allHistory = JSON.parse(localStorage.getItem("vizHistory") || "[]");
    allHistory.push(newHistoryItem);
    localStorage.setItem("vizHistory", JSON.stringify(allHistory));

    // Show Notification
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  return (
    <div className="flex bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 relative min-h-[calc(100vh-80px)]">
      
      {/* Sidebar / Floating Panel */}
      <div 
        className={`sticky top-20 h-[calc(100vh-80px)] z-40 transition-all duration-300 flex-shrink-0 ${
          isPanelOpen ? 'w-96' : 'w-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="h-full bg-white dark:bg-gray-900 shadow-2xl border-r dark:border-gray-800 overflow-hidden">
          <div className="p-6 h-full flex flex-col w-96">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
                Data Source
              </h2>
              <button onClick={() => setIsPanelOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                <FiX />
              </button>
            </div>

            {/* Input Tabs */}
            <div className="flex gap-2 mb-4">
              {[
                { id: 'paste', icon: FiCode, label: 'Paste' },
                { id: 'file', icon: FiUploadCloud, label: 'File' },
                { id: 'url', icon: FiLink, label: 'URL' },
              ].map(t => (
                <button key={t.id} onClick={() => setInputType(t.id)} 
                  className={`flex-1 py-2 text-xs font-medium flex items-center justify-center gap-1 rounded-lg transition-colors ${inputType === t.id ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'}`}>
                  <t.icon size={14} /> {t.label}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="flex-1 relative mb-4">
              {inputType === 'paste' && (
                <textarea
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                  placeholder='[{"key": "value"}]'
                  className="w-full h-full p-4 font-mono text-xs border-none focus:ring-0 rounded-xl bg-gray-50 dark:bg-gray-800 resize-none outline-none"
                />
              )}
              {inputType === 'url' && (
                <div className="mt-4">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://api..."
                    className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-none outline-none text-sm"
                  />
                </div>
              )}
              {inputType === 'file' && (
                <div className="h-full flex items-center justify-center border-2 border-dashed rounded-xl dark:border-gray-700 hover:border-indigo-500">
                  <input type="file" id="fileUp" onChange={handleFileUpload} className="hidden" />
                  <label htmlFor="fileUp" className="cursor-pointer text-center p-10">
                    <FiUploadCloud className="mx-auto text-4xl text-gray-300 mb-4" />
                    <span className="text-gray-500">Click to upload JSON</span>
                  </label>
                </div>
              )}
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg text-xs">{error}</div>}

            <button
              onClick={handleProcess}
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              {loading ? "Processing..." : "Visualize Data"} <FiPlay />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 p-8 pt-4">
        
        {/* Floating Toggle Button */}
        {!isPanelOpen && (
          <button 
            onClick={() => setIsPanelOpen(true)}
            className="fixed bottom-8 left-8 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-xl hover:bg-indigo-700 transition-all"
          >
            <FiCode size={20} />
          </button>
        )}

        {/* View Mode Switcher & Save Button */}
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold">Canvas</h1>
          
          <div className="flex items-center gap-3">
            {/* Save Button - Only shows if data exists */}
            {data.length > 0 && (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition-all text-sm font-medium"
              >
                {savedNotification ? <FiCheck /> : <FiSave />} 
                {savedNotification ? "Saved!" : "Save to History"}
              </button>
            )}

            <div className="flex p-1 bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800">
              {[
                { id: 'table', icon: FiTable, label: 'Table' },
                { id: 'card', icon: FiGrid, label: 'Grid' },
                { id: 'chart', icon: FiBarChart2, label: 'Charts' },
              ].map(v => (
                <button key={v.id} onClick={() => setViewMode(v.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === v.id ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-indigo-600'}`}>
                  <v.icon size={16} /> {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Render Content */}
        <div className="pb-20">
          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center border-2 border-dashed rounded-xl dark:border-gray-800">
              <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-full mb-4">
                <FiBarChart2 className="text-4xl text-gray-300 dark:text-gray-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-400">No Data to Display</h3>
              <p className="text-sm text-gray-400 mt-2">Open the side panel and load your data source</p>
            </div>
          ) : (
            <>
              {viewMode === 'table' && <TableView data={data} />}
              {viewMode === 'card' && <CardView data={data} renderImages={true} />}
              {viewMode === 'chart' && <ChartView data={data} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Visualizer;