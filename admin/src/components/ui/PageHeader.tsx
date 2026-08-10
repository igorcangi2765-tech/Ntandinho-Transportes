import React from 'react';
import { Breadcrumbs } from './Breadcrumbs';

interface PageHeaderProps {
  title: string;
  companyName?: string;
  description: string;
  badgeText?: string;
  icon?: React.ElementType;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  companyName,
  description,
  badgeText,
  icon: Icon,
  actions,
}) => {
  return (
    <div className="space-y-3 select-none w-full max-w-full overflow-hidden">
      <Breadcrumbs />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 md:p-6 rounded-2xl shadow-subtle transition-all duration-200 w-full max-w-full">
        {/* Top Info Section */}
        <div className="flex items-start gap-3 sm:gap-3.5">
          {Icon && (
            <div className="p-2.5 sm:p-3 rounded-xl bg-slate-900 dark:bg-brand-orange/10 text-brand-orange shrink-0 shadow-sm border border-slate-800/10 dark:border-brand-orange/20 mt-0.5">
              <Icon size={20} className="sm:w-6 sm:h-6" />
            </div>
          )}
          <div className="flex-1 min-w-0 space-y-1 overflow-hidden">
            {/* Título Principal */}
            <h1 className="text-base sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug break-words max-w-full">
              {title}
            </h1>

            {/* Subtítulo / Nome da Empresa */}
            {companyName && (
              <p className="text-xs sm:text-sm font-extrabold text-brand-orange dark:text-brand-orange tracking-wide uppercase break-words">
                {companyName}
              </p>
            )}

            {/* Descrição */}
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-4xl break-words">
              {description}
            </p>
          </div>
        </div>

        {/* Bottom Bar: Badge + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 w-full max-w-full">
          {/* Badge */}
          <div className="max-w-full overflow-hidden">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider shadow-2xs max-w-full truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span className="truncate">{badgeText || 'PAINEL PRINCIPAL • DASHBOARD ERP'}</span>
            </span>
          </div>

          {/* Actions */}
          {actions && (
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0 min-w-0 max-w-full">
              {actions}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

