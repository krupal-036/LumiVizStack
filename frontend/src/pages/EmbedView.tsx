// frontend/src/pages/EmbedView.tsx
import { useState, useEffect, useMemo, type ComponentType } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import TableView from "@/components/visualizations/TableView";
import CardView from "@/components/visualizations/CardView";
import ChartView from "@/components/visualizations/ChartView";
import TreeView from "@/components/visualizations/TreeView";
import GraphView from "@/components/visualizations/GraphView";
import Loader from "@/components/common/Loader";
import { parseDualData } from "@/utils/dataParser";
import { useTitle } from "@/hooks/customHooks";
import {
    FiAlertCircle,
    FiBarChart2,
    FiCode,
    FiExternalLink,
    FiGrid,
    FiMoon,
    FiShare2,
    FiSun,
    FiTable,
} from "react-icons/fi";

export default function EmbedView() {
    const { shareId } = useParams();
    const [searchParams] = useSearchParams();

    // Default to 'dark' unless explicitly overridden by '?theme=light' in the iframe URL
    const initialTheme = searchParams.get("theme") === "light" ? "light" : "dark";
    const [theme, setTheme] = useState<"dark" | "light">(initialTheme);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [historyData, setHistoryData] = useState<any>(null);
    const [viewMode, setViewMode] = useState<"table" | "card" | "chart" | "tree" | "graph">(
        "chart",
    );
    const [forceImages, setForceImages] = useState<boolean>(false);

    useTitle("Embedded Visualization");

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }, [theme]);

    useEffect(() => {
        const fetchEmbedData = async () => {
            try {
                const res = await fetch(`/api/history/public/${shareId}`);
                const data = await res.json();
                if (res.ok) {
                    setHistoryData(data);
                    setViewMode((data.type ?? "chart") as any);
                } else {
                    setError(data?.message || "Visualization unavailable");
                }
            } catch {
                setError("Unable to connect to visualization host");
            } finally {
                setLoading(false);
            }
        };
        fetchEmbedData();
    }, [shareId]);

    const { tabularData, hierarchicalData } = useMemo(() => {
        if (!historyData?.data) return { tabularData: [], hierarchicalData: null };
        return parseDualData(historyData.data);
    }, [historyData]);

    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-white">
                <Loader data="Loading Embed..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen w-screen flex-col items-center justify-center p-4 bg-slate-950 text-slate-200 text-center">
                <FiAlertCircle className="w-8 h-8 text-rose-500 mb-2" />
                <p className="text-sm font-semibold">{error}</p>
                <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 text-xs text-indigo-400 hover:underline inline-flex items-center gap-1"
                >
                    Visit LumiVizStack <FiExternalLink size={12} />
                </a>
            </div>
        );
    }

    const viewModes: Array<{
        id: "table" | "card" | "chart" | "tree" | "graph";
        icon: ComponentType<{ size?: number }>;
        label: string;
    }> = [
        { id: "table", icon: FiTable, label: "Table" },
        { id: "card", icon: FiGrid, label: "Cards" },
        { id: "chart", icon: FiBarChart2, label: "Charts" },
        { id: "tree", icon: FiCode, label: "JSON" },
        { id: "graph", icon: FiShare2, label: "Graph" },
    ];

    const isDarkMode = theme === "dark";

    return (
        <div
            className={`${isDarkMode ? "dark bg-[#07090e] text-slate-100" : "bg-white text-slate-900"} h-screen w-screen flex flex-col overflow-hidden font-sans select-none transition-colors duration-200`}
        >
            <header className="flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate max-w-[160px] sm:max-w-xs">
                        {historyData?.title || "Data Visualization"}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                        ({tabularData.length} records)
                    </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                    <div className="flex bg-slate-200/70 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-300/40 dark:border-slate-700/50">
                        {viewModes.map((v) => (
                            <button
                                key={v.id}
                                onClick={() => setViewMode(v.id)}
                                className={`p-1.5 rounded-md text-xs transition-colors ${
                                    viewMode === v.id
                                        ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs"
                                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                                }`}
                                title={`Switch to ${v.label}`}
                            >
                                <v.icon size={13} />
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setTheme(isDarkMode ? "light" : "dark")}
                        className="p-1.5 rounded-lg bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition-colors border border-slate-300/40 dark:border-slate-700/50"
                        title={`Switch to ${isDarkMode ? "Light" : "Dark"} mode`}
                    >
                        {isDarkMode ? <FiSun size={13} /> : <FiMoon size={13} />}
                    </button>

                    <a
                        href={`/view/${shareId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors border border-indigo-200/60 dark:border-indigo-800"
                        title="Open full interactive page on LumiVizStack"
                    >
                        <span>LumiVizStack</span>
                        <FiExternalLink size={10} />
                    </a>
                </div>
            </header>

            <main className="flex-1 w-full overflow-auto p-2 sm:p-3 custom-scrollbar bg-slate-50/50 dark:bg-[#07090e]">
                {viewMode === "table" && (
                    <TableView
                        data={tabularData}
                        forceImages={forceImages}
                        setForceImages={setForceImages}
                    />
                )}
                {viewMode === "card" && (
                    <CardView
                        data={tabularData}
                        renderImages={true}
                        forceImages={forceImages}
                        setForceImages={setForceImages}
                    />
                )}
                {viewMode === "chart" && <ChartView data={tabularData} />}
                {viewMode === "tree" && <TreeView data={hierarchicalData || tabularData} />}
                {viewMode === "graph" && <GraphView data={hierarchicalData || tabularData} />}
            </main>
        </div>
    );
}
