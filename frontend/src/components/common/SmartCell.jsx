import React, { useState } from "react";
import { createPortal } from "react-dom";
import { FiChevronDown, FiImage, FiX, FiExternalLink, FiEye } from "react-icons/fi";
import { Link } from "react-router-dom";


const SmartCell = ({ value, renderImages = true, forceImages, setForceImages }) => {
  const [showModal, setShowModal] = useState(false);

  if (value === null || value === undefined) {
    return <span className="text-slate-300 dark:text-slate-700 text-xs italic select-none">∅ null</span>;
  }

  if (typeof value === "object") {
    const isArr = Array.isArray(value);
    return (
      <>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
          }}
          className="group flex items-center gap-2 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 rounded-md transition-all active:scale-95"
        >
          <FiEye size={12} className="text-slate-400 group-hover:text-indigo-500" />
          <span className="text-[11px] font-bold font-mono text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
            {isArr ? `ARRAY(${value.length})` : 'OBJECT'}
          </span>
        </button>
        {showModal && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">

            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={() => setShowModal(false)}
            />

            <div className="relative bg-white dark:bg-slate-950 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                    <FiEye size={18} />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">Data Inspector</h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="p-6 overflow-auto custom-scrollbar bg-slate-50/30 dark:bg-transparent">
                <pre className="text-[13px] font-mono leading-relaxed text-indigo-700 dark:text-indigo-300 selection:bg-indigo-100 dark:selection:bg-indigo-900/50">
                  {JSON.stringify(value, null, 2)}
                </pre>
              </div>
            </div>
          </div>,
          document.body
        )}
      </>
    );
  }

  if (typeof value === "string") {
    const isUrl = value.startsWith("http");
    const isImageExt = value.match(/\.(jpeg|jpg|gif|png|svg|webp)$/i) != null || value.includes('unsplash.com');
    const shouldRenderImage = renderImages && (isImageExt || forceImages);

    if (shouldRenderImage && isUrl) {
      return (
        <div className="relative group/img w-fit">
          <img
            src={value}
            alt="Preview"
            className="h-14 w-14 min-w-[56px] rounded-lg object-cover shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 bg-slate-50"
            onError={(e) => { e.target.parentElement.style.display = 'none'; }}
          />
          <button
            onClick={() => setForceImages(false)}
            className="absolute -top-1 -right-1 bg-white dark:bg-slate-800 shadow-md rounded-full p-1 border border-slate-200 dark:border-slate-700 opacity-0 group-hover/img:opacity-100 transition-opacity hover:text-red-500"
          >
            <FiX size={10} />
          </button>
        </div>
      );
    }

    if (isUrl) {
      return (
        <div className="flex items-center gap-2 group/link">
          <Link
            href={value}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-[13px] font-medium transition-colors truncate max-w-[200px]"
          >
            <FiExternalLink size={12} className="shrink-0" />
            <span className="truncate">{value.replace(/(^\w+:|^)\/\//, '')}</span>
          </Link>
          <button
            onClick={() => setForceImages(true)}
            className="opacity-0 group-hover/link:opacity-100 p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-indigo-500 transition-all"
            title="Preview Image"
          >
            <FiImage size={13} />
          </button>
        </div>
      );
    }

    return <span className="text-slate-700 dark:text-slate-200 text-[13px] leading-snug">{value}</span>;
  }
  const isNumber = typeof value === "number";
  return (
    <span className={`text-[13px] font-semibold px-2 py-0.5 rounded-full ${isNumber
      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10"
      : "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10"
      }`}>
      {String(value)}
    </span>
  );
};

export default SmartCell;
