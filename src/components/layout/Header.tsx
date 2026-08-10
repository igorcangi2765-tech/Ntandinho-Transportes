import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell, Menu, ShieldAlert, Plus, LogOut } from 'lucide-react';
import { MobileDrawer } from './MobileDrawer';

interface HeaderProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ sidebarCollapsed, setSidebarCollapsed }) => {
  const { notifications, markNotificationRead, setIsSearchModalOpen, setActiveModule } = useData();
  const { currentUser, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const unreadNotifications = notifications.filter((n) => !n.read);

  // Exact static class names for Tailwind responsive alignment with main content area
  const headerStyle = sidebarCollapsed
    ? 'w-full md:w-[calc(100%-5rem)] md:left-20'
    : 'w-full md:w-[calc(100%-16rem)] md:left-64';

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 ${headerStyle} z-30 bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800/90 h-16 transition-all duration-300 shadow-md`}
      >
        <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 w-full">
          {/* Left: Mobile Drawer Trigger & Command Search */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors md:hidden shrink-0"
              aria-label="Abrir menu de navegação"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Command Palette Trigger Input */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1E293B]/70 border border-slate-700/80 text-slate-400 hover:text-slate-200 hover:border-slate-600 text-xs w-full max-w-[220px] sm:max-w-xs md:max-w-md transition-all truncate"
            >
              <Search className="w-3.5 h-3.5 text-[#F5A300] shrink-0" />
              <span className="flex-1 text-left truncate">Pesquisar no sistema...</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-400 rounded border border-slate-700 shrink-0">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setActiveModule('pedidos')}
              className="stripe-button-primary text-xs py-1.5 px-2.5 sm:px-3.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">Novo Pedido</span>
            </button>

            {/* Role Pill Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[#F5A300] text-xs font-semibold shrink-0">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{currentUser.role}</span>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors relative"
                aria-label="Notificações"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#F5A300] rounded-full ring-2 ring-[#0F172A]" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-slide-down">
                  <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-[#020817]">
                    <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Notificações</h4>
                    <span className="text-[10px] text-amber-400 font-medium">
                      {unreadNotifications.length} não lidas
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">Sem notificações ativas</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3.5 text-xs hover:bg-slate-800/50 transition-colors cursor-pointer ${
                            !n.read ? 'bg-slate-800/30 font-medium' : 'opacity-70'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="font-semibold text-slate-200">{n.title}</h5>
                            <span className="text-[10px] text-slate-500 shrink-0">{n.timestamp}</span>
                          </div>
                          <p className="text-slate-400 mt-1 leading-relaxed text-[11px]">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800 shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full border border-[#F5A300] object-cover"
                title={`${currentUser.name} (${currentUser.role})`}
              />
              <button
                onClick={logout}
                className="p-1 text-slate-400 hover:text-rose-400 md:hidden"
                title="Encerrar Sessão"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isMobileDrawerOpen} onClose={() => setIsMobileDrawerOpen(false)} />
    </>
  );
};
