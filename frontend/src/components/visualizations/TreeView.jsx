import React, { useState } from 'react';
import { FiCopy, FiDownload, FiCheck, FiCode } from 'react-icons/fi';

const TreeView = ({ data, title = "Data Export" }) => {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative group rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg text-indigo-600 dark:text-indigo-400">
            <FiCode className="w-4 h-4 stroke-[2.5px]" />
          </div>
          <span className="text-sm font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-cyan-400">
            JSON SOURCE
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all border border-slate-200 dark:border-zinc-700 hover:border-indigo-500 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400">
            {copied ? <FiCheck className="text-emerald-500" /> : <FiCopy />}
            {copied ? "Copied!" : "Copy"}
          </button>
          <button onClick={handleDownload} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
            <FiDownload /> Export
          </button>
        </div>
      </div>

      {/* Fixed Code Area */}
      <div className="p-4 md:p-6 max-h-[500px] overflow-auto bg-slate-900 dark:bg-black/40 font-mono">
        <pre className="text-[13px] leading-relaxed whitespace-pre text-indigo-300">
          {/* We use a simple dangerousSetInnerHTML or manual mapping to highlight keys safely */}
          {jsonString.split('\n').map((line, i) => {
            // Find the key (anything inside quotes before a colon)
            const highlightedLine = line.replace(/"([^"]+)":/g, '<span class="text-cyan-400">"$1"</span>:');
            
            return (
              <div key={i} className="flex gap-4">
                <span className="w-8 shrink-0 text-slate-600 dark:text-zinc-600 text-right select-none">{i + 1}</span>
                <span 
                  className="text-indigo-200 dark:text-blue-200"
                  dangerouslySetInnerHTML={{ __html: highlightedLine }} 
                />
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
};

export default TreeView;
