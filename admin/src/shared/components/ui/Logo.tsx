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
}) => {
  const iconConfig = {
    sm: { box: 'w-7 h-7 rounded-lg', icon: 'w-4 h-4', text: 'text-sm' },
    md: { box: 'w-9 h-9 rounded-xl', icon: 'w-5 h-5', text: 'text-base font-extrabold' },
    lg: { box: 'w-11 h-11 rounded-xl', icon: 'w-6 h-6', text: 'text-xl font-black' },
  };

  const current = iconConfig[size] || iconConfig.md;

  return (
    <div className={cn('inline-flex items-center gap-2.5 sm:gap-3 select-none cursor-pointer group', className)}>
      {/* Official Brand Emblem (Truck Transpontes) */}
      <div
        className={cn(
          'bg-[#F6A823] flex items-center justify-center text-[#0B132B] shadow-sm shrink-0 relative overflow-hidden transition-transform duration-200 group-hover:scale-105',
          current.box
        )}
        title="Transportes N'Tandinho"
      >
        <Truck className={cn('text-[#0B132B]', current.icon)} strokeWidth={2.5} />
      </div>

      {/* Brand Logotype Text */}
      {!collapsed && (
        <span className={cn('tracking-tight text-slate-900 dark:text-white font-display whitespace-nowrap', current.text)}>
          N’Tandinho
        </span>
      )}
    </div>
  );
};

