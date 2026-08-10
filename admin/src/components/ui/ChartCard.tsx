import React, { useState } from 'react';
import { Card } from './Card';
import { cn } from '../../utils/cn';

export type TimePeriod = 'HOJE' | 'SEMANA' | 'MES' | 'ANO' | 'CUSTOM';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  onPeriodChange?: (period: TimePeriod) => void;
  actions?: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  badge,
  children,
  onPeriodChange,
  actions,
  className,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('SEMANA');

  const handleSelectPeriod = (period: TimePeriod) => {
    setSelectedPeriod(period);
    if (onPeriodChange) onPeriodChange(period);
  };

  return (
    <Card className={cn('w-full flex flex-col space-y-4 select-none', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-[#1C2A48] pb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h3>
            {badge}
          </div>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-300 font-medium mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
          {actions}

          <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-[#16223B] p-1 rounded-xl border border-slate-200 dark:border-[#273759] text-[11px] font-extrabold">
            {(
              [
                { id: 'HOJE', label: 'Hoje' },
                { id: 'SEMANA', label: 'Semana' },
                { id: 'MES', label: 'Mês' },
                { id: 'ANO', label: 'Ano' },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPeriod(p.id)}
                className={cn(
                  'px-2 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap',
                  selectedPeriod === p.id
                    ? 'bg-[#F6A823] text-[#0B132B] font-black shadow-xs'
                    : 'text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-1 flex-1 w-full min-h-[280px]">{children}</div>
    </Card>
  );
};
