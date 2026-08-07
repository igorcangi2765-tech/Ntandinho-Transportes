import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center p-8 text-center space-y-6 animate-in fade-in duration-300">
      <div className="p-5 rounded-3xl bg-brand-orange/10 text-brand-orange border border-brand-orange/20 shadow-glow">
        <FileQuestion size={48} />
      </div>

      <div className="max-w-md space-y-2">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-orange">
          Erro 404 — Página Não Encontrada
        </span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Caminho Inexistente
        </h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          A página ou recurso que está a tentar aceder não existe no ERP N' Tandinho ou foi movido.
        </p>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center space-x-2 transition-all"
        >
          <ArrowLeft size={16} />
          <span>Voltar Página Anterior</span>
        </button>

        <Link
          to="/"
          className="px-4 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 text-xs font-bold rounded-xl shadow-glow flex items-center space-x-2 transition-all"
        >
          <Home size={16} />
          <span>Painel Principal</span>
        </Link>
      </div>
    </div>
  );
};
