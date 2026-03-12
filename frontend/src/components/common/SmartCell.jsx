import React, { useState } from "react";
import { FiChevronDown, FiImage, FiX, FiExternalLink } from "react-icons/fi";

const SmartCell = ({ value, renderImages = true }) => {
  const [showModal, setShowModal] = useState(false);
  const [isForcedImage, setIsForcedImage] = useState(false);

  // 1. Handle Null / Undefined
  if (value === null || value === undefined) {
    return <span className="text-gray-400 italic">null</span>;
  }

  // 2. Handle Objects / Arrays (Recursive)
  if (typeof value === "object") {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
        >
          <FiChevronDown size={12} />
          {Array.isArray(value) ? `[${value.length}]` : `{Object}`}
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <div 
              className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col border dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                <h3 className="font-bold text-lg dark:text-white">Data Inspector</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-red-500">
                  <FiX size={20} />
                </button>
              </div>
              <div className="p-4 overflow-auto">
                <pre className="text-xs font-mono text-indigo-600 dark:text-indigo-300 whitespace-pre-wrap">
                  {JSON.stringify(value, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // 3. Handle Strings (URLs, Images, Text)
  if (typeof value === "string") {
    const isUrl = value.startsWith("http");
    
    // Check for image (Auto or Forced)
    const isImageExt = value.match(/\.(jpeg|jpg|gif|png|svg|webp)$/) != null || value.includes('unsplash');
    const shouldRenderImage = renderImages && (isImageExt || isForcedImage);

    if (shouldRenderImage && isUrl) {
      return (
        <div className="flex items-center gap-2">
          <img 
            src={value} 
            alt="preview" 
            className="h-12 w-12 rounded-lg object-cover shadow-sm border dark:border-gray-700 bg-gray-50" 
            onError={(e) => { e.target.style.display = 'none'; }} 
          />
          <button 
            onClick={() => setIsForcedImage(false)}
            className="text-[10px] text-red-500 hover:underline"
          >
            Hide
          </button>
        </div>
      );
    }

    if (isUrl) {
      return (
        <div className="flex items-center gap-1">
          <a href={value} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-xs truncate max-w-[150px]">
            {value}
          </a>
          <button 
            onClick={() => setIsForcedImage(true)} 
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-indigo-500"
            title="Preview as Image"
          >
            <FiImage size={12} />
          </button>
        </div>
      );
    }

    return <span className="text-gray-800 dark:text-gray-100 text-sm">{value}</span>;
  }

  // 4. Default (Numbers, Booleans)
  return <span className="text-teal-600 dark:text-teal-300 font-medium">{String(value)}</span>;
};

export default SmartCell;