import { useState, useMemo, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend } from 'recharts';
import { FiSettings, FiBarChart2, FiActivity, FiPieChart, FiMaximize } from 'react-icons/fi';
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#3b82f6', '#f97316', '#a855f7', '#14b8a6'];

type ChartViewProps = {
  data: Array<Record<string, any>>;
};

const ChartView = ({ data }: ChartViewProps) => {
  const [chartType, setChartType] = useState('bar');
  const [selectedNumKey, setSelectedNumKey] = useState('');
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const chartContainerRef = useRef(null);
  const allKeys = useMemo(() => (data.length > 0 ? Object.keys(data[0]) : []), [data]);
  const numericKeys = useMemo(() => allKeys.filter(k => typeof data[0][k] === 'number'), [data, allKeys]);
  const labelKey = useMemo(() => allKeys.find(k => typeof data[0][k] === 'string') || allKeys[0], [data, allKeys]);
  const renderLegendText = (value: string) => {
    const maxLength = value.length > 12 ? value.length / 1.5 : value.length;
    return value.length > maxLength ? `${value.substring(0, maxLength)}...` : value;
  };
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
  useEffect(() => {
    const handleResize = () => {
      setContainerSize((prev) => ({ ...prev }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const pieRadius = useMemo(() => {
    const { width, height } = containerSize;
    if (width === 0 || height === 0) return 100;
    const calculatedRadius = Math.min(width, height) / 2 - 80;
    return Math.max(40, Math.min(calculatedRadius, 200));
  }, [containerSize]);
  if (data.length === 0) return null;
  return (
    <div className="bg-white dark:bg-gray-800 py-4 rounded-xl border border-gray-200 dark:border-gray-700 w-full h-[600px] md:aspect-[16/9] lg:max-h-[600px] shadow-sm flex flex-col overflow-hidden">
      <div className="flex flex-wrap justify-between items-center gap-4 px-6 mb-6">
        <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
          {[
            { id: 'bar', icon: <FiBarChart2 /> },
            { id: 'line', icon: <FiActivity /> },
            { id: 'area', icon: <FiMaximize /> },
            { id: 'pie', icon: <FiPieChart /> }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setChartType(t.id)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize
                  ${chartType === t.id
                  ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-black/5'
                  : 'text-gray-500 dark:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'}`}
            >
              {t.icon}
              <span >{t.id}</span>
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
      <div className="flex-1 w-full overflow-x-auto custom-scrollbar">
        <div ref={chartContainerRef} className="flex-1 w-full h-full min-w-[600px] md:min-w-full">
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
                  {data.map((_: any, index: number) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', backgroundColor: '#111010' }} />
                <Legend formatter={renderLegendText} />
              </PieChart>
            ) : (
              (() => {
                const ChartComp = chartType === 'bar' ? BarChart : chartType === 'line' ? LineChart : AreaChart;
                return (
                  <ChartComp data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                    <XAxis dataKey={labelKey} tick={{ fontSize: 11, fill: '#868383' }} axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#868383', fontSize: 11 }} />
                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', backgroundColor: '#d8cdcd', color: '#111' }} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={renderLegendText}
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
    </div>
  );
};
export default ChartView;