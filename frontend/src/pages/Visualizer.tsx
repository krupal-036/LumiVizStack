// frontend/src/pages/Visualizer.tsx
import { ChangeEvent, useState, useEffect, useContext, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
    FiCode,
    FiUploadCloud,
    FiLink,
    FiX,
    FiSave,
    FiCheck,
    FiTrash2,
    FiEye,
    FiEyeOff,
    FiTable,
    FiGrid,
    FiBarChart2,
    FiDatabase,
    FiGitBranch,
    FiLoader,
    FiSettings,
    FiSearch,
    FiRefreshCw,
} from "react-icons/fi";
import { parseDualData } from "@/utils/dataParser";
import { SafeStorage } from "@/utils/safeStorage";
import { AuthContext } from "@/context/AuthContext";
import { useAlert, useTitle } from "@/hooks/customHooks";
import TableView from "@/components/visualizations/TableView";
import CardView from "@/components/visualizations/CardView";
import ChartView from "@/components/visualizations/ChartView";
import TreeView from "@/components/visualizations/TreeView";
import GraphView from "@/components/visualizations/GraphView";
import { Features } from "@/components/Features";
import { HiOutlineDatabase, HiPlusCircle, HiSparkles } from "react-icons/hi";
import MonacoCodeEditor from "@/components/common/MonacoCodeEditor";

const VISUALIZER_STORAGE_KEY = "visualizerState";

const Visualizer = () => {
    const location = useLocation();
    const { user, setCredits } = useContext(AuthContext);
    const { showAlert } = useAlert();
    const reportRef = useRef<HTMLDivElement | null>(null);
    const panelref = useRef<HTMLButtonElement | null>(null);

    const [inputType, setInputType] = useState<string>("paste");
    const [rawInput, setRawInput] = useState<string>("");
    const [urlInput, setUrlInput] = useState<string>("");

    // Dual Data Stream: Tabular projection for Table/Charts, full tree for Graph/JSON
    const [tabularData, setTabularData] = useState<any[]>([]);
    const [hierarchicalData, setHierarchicalData] = useState<any>(null);
    const [savedShareId, setSavedShareId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<string>("table");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
    const [saveState, setSaveState] = useState<string>("idle");
    const [isPublic, setIsPublic] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [viztitle, setViztitle] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [forceImages, setForceImages] = useState<boolean>(false);
    const [searchBar, setSearchBar] = useState<boolean>(false);

    useTitle("Visualizer");

    // Drawer lock
    useEffect(() => {
        if (isPanelOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isPanelOpen]);

    useEffect(() => {
        const forceLoad = location.state?.forceLoad === true;
        if (forceLoad && location.state?.config) {
            const config = location.state.config;
            const parsed = parseDualData(config.data ?? []);
            setTabularData(parsed.tabularData);
            setHierarchicalData(parsed.hierarchicalData);
            setViewMode(config.type ?? "table");
            setRawInput(config.rawInput ?? "");
            setUrlInput(config.urlInput ?? "");
            setInputType(config.inputType ?? "paste");
            SafeStorage.setItem(VISUALIZER_STORAGE_KEY, JSON.stringify(config));
            return;
        }

        const saved = SafeStorage.getItem(VISUALIZER_STORAGE_KEY);
        if (saved) {
            try {
                const parsedConfig = JSON.parse(saved);
                setTabularData(parsedConfig.tabularData ?? parsedConfig.data ?? []);
                setHierarchicalData(parsedConfig.hierarchicalData ?? parsedConfig.data ?? null);
                setViewMode(parsedConfig.viewMode ?? "table");
                setRawInput(parsedConfig.rawInput ?? "");
                setUrlInput(parsedConfig.urlInput ?? "");
                setInputType(parsedConfig.inputType ?? "paste");
            } catch {
                SafeStorage.removeItem(VISUALIZER_STORAGE_KEY);
            }
        }
    }, [location.state]);

    useEffect(() => {
        if (tabularData.length === 0 && !hierarchicalData) return;
        const snapshot = {
            tabularData,
            hierarchicalData,
            viewMode,
            rawInput: rawInput.length > 500000 ? "" : rawInput,
            urlInput,
            inputType,
        };
        SafeStorage.setItem(VISUALIZER_STORAGE_KEY, JSON.stringify(snapshot));
    }, [tabularData, hierarchicalData, viewMode, rawInput, urlInput, inputType]);

    const generateRandomTitle = () => {
        const randomID = Math.random().toString(36).substring(2, 10).toLowerCase();
        setViztitle(`Viz_${randomID}`);
    };

    useEffect(() => {
        if (isModalOpen) generateRandomTitle();
    }, [isModalOpen]);

    const handleClearVisualizer = () => {
        setTabularData([]);
        setHierarchicalData(null);
        setRawInput("");
        setUrlInput("");
        setInputType("paste");
        setViewMode("table");
        setError("");
        setSearchTerm("");
        SafeStorage.removeItem(VISUALIZER_STORAGE_KEY);
        showAlert("Input Data Cleared successfully", "Message", 3);
        setSavedShareId(null);
        setSaveState("idle");
    };

    const handleProcess = async () => {
        setLoading(true);
        setError("");
        try {
            let rawData = "";
            if (inputType === "paste") {
                rawData = rawInput;
            } else if (inputType === "url") {
                if (!urlInput.trim()) throw new Error("URL missing");
                const res = await fetch(urlInput);
                if (!res.ok) throw new Error(`HTTP Error: ${res.statusText}`);
                rawData = await res.text();
            } else if (inputType === "file") {
                rawData = rawInput;
            }

            if (!rawData.trim()) throw new Error("Please enter or upload data to visualize");

            const { tabularData: tData, hierarchicalData: hData } = parseDualData(rawData);
            if (!tData || (tData.length === 0 && !hData)) {
                throw new Error("No valid JSON structure found in data");
            }

            setTabularData(tData);
            setHierarchicalData(hData);
            setIsPanelOpen(false);
        } catch (err: any) {
            setError(err?.message || "Failed to parse input data");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            showAlert("File is too large! Max file size is 10MB.", "Upload Error", 2);
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
        if (!user || (tabularData.length === 0 && !hierarchicalData)) return;
        setIsModalOpen(true);
    };

    const confirmSave = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Authentication error. Please log in again.");
            return;
        }

        setSaveState("saving");
        setIsModalOpen(false);

        const newHistoryItem = {
            title: viztitle?.trim() || `Visual ${new Date().toLocaleDateString()}`,
            type: viewMode,
            dataLength: tabularData.length,
            data: hierarchicalData || tabularData,
            rawInput: rawInput,
            urlInput: urlInput,
            inputType: inputType,
            isPublic: isPublic,
        };

        try {
            const response = await fetch("/api/history/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newHistoryItem),
            });

            const result = await response.json();

            if (!response.ok) {
                showAlert(result?.message || "Failed to save history", "Save Error", 1);
                setSaveState("idle");
                return;
            }
            if (result?.credits !== undefined) {
                setCredits(result.credits);
            }
            if (result?.newHistory?.shareId) {
                setSavedShareId(result.newHistory.shareId);
            }
            setSaveState("saved");
            showAlert("History saved successfully", "Success", 2);
            setViztitle("");
        } catch (err: any) {
            setError(err?.message || "Failed to save");
            setSaveState("idle");
        }
    };

    const togglePublic = () => {
        const nextState = !isPublic;
        setIsPublic(nextState);
        showAlert(
            `Visualization will be saved as ${nextState ? "Public" : "Private"}`,
            "Visibility Updated",
            nextState ? 2 : 3,
        );
    };

    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return tabularData;
        const q = searchTerm.toLowerCase();
        return tabularData.filter((item) =>
            Object.values(item || {}).some((val) => String(val).toLowerCase().includes(q)),
        );
    }, [tabularData, searchTerm]);

    const viewModes = [
        { id: "table", icon: FiTable, label: "Table" },
        { id: "card", icon: FiGrid, label: "Grid" },
        { id: "chart", icon: FiBarChart2, label: "Charts" },
        { id: "tree", icon: FiDatabase, label: "JSON" },
        { id: "graph", icon: FiGitBranch, label: "Graph" },
    ];

    const hasData = tabularData.length > 0 || hierarchicalData !== null;

    return (
        <div className="relative flex bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 min-h-screen w-full pt-16">
            <div className="inset-0 overflow-hidden pointer-events-none z-0 fixed">
                <div className="absolute top-[-10%] right-[-5%] w-[350px] h-[350px] bg-cyan-500/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-[-5%] left-0 w-[350px] h-[350px] bg-fuchsia-500/10 blur-[100px] rounded-full" />
            </div>

            {isPanelOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-2xs z-50 md:hidden"
                    onClick={() => setIsPanelOpen(false)}
                />
            )}

            <div
                className={`fixed inset-y-0 left-0 z-50 w-full sm:w-[420px] md:w-125 transform transition-transform duration-300 ease-in-out overscroll-contain
                    ${isPanelOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="h-[100dvh] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-2xl">
                    <div className="flex p-4 justify-between items-center border-b border-gray-200 dark:border-gray-800">
                        <h2 className="font-bold text-sm text-gray-800 dark:text-white flex items-center gap-2">
                            <FiSettings className="text-indigo-500" /> Data Source
                        </h2>
                        <button
                            type="button"
                            onClick={() => setIsPanelOpen(false)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-slate-500 transition-colors"
                            ref={panelref}
                        >
                            <FiX size={18} />
                        </button>
                    </div>

                    <div className="p-4 flex-1 overflow-hidden flex flex-col gap-3">
                        <div className="flex gap-2">
                            {[
                                { id: "paste", icon: FiCode, label: "Paste" },
                                { id: "file", icon: FiUploadCloud, label: "File" },
                                { id: "url", icon: FiLink, label: "URL" },
                            ].map((t) => (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => setInputType(t.id)}
                                    className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 rounded-lg transition-colors border ${
                                        inputType === t.id
                                            ? "bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 border-indigo-500"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700"
                                    }`}
                                >
                                    <t.icon size={14} /> {t.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 w-full min-h-[300px] overflow-hidden flex flex-col">
                            {inputType === "paste" && (
                                <div className="w-full h-full">
                                    <MonacoCodeEditor
                                        value={rawInput}
                                        onChange={(val) => setRawInput(val)}
                                        language="json"
                                        showFormatButton={true}
                                    />
                                </div>
                            )}

                            {inputType === "url" && (
                                <div className="mt-4 flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-slate-500">
                                        JSON Endpoint URL:
                                    </label>
                                    <input
                                        type="text"
                                        value={urlInput}
                                        onChange={(e) => setUrlInput(e.target.value)}
                                        placeholder="https://api.github.com/repos/facebook/react"
                                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none text-xs"
                                    />
                                </div>
                            )}

                            {inputType === "file" && (
                                <div className="h-full flex flex-col items-center justify-center border-2 border-dashed rounded-xl dark:border-gray-700 hover:border-indigo-500 p-6 text-center">
                                    <input
                                        type="file"
                                        id="fileUp"
                                        accept=".json"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                    <label htmlFor="fileUp" className="cursor-pointer">
                                        <FiUploadCloud
                                            className="mx-auto text-indigo-500 mb-2"
                                            size={36}
                                        />
                                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
                                            Upload JSON Document
                                        </span>
                                        <span className="text-[11px] text-gray-400">
                                            Up to 10MB (package.json, deep trees supported)
                                        </span>
                                    </label>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 rounded-lg text-xs">
                                {error}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleProcess}
                            disabled={loading}
                            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-xs active:scale-[0.98]"
                        >
                            {loading ? "Processing..." : "Visualize Data"} <HiSparkles size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <div
                className={`flex-1 w-full min-w-0 transition-all duration-300 px-4 sm:px-8 max-w-full ${
                    isPanelOpen ? "md:ml-125" : "ml-0"
                }`}
            >
                {!isPanelOpen && (
                    <button
                        type="button"
                        onClick={() => {
                            panelref.current?.focus();
                            setIsPanelOpen(true);
                        }}
                        className="fixed bottom-6 left-6 z-40 p-3.5 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-700 transition-all active:scale-95"
                        title="Open Input Editor"
                    >
                        <FiCode size={20} />
                    </button>
                )}

                <div className="flex flex-col gap-4 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setIsPanelOpen(!isPanelOpen)}
                                className="p-2.5 bg-linear-to-br from-indigo-100 to-blue-50 dark:from-indigo-900/40 dark:to-blue-900/40 rounded-xl text-indigo-600 dark:text-indigo-400 shadow-2xs border border-indigo-200/50 dark:border-indigo-500/20 hover:scale-105 transition-transform"
                                title="Toggle Input Panel"
                            >
                                <FiBarChart2 className="w-6 h-6 stroke-[2.5px]" />
                            </button>
                            <div>
                                <h1 className="text-xl md:text-2xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-cyan-400">
                                    Visualization Canvas
                                </h1>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {hasData
                                        ? `${tabularData.length} records projected`
                                        : "No dataset loaded"}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-gray-900 p-1.5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs">
                            {hasData && (
                                <>
                                    <button
                                        type="button"
                                        onClick={togglePublic}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
                                            isPublic
                                                ? "bg-blue-50 dark:bg-blue-950 text-blue-600 border-blue-300 dark:border-blue-700"
                                                : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                                        }`}
                                    >
                                        {isPublic ? <FiEye size={14} /> : <FiEyeOff size={14} />}
                                        <span className="hidden sm:inline">
                                            {isPublic ? "Public" : "Private"}
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleSave}
                                        disabled={saveState === "saving"}
                                        className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-lg text-xs font-semibold shadow-xs transition-all"
                                    >
                                        {saveState === "saving" ? (
                                            <FiLoader className="animate-spin" size={14} />
                                        ) : saveState === "saved" ? (
                                            <FiCheck size={14} />
                                        ) : (
                                            <FiSave size={14} />
                                        )}
                                        <span className="hidden sm:inline">
                                            {saveState === "saving"
                                                ? "Saving..."
                                                : saveState === "saved"
                                                  ? "Saved"
                                                  : "Save"}
                                        </span>
                                    </button>

                                    {savedShareId && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (!savedShareId) {
                                                    showAlert(
                                                        "Please save this visualization first to generate an embed code.",
                                                        "Save Required",
                                                        3,
                                                    );
                                                    setIsModalOpen(true);
                                                    return;
                                                }
                                                const embedSnippet = `<iframe src="${window.location.origin}/embed/${savedShareId}" width="100%" height="100%" frameborder="0" style="border:1px solid #e2e8f0; border-radius:12px;" allowfullscreen></iframe>`;
                                                navigator.clipboard.writeText(embedSnippet);
                                                showAlert(
                                                    "Embed code copied to clipboard! Paste it into Notion, blogs, or HTML.",
                                                    "Embed Code Ready",
                                                    2,
                                                );
                                            }}
                                            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 rounded-lg text-xs font-semibold border border-indigo-200 dark:border-indigo-800 shadow-xs transition-all"
                                            title="Get embeddable <iframe> snippet"
                                        >
                                            <FiCode size={14} />
                                            <span className="hidden sm:inline">Embed</span>
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={handleClearVisualizer}
                                        className="flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all"
                                    >
                                        <FiTrash2 size={14} />
                                        <span className="hidden sm:inline">Clear</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setSearchBar(!searchBar)}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                                            searchBar
                                                ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 border-indigo-300 dark:border-indigo-700"
                                                : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                                        }`}
                                    >
                                        <FiSearch size={14} />
                                        <span className="hidden sm:inline">Filter</span>
                                    </button>
                                </>
                            )}

                            <div className="h-4 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block mx-1" />

                            <div className="flex items-center gap-1">
                                {viewModes.map((v) => {
                                    const isActive = viewMode === v.id;
                                    return (
                                        <button
                                            key={v.id}
                                            type="button"
                                            onClick={() => setViewMode(v.id)}
                                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                                                isActive
                                                    ? "bg-indigo-600 text-white shadow-xs"
                                                    : "text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                                            }`}
                                        >
                                            <v.icon size={15} />
                                            <span className="hidden md:inline">{v.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {searchBar && (
                        <div className="w-full pt-2 animate-in fade-in slide-in-from-top-2">
                            <Features
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                targetRef={reportRef}
                            />
                        </div>
                    )}
                </div>

                <div ref={reportRef} className="pb-24 w-full">
                    {!hasData ? (
                        <div className="flex flex-col items-center justify-center h-[55vh] text-center border-2 border-dashed rounded-3xl border-gray-300 dark:border-gray-800 bg-white/60 dark:bg-gray-900/30 backdrop-blur-xs p-8">
                            <div className="p-5 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl mb-4 text-indigo-600 dark:text-indigo-400">
                                <HiOutlineDatabase size={44} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                Ready to Visualize Your Data
                            </h3>
                            <p className="max-w-md text-xs text-gray-500 dark:text-gray-400 mt-2 mb-6">
                                Paste JSON, connect an API endpoint, or upload package.json to
                                generate interactive tables, charts, network graphs, and inspectors.
                            </p>
                            <button
                                type="button"
                                onClick={() => setIsPanelOpen(true)}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg active:scale-95 transition-all"
                            >
                                <HiPlusCircle size={18} />
                                Load Data Source
                            </button>
                        </div>
                    ) : (
                        <div className="w-full">
                            {viewMode === "table" && (
                                <TableView
                                    data={filteredData}
                                    forceImages={forceImages}
                                    setForceImages={setForceImages}
                                />
                            )}
                            {viewMode === "card" && (
                                <CardView
                                    data={filteredData}
                                    renderImages={true}
                                    forceImages={forceImages}
                                    setForceImages={setForceImages}
                                />
                            )}
                            {viewMode === "chart" && <ChartView data={filteredData} />}
                            {viewMode === "tree" && (
                                <TreeView data={hierarchicalData || tabularData} />
                            )}
                            {viewMode === "graph" && (
                                <GraphView data={hierarchicalData || tabularData} />
                            )}
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 p-4 flex items-center justify-center bg-black/60 backdrop-blur-xs">
                    <div className="w-full max-w-md p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            Save Visualization
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                            Provide a title for this dataset or continue with the generated name.
                        </p>
                        <div className="relative flex items-center mb-6">
                            <input
                                type="text"
                                className="w-full pl-3 pr-10 py-2.5 border rounded-xl text-xs outline-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter title..."
                                value={viztitle}
                                onChange={(e) => setViztitle(e.target.value)}
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={generateRandomTitle}
                                className="absolute right-2 p-1.5 text-gray-400 hover:text-indigo-600 rounded-md"
                                title="Regenerate Title"
                            >
                                <FiRefreshCw size={14} />
                            </button>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmSave}
                                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition"
                            >
                                Save Visualization
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Visualizer;
