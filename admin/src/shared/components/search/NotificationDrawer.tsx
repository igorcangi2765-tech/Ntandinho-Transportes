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
    <div className="fixed inset-0 z-50 overflow-hidden bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setNotificationDrawerOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-navy-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-brand-orange/10 text-brand-orange border border-brand-orange/20">
                <Bell size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Notificações do Sistema
                </h3>
                <p className="text-xs text-slate-400">
                  {unreadCount} não lida{unreadCount === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setNotificationDrawerOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X size={18} />
            </button>
          </div>

          {/* Notification List */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3">
            {notifications.length > 0 ? (
              notifications.map((item) => {
                const icons = {
                  success: <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />,
                  warning: <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />,
                  error: <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />,
                  info: <Info size={16} className="text-sky-400 shrink-0 mt-0.5" />,
                };

                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotifClick(item.id, item.link)}
                    className={cn(
                      'p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 text-xs',
                      item.read
                        ? 'bg-slate-900/40 border-slate-800/60 opacity-70 hover:opacity-100'
                        : 'bg-navy-850 border-brand-orange/30 shadow-md'
                    )}
                  >
                    {icons[item.type]}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-100">{item.title}</h4>
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-brand-orange shrink-0 ml-2" />
                        )}
                      </div>
                      <p className="text-slate-400 mt-1 leading-relaxed">{item.message}</p>
                      <span className="text-[10px] text-slate-500 block mt-2 font-mono">
                        {item.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                Nenhuma notificação no momento.
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-800 bg-navy-950/80 flex items-center justify-between">
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-all"
            >
              <CheckCheck size={14} />
              <span>Marcar Todas como Lidas</span>
            </button>

            <button
              onClick={clearNotifications}
              disabled={notifications.length === 0}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 disabled:opacity-40 text-rose-400 text-xs font-semibold flex items-center space-x-1.5 transition-all border border-rose-500/20"
            >
              <Trash2 size={14} />
              <span>Limpar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
