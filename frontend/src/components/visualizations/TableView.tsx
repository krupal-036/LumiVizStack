// frontend/src/components/visualizations/TableView.tsx
import React, { useState, useMemo } from "react";
import SmartCell from "@/components/common/SmartCell";
import {
    FiHash,
    FiChevronUp,
    FiChevronDown,
    FiChevronsLeft,
    FiChevronLeft,
    FiChevronRight,
    FiChevronsRight,
    FiSliders,
} from "react-icons/fi";

type TableViewProps = {
    data: Array<Record<string, any>>;
    forceImages: boolean;
    setForceImages: (value: boolean) => void;
};

type SortConfig = {
    key: string;
    direction: "asc" | "desc";
} | null;

const TableView: React.FC<TableViewProps> = ({ data, forceImages, setForceImages }) => {
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({});
    const [showColumnDropdown, setShowColumnDropdown] = useState(false);

    // Extract UNION of all keys across all records (Never breaks on sparse fields)
    const allHeaders = useMemo(() => {
        if (!Array.isArray(data) || data.length === 0) return [];
        const keySet = new Set<string>();
        data.forEach((row) => {
            if (row && typeof row === "object" && !Array.isArray(row)) {
                Object.keys(row).forEach((k) => keySet.add(k));
            }
        });
        return Array.from(keySet);
    }, [data]);

    // Active displayed columns
    const displayedHeaders = useMemo(() => {
        return allHeaders.filter((header) => visibleColumns[header] !== false);
    }, [allHeaders, visibleColumns]);

    // Safe sorting
    const sortedData = useMemo(() => {
        if (!sortConfig) return data;
        const sorted = [...data];
        sorted.sort((a, b) => {
            const valA = a?.[sortConfig.key];
            const valB = b?.[sortConfig.key];

            if (valA === undefined || valA === null) return 1;
            if (valB === undefined || valB === null) return -1;

            if (typeof valA === "number" && typeof valB === "number") {
                return sortConfig.direction === "asc" ? valA - valB : valB - valA;
            }

            const strA = String(valA).toLowerCase();
            const strB = String(valB).toLowerCase();
            if (strA < strB) return sortConfig.direction === "asc" ? -1 : 1;
            if (strA > strB) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [data, sortConfig]);

    // Pagination calculations
    const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return sortedData.slice(start, start + pageSize);
    }, [sortedData, currentPage, pageSize]);

    const handleSort = (key: string) => {
        setSortConfig((prev) => {
            if (prev?.key === key) {
                if (prev.direction === "asc") return { key, direction: "desc" };
                return null;
            }
            return { key, direction: "asc" };
        });
    };

    const toggleColumn = (key: string) => {
        setVisibleColumns((prev) => ({
            ...prev,
            [key]: prev[key] === false ? true : false,
        }));
    };

    if (!data || data.length === 0) {
        return (
            <div className="p-8 text-center text-slate-400 border border-dashed rounded-xl border-slate-300 dark:border-slate-800">
                No tabular data available
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-3">
            {/* Toolbar: Column Toggle & Page Size */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {data.length} total records • {allHeaders.length} columns identified
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <FiSliders size={13} />
                            Columns ({displayedHeaders.length}/{allHeaders.length})
                        </button>

                        {showColumnDropdown && (
                            <div className="absolute right-0 mt-2 z-50 w-64 max-h-64 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 flex flex-col gap-1">
                                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                                    Toggle Columns
                                </div>
                                {allHeaders.map((col) => (
                                    <label
                                        key={col}
                                        className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-xs cursor-pointer text-slate-700 dark:text-slate-200"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={visibleColumns[col] !== false}
                                            onChange={() => toggleColumn(col)}
                                            className="rounded text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="truncate">{col.replace(/_/g, " ")}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 outline-none"
                    >
                        <option value={10}>10 / page</option>
                        <option value={25}>25 / page</option>
                        <option value={50}>50 / page</option>
                        <option value={100}>100 / page</option>
                    </select>
                </div>
            </div>

            {/* Main Table Container */}
            <div className="w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <div className="overflow-x-auto max-h-[70vh] custom-scrollbar">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead className="sticky top-0 z-20">
                            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                <th className="sticky left-0 z-30 bg-slate-100 dark:bg-slate-800 p-2 text-[11px] font-bold uppercase tracking-wider w-12 text-center border-b border-r border-slate-200 dark:border-slate-700">
                                    <div className="flex justify-center">
                                        <FiHash size={13} />
                                    </div>
                                </th>
                                {displayedHeaders.map((header) => {
                                    const isSorted = sortConfig?.key === header;
                                    return (
                                        <th
                                            key={header}
                                            onClick={() => handleSort(header)}
                                            className="px-3 py-3 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700/60 transition-colors border-b border-r border-slate-200 dark:border-slate-700 select-none"
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <span>{header.replace(/_/g, " ")}</span>
                                                <span className="text-slate-400">
                                                    {isSorted && sortConfig?.direction === "asc" ? (
                                                        <FiChevronUp
                                                            size={14}
                                                            className="text-indigo-600 dark:text-indigo-400"
                                                        />
                                                    ) : isSorted &&
                                                      sortConfig?.direction === "desc" ? (
                                                        <FiChevronDown
                                                            size={14}
                                                            className="text-indigo-600 dark:text-indigo-400"
                                                        />
                                                    ) : (
                                                        <div className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100" />
                                                    )}
                                                </span>
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {paginatedData.map((row, relativeIdx) => {
                                const absoluteIdx = (currentPage - 1) * pageSize + relativeIdx + 1;
                                return (
                                    <tr
                                        key={relativeIdx}
                                        className="group hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-colors"
                                    >
                                        <td className="sticky left-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-indigo-50/70 dark:group-hover:bg-indigo-950/40 p-2 text-xs font-mono text-center text-slate-400 dark:text-slate-500 border-b border-r border-slate-200 dark:border-slate-800">
                                            {absoluteIdx}
                                        </td>
                                        {displayedHeaders.map((key) => {
                                            // Safe access even if the key does not exist on this specific record
                                            const cellValue =
                                                row !== null &&
                                                typeof row === "object" &&
                                                key in row
                                                    ? row[key]
                                                    : undefined;

                                            return (
                                                <td
                                                    key={`${relativeIdx}-${key}`}
                                                    className="px-3 py-2.5 text-left align-middle border-b border-r border-slate-200 dark:border-slate-800 max-w-[320px] truncate"
                                                >
                                                    <SmartCell
                                                        value={cellValue}
                                                        forceImages={forceImages}
                                                        setForceImages={setForceImages}
                                                    />
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 py-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="p-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <FiChevronsLeft size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <FiChevronLeft size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <FiChevronRight size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="p-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <FiChevronsRight size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TableView;
