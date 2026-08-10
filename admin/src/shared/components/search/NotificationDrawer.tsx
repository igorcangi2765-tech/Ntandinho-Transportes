import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../stores/useAppStore';
import { useNotificationStore } from '../../stores/useNotificationStore';
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCheck,
  Trash2,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const NotificationDrawer: React.FC = () => {
  const { notificationDrawerOpen, setNotificationDrawerOpen } = useAppStore();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } =
    useNotificationStore();
  const navigate = useNavigate();

  if (!notificationDrawerOpen) return null;

  const handleNotifClick = (id: string, link?: string) => {
    markAsRead(id);
    if (link) {
      setNotificationDrawerOpen(false);
      navigate(link);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 dark:bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setNotificationDrawerOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#0B132B] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between h-full relative z-10">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-[#111D33]/90">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 dark:bg-brand-orange/20 text-brand-orange border border-amber-500/30 dark:border-brand-orange/40">
                <Bell size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Notificações do Sistema
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {unreadCount} não lida{unreadCount === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setNotificationDrawerOpen(false)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Fechar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Notification List */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-slate-100/50 dark:bg-[#0B132B]">
            {notifications.length > 0 ? (
              notifications.map((item) => {
                const icons = {
                  success: <CheckCircle2 size={18} className="text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />,
                  warning: <AlertTriangle size={18} className="text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />,
                  error: <AlertCircle size={18} className="text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />,
                  info: <Info size={18} className="text-sky-500 dark:text-sky-400 shrink-0 mt-0.5" />,
                };

                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotifClick(item.id, item.link)}
                    className={cn(
                      'p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 text-xs shadow-xs',
                      item.read
                        ? 'bg-white dark:bg-[#111D33] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#16223B]'
                        : 'bg-amber-500/10 dark:bg-[#16223B] border-amber-500/40 dark:border-brand-orange/50 text-slate-900 dark:text-white shadow-sm font-medium'
                    )}
                  >
                    {icons[item.type]}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={cn('font-bold text-sm leading-tight', item.read ? 'text-slate-800 dark:text-slate-200' : 'text-slate-900 dark:text-white')}>
                          {item.title}
                        </h4>
                        {!item.read && (
                          <span className="w-2.5 h-2.5 rounded-full bg-brand-orange shrink-0 shadow-xs" />
                        )}
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-xs mt-1.5 leading-relaxed">
                        {item.message}
                      </p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-400 block mt-2 font-mono font-semibold">
                        {item.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 px-4 bg-white dark:bg-[#111D33] border border-slate-200 dark:border-slate-800 rounded-2xl">
                <Bell size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">Sem Notificações</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Não existem alertas pendentes no momento.</p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B132B] flex items-center justify-between gap-3">
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
            >
              <CheckCheck size={15} />
              <span>Marcar todas como lidas</span>
            </button>

            <button
              onClick={clearNotifications}
              disabled={notifications.length === 0}
              className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 disabled:opacity-40 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all border border-rose-500/20 cursor-pointer"
            >
              <Trash2 size={15} />
              <span>Limpar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
