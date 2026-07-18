import { createContext, useState, useCallback, useMemo, useEffect, CSSProperties } from 'react';
import { FiX, FiTrash2 } from 'react-icons/fi';

export type AlertType = 1 | 2 | 3;

export interface AlertItem {
  id: number;
  title: string;
  message: string;
  type: AlertType;
}

export type AlertContextType = {
  showAlert: (message: string, title?: string, type?: AlertType) => void;
  hideAlert: (id: number) => void;
  clearAll: () => void;
}

const DefaultAlertContext: AlertContextType = {
  showAlert: () => {},
  hideAlert: () => {},
  clearAll: () => {}
};

export const AlertContext = createContext<AlertContextType>(DefaultAlertContext);

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  
  const hideAlert = useCallback((id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const clearAll = useCallback(() => setAlerts([]), []);
  
  const showAlert = useCallback((message: string, title = "Unknown Error...", type: AlertType = 1) => {
    const id = Date.now();
    setAlerts((prev) => [{ id, title, message, type }, ...prev]);
  }, []);

  const contextValue = useMemo(() => ({
    showAlert,
    hideAlert,
    clearAll
  }), [showAlert, hideAlert, clearAll]);

  return (
    <AlertContext.Provider value={contextValue}>
      {children}

      <div className="fixed bottom-8 left-0 right-0 z-[9999] px-6 flex flex-col items-center pointer-events-none">
        <div className="relative w-full max-w-sm sm:max-w-md min-h-[80px]">
          {alerts.map((alert, index) => (
            <Alert
              key={alert.id}
              alert={alert}
              index={index}
              total={alerts.length}
              onClose={() => hideAlert(alert.id)}
              onClear={() => clearAll()}
            />
          ))}
        </div>
      </div>
    </AlertContext.Provider>
  );
};

interface AlertProps {
  alert: AlertItem;
  onClose: () => void;
  index: number;
  total: number;
  onClear: () => void;
}

const Alert = ({ alert, onClose, index, total, onClear }: AlertProps) => {
  const typeStyles = useMemo(() => {
    const base: Record<AlertType | 'default', string> = {
      1: "",
      2: "",
      3: "",
      default: ""
    };
    
    return {
      bg: {
        ...base,
        1: "bg-red-50/90 border-red-200 text-red-900 dark:bg-red-950/40 dark:border-red-500/20 dark:text-red-200",
        2: "bg-emerald-50/90 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-500/20 dark:text-emerald-200",
        3: "bg-amber-50/90 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-500/20 dark:text-amber-200",
        default: "bg-slate-50/90 border-slate-200 text-slate-900 dark:bg-slate-900/80 dark:border-white/10 dark:text-slate-200"
      },
      ping: { ...base, 1: "bg-red-400", 2: "bg-emerald-400", 3: "bg-amber-400", default: "bg-slate-400" },
      dot: { ...base, 1: "bg-red-500", 2: "bg-emerald-500", 3: "bg-amber-500", default: "bg-slate-500" },
      bar: {
        ...base,
        1: "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]",
        2: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]",
        3: "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]",
        default: "bg-slate-500"
      }
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const stackStyle: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: total - index,
    transform: `translateY(-${index * 12}px) scale(${1 - index * 0.05})`,
    opacity: index > 2 ? 0 : 1,
    transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
  };

  const style = typeStyles.bg[alert.type] || typeStyles.bg.default;

  return (
    <div style={stackStyle} className="pointer-events-none">
      <div className={`
        relative overflow-hidden w-full max-w-sm sm:max-w-md pointer-events-auto 
      flex items-center gap-4 p-0 sm:p-4 rounded-2xl backdrop-blur-xl 
      shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]
      border transition-all duration-300 ease-out ${style}
      animate-in fade-in slide-in-from-bottom-8 duration-500 cubic-bezier(0.16, 1, 0.3, 1)
      `}>

        <div className="flex-shrink-0 relative flex items-center justify-center w-5 h-5 ml-4 sm:ml-0">
          <span className={`absolute inline-flex h-full w-full rounded-full opacity-20 animate-ping ${typeStyles.ping[alert.type] || typeStyles.ping.default}`}></span>
          <span className={`relative inline-flex rounded-full h-3 w-3 ${typeStyles.dot[alert.type] || typeStyles.dot.default}`}></span>
        </div>

        <div className="flex-1 min-w-0 pr-2 py-4 sm:py-0">
          <p className="text-[14px] font-semibold tracking-tight leading-none mb-1">{alert.title}</p>
          <p className="text-[13px] opacity-70 font-medium leading-relaxed">{alert.message}</p>
        </div>

        <div className="flex-shrink-0 flex items-center self-center pt-0.5 border-l border-gray-100 dark:border-white/5 pl-2 ml-1 mr-2 sm:mr-0">
          <button onClick={onClose} className="p-1.5 rounded-lg transition-all duration-200 text-gray-500 hover:text-gray-600 hover:bg-gray-100/80 dark:hover:bg-white/10 active:scale-90">
            <FiX size={18} strokeWidth={2.5} />
          </button>
          {total > 2 && <button onClick={onClear} className="p-1.5 rounded-lg transition-all duration-200 text-gray-500 hover:text-gray-600 hover:bg-gray-100/80 dark:hover:bg-white/10 active:scale-90">
            <FiTrash2 size={16} strokeWidth={2.5} />
          </button>}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-100/50 dark:bg-white/5">
          <div className={`h-full animate-toast-progress origin-left ${typeStyles.bar[alert.type] || typeStyles.bar.default}`} />
        </div>
      </div>
    </div>
  );
};
