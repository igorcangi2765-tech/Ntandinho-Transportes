import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Plus,
  Menu,
  UserCog,
  Moon,
  Sun,
} from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { useNotificationStore } from '../stores/useNotificationStore';
import { useUserProfileStore } from '../stores/useUserProfileStore';
import { QuickActionModal } from '../../components/ui/QuickActionModal';
import { GlobalSearchModal } from '../../components/ui/GlobalSearchModal';

export const Header: React.FC = () => {
  const {
    toggleMobileSidebar,
    toggleNotificationDrawer,
  } = useAppStore();

  const { theme, toggleTheme } = useThemeStore();
  const { currentUser, setEditProfileOpen } = useUserProfileStore();
  const { unreadCount } = useNotificationStore();

  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="h-16 sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-navy-950/90 backdrop-blur-xl px-4 flex items-center justify-between select-none shrink-0">
        {/* Left: Mobile Menu Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobileSidebar}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Menu size={18} />
          </button>
        </div>

        {/* Center: Command Palette / Search Trigger */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <button
            onClick={() => setIsGlobalSearchOpen(true)}
            className="w-full flex items-center justify-between px-3 py-1.5 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-all shadow-sm group cursor-pointer rounded-xl"
          >
            <div className="flex items-center gap-2 text-xs font-medium">
              <Search size={14} className="text-slate-400 group-hover:text-slate-500" />
              <span>Pesquisa Global: Viagens, clientes, viaturas, faturas...</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded border border-slate-200 dark:border-slate-700">
                Ctrl
              </kbd>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded border border-slate-200 dark:border-slate-700">
                K
              </kbd>
            </div>
          </button>
        </div>

        {/* Right: Tools & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger for Mobile */}
          <button
            onClick={() => setIsGlobalSearchOpen(true)}
            className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Pesquisar"
          >
            <Search size={18} />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
          >
            {theme === 'dark' ? (
              <Sun size={18} className="text-amber-400" />
            ) : (
              <Moon size={18} className="text-slate-700" />
            )}
          </button>

          {/* Notifications */}
          <button
            onClick={toggleNotificationDrawer}
            className="relative p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Notificações"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-orange ring-2 ring-white" />
            )}
          </button>

          {/* Avatar Profile */}
          <button
            onClick={() => setEditProfileOpen(true)}
            className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-brand-orange dark:hover:border-brand-orange transition-all cursor-pointer shadow-sm relative group shrink-0"
            title="Editar Foto & Perfil"
          >
            <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <UserCog size={12} className="text-white" />
            </div>
          </button>

          {/* Global Quick Action Button + Criar */}
          <button
            onClick={() => setIsQuickActionOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-lg shadow-glow transition-all ml-1 cursor-pointer"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>+ Criar</span>
          </button>
        </div>
      </header>

      {/* Global Modals */}
      <QuickActionModal isOpen={isQuickActionOpen} onClose={() => setIsQuickActionOpen(false)} />
      <GlobalSearchModal isOpen={isGlobalSearchOpen} onClose={() => setIsGlobalSearchOpen(false)} />
    </>
  );
};
