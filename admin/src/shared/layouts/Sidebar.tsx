import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PackageSearch,
  Truck,
  Building2,
  Receipt,
  FileBarChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Search,
  X,
  LogOut,
  UserCog,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useAppStore } from '../stores/useAppStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useNotificationStore } from '../stores/useNotificationStore';
import { useUserProfileStore } from '../stores/useUserProfileStore';
import { Logo } from '../components/ui/Logo';

export const workspaceNav = [
  { title: 'Painel Principal', path: '/', icon: LayoutDashboard },
  { title: 'Operações & Cargas', path: '/loads', icon: PackageSearch },
  { title: 'Gestão de Frota', path: '/fleet', icon: Truck },
  { title: 'Comercial & Clientes', path: '/crm', icon: Building2 },
  { title: 'Faturação & Finanças', path: '/finance', icon: Receipt },
  { title: 'Relatórios & Métricas', path: '/reports', icon: FileBarChart },
  { title: 'Configurações', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar, mobileSidebarOpen, setMobileSidebarOpen } = useAppStore();
  const { logout } = useAuthStore();
  const { currentUser, canAccessRoute, setEditProfileOpen } = useUserProfileStore();
  const { addToast } = useNotificationStore();
  const navigate = useNavigate();

  const [moduleSearch, setModuleSearch] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    addToast('Sessão Encerrada', 'Até breve!', 'info');
    navigate('/login');
  };

  const filteredNav = workspaceNav.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(moduleSearch.toLowerCase());
    const hasPermission = canAccessRoute(item.path);
    return matchesSearch && hasPermission;
  });

  const sidebarContent = (
    <aside
      className={cn(
        'h-screen flex flex-col justify-between transition-all duration-300 ease-in-out select-none bg-[#020617] border-r border-slate-800/40 relative',
        sidebarCollapsed ? 'w-[72px]' : 'w-[280px]'
      )}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Branding Header with Official Logo */}
        <div className="flex items-center justify-between h-16 px-4 shrink-0 border-b border-slate-800/30">
          <Logo collapsed={sidebarCollapsed} size="md" showSubtitle={true} />

          <button
            onClick={toggleSidebar}
            className="hidden md:block p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-slate-800/40 transition-colors"
            title={sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-md text-slate-500 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Global Nav Filter */}
        {!sidebarCollapsed && (
          <div className="px-3 py-3 shrink-0">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Ir para..."
                value={moduleSearch}
                onChange={(e) => setModuleSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900/60 border border-slate-800/60 rounded-md text-slate-200 focus:outline-none focus:border-brand-orange/50 transition-colors placeholder:text-slate-600"
              />
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {filteredNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => setMobileSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-3 py-2 rounded-md text-xs font-medium transition-all duration-150',
                  isActive
                    ? 'text-white border-l-2 border-brand-orange bg-white/[0.03]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] border-l-2 border-transparent'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      'w-4 h-4 shrink-0',
                      isActive ? 'text-slate-100' : 'text-slate-500'
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {!sidebarCollapsed && (
                    <span className="ml-3 truncate">{item.title}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile Footer */}
        <div className="px-3 pb-3 pt-2 shrink-0 border-t border-slate-800/30">
          <div className="relative">
            {showProfileMenu && !sidebarCollapsed && (
              <div className="absolute bottom-full left-0 w-full mb-2 p-1.5 bg-slate-900 border border-slate-800/80 rounded-xl shadow-2xl flex flex-col gap-0.5 animate-in fade-in slide-in-from-bottom-1 duration-150 z-50">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    setEditProfileOpen(true);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  <UserCog size={14} className="text-brand-orange" />
                  Editar Perfil & Foto
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/audit-logs');
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck size={14} className="text-slate-400" />
                  Logs de Auditoria
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  <LogOut size={14} />
                  Terminar Sessão
                </button>
              </div>
            )}

            <button
              onClick={() => !sidebarCollapsed && setShowProfileMenu(!showProfileMenu)}
              className={cn(
                'w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-150 border border-transparent cursor-pointer',
                sidebarCollapsed ? 'justify-center' : 'hover:bg-slate-900 hover:border-slate-800/60',
                showProfileMenu && !sidebarCollapsed ? 'bg-slate-900 border-slate-800/60' : ''
              )}
            >
              <div className="w-8 h-8 rounded-md bg-slate-800 border border-slate-700/50 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm relative overflow-hidden">
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#020617]" />
              </div>

              {!sidebarCollapsed && (
                <div className="flex flex-col items-start truncate">
                  <span className="text-xs font-semibold text-white truncate w-full text-left">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-brand-orange font-medium truncate w-full text-left">
                    {currentUser.role}
                  </span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden md:block fixed top-0 left-0 z-40 h-screen">
        {sidebarContent}
      </div>
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative flex-1 max-w-xs w-full z-10">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
