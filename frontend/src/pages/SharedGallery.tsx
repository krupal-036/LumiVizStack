// frontend/src/pages/SharedGallery.tsx
import { useState, useEffect, useMemo, type ComponentType } from "react";
import { Link } from "react-router-dom";
import {
    FiGlobe,
    FiSearch,
    FiBarChart2,
    FiTable,
    FiGrid,
    FiGitBranch,
    FiCalendar,
    FiExternalLink,
    FiCode,
    FiUser,
    FiLayers,
} from "react-icons/fi";
import Loader from "@/components/common/Loader";
import { useTitle, useAlert } from "@/hooks/customHooks";

const TYPE_CONFIG: Record<
    string,
    { icon: ComponentType<{ size?: number; className?: string }>; label: string }
> = {
    all: { icon: FiLayers, label: "All Types" },
    table: { icon: FiTable, label: "Tables" },
    chart: { icon: FiBarChart2, label: "Charts" },
    graph: { icon: FiGitBranch, label: "Graphs" },
    card: { icon: FiGrid, label: "Cards" },
    tree: { icon: FiCode, label: "JSON Trees" },
};

export default function SharedGallery() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedType, setSelectedType] = useState<string>("all");
    const { showAlert } = useAlert();

    useTitle("Explore Public Visualizations");

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await fetch("/api/history/gallery");
                const data = await res.json();
                if (res.ok) {
                    setItems(data);
                }
            } catch {
                console.error("Gallery fetch failed");
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, []);

    const filtered = useMemo(() => {
        return items.filter((item) => {
            const matchesSearch =
                item.title?.toLowerCase().includes(search.toLowerCase()) ||
                item.userId?.username?.toLowerCase().includes(search.toLowerCase());
            const matchesType = selectedType === "all" || item.type === selectedType;
            return matchesSearch && matchesType;
        });
    }, [items, search, selectedType]);

    const latestItem = items[0];

    const getTypeIcon = (type: string) => {
        const config = TYPE_CONFIG[type?.toLowerCase()] || TYPE_CONFIG.chart;
        const IconComponent = config.icon;
        return <IconComponent size={13} className="shrink-0" />;
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] pt-24 pb-16 px-4 sm:px-6 lg:px-12 text-slate-900 dark:text-slate-100">
            {/* Header Hero */}
            <div className="text-center max-w-2xl mx-auto mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
                    <FiGlobe className="w-3.5 h-3.5" />
                    Public Showcase Gallery
                </div>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-3">
                    Explore Community Visualizations
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Discover, inspect, and embed interactive charts, network graphs, and data
                    architectures created by users.
                </p>
            </div>

            {latestItem && (
                <div className="max-w-5xl mx-auto mb-12 p-6 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-200 dark:border-indigo-800/60 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-indigo-600 text-white">
                            {getTypeIcon(latestItem.type)}
                            <span>Latest Showcase: {latestItem.type}</span>
                        </span>
                        <h2 className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">
                            {latestItem.title}
                        </h2>
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                            <span className="flex items-center gap-1">
                                <FiUser size={13} />@{latestItem.userId?.username || "developer"}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <FiCalendar size={13} />
                                {new Date(latestItem.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <Link
                            to={`/view/${latestItem.shareId}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-600/20 active:scale-95"
                        >
                            <span>Open Visualization</span>
                            <FiExternalLink size={13} />
                        </Link>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                <div className="relative w-full sm:w-80">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by title or author..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    />
                </div>

                <div className="flex flex-wrap gap-1.5">
                    {Object.entries(TYPE_CONFIG).map(([typeKey, config]) => {
                        const Icon = config.icon;
                        const isSelected = selectedType === typeKey;
                        return (
                            <button
                                key={typeKey}
                                onClick={() => setSelectedType(typeKey)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                                    isSelected
                                        ? "bg-indigo-600 text-white shadow-xs"
                                        : "bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800"
                                }`}
                            >
                                <Icon size={13} />
                                <span>{config.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {loading ? (
                <Loader data="Loading Gallery..." />
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                    No public visualizations found matching current criteria.
                </div>
            ) : (
                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-800 transition-all flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                                        {getTypeIcon(item.type)}
                                        <span>{item.type}</span>
                                    </span>

                                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                                        <FiCalendar size={12} />
                                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                    </span>
                                </div>

                                <h3
                                    className="font-bold text-base text-slate-900 dark:text-white truncate mb-1"
                                    title={item.title}
                                >
                                    {item.title}
                                </h3>

                                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                                    <FiUser size={12} />
                                    <span>@{item.userId?.username || "anonymous"}</span>
                                </p>
                            </div>

                            <div className="flex items-center justify-between gap-2 mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                                <button
                                    onClick={() => {
                                        const snippet = `<iframe src="${window.location.origin}/embed/${item.shareId}" width="100%" height="600" frameborder="0" style="border: 1px solid #e2e8f0; border-radius: 12px;" allowfullscreen></iframe>`;
                                        navigator.clipboard.writeText(snippet);
                                        showAlert("Embed code copied to clipboard!", "Copied", 2);
                                    }}
                                    className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                    title="Copy <iframe> embed code"
                                >
                                    <FiCode size={16} />
                                </button>
                                <Link
                                    to={`/view/${item.shareId}`}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-xs font-bold transition"
                                >
                                    <span>Explore</span>
                                    <FiExternalLink size={12} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
