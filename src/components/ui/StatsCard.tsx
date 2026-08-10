import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  description?: string;
  badgeText?: string;
  highlightColor?: 'orange' | 'amber' | 'blue' | 'emerald' | 'purple' | 'rose';
  onClick?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  isPositive,
  icon: Icon,
  description,
  badgeText,
  highlightColor = 'orange',
  onClick
}) => {
  const colorStyles = {
    orange: 'border-orange-500/20 text-[#F5A300] bg-orange-500/10 hover:border-[#F5A300]',
    amber: 'border-amber-500/20 text-amber-400 bg-amber-500/10 hover:border-amber-400',
    blue: 'border-blue-500/20 text-blue-400 bg-blue-500/10 hover:border-blue-400',
    emerald: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10 hover:border-emerald-400',
    purple: 'border-purple-500/20 text-purple-400 bg-purple-500/10 hover:border-purple-400',
    rose: 'border-rose-500/20 text-rose-400 bg-rose-500/10 hover:border-rose-400'
  };

  return (
    <div
      onClick={onClick}
      className={`stripe-card flex flex-col justify-between h-full group transition-all duration-200 ${
        onClick
          ? 'cursor-pointer hover:border-[#F5A300]/60 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-0.5 active:scale-[0.99]'
          : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0 flex-1">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block truncate">
            {title}
          </span>
          <div className="text-lg sm:text-xl lg:text-2xl font-black text-slate-100 tracking-tight truncate">
            {value}
          </div>
        </div>

        <div className={`p-2.5 rounded-xl border ${colorStyles[highlightColor]} shrink-0 transition-transform group-hover:scale-110`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
        {change && (
          <div className="flex items-center gap-1 font-semibold text-[11px] sm:text-xs truncate">
            {isPositive !== undefined && (
              isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              )
            )}
            <span className={isPositive === true ? 'text-emerald-400' : isPositive === false ? 'text-rose-400' : 'text-slate-300'}>
              {change}
            </span>
          </div>
        )}

        {description && <span className="text-slate-400 text-[11px] sm:text-xs truncate">{description}</span>}

        {badgeText && (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-[#F5A300] border border-slate-700 shrink-0">
            {badgeText}
          </span>
        )}

        {onClick && (
          <span className="text-[10px] text-slate-500 group-hover:text-[#F5A300] font-bold transition-colors ml-auto shrink-0 hidden xs:inline-block">
            Abrir ➔
          </span>
        )}
      </div>
    </div>
  );
};
