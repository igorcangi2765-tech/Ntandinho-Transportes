import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Ocorreu um erro de carregamento',
  message = 'Não foi possível carregar os dados atualizados do servidor.',
  onRetry,
}) => {
  return (
    <div className="p-8 text-center rounded-2xl bg-rose-500/5 border border-rose-500/20 flex flex-col items-center justify-center space-y-4">
      <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
        <AlertTriangle size={28} />
      </div>
      <div className="max-w-md">
        <h4 className="text-base font-bold text-rose-300">{title}</h4>
        <p className="text-xs text-slate-400 mt-1">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-all flex items-center space-x-2"
        >
          <RefreshCw size={14} />
          <span>Tentar Novamente</span>
        </button>
      )}
    </div>
  );
};
