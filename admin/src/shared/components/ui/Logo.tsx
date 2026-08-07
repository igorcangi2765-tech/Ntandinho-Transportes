import React from 'react';
import { Truck } from 'lucide-react';
import { cn } from '../../utils/cn';

interface LogoProps {
  collapsed?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  collapsed = false,
  size = 'md',
  className,
  showSubtitle = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div className={cn('flex items-center gap-3 select-none', className)}>
      {/* Brand Icon Emblem */}
      <div
        className={cn(
          'rounded-xl bg-gradient-to-br from-brand-yellow via-amber-500 to-brand-orange flex items-center justify-center font-extrabold text-slate-950 shadow-md shrink-0 relative overflow-hidden group',
          iconSizes[size]
        )}
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center justify-center gap-0.5">
          <Truck className="w-5 h-5 text-slate-950" strokeWidth={2.5} />
        </div>
      </div>

      {/* Brand Logotype Text */}
      {!collapsed && (
        <div className="flex flex-col truncate">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-sm tracking-tight text-white font-display uppercase truncate">
              N' Tandinho
            </span>
          </div>
          {showSubtitle && (
            <span className="text-[11px] font-medium text-slate-400 truncate">
              Dashboard Geral
            </span>
          )}
        </div>
      )}
    </div>
  );
};
