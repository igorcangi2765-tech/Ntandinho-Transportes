import React from 'react';
import {
  Bell,
  Menu,
  Moon,
  Sun,
} from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { useNotificationStore } from '../stores/useNotificationStore';
import { User3DAvatar } from '../components/ui/User3DAvatar';

export const Header: React.FC = () => {
  const {
    toggleMobileSidebar,
    toggleNotificationDrawer,
  } = useAppStore();

  const { theme, toggleTheme } = useThemeStore();
  const { unreadCount } = useNotificationStore();

  return (
    <header className="h-16 sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-[#0B132B]/90 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between select-none shrink-0">
      {/* Left: Mobile Menu Trigger */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleMobileSidebar}
          className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Abrir Menu de Navegação"
          aria-label="Abrir Menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Right: [Light/Dark Mode] [Notificações] [Avatar 3D] */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Toggle Light / Dark Mode */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-all cursor-pointer"
          title={theme === 'dark' ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
          aria-label="Alternar Tema"
        >
          {theme === 'dark' ? (
            <Sun size={19} className="text-amber-400 hover:rotate-45 transition-transform" />
          ) : (
            <Moon size={19} className="text-slate-700 hover:-rotate-12 transition-transform" />
          )}
        </button>

        {/* Notificações */}
        <button
          type="button"
          onClick={toggleNotificationDrawer}
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-all cursor-pointer"
          title="Notificações"
          aria-label="Notificações"
        >
          <Bell size={19} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#F6A823] ring-2 ring-white dark:ring-[#0B132B] animate-pulse" />
          )}
        </button>

        {/* Avatar 3D do Utilizador com Menu */}
        <User3DAvatar />
      </div>
    </header>
  );
};

