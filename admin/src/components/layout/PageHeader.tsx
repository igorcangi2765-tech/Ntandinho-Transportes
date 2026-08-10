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
    <div className="space-y-3 mb-6 sm:mb-8 w-full max-w-full overflow-hidden">
      <Breadcrumb />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 p-4 sm:p-5 md:p-6 rounded-2xl border border-slate-800 shadow-glass w-full max-w-full">
        <div className="min-w-0 flex-1 overflow-hidden">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5 break-words max-w-full">
            {Icon && <Icon className="text-brand-orange shrink-0" size={22} />}
            <span className="break-words">{title}</span>
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1.5 max-w-2xl break-words leading-relaxed">{subtitle}</p>
          )}
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0 w-full md:w-auto min-w-0 max-w-full">{actions}</div>
        )}

      </div>
    </div>
  );
};

