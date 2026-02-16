import React from "react";

const ChartView = ({ data }) => {
  if (data.length === 0)
    return <p className="text-center py-10 text-gray-400">No data to display</p>;

  const firstItem = data[0];
  const keys = Object.keys(firstItem);
  
  // Find numeric and string keys
  const valueKey = keys.find((k) => typeof firstItem[k] === "number") || keys[1];
  const labelKey = keys.find((k) => typeof firstItem[k] === "string") || keys[0];

  // Calculate max for scaling
  const maxVal = Math.max(...data.map((d) => d[valueKey] || 0));

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 italic">
        Auto-generated bar chart using key: <strong>{valueKey}</strong>
      </p>
      <div className="space-y-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-24 truncate text-xs text-gray-500 dark:text-gray-400 text-right pr-2">
              {String(item[labelKey])}
            </div>
            <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-4 overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${maxVal > 0 ? (item[valueKey] / maxVal) * 100 : 0}%`,
                }}
              />
            </div>
            <div className="w-12 text-right text-xs font-medium text-gray-700 dark:text-gray-200">
              {item[valueKey]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartView;