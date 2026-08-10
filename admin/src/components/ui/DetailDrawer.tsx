import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface DrawerTab {
  id: string;
  label: string;
  badge?: number | string;
  content: React.ReactNode;
}

interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  tabs?: DrawerTab[];
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  width?: 'md' | 'lg' | 'xl';
}

export const DetailDrawer: React.FC<DetailDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  tabs,
  activeTabId,
  onTabChange,
  children,
  actions,
  width = 'lg',
}) => {
  const [localActiveTab, setLocalActiveTab] = React.useState<string>(
    activeTabId || (tabs && tabs.length > 0 ? tabs[0].id : '')
  );

  useEffect(() => {
    if (activeTabId) setLocalActiveTab(activeTabId);
  }, [activeTabId]);

  if (!isOpen) return null;

  const handleSelectTab = (tabId: string) => {
    setLocalActiveTab(tabId);
    if (onTabChange) onTabChange(tabId);
  };

  const widthClasses =
    width === 'md' ? 'max-w-md' : width === 'xl' ? 'max-w-3xl' : 'max-w-2xl';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={`w-screen ${widthClasses} bg-white dark:bg-[#111D33] shadow-2xl border-l border-slate-200 dark:border-[#16223B] flex flex-col justify-between animate-in slide-in-from-right duration-250`}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-[#16223B] bg-slate-50/80 dark:bg-[#0B132B]/80 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h2>
                {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{subtitle}</p>}
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl border border-slate-200 dark:border-[#273759] bg-white dark:bg-[#16223B] text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1C2A48] transition-colors cursor-pointer"
                title="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tab Header if provided */}
            {tabs && tabs.length > 0 && (
              <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 dark:border-[#16223B] pt-2 -mb-6">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTab(t.id)}
                    className={`px-3 py-2 text-xs font-extrabold transition-all border-b-2 cursor-pointer ${
                      localActiveTab === t.id
                        ? 'border-[#F6A823] text-slate-900 dark:text-white font-black'
                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <span>{t.label}</span>
                    {t.badge && (
                      <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 dark:bg-[#16223B] text-slate-700 dark:text-slate-300 font-mono font-bold">
                        {t.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 text-slate-800 dark:text-slate-100">
            {tabs && tabs.length > 0 ? (
              tabs.find((t) => t.id === localActiveTab)?.content
            ) : (
              children
            )}
          </div>

          {/* Drawer Actions Footer */}
          {actions && (
            <div className="p-4 border-t border-slate-200 dark:border-[#16223B] bg-slate-50 dark:bg-[#0B132B] flex justify-end gap-2 shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
