// frontend/src/components/visualizations/TreeView.tsx
import MonacoCodeEditor from "@/components/common/MonacoCodeEditor";
import React, { useState } from "react";
import { FiCopy, FiDownload, FiCheck, FiCode, FiMinimize2 } from "react-icons/fi";

type TreeViewProps = {
    data: any;
    title?: string;
};

const TreeView: React.FC<TreeViewProps> = ({ data, title = "Data Export" }) => {
    const [copied, setCopied] = useState(false);
    const [minified, setMinified] = useState(false);

    const jsonString = React.useMemo(() => {
        try {
            return minified ? JSON.stringify(data) : JSON.stringify(data, null, 2);
        } catch {
            return String(data);
        }
    }, [data, minified]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(jsonString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${title.toLowerCase().replace(/\s+/g, "-")}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="relative rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden flex flex-col h-[650px] w-full">
            {/* Action Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <FiCode className="w-4 h-4 stroke-[2.5px]" />
                    </div>
                    <span className="text-xs font-black tracking-wide bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-cyan-400 uppercase">
                        Monaco JSON Explorer
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 ml-2">
                        {Array.isArray(data) ? `[${data.length} items]` : "{Object}"}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setMinified(!minified)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all border ${
                            minified
                                ? "bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 border-indigo-300 dark:border-indigo-700"
                                : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700"
                        }`}
                        title="Toggle Minification"
                    >
                        <FiMinimize2 size={13} />
                        {minified ? "Beautify" : "Minify"}
                    </button>

                    <button
                        type="button"
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all border border-slate-200 dark:border-zinc-700 hover:border-indigo-500 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400"
                    >
                        {copied ? (
                            <FiCheck className="text-emerald-500" size={13} />
                        ) : (
                            <FiCopy size={13} />
                        )}
                        {copied ? "Copied!" : "Copy"}
                    </button>

                    <button
                        type="button"
                        onClick={handleDownload}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                    >
                        <FiDownload size={13} /> Export
                    </button>
                </div>
            </div>

            {/* Monaco Editor in Read-Only Explorer Mode */}
            <div className="flex-1 w-full h-full min-h-0">
                <MonacoCodeEditor
                    value={jsonString}
                    readOnly={true}
                    language="json"
                    showFormatButton={false}
                />
            </div>
        </div>
    );
};

export default TreeView;
