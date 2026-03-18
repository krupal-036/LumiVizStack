import React, { useState, useMemo, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend } from 'recharts';
import { FiSettings } from 'react-icons/fi';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const ChartView = ({ data }) => {
  const [chartType, setChartType] = useState('bar');
  const [selectedNumKey, setSelectedNumKey] = useState('');
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const chartContainerRef = useRef(null);

  const allKeys = useMemo(() => (data.length > 0 ? Object.keys(data[0]) : []), [data]);
  const numericKeys = useMemo(() => allKeys.filter(k => typeof data[0][k] === 'number'), [data, allKeys]);
  const labelKey = useMemo(() => allKeys.find(k => typeof data[0][k] === 'string') || allKeys[0], [data, allKeys]);

  const renderLegendText = (value) => {
    const maxLength = 12; 
    return value.length > maxLength ? `${value.substring(0, maxLength)}...` : value;
  };
  const renderLegendPayload = (payload) => payload.slice(0, 5);

  useEffect(() => {
    if (numericKeys.length > 0 && !selectedNumKey) setSelectedNumKey(numericKeys[0]);
  }, [numericKeys, selectedNumKey]);

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setContainerSize({ width, height });
      }
    });
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  const pieRadius = useMemo(() => {
    const { width, height } = containerSize;
    if (width === 0 || height === 0) return 100;
    const calculatedRadius = Math.min(width, height) / 2 - 80;
    return Math.max(40, Math.min(calculatedRadius, 200));
  }, [containerSize]);

  if (data.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 h-[500px] shadow-sm flex flex-col">
    
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
          {['bar', 'line', 'area', 'pie'].map(t => (
            <button key={t} onClick={() => setChartType(t)} 
              className={`px-4 py-2 rounded-md text-xs font-bold transition-all capitalize
                ${chartType === t ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>
              {t}
            </button>
          ))}
        </div>

        {numericKeys.length > 0 && (
          <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-lg border border-indigo-100 dark:border-indigo-800">
            <FiSettings size={16} className="text-indigo-600" />
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">Data Key:</span>
            <select
              value={selectedNumKey}
              onChange={(e) => setSelectedNumKey(e.target.value)}
              className="bg-transparent text-xs font-bold text-indigo-900 dark:text-indigo-100 outline-none cursor-pointer"
            >
              {numericKeys.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
        )}
      </div>

      <div ref={chartContainerRef} className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'pie' ? (
            <PieChart>
              <Pie 
                data={data} 
                dataKey={selectedNumKey} 
                nameKey={labelKey} 
                cx="50%" 
                cy="50%" 
                outerRadius={pieRadius} 
                label
              >
                {data.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend 
                formatter={renderLegendText} 
                payloadUnwrapper={renderLegendPayload} 
                content={({ payload }) => (
                  <ul className="flex flex-wrap justify-center gap-4 text-xs font-medium text-gray-500 mt-4">
                    {payload.slice(0, 5).map((entry, index) => (
                      <li key={`item-${index}`} className="flex items-center gap-1.6">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span>{renderLegendText(entry.value)}</span>
                      </li>
                    ))}
                    {payload.length > 5 && <li className="italic text-gray-400">+{payload.length - 5} more</li>}
                  </ul>
                )}
              />
            </PieChart>
          ) : (
            (() => {
              const ChartComp = chartType === 'bar' ? BarChart : chartType === 'line' ? LineChart : AreaChart;
              return (
                <ChartComp data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                  <XAxis dataKey={labelKey} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', backgroundColor: '#fff', color: '#111' }} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    formatter={renderLegendText}
                    payload={data.slice(0, 5).map((d, i) => ({
                      value: d[labelKey],
                      type: 'rect',
                      color: chartType === 'pie' ? COLORS[i % COLORS.length] : '#6366f1'
                    }))}
                  />
                  {chartType === 'bar' && <Bar dataKey={selectedNumKey} fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />}
                  {chartType === 'line' && <Line type="monotone" dataKey={selectedNumKey} stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} />}
                  {chartType === 'area' && <Area type="monotone" dataKey={selectedNumKey} fill="#6366f1" stroke="#6366f1" fillOpacity={0.2} strokeWidth={2} />}
                </ChartComp>
              );
            })()
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartView;