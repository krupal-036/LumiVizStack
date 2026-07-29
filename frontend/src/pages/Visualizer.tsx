import { ChangeEvent, useState, useEffect, useContext, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { FiCode, FiUploadCloud, FiLink, FiX, FiSave, FiCheck, FiTrash2, FiEye, FiEyeOff, FiTable, FiGrid, FiBarChart2, FiDatabase, FiGitBranch, FiLoader, FiSettings, FiSearch, FiRefreshCw } from "react-icons/fi";
import { parseData } from "../utils/dataParser.js";
import { AuthContext } from "../context/AuthContext.js";
import { useAlert, useTitle } from '../hooks/customHooks.js';
import TableView from "../components/visualizations/TableView.js";
import CardView from "../components/visualizations/CardView.js";
import ChartView from "../components/visualizations/ChartView.js";
import TreeView from "../components/visualizations/TreeView.js";
import GraphView from "../components/visualizations/GraphView.js";
import { Features } from "../components/Features.js";
import { HiOutlineDatabase, HiPlusCircle, HiSparkles } from "react-icons/hi";

const VISUALIZER_STORAGE_KEY = "visualizerState";

const Visualizer = () => {
  const location = useLocation();
  const { user, setCredits } = useContext(AuthContext);
  const { showAlert } = useAlert();
  const reportRef = useRef<HTMLDivElement | null>(null);
  const panelref = useRef<HTMLButtonElement | null>(null);
  const [inputType, setInputType] = useState("paste");
  const [rawInput, setRawInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [data, setData] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [saveState, setSaveState] = useState("idle");
  const [isPublic, setIsPublic] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viztitle, setViztitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [forceImages, setForceImages] = useState<boolean>(false);
  const [searchBar, setSearchBar] = useState(false);

  useTitle("Visualizer");

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

  const generateRandomTitle = () => {
    const randomID = Math.random().toString(36).substring(2, 10).toLowerCase();
    setViztitle(`Viz_${randomID}`);
  };

  useEffect(() => {
    if (isModalOpen) generateRandomTitle();
  }, [isModalOpen]);


  const handleClearVisualizer = () => {
    setData([]);
    setRawInput("");
    setUrlInput("");
    setInputType("paste");
    setViewMode("table");
    setError("");
    setSearchTerm("");
    sessionStorage.removeItem(VISUALIZER_STORAGE_KEY);
    showAlert("Input Data Cleared successfully", "Message", 3)
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
      const errorObj = err as Error;
      setError(errorObj.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      showAlert("File is too large! Please upload a file smaller than 2MB.", "Upload Error", 2);
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") {
        setRawInput(result);
        setInputType("paste");
      }
    };
    reader.readAsText(file);
  };


  const handleSave = () => {
    if (!user || data.length === 0) return;
    setIsModalOpen(true);
  };

  const confirmSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication error. Please log in again.");
      return;
    }

    if (rawInput) {
      const rawLines = rawInput.trim().split('\n').length;
      if (rawLines > 500) {
        showAlert(`Input text is too long (${rawLines} lines). Please limit to 500 lines.`, "Validation Error", 1);
        return;
      }
    }

    if (data) {
      const dataLines = JSON.stringify(data, null, 2).split('\n').length;
      if (dataLines > 500) {
        showAlert(`The data structure is too large (${dataLines} lines). Please reduce the amount of data.`, "Validation Error", 1);
        return;
      }
    }

    setSaveState("saving");
    setIsModalOpen(false);

    const newHistoryItem = {
      title: viztitle?.trim() || `Visual ${new Date().toLocaleDateString()}`,
      type: viewMode,
      dataLength: data.length,
      data: data,
      rawInput: rawInput,
      urlInput: urlInput,
      inputType: inputType,
      isPublic: isPublic
    };

    try {
      const response = await fetch("/api/history/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(newHistoryItem)
      });

      const result = await response.json();

      if (!response.ok) {
        showAlert(result?.message || result?.error || "Failed to save history", "Save Error", 1);
        setSaveState("idle");
        return;
      }
      setCredits(result?.credits);
      setSaveState("saved");
      showAlert("History saved successfully", "Success", 2)
      setViztitle("")
      setTimeout(() => {
        setSaveState("idle");
      }, 2000);

    } catch (err) {
      const errorObj = err as Error;
      setError(errorObj.message || String(err));
      setSaveState("idle");
    }
  };

  const togglePublic = () => {
    const nextState = !isPublic;
    setIsPublic(nextState);
    const message = `Visualization will be saved as ${nextState ? 'Public' : 'Private'}`;
    const alertType = nextState ? 2 : 3;
    showAlert(message, "Visibility Updated", alertType);
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
    { id: 'tree', icon: FiDatabase, label: 'JSON' },
    { id: 'graph', icon: FiGitBranch, label: 'Graph' },
  ];


  return (
    <div className={`relative flex bg-gray-100 dark:bg-black text-gray-900 dark:text-gray-100 sm:h-full overflow-hidden w-full pt-10 sm:pt-16`}>
      <div className="inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-cyan-500/20 blur-[50px] md:blur-[80px] rounded-bl-full pointer-events-none" />
        <div className="absolute bottom-[-5%] left-0 w-[180px] h-[180px] md:w-[300px] md:h-[300px] bg-fuchsia-500/20 blur-[50px] md:blur-[80px] rounded-tr-full pointer-events-none" />
      </div>

      {isPanelOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsPanelOpen(false)} />
      )}

      <div className={`fixed inset-y-0 left-0 z-40 w-80 sm:w-[calc(100vw-75%)] max-w-full transform transition-transform duration-300 ease-in-out
                    md:sticky md:top-0 md:translate-x-0 md:transform-none 
                    ${isPanelOpen ? 'translate-x-0' : '-translate-x-full md:w-0 md:opacity-0 md:pointer-events-none'}`}>
        <div className="min-h-screen sm:min-h-auto sm:h-[calc(100vh-64px)] bg-white dark:bg-gray-900 border-r border-b border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col shadow-xl md:shadow-none pt-10 sm:pt-0" >

          <div className="hidden md:flex p-6 justify-between items-center border-b border-gray-200 dark:border-gray-800">
            <h2 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <FiSettings className="text-indigo-500" /> Input Source
            </h2>
            <button onClick={() => setIsPanelOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full" ref={panelref}>
              <FiX />
            </button>
          </div>

          <div className="p-4 py-10 sm:py-4 flex-1 overflow-y-auto flex flex-col text-xs">
            <div className="flex gap-2 mb-4 z-100">
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
              <button onClick={() => setIsPanelOpen(false)} className="sm:hidden p-2.5 font-semibold text flex items-center justify-center gap-1 rounded-full transition-colors border-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 text-xs border-gray-600 dark:border-gray-700">
                <FiX />
              </button>
            </div>

            <div className="flex-1 relative mb-4 min-h-[200px]">
              {inputType === 'paste' && (
                <textarea value={rawInput} onChange={(e) => setRawInput(e.target.value)} placeholder='[{"key": "value"}]' className="w-full h-full p-4 font-mono text-xs border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-0 bg-gray-50 dark:bg-gray-800 resize-none outline-none" />
              )}
              {inputType === 'url' && (
                <div className="mt-4">
                  <input type="text" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="https://api.example.com/data..." className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 outline-none text-xs" />
                </div>
              )}
              {inputType === 'file' && (
                <div className="h-full flex items-center justify-center border-2 border-dashed rounded-xl dark:border-gray-700 hover:border-indigo-500 min-h-[150px]">
                  <input type="file" id="fileUp" onChange={handleFileUpload} className="hidden" />
                  <label htmlFor="fileUp" className="cursor-pointer text-center p-10">
                    <FiUploadCloud className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={20} />
                    <span className="text-gray-500">Click to upload JSON</span>
                  </label>
                </div>
              )}
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-500 rounded-lg text-sm ">{error}</div>}

            <button onClick={handleProcess} disabled={loading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50">
              {loading ? "Processing..." : "Visualize Data"} <HiSparkles size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 min-w-0 transition-all duration-300 md:max-w-7xl mx-auto px-2 sm:px-0">
        {!isPanelOpen && (
          <button onClick={() => {
            panelref.current?.focus();
            setIsPanelOpen(true);
          }} className="fixed bottom-6 left-6 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-xl hover:bg-indigo-700 transition-all" >
            <FiCode size={20} />
          </button>
        )}
        <div className="flex flex-col gap-4 py-4 rounded-xl transition-colors py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 justify-center">
              <div className="p-2.5 bg-linear-to-br from-indigo-100 to-blue-50 dark:from-indigo-900/40 dark:to-blue-900/40 rounded-xl text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-200/50 dark:border-indigo-500/20">
                <FiBarChart2 className="w-6 h-6 stroke-[2.5px]" />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-cyan-400">
                  Visualization Canvas
                </span>
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row p-1.5 sm:p-1 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 gap-2 sm:gap-0 overflow-x-hidden max-w-full">

              {data.length > 0 && (
                <div className="flex items-center justify-around sm:justify-start gap-2 sm:gap-3 px-1">
                  <>
                    <button onClick={togglePublic} className={`group flex items-center justify-center gap-0 hover:gap-2 px-3 py-2 rounded-lg shadow-md transition-all duration-300 border-2 w-full sm:w-auto
                      ${isPublic
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 border-blue-500"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600"}`} >
                      <div className="flex-shrink-0">{isPublic ? <FiEye size={18} /> : <FiEyeOff size={18} />}</div>
                      <div className="grid grid-cols-[0fr] group-hover:grid-cols-[1fr] transition-all duration-300 ease-in-out">
                        <span className="hidden sm:flex overflow-hidden whitespace-nowrap text-sm font-medium">
                          {isPublic ? "Public" : "Private"}
                        </span>
                      </div>
                    </button>

                    <button onClick={handleSave} disabled={saveState === "saving"} className="group flex items-center justify-center gap-0 hover:gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white rounded-lg shadow-md transition-all duration-300 w-full sm:w-auto" >
                      <div className="flex-shrink-0">
                        {saveState === "saving" && <FiLoader className="animate-spin" size={18} />}
                        {saveState === "saved" && <FiCheck size={18} />}
                        {saveState === "idle" && <FiSave size={18} />}
                      </div>
                      <div className="grid grid-cols-[0fr] group-hover:grid-cols-[1fr] transition-all duration-300 ease-in-out">
                        <span className="hidden sm:flex overflow-hidden whitespace-nowrap text-sm font-medium">
                          {saveState === "saving" ? "Saving..." : saveState === "saved" ? "Saved" : "Save"}
                        </span>
                      </div>
                    </button>

                    <button onClick={handleClearVisualizer} className="group flex items-center justify-center gap-0 hover:gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-all duration-300 w-full sm:w-auto" >
                      <div className="flex-shrink-0"><FiTrash2 size={18} /></div>
                      <div className="grid grid-cols-[0fr] group-hover:grid-cols-[1fr] transition-all duration-300 ease-in-out">
                        <span className="hidden sm:flex overflow-hidden whitespace-nowrap text-sm font-medium">Clear</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setSearchBar(!searchBar)}
                      disabled={data.length === 0 || viewMode === "graph" || viewMode === "tree"}
                      className={`group flex items-center justify-center gap-0 sm:hover:gap-2 px-3 py-2 rounded-lg shadow-md transition-all duration-300 border-2 w-full sm:w-auto
                        ${searchBar
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 border-blue-500 gap-2"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}>
                      <div className="flex-shrink-0"><FiSearch size={18} /></div>
                      <div className={`grid transition-all duration-300 ease-in-out ${searchBar ? "grid-cols-[1fr] gap-2" : "grid-cols-[0fr] group-hover:grid-cols-[1fr] group-hover:gap-2"}`}>
                        <span className="hidden sm:flex overflow-hidden whitespace-nowrap text-sm font-medium">
                          Search
                        </span>
                      </div>
                    </button>
                  </>
                </div>
              )}

              {data.length < 0 && <div className="h-[1px] w-full bg-gray-100 dark:bg-gray-800 sm:hidden" />}
              {data.length < 0 && <div className="hidden sm:block w-[1px] h-6 bg-gray-200 dark:bg-gray-700 mx-2" />}

              <div className="flex items-center justify-around sm:justify-start gap-2 sm:gap-3 px-1 overflow-x-auto no-scrollbar">
                {viewModes.map(v => {
                  const isActive = viewMode === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setViewMode(v.id)}
                      className={`group flex items-center justify-center sm:px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap flex-1 sm:flex-none
                        ${isActive
                          ? "bg-indigo-600 text-white shadow-md sm:gap-2"
                          : "text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 gap-0 hover:gap-2"
                        }`}>
                      <div className="flex-shrink-0"><v.icon size={18} /></div>
                      <div className={`grid transition-all duration-300 ease-in-out ${isActive ? "grid-cols-[1fr]" : "grid-cols-[0fr] group-hover:grid-cols-[1fr]"}`}>
                        <span className="hidden sm:flex overflow-hidden whitespace-nowrap">
                          {v.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          {searchBar && viewMode !== "graph" && viewMode !== "tree" && (
            <div className="w-full transition-all duration-500 animate-in fade-in slide-in-from-top-2">
              <Features searchTerm={searchTerm} setSearchTerm={setSearchTerm} targetRef={reportRef} />
            </div>
          )}
        </div>
        <div ref={reportRef} className="pb-20">
          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center border-2 border-dashed rounded-2xl border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-900/20 backdrop-blur-sm p-8 transition-all">

              <div className="relative p-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-full mb-6 group">
                <HiOutlineDatabase className="text-5xl text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -top-1 -right-1">
                  <span className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500"></span>
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Ready to get started?
              </h3>
              <p className="max-w-xs text-gray-500 dark:text-gray-400 mt-2 mb-8 leading-relaxed">
                Your data workspace is empty. Open the side panel to connect your source.
              </p>

              <button
                onClick={() => setIsPanelOpen(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
                 bg-green-400 hover:bg-green-700 text-green-900 
                 dark:bg-green-500 dark:hover:bg-green-600
                 shadow-lg shadow-green-200 dark:shadow-none
                 active:scale-95"
              >
                <HiPlusCircle className="w-5 h-5" />
                Connect Data Source
              </button>

            </div>
          ) : (
            <div className="overflow-x-auto">
              {viewMode === 'table' && <TableView data={filteredData} forceImages={forceImages} setForceImages={setForceImages} />}
              {viewMode === 'card' && <CardView data={filteredData} renderImages={true} forceImages={forceImages} setForceImages={setForceImages} />}
              {viewMode === 'chart' && <ChartView data={filteredData} />}
              {viewMode === 'tree' && <TreeView data={data} />}
              {viewMode === 'graph' && <GraphView data={data} />}
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 p-4 sm:p-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-300 dark:border-gray-700 transition-all">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Save Visualization
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Enter a title for your data OR Continue with the auto-generated name.
            </p>

            <div className="relative flex items-center">
              <input
                type="text"
                className="w-full pl-4 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none 
               bg-gray-50 dark:bg-gray-900 
               text-gray-900 dark:text-white 
               border-gray-300 dark:border-gray-600 transition-all"
                placeholder="Enter title..."
                value={viztitle}
                onChange={(e) => setViztitle(e.target.value)}
                autoFocus
                onFocus={(e) => e.target.select()}
              />
              <button
                type="button"
                onClick={generateRandomTitle}
                className="absolute right-2 p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
                title="Regenerate Title"
              >
                <FiRefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              >
                Save Data
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Visualizer;