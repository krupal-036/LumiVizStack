import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FiCheck,
  FiLink,
  FiFileText,
  FiCode,
  FiCopy,
  FiTerminal,
  FiArrowRight,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

import Alert from "../components/common/Alert";

const copyjsondata = JSON.stringify(
  {
    employees: [
      {
        id: 1,
        name: "Alice Johnson",
        department: "HR",
        salary: 50000,
        avatar: "https://picsum.photos/seed/alice/40/40.jpg",
      },
      {
        id: 2,
        name: "Bob Smith",
        department: "Engineering",
        salary: 85000,
        avatar: "https://picsum.photos/seed/bob/40/40.jpg",
      },
      {
        id: 3,
        name: "Charlie Brown",
        department: "Marketing",
        salary: 60000,
        avatar: "https://picsum.photos/seed/charlie/40/40.jpg",
      },
    ],
    company: "LumiVizStack",
  },
  null,
  2,
);

export default function Dashboard() {
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyjsondata);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch {
      setError("Failed to copy to clipboard.");
    }
  };

  const handleVisualizeClick = () => {
    if (user) {
      navigate("/visualize");
    } else {
      setError("You must be logged in to visualize your data.");
      setTimeout(
        () =>
          navigate("/login", { state: { error: "Please login to continue" } }),
        1500,
      );
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 pb-20">
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 dark:bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-violet-500/20 dark:bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center text-center pt-10">
        {/* Badge: Supported Formats */}
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

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
          Transform Data into <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
            Actionable Insights
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed">
          The fastest way to visualize complex JSON structures. No configuration
          needed—just paste, connect, or upload your data.
        </p>

        {/* Primary Action Button */}
        <button
          onClick={handleVisualizeClick}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-50 dark:focus:ring-offset-[#0B0F19] shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5"
        >
          <HiSparkles className="w-5 h-5 text-indigo-200 group-hover:rotate-12 transition-transform" />
          Start Visualizing
          <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Error Message Area */}
        {error && (
          <div className="mt-6 animate-fade-in-up">
            <Alert message={error} type="error" />
          </div>
        )}

        {/* Divider */}
        <div className="my-12 flex items-center w-full max-w-sm">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
          <span className="px-4 text-sm text-slate-400 font-medium">
            or try with sample data
          </span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
        </div>

        {/* Demo Data / Copy Card */}
        <div className="w-full max-w-lg bg-white dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden group hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
          {/* Card Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 ml-2">
                sample-data.json
              </span>
            </div>
            <button
              onClick={handleCopy}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                ${isCopied
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-600"
                }
              `}
            >
              {isCopied ? (
                <>
                  <FiCheck className="w-3.5 h-3.5" /> Copied!
                </>
              ) : (
                <>
                  <FiCopy className="w-3.5 h-3.5" /> Copy Code
                </>
              )}
            </button>
          </div>

          {/* Card Body (Preview) */}
          <div className="p-2 bg-slate-50 dark:bg-[#0B0F19]">
  <div className="font-mono text-xs sm:text-sm text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed select-none">
{`{
"employees": [
  { "id": 1, "name": "Alice Johnson", ... },
  { "id": 2, "name": "Bob Smith", ... },
  ...
],
"company": "LumiVizStack"
}`}
  </div>
</div>
        </div>
      </div>
    </section>
  );
}
