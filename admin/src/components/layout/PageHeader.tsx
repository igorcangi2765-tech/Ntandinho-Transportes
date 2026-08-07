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
    <div className="space-y-3 mb-8">
      <Breadcrumb />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 p-6 rounded-2xl border border-slate-800 shadow-glass">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            {Icon && <Icon className="text-brand-orange shrink-0" size={26} />}
            <span>{title}</span>
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1.5 max-w-2xl">{subtitle}</p>
          )}
        </div>

        {actions && (
          <div className="flex items-center space-x-3 shrink-0">{actions}</div>
        )}
      </div>
    </div>
  );
};
