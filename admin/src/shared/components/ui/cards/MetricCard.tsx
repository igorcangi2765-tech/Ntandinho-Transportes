import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down' | 'neutral';
  };
  className?: string;
  delay?: number;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  className,
  delay = 0,
  onClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={onClick ? { y: -3 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.2, delay }}
      onClick={onClick}
      className={cn(
        'bg-[#0f172a] rounded-xl p-5 flex flex-col justify-between shadow-sm border border-slate-800/40 relative overflow-hidden group transition-all duration-200',
        onClick && 'cursor-pointer hover:border-brand-orange/40 hover:shadow-md hover:shadow-brand-orange/5',
        className
      )}
    >
      <div className="flex justify-between items-start">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider group-hover:text-slate-200 transition-colors">
          {title}
        </span>
        <div className="p-2 rounded-lg bg-slate-900/50 text-slate-500 group-hover:text-brand-orange group-hover:bg-brand-orange/10 transition-colors">
          <Icon size={16} />
        </div>
      </div>

      <div className="mt-4">
        <span className="block text-3xl font-display font-bold text-white tracking-tight group-hover:scale-[1.01] origin-left transition-transform">
          {value}
        </span>
      </div>

      {trend && (
        <div className="mt-4 flex items-center pt-4 border-t border-slate-800/40 gap-2">
          <div
            className={cn(
              'flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded',
              trend.direction === 'up' && 'text-emerald-400 bg-emerald-400/10',
              trend.direction === 'down' && 'text-rose-400 bg-rose-400/10',
              trend.direction === 'neutral' && 'text-slate-400 bg-slate-400/10'
            )}
          >
            {trend.direction === 'up' && <TrendingUp size={12} />}
            {trend.direction === 'down' && <TrendingDown size={12} />}
            {trend.direction === 'neutral' && <Minus size={12} />}
            <span>{Math.abs(trend.value)}%</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">{trend.label}</span>
        </div>
      )}

      {/* Subtle hover gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
};
