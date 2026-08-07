import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Plus,
  Globe,
  Menu,
  Building2,
  UserCog,
} from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';
import { useNotificationStore } from '../stores/useNotificationStore';
import { useUserProfileStore } from '../stores/useUserProfileStore';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const {
    toggleMobileSidebar,
    setCommandPaletteOpen,
    toggleNotificationDrawer,
    selectedCompany,
    companies,
    setCompany,
  } = useAppStore();

  const { currentUser, setEditProfileOpen } = useUserProfileStore();
  const { unreadCount, addToast } = useNotificationStore();

  const handleQuickAction = () => {
    addToast('Novo Despacho', 'A redirecionar para a gestão de ordens de carga...', 'info');
    navigate('/loads');
  };

  return (
    <header className="h-16 sticky top-0 z-30 border-b border-slate-800/40 bg-[#020617]/90 backdrop-blur-xl px-4 flex items-center justify-between select-none">
      {/* Left: Mobile Menu Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobileSidebar}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Center: Command Palette Trigger */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/80 hover:border-slate-700/80 rounded-lg text-slate-400 hover:text-slate-300 transition-all shadow-sm group cursor-pointer"
        >
          <div className="flex items-center gap-2 text-xs font-medium">
            <Search size={14} className="text-slate-500 group-hover:text-slate-400" />
            <span>Pesquisar operações, frota, faturas...</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-slate-800 text-slate-400 rounded border border-slate-700/50">
              ⌘
            </kbd>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-slate-800 text-slate-400 rounded border border-slate-700/50">
              K
            </kbd>
          </div>
        </button>
      </div>

      {/* Right: Tools & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Network Corridor Status */}
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold text-emerald-400 bg-emerald-500/5 border border-emerald-500/20">
          <Globe size={13} />
          <span>SADC Nampula</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
        </div>

        {/* Company Switcher */}
        <div className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-slate-800/50">
          <Building2 size={13} className="text-slate-400" />
          <select
            value={selectedCompany}
            onChange={(e) => setCompany(e.target.value)}
            className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer appearance-none pr-3"
          >
            {companies.map((c) => (
              <option key={c} value={c} className="bg-slate-900 text-white">
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="w-px h-4 bg-slate-800/80 hidden sm:block mx-1" />

        {/* Notifications */}
        <button
          onClick={toggleNotificationDrawer}
          className="relative p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          title="Notificações"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-orange ring-2 ring-[#020617]" />
          )}
        </button>

        {/* Avatar Image Profile Button */}
        <button
          onClick={() => setEditProfileOpen(true)}
          className="w-8 h-8 rounded-lg overflow-hidden border border-slate-700 hover:border-brand-orange transition-all cursor-pointer shadow-sm relative group shrink-0"
          title="Editar Foto & Perfil"
        >
          <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <UserCog size={12} className="text-white" />
          </div>
        </button>

        {/* Primary Quick Action Button */}
        <button
          onClick={handleQuickAction}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-lg shadow-sm transition-all ml-1 cursor-pointer"
        >
          <Plus size={14} strokeWidth={2.5} />
          <span className="hidden sm:inline">Novo Despacho</span>
        </button>
      </div>
    </header>
  );
};
