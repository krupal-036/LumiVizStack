// src/pages/Visualizer.jsx
import { useState } from "react";
import {
  FiUploadCloud, FiCode, FiLink, FiPlay, FiTable,
  FiBarChart2, FiCreditCard, FiRefreshCw
} from "react-icons/fi";

// Components
import TableView from "../components/visualizations/TableView";
import CardView from "../components/visualizations/CardView";
import ChartView from "../components/visualizations/ChartView";

// Utils
import { parseData } from "../utils/dataParser";

const Visualizer = () => {
  // Input States
  const [inputType, setInputType] = useState("paste"); // paste | file | url
  const [jsonInput, setJsonInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  
  // Visualization States
  const [data, setData] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // table | card | chart
  const [renderImages, setRenderImages] = useState(true);
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVisualize = async () => {
    setLoading(true);
    setError("");
    setData([]);

    try {
      let rawData = "";

      if (inputType === "paste") {
        rawData = jsonInput;
      } else if (inputType === "url") {
        if (!urlInput) throw new Error("Please enter a URL");
        // Note: In production, use a backend proxy to avoid CORS issues
        const res = await fetch(urlInput);
        if (!res.ok) throw new Error("Failed to fetch data from URL");
        rawData = await res.text();
      } else if (inputType === "file") {
        if (!jsonInput) throw new Error("Please upload a file");
        rawData = jsonInput;
      }

      const parsed = parseData(rawData);
      setData(parsed);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setJsonInput(e.target.result);
        setInputType("paste"); 
      };
      reader.readAsText(file);
    }
  };

  const clearData = () => {
    setData([]);
    setJsonInput("");
    setUrlInput("");
    setError("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input Controls */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Data Input</h2>
            
            {/* Input Type Selector */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {[
                { type: 'paste', icon: FiCode, label: 'Paste' },
                { type: 'file', icon: FiUploadCloud, label: 'File' },
                { type: 'url', icon: FiLink, label: 'API URL' },
              ].map(opt => (
                <button
                  key={opt.type}
                  onClick={() => { setInputType(opt.type); clearData(); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    inputType === opt.type 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <opt.icon size={16} />
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="min-h-[200px]">
              {inputType === 'paste' && (
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder='[{"name": "John", "age": 30, "nested": {"a":1}}]'
                  className="w-full h-64 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-mono"
                />
              )}

              {inputType === 'file' && (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 hover:border-indigo-500 transition-colors cursor-pointer">
                  <input type="file" accept=".json" onChange={handleFileChange} className="hidden" id="file-upload" />
                  <label htmlFor="file-upload" className="cursor-pointer text-center p-4">
                    <FiUploadCloud className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Click to upload JSON file</span>
                  </label>
                </div>
              )}

              {inputType === 'url' && (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://api.example.com/data"
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                  <p className="text-xs text-gray-400">Note: API must allow CORS.</p>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="mt-4 pt-4 border-t dark:border-gray-800 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Auto-detect Images</span>
                <button 
                  onClick={() => setRenderImages(!renderImages)}
                  className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors ${renderImages ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${renderImages ? 'translate-x-4' : 'translate-x-1'}`} />
                </button>
              </div>
              
              <button
                onClick={handleVisualize}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg transition-colors shadow-md disabled:opacity-50"
              >
                {loading ? <FiRefreshCw className="animate-spin" /> : <FiPlay />}
                {loading ? "Processing..." : "Visualize"}
              </button>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-300 text-xs">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Output Display */}
        <div className="lg:col-span-8 bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          
          {/* View Mode Selector */}
          <div className="flex justify-between items-center mb-4 pb-4 border-b dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Output</h2>
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {[
                { mode: 'table', icon: FiTable, label: 'Table' },
                { mode: 'card', icon: FiCreditCard, label: 'Cards' },
                { mode: 'chart', icon: FiBarChart2, label: 'Chart' },
              ].map(opt => (
                <button
                  key={opt.mode}
                  onClick={() => setViewMode(opt.mode)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    viewMode === opt.mode 
                    ? 'bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-white' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  <opt.icon size={14} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Render Area */}
          <div className="min-h-[400px] w-full overflow-auto">
            {viewMode === 'table' && <TableView data={data} renderImages={renderImages} />}
            {viewMode === 'card' && <CardView data={data} renderImages={renderImages} />}
            {viewMode === 'chart' && <ChartView data={data} />}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Visualizer;