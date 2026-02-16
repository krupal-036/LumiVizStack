import React, { useState, useMemo } from "react";
import { FiBarChart2, FiActivity, FiPieChart } from "react-icons/fi";

const ChartView = ({ data }) => {
  const [chartType, setChartType] = useState("bar"); // bar | line | pie

  const { values, labels, maxVal } = useMemo(() => {
    if (!data || data.length === 0) return { values: [], labels: [], maxVal: 0 };
    
    const firstItem = data[0];
    const keys = Object.keys(firstItem);
    
    // Find numeric and string keys automatically
    const valueKey = keys.find(k => typeof firstItem[k] === 'number') || keys[0];
    const labelKey = keys.find(k => typeof firstItem[k] === 'string') || keys[1] || keys[0];

    const vals = data.map(d => Number(d[valueKey]) || 0);
    const labs = data.map(d => String(d[labelKey]).substring(0, 15));
    
    return { values: vals, labels: labs, maxVal: Math.max(...vals) };
  }, [data]);

  if (data.length === 0) return <div className="text-center py-20 text-gray-400">No data for chart</div>;

  // Simple SVG Chart Logic
  const SVG_WIDTH = 600;
  const SVG_HEIGHT = 300;
  const BAR_WIDTH = SVG_WIDTH / data.length - 10;

  const renderBarChart = () => (
    <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-64 overflow-visible">
      {values.map((val, i) => {
        const height = (val / maxVal) * (SVG_HEIGHT - 40);
        const x = i * (BAR_WIDTH + 10) + 10;
        const y = SVG_HEIGHT - height - 20;
        
        return (
          <g key={i} className="transition-all duration-500">
            <rect 
              x={x} y={y} 
              width={BAR_WIDTH} 
              height={height} 
              fill="#6366f1" 
              rx="4" 
              className="hover:fill-indigo-400 cursor-pointer"
            />
            <text x={x + BAR_WIDTH/2} y={SVG_HEIGHT - 5} textAnchor="middle" className="fill-gray-400 text-[10px]">
              {labels[i]}
            </text>
            <text x={x + BAR_WIDTH/2} y={y - 5} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300 text-[10px] font-bold">
              {val}
            </text>
          </g>
        );
      })}
    </svg>
  );

  const renderLineChart = () => {
    const points = values.map((val, i) => {
      const x = i * (SVG_WIDTH / values.length) + 20;
      const y = SVG_HEIGHT - (val / maxVal) * (SVG_HEIGHT - 40) - 20;
      return `${x},${y}`;
    }).join(" ");

    return (
      <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-64 overflow-visible">
        <polyline
          fill="none"
          stroke="#6366f1"
          strokeWidth="3"
          points={points}
          className="drop-shadow-md"
        />
        {values.map((val, i) => {
           const x = i * (SVG_WIDTH / values.length) + 20;
           const y = SVG_HEIGHT - (val / maxVal) * (SVG_HEIGHT - 40) - 20;
           return (
             <circle key={i} cx={x} cy={y} r="4" fill="#fff" stroke="#6366f1" strokeWidth="2" className="hover:r-6 cursor-pointer" />
           )
        })}
      </svg>
    );
  };

  const renderPieChart = () => {
    let currentAngle = 0;
    const total = values.reduce((a, b) => a + b, 0);
    const cx = 150, cy = 150, r = 100;

    return (
      <svg viewBox="0 0 300 300" className="w-64 h-64 mx-auto">
        {values.map((val, i) => {
          const angle = (val / total) * 360;
          const largeArc = angle > 180 ? 1 : 0;
          
          // Calculate start/end points
          const startRad = (currentAngle - 90) * Math.PI / 180;
          const endRad = (currentAngle + angle - 90) * Math.PI / 180;
          
          const x1 = cx + r * Math.cos(startRad);
          const y1 = cy + r * Math.sin(startRad);
          const x2 = cx + r * Math.cos(endRad);
          const y2 = cy + r * Math.sin(endRad);

          const pathD = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
          
          currentAngle += angle;
          
          const colors = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
          
          return (
            <path key={i} d={pathD} fill={colors[i % colors.length]} stroke="#fff" strokeWidth="2" className="hover:opacity-80 transition-opacity cursor-pointer">
              <title>{`${labels[i]}: ${val}`}</title>
            </path>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border dark:border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2 p-1 bg-gray-50 dark:bg-gray-800 rounded-lg w-fit">
          <button onClick={() => setChartType("bar")} className={`p-2 rounded ${chartType === "bar" ? "bg-white dark:bg-gray-600 shadow text-indigo-600" : "text-gray-500"}`}><FiBarChart2 /></button>
          <button onClick={() => setChartType("line")} className={`p-2 rounded ${chartType === "line" ? "bg-white dark:bg-gray-600 shadow text-indigo-600" : "text-gray-500"}`}><FiActivity /></button>
          <button onClick={() => setChartType("pie")} className={`p-2 rounded ${chartType === "pie" ? "bg-white dark:bg-gray-600 shadow text-indigo-600" : "text-gray-500"}`}><FiPieChart /></button>
        </div>
        <span className="text-xs text-gray-400 uppercase font-bold">Auto-Mapped Data</span>
      </div>

      <div className="flex justify-center items-center py-4">
        {chartType === "bar" && renderBarChart()}
        {chartType === "line" && renderLineChart()}
        {chartType === "pie" && renderPieChart()}
      </div>
    </div>
  );
};

export default ChartView;