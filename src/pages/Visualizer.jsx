import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiPlay, FiCode, FiUploadCloud, FiLink, FiX, FiGrid, FiTable,
  FiBarChart2, FiSave, FiCheck, FiTrash2, FiList, FiShare2,
  FiClock
} from "react-icons/fi";
import { parseData } from "../utils/dataParser";
import { AuthContext } from "../context/AuthContext";
import TableView from "../components/visualizations/TableView";
import CardView from "../components/visualizations/CardView";
import ChartView from "../components/visualizations/ChartView";
import TreeView from "../components/visualizations/TreeView";
import GraphView from "../components/visualizations/GraphView";
import { Features, renderValue } from "../components/Features.jsx";

const VISUALIZER_STORAGE_KEY = "visualizerState";

const Visualizer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const reportRef = useRef(null);

  const [inputType, setInputType] = useState("paste");
  const [rawInput, setRawInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [data, setData] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [forceImages, setForceImages] = useState({});

  useEffect(() => {
    const forceLoad = location.state?.forceLoad === true;
    if (forceLoad && location.state?.config) {
      const config = location.state.config;
      setData(config.data ?? []);
      setViewMode(config.type ?? "table");
      setRawInput(config.rawInput ?? "");
      setUrlInput(config.urlInput ?? "");
      setInputType(config.inputType ?? "paste");
      sessionStorage.setItem(VISUALIZER_STORAGE_KEY, JSON.stringify(config));
      return;
    }

    const saved = sessionStorage.getItem(VISUALIZER_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setData(parsed.data ?? []);
      setViewMode(parsed.viewMode ?? "table");
      setRawInput(parsed.rawInput ?? "");
      setUrlInput(parsed.urlInput ?? "");
      setInputType(parsed.inputType ?? "paste");
    }
  }, []);

  useEffect(() => {
    if (data.length === 0) return;
    const snapshot = { data, viewMode, rawInput, urlInput, inputType };
    sessionStorage.setItem(VISUALIZER_STORAGE_KEY, JSON.stringify(snapshot));
  }, [data, viewMode, rawInput, urlInput, inputType]);

  const handleClearVisualizer = () => {
    setData([]);
    setRawInput("");
    setUrlInput("");
    setInputType("paste");
    setViewMode("table");
    setError("");
    setSearchTerm("");
    sessionStorage.removeItem(VISUALIZER_STORAGE_KEY);
  };

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

  const handleSave = () => {
    if (!user || data.length === 0) return;
    const newHistoryItem = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      owner: user.email,
      title: `Visualization ${new Date().toLocaleDateString()}`,
      type: viewMode,
      savedAt: new Date().toISOString(),
      dataLength: data.length,
      data: data,
      rawInput: rawInput,
      urlInput: urlInput,
      inputType: inputType
    };

    const allHistory = JSON.parse(localStorage.getItem("vizHistory") || "[]");
    allHistory.push(newHistoryItem);
    localStorage.setItem("vizHistory", JSON.stringify(allHistory));

    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(item =>
      Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [data, searchTerm]);

  const viewModes = [
    { id: 'table', icon: FiTable, label: 'Table' },
    { id: 'card', icon: FiGrid, label: 'Grid' },
    { id: 'chart', icon: FiBarChart2, label: 'Charts' },
    { id: 'tree', icon: FiCode, label: 'JSON' },
    { id: 'graph', icon: FiShare2, label: 'Graph' },
  ];

  return (
    <div className="relative flex bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 min-h-screen w-full">


      {isPanelOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsPanelOpen(false)} />
      )}

      <div className={`fixed inset-y-0 left-0 z-40 w-80 max-w-full transform transition-transform duration-300 ease-in-out
                    md:sticky md:top-0 md:h-screen md:translate-x-0 md:transform-none
                    ${isPanelOpen ? 'translate-x-0' : '-translate-x-full md:w-0 md:opacity-0 md:pointer-events-none'}`}>
        <div className="h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col shadow-xl md:shadow-none">

          <div className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
              Data Source
            </h2>
            <button onClick={() => setIsPanelOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <FiX />
            </button>
          </div>

          <div className="p-6 flex-1 overflow-y-auto flex flex-col">

            <div className="flex gap-2 mb-4">
              {[
                { id: 'paste', icon: FiCode, label: 'Paste' },
                { id: 'file', icon: FiUploadCloud, label: 'File' },
                { id: 'url', icon: FiLink, label: 'URL' },
              ].map(t => (
                <button key={t.id} onClick={() => setInputType(t.id)}
                  className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1 rounded-lg transition-colors border-2 
                    ${inputType === t.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 border-indigo-500'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700'}`}>
                  <t.icon size={14} /> {t.label}
                </button>
              ))}
            </div>


            <div className="flex-1 relative mb-4 min-h-[200px]">
              {inputType === 'paste' && (
                <textarea
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                  placeholder='[{"key": "value"}]'
                  className="w-full h-full p-4 font-mono text-xs border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-0 bg-gray-50 dark:bg-gray-800 resize-none outline-none"
                />
              )}
              {inputType === 'url' && (
                <div className="mt-4">
                  <input type="text" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="https://api..." className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 outline-none text-sm" />
                </div>
              )}
              {inputType === 'file' && (
                <div className="h-full flex items-center justify-center border-2 border-dashed rounded-xl dark:border-gray-700 hover:border-indigo-500 min-h-[150px]">
                  <input type="file" id="fileUp" onChange={handleFileUpload} className="hidden" />
                  <label htmlFor="fileUp" className="cursor-pointer text-center p-10">
                    <FiUploadCloud className="mx-auto text-4xl text-gray-300 dark:text-gray-500 mb-4" />
                    <span className="text-gray-500">Click to upload JSON</span>
                  </label>
                </div>
              )}
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-500 rounded-lg text-xs">{error}</div>}

            <button onClick={handleProcess} disabled={loading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50">
              {loading ? "Processing..." : "Visualize Data"} <FiPlay />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0 p-4 md:p-8 transition-all duration-300 lg:max-w-screen-2xl mx-auto px-4 lg:px-8">

        {!isPanelOpen && (
          <button onClick={() => setIsPanelOpen(true)} className="fixed bottom-6 left-6 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-xl hover:bg-indigo-700 transition-all">
            <FiCode size={20} />
          </button>
        )}

        <div className="flex flex-col gap-4 mb-8 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
                <FiBarChart2 className="w-6 h-6" />
              </div>

              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
                Visualization Canvas
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">

              {data.length > 0 && (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition-all text-sm font-medium"
                  >
                    {savedNotification ? <FiCheck /> : <FiSave />}
                    <span className="hidden sm:inline">
                      {savedNotification ? "Saved!" : "Save"}
                    </span>
                  </button>

                  <button
                    onClick={handleClearVisualizer}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-all text-sm font-medium"
                  >
                    <FiTrash2 />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                </>
              )}
              <div className="flex p-1 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto max-w-full">
                {viewModes.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setViewMode(v.id)}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap
            ${viewMode === v.id
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                      }`}
                  >
                    <v.icon size={16} />
                    <span className="hidden sm:inline">{v.label}</span>
                  </button>
                ))}
              </div>

            </div>
          </div>

          {data.length > 0 && viewMode !== "graph" && (
            <div className="w-full">
              <Features
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                targetRef={reportRef}
              />
            </div>
          )}

        </div>

        <div ref={reportRef} className="pb-20">
          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center border-2 border-dashed rounded-xl border-gray-500 dark:border-gray-500 bg-white dark:bg-gray-800/50 p-4">
              <div className="p-6 bg-gray-200/80 dark:bg-gray-800 rounded-full mb-4">
                <FiBarChart2 className="text-4xl text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">No Data to Display</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Open the side panel and load your data source</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {viewMode === 'table' && <TableView data={filteredData} renderValue={renderValue} forceImages={forceImages} setForceImages={setForceImages} />}
              {viewMode === 'card' && <CardView data={filteredData} renderValue={renderValue} forceImages={forceImages} setForceImages={setForceImages} />}
              {viewMode === 'chart' && <ChartView data={filteredData} />}
              {viewMode === 'tree' && <TreeView data={data} />}
              {viewMode === 'graph' && <GraphView data={data} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Visualizer;