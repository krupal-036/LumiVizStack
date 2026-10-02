// frontend/src/components/visualizations/CardView.tsx
import { useState, useMemo } from "react";
import {
    FiLayers,
    FiMaximize2,
    FiX,
    FiExternalLink,
    FiChevronLeft,
    FiChevronRight,
    FiChevronsLeft,
    FiChevronsRight,
    FiGrid,
} from "react-icons/fi";
import SmartCell from "@/components/common/SmartCell";
import { isUrl } from "@/utils/dataParser";

type CardViewProps = {
    data: any[];
    renderImages?: boolean;
    forceImages?: boolean;
    setForceImages?: (value: boolean) => void;
};

const checkIsImage = (key: string, value: any) => {
    if (typeof value !== "string" || !isUrl(value)) return false;
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp", ".bmp"];
    const isImageExt = imageExtensions.some((ext) => value.toLowerCase().includes(ext));
    const imageKeys = [
        "image",
        "img",
        "thumbnail",
        "photo",
        "avatar",
        "cover",
        "picture",
        "poster",
    ];
    const isImageKey = imageKeys.some((k) => key.toLowerCase().includes(k));
    const isKnownService =
        value.includes("unsplash.com") ||
        value.includes("picsum.photos") ||
        value.includes("googleusercontent");
    return isImageExt || isImageKey || isKnownService;
};

const CardView = ({ data, renderImages = true, forceImages, setForceImages }: CardViewProps) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);

    const totalPages = Math.ceil((data?.length || 0) / pageSize) || 1;

    // Windowing: only render active page items to preserve 60 FPS
    const paginatedData = useMemo(() => {
        if (!data || data.length === 0) return [];
        const start = (currentPage - 1) * pageSize;
        return data.slice(start, start + pageSize);
    }, [data, currentPage, pageSize]);

    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-28 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400">
                <FiLayers size={44} className="mb-3 opacity-40" />
                <p className="font-semibold text-sm">No records available</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-4">
            {/* Header / Density & Pagination Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <FiGrid size={14} /> Showing {paginatedData.length} of {data.length} cards
                </span>

                <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-500 dark:text-slate-400">
                        Cards per page:
                    </label>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                    >
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                        <option value={48}>48</option>
                        <option value={96}>96</option>
                    </select>
                </div>
            </div>

            {/* Responsive Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {paginatedData.map((item, idx) => {
                    const relativeIdx = (currentPage - 1) * pageSize + idx + 1;
                    const imgKey = Object.keys(item || {}).find((key) =>
                        checkIsImage(key, item[key]),
                    );
                    const imgSrc = imgKey && renderImages ? item[imgKey] : null;

                    return (
                        <div
                            key={relativeIdx}
                            className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800/80 transition-all duration-200 overflow-hidden"
                        >
                            {imgSrc && (
                                <div className="relative w-full h-44 overflow-hidden bg-slate-100 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800">
                                    <img
                                        src={imgSrc}
                                        alt="Visual representation"
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e: any) => {
                                            e.target.closest(".relative").style.display = "none";
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setPreviewImage(imgSrc)}
                                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Quick View"
                                    >
                                        <FiMaximize2 size={13} />
                                    </button>
                                </div>
                            )}

                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                                        <span className="text-[10px] font-mono font-bold text-slate-400">
                                            #{relativeIdx}
                                        </span>
                                    </div>

                                    {Object.entries(item || {})
                                        .slice(0, 8)
                                        .map(([key, val]) => {
                                            if (key === imgKey) return null;
                                            return (
                                                <div key={key} className="flex flex-col gap-0.5">
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                                        {key.replace(/_/g, " ")}
                                                    </span>
                                                    <div className="text-xs truncate max-w-full text-slate-800 dark:text-slate-200">
                                                        <SmartCell
                                                            value={val}
                                                            renderImages={renderImages}
                                                            forceImages={forceImages}
                                                            setForceImages={setForceImages}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 pt-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50"
                        >
                            <FiChevronsLeft size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50"
                        >
                            <FiChevronLeft size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50"
                        >
                            <FiChevronRight size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50"
                        >
                            <FiChevronsRight size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* High-Res Image Lightbox */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in"
                    onClick={() => setPreviewImage(null)}
                >
                    <div
                        className="relative max-w-4xl max-h-[85vh] bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="absolute top-4 right-4 flex gap-2 z-10">
                            <a
                                href={previewImage}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
                            >
                                <FiExternalLink size={15} />
                            </a>
                            <button
                                type="button"
                                onClick={() => setPreviewImage(null)}
                                className="p-2 bg-black/60 hover:bg-rose-600 text-white rounded-full transition-colors"
                            >
                                <FiX size={15} />
                            </button>
                        </div>
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="max-h-[80vh] w-auto object-contain rounded-xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CardView;
