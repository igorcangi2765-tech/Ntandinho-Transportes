import React from 'react';
import { useData } from '../../context/DataContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastNotificationStack: React.FC = () => {
  const { toasts, removeToast } = useData();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 animate-slide-down ${
            toast.type === 'success'
              ? 'bg-[#0F172A]/95 border-emerald-500/40 text-emerald-300'
              : toast.type === 'error'
              ? 'bg-[#0F172A]/95 border-rose-500/40 text-rose-300'
              : toast.type === 'warning'
              ? 'bg-[#0F172A]/95 border-amber-500/40 text-amber-300'
              : 'bg-[#0F172A]/95 border-blue-500/40 text-blue-300'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {toast.type === 'error' && <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
          {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />}

          <div className="flex-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">{toast.title}</h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-100 transition-colors p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
