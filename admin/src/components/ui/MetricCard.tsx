import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from './Card';
import { cn } from '../../utils/cn';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: React.ElementType;
  iconBg?: string;
  iconColor?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  subtext,
  trend,
  icon: Icon,
  iconBg = 'bg-amber-500/10 dark:bg-[#16223B]',
  iconColor = 'text-[#F6A823]',
  onClick,
}) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        'w-full min-h-[136px] h-full flex flex-col justify-between transition-all duration-300 ease-out',
        onClick && 'cursor-pointer hover:border-[#F6A823] dark:hover:border-[#F6A823] hover:shadow-card hover:-translate-y-1 active:scale-[0.98] touch-manipulation group'
      )}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-300 truncate">{title}</span>
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300', iconBg, iconColor, onClick && 'group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-glow')}>
          <Icon size={20} />
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-display">{value}</span>
          {unit && <span className="text-xs font-black text-slate-500 dark:text-slate-300">{unit}</span>}
        </div>

        <div className="flex items-center justify-between gap-2 mt-1.5 pt-1 border-t border-slate-100 dark:border-[#1C2A48]">
          {subtext && <p className="text-[11px] text-slate-500 dark:text-slate-300 font-medium truncate">{subtext}</p>}
          {trend && (
            <span
              className={cn(
                'inline-flex items-center text-[11px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ml-auto',
                trend.isPositive ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-400' : 'text-rose-700 bg-rose-50 dark:bg-rose-500/15 dark:text-rose-400'
              )}
            >
              {trend.isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              {trend.value}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
