import React from 'react';
import { AlertOctagon, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ServerErrorPageProps {
  error?: string;
  onRetry?: () => void;
}

export const ServerErrorPage: React.FC<ServerErrorPageProps> = ({ error, onRetry }) => {
  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center p-8 text-center space-y-6 animate-in fade-in duration-300">
      <div className="p-5 rounded-3xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-lg">
        <AlertOctagon size={48} />
      </div>

      <div className="max-w-md space-y-2">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-400">
          Erro 500 — Falha do Sistema
        </span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Ocorreu um Erro Inesperado
        </h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          {error || 'A aplicação detetou uma exceção crítica ao processar a solicitação.'}
        </p>
      </div>

      <div className="flex items-center space-x-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 text-xs font-bold rounded-xl shadow-glow flex items-center space-x-2 transition-all"
          >
            <RefreshCw size={16} />
            <span>Recarregar Componente</span>
          </button>
        )}

        <Link
          to="/"
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center space-x-2 transition-all"
        >
          <Home size={16} />
          <span>Voltar ao Início</span>
        </Link>
      </div>
    </div>
  );
};
