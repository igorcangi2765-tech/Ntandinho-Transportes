import React from 'react';
import { useNotificationStore } from '../../stores/useNotificationStore';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotificationStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />,
          warning: <AlertTriangle size={18} className="text-amber-400 shrink-0" />,
          error: <AlertCircle size={18} className="text-rose-400 shrink-0" />,
          info: <Info size={18} className="text-sky-400 shrink-0" />,
        };

        const borderColors = {
          success: 'border-emerald-500/30 bg-navy-900/95',
          warning: 'border-amber-500/30 bg-navy-900/95',
          error: 'border-rose-500/30 bg-navy-900/95',
          info: 'border-sky-500/30 bg-navy-900/95',
        };

        return (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto p-4 rounded-2xl border shadow-glass flex items-start justify-between space-x-3 text-xs animate-in slide-in-from-bottom-3 duration-200',
              borderColors[toast.type]
            )}
          >
            <div className="flex items-start space-x-3">
              {icons[toast.type]}
              <div>
                <h5 className="font-bold text-white">{toast.title}</h5>
                {toast.message && (
                  <p className="text-slate-400 mt-0.5">{toast.message}</p>
                )}
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-500 hover:text-white p-1"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
