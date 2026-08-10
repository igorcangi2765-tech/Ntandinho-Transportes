import type { FC } from 'react';

export const SkeletonTable: FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full animate-pulse space-y-3 p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
      <div className="h-6 bg-slate-800 rounded w-1/4 mb-4"></div>
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="h-10 bg-slate-950/80 rounded-xl flex items-center justify-between px-4 space-x-4">
          <div className="h-4 bg-slate-800 rounded w-1/6"></div>
          <div className="h-4 bg-slate-800 rounded w-1/4"></div>
          <div className="h-4 bg-slate-800 rounded w-1/5"></div>
          <div className="h-4 bg-slate-800 rounded w-1/6"></div>
        </div>
      ))}
    </div>
  );
};

export const SkeletonCard: FC = () => {
  return (
    <div className="animate-pulse p-6 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-slate-800 rounded w-1/3"></div>
        <div className="w-8 h-8 rounded-xl bg-slate-800"></div>
      </div>
      <div className="h-8 bg-slate-800 rounded w-1/2"></div>
      <div className="h-3 bg-slate-800 rounded w-3/4"></div>
    </div>
  );
};
