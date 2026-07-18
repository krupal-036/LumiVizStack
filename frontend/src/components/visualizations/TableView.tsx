import SmartCell from "../common/SmartCell";
import { FiHash } from "react-icons/fi";

type TableViewProps = {
  data: Array<Record<string, any>>;
  forceImages: boolean;
  setForceImages: (value: boolean) => void;
};

const TableView = ({ data, forceImages, setForceImages }: TableViewProps) => {
  if (!data || data.length === 0) return null;
  const headers = Object.keys(data[0]);

  return (
    <div className="w-full transition-all duration-300">
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm shadow-slate-200/50 dark:shadow-none">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                <th className="sticky left-0 z-10 bg-slate-50 dark:bg-slate-800 p-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest w-12 text-center border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-center"><FiHash size={14} /></div>
                </th>
                {headers.map((key) => (
                  <th
                    key={key}
                    className="px-2 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap text-center border border-gray-200 dark:border-gray-700"
                  >
                    {key.replace(/_/g, ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.map((row: Record<any, any>, rowIndex: number) => (
                <tr
                  key={rowIndex}
                  className="group hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors duration-150"
                >
                  <td className="sticky left-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/10 p-1 text-xs font-medium text-slate-400 dark:text-slate-600 font-mono text-center border border-gray-200 dark:border-gray-700">
                    {rowIndex + 1}
                  </td>
                  {headers.map((key) => (
                    <td key={`${rowIndex}-${key}`} className="px-2 py-4 text-center align-middle border border-gray-200 dark:border-gray-700">
                      <SmartCell value={row[key]} forceImages={forceImages} setForceImages={setForceImages} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-3 text-[11px] text-slate-400 dark:text-slate-600 px-1">
        Showing {data.length} entries
      </div>
    </div>
  );
};

export default TableView;