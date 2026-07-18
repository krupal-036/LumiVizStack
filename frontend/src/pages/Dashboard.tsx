import { useState } from "react";

import {
  FiCheck, FiLink, FiFileText, FiCode, FiCopy,
} from "react-icons/fi";
import VisualizeButton from "../components/common/Button.js";
import { useAlert, useTitle } from "../hooks/customHooks.js";
import { jsondata } from "../utils/mockData.js";

export default function Dashboard() {
  const [isCopied, setIsCopied] = useState(false);
  const { showAlert } = useAlert();
  useTitle("Home");
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsondata);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch {
      showAlert("Failed to copy to clipboard.", "Error", 1);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 py-16">
      <div className="inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 dark:bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-violet-500/20 dark:bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />
      </div>
      <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center text-center pt-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm mb-8 backdrop-blur-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Supports:
          </span>
          <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-700">
            <span className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400">
              <FiCode className="w-4 h-4" /> JSON
            </span>
            <span className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400">
              <FiLink className="w-4 h-4" /> API
            </span>
            <span className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400">
              <FiFileText className="w-4 h-4" /> File
            </span>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8">
          Transform Data into <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
            Actionable Insights
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          The fastest way to visualize complex JSON structures. <br />
          No configuration needed - just paste, connect, or upload your data.
        </p>

        <VisualizeButton text="Visualize JSON Now" />

        <div className="my-12 flex items-center w-full max-w-sm">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
          <span className="px-4 text-sm text-slate-400 font-medium">
            or try with sample payload
          </span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
        </div>


        <div className="relative w-full max-w-2xl mx-auto group">
          <div className="relative flex flex-col w-full overflow-hidden border bg-white/70 dark:bg-slate-950/80 backdrop-blur-2xl border-white/20 dark:border-slate-800 rounded-3xl shadow-2xl">

            <div className="flex items-center justify-between px-6 py-4 bg-linear-to-b from-white/50 to-transparent dark:from-slate-800/50 dark:to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 dark:bg-indigo-400/10">
                  <FiCode className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100">Sample Data</h3>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">payload.json</p>
                </div>
              </div>

              <button
                onClick={handleCopy}
                className="relative overflow-hidden px-5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 bg-slate-900 dark:bg-white text-white dark:text-slate-900"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isCopied ? <><FiCheck className="w-4 h-4" /> Done!</> : <><FiCopy className="w-4 h-4" /> Copy JSON</>}
                </span>
              </button>
            </div>

            <div className="p-6 pt-2 font-mono text-sm text-left leading-relaxed">
              <div className="overflow-x-auto selection:bg-pink-500/30">
                <div className="space-y-1">
                  <code>
                    <span className="text-slate-400">{"{"}</span><br />
                    <span className="pl-4 text-rose-500 dark:text-rose-400">"users"</span>: <span className="text-slate-400">[</span><br />
                    <span className="pl-8 text-slate-400">{"{"}</span> <span className="text-cyan-600 dark:text-cyan-400">"id"</span>: <span className="text-amber-500">1</span>, <span className="text-cyan-600 dark:text-cyan-400">"name"</span>: <span className="text-emerald-500">"Alice Johnson"</span>, ...<span className="text-slate-400">{"}"}</span>,<br />
                    <span className="pl-8 text-slate-400">{"{"}</span> <span className="text-cyan-600 dark:text-cyan-400">"id"</span>: <span className="text-amber-500">2</span>, <span className="text-cyan-600 dark:text-cyan-400">"name"</span>: <span className="text-emerald-500">"Bob Smith"</span>, ...<span className="text-slate-400">{"}"}</span>,<br />
                    <span className="pl-8 text-slate-100">...</span><br />
                    <span className="pl-4 text-slate-400">]</span>,<br />
                    <span className="pl-4 text-rose-500 dark:text-rose-400">"company"</span>: <span className="text-emerald-500">"LumiVizStack"</span><br />
                    <span className="text-slate-400">{"}"}</span>
                  </code>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 text-[10px] border-t border-slate-100 dark:border-slate-800/50 text-slate-400 flex justify-between items-center bg-slate-50/30 dark:bg-transparent">
              <span>UTF-8 Encoding</span>
              <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Read Only</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
