// frontend/src/components/visualizations/ChartView.tsx
import { useState, useMemo, useEffect, useRef } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    LineChart,
    Line,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import {
    FiSettings,
    FiBarChart2,
    FiActivity,
    FiPieChart,
    FiMaximize,
    FiFilter,
} from "react-icons/fi";

const COLORS = [
    "#6366f1",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
    "#3b82f6",
    "#f97316",
    "#a855f7",
    "#14b8a6",
];

type ChartViewProps = {
    data: Array<Record<string, any>>;
};

const ChartView = ({ data }: ChartViewProps) => {
    const [chartType, setChartType] = useState<"bar" | "line" | "area" | "pie">("bar");
    const [selectedNumKey, setSelectedNumKey] = useState<string>("");
    const [dataLimit, setDataLimit] = useState<number>(50);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const chartContainerRef = useRef<HTMLDivElement | null>(null);

    // 1. Union of all keys across all records (handles missing fields across records)
    const allKeys = useMemo(() => {
        if (!Array.isArray(data) || data.length === 0) return [];
        const set = new Set<string>();
        data.forEach((row) => {
            if (row && typeof row === "object" && !Array.isArray(row)) {
                Object.keys(row).forEach((k) => set.add(k));
            }
        });
        return Array.from(set);
    }, [data]);

    // 2. Identify all valid numeric keys
    const numericKeys = useMemo(() => {
        return allKeys.filter((k) =>
            data.some((row) => typeof row?.[k] === "number" && !isNaN(row[k])),
        );
    }, [data, allKeys]);

    // 3. Automatically pick the best label key (e.g. name, title, country; ignores image/avatar urls)
    const labelKey = useMemo(() => {
        const preferred = allKeys.find((k) => {
            const lower = k.toLowerCase();
            const isMedia = ["avatar", "img", "image", "url", "icon"].some((m) =>
                lower.includes(m),
            );
            return !isMedia && data.some((row) => typeof row?.[k] === "string");
        });
        return preferred || allKeys[0] || "id";
    }, [data, allKeys]);

    // 4. Default to meaningful metric (e.g., "age", "gross_revenue_usd" over "id")
    useEffect(() => {
        if (numericKeys.length > 0 && (!selectedNumKey || !numericKeys.includes(selectedNumKey))) {
            const preferred =
                numericKeys.find(
                    (k) => !["id", "_id", "postid", "userid"].includes(k.toLowerCase()),
                ) || numericKeys[0];
            setSelectedNumKey(preferred);
        }
    }, [numericKeys, selectedNumKey]);

    // Container auto-resize
    useEffect(() => {
        const container = chartContainerRef.current;
        if (!container) return;
        const resizeObserver = new ResizeObserver((entries) => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect;
                setContainerSize({ width, height });
            }
        });
        resizeObserver.observe(container);
        return () => resizeObserver.disconnect();
    }, []);

    const pieRadius = useMemo(() => {
        const { width, height } = containerSize;
        if (width === 0 || height === 0) return 100;
        const calculatedRadius = Math.min(width, height) / 2 - 80;
        return Math.max(40, Math.min(calculatedRadius, 180));
    }, [containerSize]);

    const renderLegendText = (value: string) => {
        if (!value) return "";
        const maxLength = value.length > 14 ? 14 : value.length;
        return value.length > maxLength ? `${value.substring(0, maxLength)}...` : value;
    };

    // 5. Data Sampling Window based on the "Show:" filter
    const windowedData = useMemo(() => {
        if (!data || data.length === 0) return [];
        if (dataLimit === -1 || data.length <= dataLimit) {
            return data;
        }
        return data.slice(0, dataLimit);
    }, [data, dataLimit]);

    // 6. Precise normalized data pipeline: fixes missing keys (like Record 2 missing 'name' or 'age')
    const chartData = useMemo(() => {
        if (!windowedData || windowedData.length === 0) return [];

        return windowedData.map((item, index) => {
            // Safe label resolution: fallback to country, id, or index if name is missing
            const rawLabel = item?.[labelKey];
            const resolvedLabel =
                rawLabel !== undefined && rawLabel !== null && String(rawLabel).trim() !== ""
                    ? String(rawLabel)
                    : item?.name || item?.country || item?.id || `Record #${index + 1}`;

            // Safe numeric resolution: keep null (not undefined) so SVG paths never produce NaN
            const rawVal = item?.[selectedNumKey];
            const resolvedVal = typeof rawVal === "number" && !isNaN(rawVal) ? rawVal : null;

            return {
                ...item,
                [labelKey]: resolvedLabel,
                [selectedNumKey]: resolvedVal,
            };
        });
    }, [windowedData, labelKey, selectedNumKey]);

    // 7. Pie Data: Exact classic design when <= 15 items; Top 10 + Other when massive
    const pieData = useMemo(() => {
        const valid = chartData.filter((d) => d[selectedNumKey] !== null && d[selectedNumKey] > 0);

        if (valid.length <= 15) {
            return valid;
        }

        const sorted = [...valid].sort(
            (a, b) => (b[selectedNumKey] || 0) - (a[selectedNumKey] || 0),
        );
        const top10 = sorted.slice(0, 10);
        const others = sorted.slice(10);
        const otherSum = others.reduce((acc, curr) => acc + (curr[selectedNumKey] || 0), 0);

        return [
            ...top10,
            {
                [labelKey]: `Other (${others.length})`,
                [selectedNumKey]: Number(otherSum.toFixed(2)),
            },
        ];
    }, [chartData, selectedNumKey, labelKey]);

    if (data.length === 0) return null;

    return (
        <div className="bg-white dark:bg-gray-800 py-4 rounded-xl border border-gray-200 dark:border-gray-700 w-full h-[620px] md:aspect-[16/9] lg:max-h-[620px] shadow-sm flex flex-col overflow-hidden">
            {/* Header with Type Tabs and Filter / Metric Controls */}
            <div className="flex flex-wrap justify-between items-center gap-4 px-6 mb-4">
                <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
                    {[
                        { id: "bar", icon: <FiBarChart2 /> },
                        { id: "line", icon: <FiActivity /> },
                        { id: "area", icon: <FiMaximize /> },
                        { id: "pie", icon: <FiPieChart /> },
                    ].map((t) => (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => setChartType(t.id as any)}
                            className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                                chartType === t.id
                                    ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-black/5"
                                    : "text-gray-500 dark:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                            }`}
                        >
                            {t.icon}
                            <span>{t.id}</span>
                        </button>
                    ))}
                </div>

                {/* Data Selector Controls */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Data Sampling Filter for large datasets */}
                    {chartType !== "pie" && data.length > 30 && (
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/80 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs">
                            <FiFilter className="text-gray-400" />
                            <span className="text-gray-500 font-medium">Show:</span>
                            <select
                                value={dataLimit}
                                onChange={(e) => setDataLimit(Number(e.target.value))}
                                className="bg-transparent font-bold text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
                            >
                                <option value={25}>First 25</option>
                                <option value={50}>First 50</option>
                                <option value={100}>First 100</option>
                                <option value={250}>First 250</option>
                                <option value={-1}>All ({data.length})</option>
                            </select>
                        </div>
                    )}

                    {/* Numeric Field Selector */}
                    {numericKeys.length > 0 && (
                        <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900/50 text-xs">
                            <FiSettings className="text-indigo-600 dark:text-indigo-400" />
                            <span className="text-indigo-700 dark:text-indigo-300 font-bold">
                                Metric:
                            </span>
                            <select
                                value={selectedNumKey}
                                onChange={(e) => setSelectedNumKey(e.target.value)}
                                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                            >
                                {numericKeys.map((k) => (
                                    <option key={k} value={k}>
                                        {k.replace(/_/g, " ")}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* Responsive Chart Container */}
            <div className="flex-1 w-full overflow-x-auto custom-scrollbar">
                <div
                    ref={chartContainerRef}
                    className="flex-1 w-full h-full min-w-[500px] md:min-w-full"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === "pie" ? (
                            /* EXACT ORIGINAL PIE DESIGN */
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey={selectedNumKey}
                                    nameKey={labelKey}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={pieRadius}
                                    label
                                >
                                    {pieData.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    cursor={{ fill: "rgba(0,0,0,0.05)" }}
                                    contentStyle={{
                                        borderRadius: "12px",
                                        border: "none",
                                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                                        backgroundColor: "#111010",
                                        color: "#fff",
                                    }}
                                />
                                <Legend formatter={renderLegendText} />
                            </PieChart>
                        ) : (
                            (() => {
                                const ChartComp =
                                    chartType === "bar"
                                        ? BarChart
                                        : chartType === "line"
                                          ? LineChart
                                          : AreaChart;

                                const isDense = chartData.length > 25;

                                return (
                                    <ChartComp
                                        data={chartData}
                                        margin={{ top: 20, right: 30, left: 10, bottom: 35 }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            stroke="#374151"
                                            opacity={0.15}
                                        />
                                        <XAxis
                                            dataKey={labelKey}
                                            tick={{ fontSize: 11, fill: "#868383" }}
                                            axisLine={false}
                                            tickLine={false}
                                            interval={isDense ? "preserveStartEnd" : 0}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: "#868383", fontSize: 11 }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: "rgba(0,0,0,0.05)" }}
                                            contentStyle={{
                                                borderRadius: "12px",
                                                border: "none",
                                                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                                                backgroundColor: "#111010",
                                                color: "#fff",
                                            }}
                                            formatter={(val: any) => [
                                                val !== null ? val : "N/A",
                                                selectedNumKey,
                                            ]}
                                        />
                                        <Legend
                                            verticalAlign="bottom"
                                            height={36}
                                            formatter={renderLegendText}
                                        />

                                        {chartType === "bar" && (
                                            <Bar
                                                dataKey={selectedNumKey}
                                                fill="#6366f1"
                                                radius={[4, 4, 0, 0]}
                                                barSize={30}
                                            />
                                        )}

                                        {chartType === "line" && (
                                            <Line
                                                type="monotone"
                                                dataKey={selectedNumKey}
                                                stroke="#6366f1"
                                                strokeWidth={3}
                                                connectNulls={true}
                                                dot={
                                                    isDense
                                                        ? false
                                                        : {
                                                              r: 4,
                                                              fill: "#6366f1",
                                                              strokeWidth: 2,
                                                              stroke: "#fff",
                                                          }
                                                }
                                            />
                                        )}

                                        {chartType === "area" && (
                                            <Area
                                                type="monotone"
                                                dataKey={selectedNumKey}
                                                fill="#6366f1"
                                                stroke="#6366f1"
                                                fillOpacity={0.2}
                                                strokeWidth={2}
                                                connectNulls={true}
                                            />
                                        )}
                                    </ChartComp>
                                );
                            })()
                        )}
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ChartView;
