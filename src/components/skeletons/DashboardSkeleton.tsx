import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-slate-800 rounded-lg" />
          <div className="h-4 w-72 bg-slate-800/60 rounded-lg" />
        </div>
        <div className="h-9 w-32 bg-slate-800 rounded-xl" />
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stripe-card p-5 space-y-3">
            <div className="h-4 w-24 bg-slate-800 rounded" />
            <div className="h-8 w-32 bg-slate-800 rounded-lg" />
            <div className="h-4 w-20 bg-slate-800/60 rounded" />
          </div>
        ))}
      </div>

      {/* Main Chart Skeleton */}
      <div className="stripe-card p-6 h-72 space-y-4">
        <div className="h-5 w-40 bg-slate-800 rounded" />
        <div className="h-48 bg-slate-800/40 rounded-xl" />
      </div>
    </div>
  );
};
