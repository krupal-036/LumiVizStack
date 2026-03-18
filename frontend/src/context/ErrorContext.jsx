import React, { createContext, useState, useContext, useCallback } from 'react';

export const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  const showError = useCallback((message) => {
    setError(message);
    setTimeout(() => setError(null), 2500); 
  }, []);

  return (
    <ErrorContext value={{ showError }}>
      {children}
      <ErrorPopup error={error} />
    </ErrorContext>
  );
};

const ErrorPopup = ({ error }) => {
  if (!error) return null;
  
  return (
    <div className="fixed bottom-8 left-0 right-0 z-[9999] px-6 flex justify-center pointer-events-none">
      <div className="
        relative overflow-hidden
        w-full max-w-sm sm:max-w-md pointer-events-auto 
        flex items-center gap-4 p-4 rounded-2xl
        
        backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)]
        dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]
        
        bg-white/80 border border-gray-100 text-gray-800
        
        dark:bg-gray-900/80 dark:border-white/10 dark:text-gray-200
        
        animate-in fade-in slide-in-from-bottom-8 duration-500 cubic-bezier(0.16, 1, 0.3, 1)
      ">
        
        <div className="flex-shrink-0 relative flex items-center justify-center w-5 h-5">
           <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-20 animate-ping"></span>
           <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </div>
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-[14px] font-semibold tracking-tight leading-none mb-1">
            Action Required
          </p>
          <p className="text-[13px] opacity-70 font-medium leading-relaxed sm:whitespace-normal">
            {error}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-100/50 dark:bg-white/5">
          <div className="h-full bg-red-500 animate-toast-progress origin-left shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
        </div>
      </div>
    </div>
  );
};