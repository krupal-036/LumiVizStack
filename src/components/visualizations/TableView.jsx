import React from 'react';
import { FiHash } from 'react-icons/fi';

const TableView = ({ data, renderValue, forceImages, setForceImages }) => {
  if (!data || data.length === 0) return null;
  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-10">
              <FiHash />
            </th>
            {headers.map(h => (
              <th key={h} className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
              <td className="p-4 text-sm text-gray-400 font-mono">{i + 1}</td>
              {headers.map(h => (
                <td key={h} className="p-4 text-sm align-top whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis">
                  {renderValue ? renderValue(row[h], `row-${i}-${h}`, forceImages, setForceImages) : String(row[h])}
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