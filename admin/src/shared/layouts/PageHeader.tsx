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
    <div className="space-y-2.5 mb-4">
      <Breadcrumb />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-glass">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-brand-orange/10 border border-brand-orange/20 text-brand-orange flex items-center justify-center shrink-0">
              <Icon size={20} />
            </div>
          )}
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-snug">
              {title}
            </h1>
            {subtitle && <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-tight max-w-2xl">{subtitle}</p>}
          </div>
        </div>

        {actions && <div className="flex items-center space-x-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
};
