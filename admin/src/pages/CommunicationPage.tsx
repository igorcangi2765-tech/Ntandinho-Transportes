import React from 'react';
import { useNotificationStore } from '../shared/stores/useNotificationStore';
import { MessageSquare, Bell, CheckCircle2, AlertCircle, Info, Trash2 } from 'lucide-react';

export const CommunicationPage: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotificationStore();

  return (
    <div className="p-4 md:p-6 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800/80 p-5 rounded-2xl shadow-xl backdrop-blur-md">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="text-brand-orange" size={24} />
            Central de Comunicação & Notificações
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Histórico de comunicações internas, confirmações de despacho e avisos do sistema.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllAsRead}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Marcar todas como lidas
          </button>
          <button
            onClick={clearNotifications}
            className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-all cursor-pointer"
            title="Limpar Histórico"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl">
            <Bell size={32} className="mx-auto text-slate-600 mb-2" />
            <h4 className="text-sm font-bold text-white">Nenhuma notificação pendente</h4>
            <p className="text-xs text-slate-400 mt-1">Tudo em dia nas operações da N' Tandinho Transportes.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                n.read
                  ? 'bg-slate-900/40 border-slate-800/60 opacity-80'
                  : 'bg-slate-900 border-slate-700/80 shadow-md ring-1 ring-brand-orange/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    n.type === 'success'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : n.type === 'error'
                      ? 'bg-rose-500/10 text-rose-400'
                      : n.type === 'warning'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-sky-500/10 text-sky-400'
                  }`}
                >
                  {n.type === 'success' ? (
                    <CheckCircle2 size={18} />
                  ) : n.type === 'error' ? (
                    <AlertCircle size={18} />
                  ) : (
                    <Info size={18} />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{n.title}</h4>
                  <p className="text-xs text-slate-300 mt-0.5">{n.message}</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {new Date(n.timestamp).toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {!n.read && (
                <span className="w-2 h-2 rounded-full bg-brand-orange shrink-0 mt-2" title="Não lida" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
