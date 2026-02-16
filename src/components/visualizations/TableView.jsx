import React, { useState } from "react";
import { FiImage } from "react-icons/fi";
import { isImageUrl, isUrl } from "../../utils/dataParser";

const TableView = ({ data, renderImages }) => {
  const [forcedImages, setForcedImages] = useState({});

  if (data.length === 0)
    return <p className="text-center py-10 text-gray-400">No data to display</p>;

  const headers = Object.keys(data[0]);

  const toggleForceImage = (rowIdx, key) => {
    const id = `${rowIdx}-${key}`;
    setForcedImages((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderCellContent = (value, rowIdx, key) => {
    const cellId = `${rowIdx}-${key}`;
    
    // 1. Handle Objects/Arrays (Fix for [object Object])
    if (typeof value === 'object' && value !== null) {
      return (
        <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto max-w-xs whitespace-pre-wrap">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }

    // 2. Handle Strings
    if (typeof value === 'string') {
      const isImage = renderImages && isImageUrl(value);
      const isForced = forcedImages[cellId];
      const looksLikeUrl = isUrl(value);

      // Render Image if auto-detected or forced
      if (isImage || (isForced && looksLikeUrl)) {
        return (
          <div className="flex items-center gap-2">
            <img
              src={value}
              alt="content"
              className="h-10 w-10 rounded object-cover bg-gray-100"
              onError={(e) => e.target.style.display = 'none'} 
            />
            <button 
              onClick={() => toggleForceImage(rowIdx, key)}
              className="text-xs text-red-500 hover:underline"
              title="Revert to URL"
            >
              Hide
            </button>
          </div>
        );
      }

      // Render URL with Converter Button
      if (looksLikeUrl) {
        return (
          <div className="flex items-center gap-2">
            <span className="text-blue-500 truncate max-w-[150px]">{value}</span>
            <button
              onClick={() => toggleForceImage(rowIdx, key)}
              className="p-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
              title="Render as Image"
            >
              <FiImage size={12} />
            </button>
          </div>
        );
      }
    }

    // 3. Default
    return <span className="text-gray-800 dark:text-gray-100">{String(value)}</span>;
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {headers.map((key) => (
              <th
                key={key}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              {headers.map((key) => (
                <td key={key} className="px-4 py-3 whitespace-nowrap align-top">
                  {renderCellContent(row[key], idx, key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;