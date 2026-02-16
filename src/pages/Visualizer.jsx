// src/pages/Visualizer.jsx
import { useState, useEffect } from "react";
import {
  FiUploadCloud, FiCode, FiLink, FiPlay, FiTable,
  FiBarChart2, FiCreditCard, FiImage, FiX, FiRefreshCw
} from "react-icons/fi";

// Helper to check if string is an image URL
const isImageUrl = (url) => {
  if (typeof url !== 'string') return false;
  return url.match(/\.(jpeg|jpg|gif|png|svg|webp)$/) != null || url.includes('unsplash') || url.includes('picsum');
};

// Helper to parse JSON safely
const parseData = (dataString) => {
  try {
    const parsed = JSON.parse(dataString);
    // Normalize to always be an array
    if (Array.isArray(parsed)) return parsed;
    if (typeof parsed === 'object' && parsed !== null) {
      // If it's an object containing a key that is an array (common in APIs)
      const arrayKey = Object.keys(parsed).find(key => Array.isArray(parsed[key]));
      return arrayKey ? parsed[arrayKey] : [parsed];
    }
    return [];
  } catch (e) {
    throw new Error("Invalid JSON format");
  }
};

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
        // In a real app, this should go through your backend proxy to avoid CORS
        const res = await fetch(urlInput);
        if (!res.ok) throw new Error("Failed to fetch data from URL");
        rawData = await res.text();
      } else if (inputType === "file") {
        // File reading logic is handled in handleFileChange
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
        setInputType("paste"); // Switch logic to use the loaded text
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

  const renderTable = () => {
    if (data.length === 0) return <p className="text-center py-10 text-gray-400">No data to display</p>;
    const headers = Object.keys(data[0]);

    return (
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {headers.map((key) => (
                <th key={key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                {headers.map((key) => (
                  <td key={key} className="px-4 py-3 whitespace-nowrap">
                    {renderImages && isImageUrl(row[key]) ? (
                      <img src={row[key]} alt="content" className="h-10 w-10 rounded object-cover" />
                    ) : (
                      <span className="text-gray-800 dark:text-gray-100">{String(row[key])}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderCards = () => {
    if (data.length === 0) return <p className="text-center py-10 text-gray-400">No data to display</p>;
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.map((item, idx) => {
          // Find first image key if exists
          const imgKey = Object.keys(item).find(k => isImageUrl(item[k]));
          const imgSrc = imgKey && renderImages ? item[imgKey] : null;

          return (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all">
              {imgSrc && <img src={imgSrc} alt="Card Visual" className="w-full h-40 object-cover" />}
              <div className="p-4">
                {Object.entries(item).map(([key, val]) => (
                  <div key={key} className="mb-1 text-xs">
                    <span className="font-semibold text-gray-500 dark:text-gray-400 uppercase mr-1">{key}:</span>
                    <span className="text-gray-800 dark:text-gray-100 break-words">
                      {renderImages && isImageUrl(val) ? <a href={val} target="_blank" rel="noreferrer" className="text-blue-500 underline">View Image</a> : String(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderChart = () => {
    if (data.length === 0) return <p className="text-center py-10 text-gray-400">No data to display</p>;
    
    // Simple Auto-Detect Logic: Find first numeric field for value, first string for label
    const firstItem = data[0];
    const keys = Object.keys(firstItem);
    const valueKey = keys.find(k => typeof firstItem[k] === 'number') || keys[1];
    const labelKey = keys.find(k => typeof firstItem[k] === 'string') || keys[0];

    return (
      <div className="space-y-4">
        <p className="text-xs text-gray-500 italic">Auto-generated bar chart using key: <strong>{valueKey}</strong></p>
        <div className="space-y-2">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-24 truncate text-xs text-gray-500 dark:text-gray-400 text-right pr-2">
                {item[labelKey]}
              </div>
              <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (item[valueKey] / Math.max(...data.map(d => d[valueKey]))) * 100)}%` }}
                />
              </div>
              <div className="w-12 text-right text-xs font-medium text-gray-700 dark:text-gray-200">
                {item[valueKey]}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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
                  placeholder='[{"name": "John", "age": 30}]'
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
            {viewMode === 'table' && renderTable()}
            {viewMode === 'card' && renderCards()}
            {viewMode === 'chart' && renderChart()}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Visualizer;