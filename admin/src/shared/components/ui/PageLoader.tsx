import React from 'react';
import { Loader2 } from 'lucide-react';

interface PageLoaderProps {
  message?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ message = 'A carregar o sistema...' }) => {
  return (
    <div className="min-h-[400px] w-full flex flex-col items-center justify-center p-8 text-slate-400 space-y-4 animate-in fade-in duration-300">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-orange to-amber-600 flex items-center justify-center text-slate-950 font-bold text-lg shadow-glow animate-pulse">
          NT
        </div>
        <Loader2 className="w-6 h-6 text-brand-orange animate-spin absolute -bottom-1 -right-1" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{message}</p>
    </div>
  );
};
