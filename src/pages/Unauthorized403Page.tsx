import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

export const Unauthorized403Page: React.FC = () => {
  const { setActiveModule } = useData();
  const { currentUser } = useAuth();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-4 shadow-xl">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">403 - Acesso Não Autorizado</h1>
      <p className="text-sm text-slate-400 mt-2 max-w-md leading-relaxed">
        O seu perfil atual (<span className="text-[#F5A300] font-bold">{currentUser?.role}</span>) não possui privilégios para aceder a este módulo restrito da empresa.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={() => setActiveModule('dashboard')}
          className="stripe-button-primary text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Dashboard Geral</span>
        </button>
      </div>
    </div>
  );
};
