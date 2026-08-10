import React from 'react';
import { useData } from '../context/DataContext';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFound404Page: React.FC = () => {
  const { setActiveModule } = useData();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[#F5A300] flex items-center justify-center mb-4 shadow-xl">
        <FileQuestion className="w-8 h-8" />
      </div>

      <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">404 - Página Não Encontrada</h1>
      <p className="text-sm text-slate-400 mt-2 max-w-md">
        A rota solicitada não existe ou foi movida no sistema de gestão N' Tandinho Transportes.
      </p>

      <button
        onClick={() => setActiveModule('dashboard')}
        className="stripe-button-primary text-xs mt-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar ao Dashboard</span>
      </button>
    </div>
  );
};
