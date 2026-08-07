import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Search,
  Bell,
  ChevronRight,
  Plus,
  Globe,
  Menu,
  Building2,
} from 'lucide-react';
import { navItems } from './Sidebar';
import { useAppStore } from '../../stores/useAppStore';
import { useNotificationStore } from '../../stores/useNotificationStore';

export const Header: React.FC = () => {
  const location = useLocation();
  const {
    toggleMobileSidebar,
    setCommandPaletteOpen,
    toggleNotificationDrawer,
    selectedCompany,
    companies,
    setCompany,
  } = useAppStore();

  const { unreadCount, addToast } = useNotificationStore();

  const activeNavItem = navItems.find((item) =>
    item.path === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(item.path)
  );

  const handleNovaOperacao = () => {
    addToast('Nova Operação', 'Modal de registo rápido iniciado.', 'info');
  };

  return (
    <header className="h-16 sticky top-0 z-30 border-b border-slate-800/80 bg-navy-950/80 backdrop-blur-xl px-4 md:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center space-x-3 text-sm">
        <button
          onClick={toggleMobileSidebar}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          title="Abrir Menu"
        >
          <Menu size={20} />
        </button>

        <span className="text-slate-500 font-medium hidden sm:inline">N' Tandinho ERP</span>
        <ChevronRight size={14} className="text-slate-600 hidden sm:inline" />
        <span className="text-white font-semibold flex items-center gap-1.5">
          {activeNavItem?.title || 'Painel de Controlo'}
        </span>
      </div>

      {/* Center: Global Search Input Trigger */}
      <div
        onClick={() => setCommandPaletteOpen(true)}
        className="hidden md:flex items-center w-80 lg:w-96 relative cursor-pointer group"
      >
        <Search size={16} className="absolute left-3.5 text-slate-400 group-hover:text-brand-orange transition-colors" />
        <input
          type="text"
          readOnly
          placeholder="Pesquisar cargas, motoristas, faturas..."
          className="w-full pl-10 pr-10 py-1.5 text-xs bg-slate-900/80 text-slate-100 rounded-xl border border-slate-800 group-hover:border-slate-700 cursor-pointer transition-all placeholder:text-slate-500"
        />
        <kbd className="absolute right-3 text-[10px] bg-slate-800 text-slate-400 font-mono px-1.5 py-0.5 rounded border border-slate-700">
          ⌘K
        </kbd>
      </div>

      {/* Right: Actions, Company Selector, Notifications */}
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Company Selector Dropdown */}
        <div className="hidden xl:flex items-center space-x-2 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <Building2 size={13} className="text-brand-orange" />
          <select
            value={selectedCompany}
            onChange={(e) => setCompany(e.target.value)}
            className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
          >
            {companies.map((c) => (
              <option key={c} value={c} className="bg-navy-900 text-white">
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Network Status Badge */}
        <div className="hidden lg:flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <Globe size={13} />
          <span className="hidden xl:inline">Rede SADC Ativa</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Notifications Bell */}
        <button
          onClick={toggleNotificationDrawer}
          className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          title="Notificações do Sistema"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 px-1.5 py-0.2 min-w-[18px] text-[10px] font-bold rounded-full bg-brand-orange text-slate-950 flex items-center justify-center ring-2 ring-navy-950 animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Nova Operação Quick Action */}
        <button
          onClick={handleNovaOperacao}
          className="flex items-center space-x-2 px-3.5 py-1.5 bg-gradient-to-r from-brand-orange to-amber-600 hover:from-brand-orange-hover hover:to-amber-700 text-slate-950 font-semibold text-xs rounded-xl shadow-glow transition-all hover:scale-[1.02]"
        >
          <Plus size={14} />
          <span className="hidden sm:inline">Nova Operação</span>
        </button>
      </div>
    </header>
  );
};
