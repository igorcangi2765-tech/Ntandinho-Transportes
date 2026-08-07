import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface SlideOverDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}

export const SlideOverDrawer: React.FC<SlideOverDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-navy-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="p-5 md:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
            <div className="flex items-center space-x-3">
              {Icon && (
                <div className="w-10 h-10 rounded-2xl bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center shrink-0">
                  <Icon size={20} />
                </div>
              )}
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">{title}</h2>
                {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Content Body */}
          <div className="p-5 md:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5 text-xs text-slate-300">
            {children}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-end shrink-0">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Fechar Painel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
