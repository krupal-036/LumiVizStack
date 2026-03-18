import React from 'react';
import { FiAlertTriangle, FiX, FiLoader } from 'react-icons/fi';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  type = "danger"
}) => {
  if (!isOpen) return null;

  const themes = {
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-red-500/20",
    warning: "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20",
  };

  const iconThemes = {
    danger: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    warning: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 transition-opacity">

      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={!isLoading ? onClose : null} />

      <div className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-10 duration-200">

        {!isLoading && (
          <button onClick={onClose} className="absolute right-4 top-4 p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        )}

        <div className="p-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
            <div className={`p-3 rounded-2xl ${iconThemes[type]}`}>
              <FiAlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h3>
          </div>

          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8">
            {message}
          </p>

          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button
              disabled={isLoading}
              onClick={onClose}
              className="flex-1 px-6 py-3.5 rounded-2xl font-bold text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              disabled={isLoading}
              onClick={onConfirm}
              className={`flex-[1.5] flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed ${themes[type]}`}
            >
              {isLoading ? <FiLoader className="w-4 h-4 animate-spin" /> : null}
              {isLoading ? "Processing..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};



