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
    lg: 'w-11 h-11 text-base',
  };

  return (
    <div className={cn('flex items-center gap-3 select-none cursor-pointer', className)}>
      {/* Official Brand Emblem */}
      <div
        className={cn(
          'rounded-xl bg-[#F6A823] flex items-center justify-center font-black text-[#0B132B] shadow-sm shrink-0 relative overflow-hidden',
          iconSizes[size]
        )}
      >
        <Truck className="w-5 h-5 text-[#0B132B]" strokeWidth={2.5} />
      </div>

      {/* Brand Logotype Text */}
      {!collapsed && (
        <div className="flex flex-col truncate text-left">
          <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white font-display truncate">
            N' Tandinho
          </span>
          {showSubtitle && (
            <span className="text-[10px] font-black uppercase tracking-widest text-[#F6A823] truncate">
              ERP
            </span>
          )}
        </div>
      )}
    </div>
  );
};
