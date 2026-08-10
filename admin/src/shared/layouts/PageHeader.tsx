import React, { ReactNode } from 'react';
import { Breadcrumb } from './Breadcrumb';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  actions,
}) => {
  return (
    <div className="space-y-2.5 mb-4 w-full max-w-full overflow-hidden">
      <Breadcrumb />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-glass w-full max-w-full">
        <div className="flex items-center space-x-3 min-w-0 flex-1 overflow-hidden">
          {Icon && (
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-orange/10 border border-brand-orange/20 text-brand-orange flex items-center justify-center shrink-0">
              <Icon size={18} className="sm:w-5 sm:h-5" />
            </div>
          )}
          <div className="min-w-0 flex-1 overflow-hidden">
            <h1 className="text-sm sm:text-base md:text-lg font-extrabold text-white tracking-tight leading-snug break-words max-w-full">
              {title}
            </h1>
            {subtitle && <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-tight max-w-2xl break-words">{subtitle}</p>}
          </div>
        </div>

        {actions && <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80 max-w-full">{actions}</div>}

      </div>
    </div>
  );
};

