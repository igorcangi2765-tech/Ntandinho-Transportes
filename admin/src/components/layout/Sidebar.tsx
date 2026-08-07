import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Truck,
  Package,
  DollarSign,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  LogOut,
  X,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAppStore } from '../../stores/useAppStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useNotificationStore } from '../../stores/useNotificationStore';

export const navItems = [
  {
    title: 'Dashboard',
    path: '/admin',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: 'CRM & Cotações',
    path: '/admin/crm',
    icon: Users,
    badge: '3 Novas',
  },
  {
    title: 'Gestão de Frota',
    path: '/admin/fleet',
    icon: Truck,
    badge: '14 Ativos',
  },
  {
    title: 'Logística & Cargas',
    path: '/admin/loads',
    icon: Package,
    badge: '8 Em Rota',
  },
  {
    title: 'Financeiro',
    path: '/admin/finance',
    icon: DollarSign,
    badge: null,
  },
  {
    title: 'Auditoria & Logs',
    path: '/admin/audit-logs',
    icon: ShieldCheck,
    badge: null,
  },
  {
    title: 'Configurações',
    path: '/admin/settings',
    icon: Settings,
    badge: null,
  },
];

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar, mobileSidebarOpen, setMobileSidebarOpen } = useAppStore();
  const { user, logout } = useAuthStore();
  const { addToast } = useNotificationStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    addToast('Sessão Encerrada', 'Até breve!', 'info');
    navigate('/admin/login');
  };

  const sidebarContent = (
    <aside
      className={cn(
        'h-screen border-r border-slate-800/80 bg-navy-900/95 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 ease-in-out',
        sidebarCollapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/60">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-amber-600 flex items-center justify-center font-bold text-slate-950 text-xl shadow-glow shrink-0">
              NT
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-bold text-sm tracking-wide text-white truncate">
                  N' TANDINHO
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-brand-orange">
                  Transportes ERP
                </span>
              </div>
            )}
          </div>

          <button
            onClick={toggleSidebar}
            className="hidden md:block p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            title={sidebarCollapsed ? 'Expandir Sidebar' : 'Recolher Sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                onClick={() => setMobileSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'group relative flex items-center px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-brand-orange/20 to-navy-800/40 text-brand-orange border border-brand-orange/30 shadow-glow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        'w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110',
                        isActive ? 'text-brand-orange' : 'text-slate-400 group-hover:text-slate-200'
                      )}
                    />
                    {!sidebarCollapsed && (
                      <span className="ml-3 truncate font-medium">{item.title}</span>
                    )}

                    {!sidebarCollapsed && item.badge && (
                      <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-orange/15 text-brand-orange border border-brand-orange/30">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User & Logout */}
      <div className="p-3 border-t border-slate-800/60">
        <div
          className={cn(
            'flex items-center p-2 rounded-xl bg-slate-900/50 border border-slate-800/80',
            sidebarCollapsed ? 'justify-center' : 'justify-between'
          )}
        >
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-lg bg-navy-700 flex items-center justify-center font-semibold text-white border border-slate-700">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'AD'}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-navy-900" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-white truncate">
                  {user?.name || 'Admin Tandinho'}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck size={11} className="text-brand-orange" /> {user?.role || 'Gestor Geral'}
                </span>
              </div>
            )}
          </div>

          {!sidebarCollapsed && (
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Sair do Sistema"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block fixed top-0 left-0 z-40">
        {sidebarContent}
      </div>

      {/* Mobile Slide-Over Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative flex-1 max-w-xs w-full z-10">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
