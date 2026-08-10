import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, noPadding, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'w-full bg-white dark:bg-[#111D33] border border-slate-200 dark:border-[#1C2A48] rounded-2xl transition-all duration-200 shadow-subtle hover:shadow-card',
          props.onClick && 'cursor-pointer hover:-translate-y-0.5 active:scale-[0.99] touch-manipulation hover:border-[#F6A823]/60',
          !noPadding && 'p-5 sm:p-6',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
