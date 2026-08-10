import React from 'react';

export interface SkeletonLoaderProps {
  count?: number;
  height?: string;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  count = 3,
  height = 'h-10',
  className = '',
}) => {
  return (
    <div className="space-y-2 w-full animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${height} bg-slate-200/70 border border-slate-200/50 rounded-xl ${className}`}
        />
      ))}
    </div>
  );
};
