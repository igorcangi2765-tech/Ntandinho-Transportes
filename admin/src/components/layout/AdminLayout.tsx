import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '../../utils/cn';
import { useAppStore } from '../../stores/useAppStore';
import { CommandPalette } from '../search/CommandPalette';
import { NotificationDrawer } from '../search/NotificationDrawer';
import { ToastContainer } from '../feedback/ToastContainer';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';

export const AdminLayout: React.FC = () => {
  const {
    sidebarCollapsed,
    toggleCommandPalette,
    setCommandPaletteOpen,
    setNotificationDrawerOpen,
    setMobileSidebarOpen,
  } = useAppStore();

  // Shortcut Ctrl+K / Cmd+K -> Toggle Command Palette
  useKeyboardShortcut({
    key: 'k',
    ctrlKey: true,
    metaKey: true,
    action: () => toggleCommandPalette(),
  });

  // Shortcut Esc -> Close open dialogs
  useKeyboardShortcut({
    key: 'Escape',
    action: () => {
      setCommandPaletteOpen(false);
      setNotificationDrawerOpen(false);
      setMobileSidebarOpen(false);
    },
  });

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex font-sans relative">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300 ease-in-out min-w-0',
          sidebarCollapsed ? 'md:ml-20' : 'md:ml-72'
        )}
      >
        <Header />

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>

        {/* Global Footer info bar */}
        <footer className="px-6 py-4 border-t border-slate-800/60 bg-navy-900/40 text-xs text-slate-500 flex justify-between items-center">
          <div>
            © {new Date().getFullYear()} N' Tandinho Transportes & Logística S.A. Todos os direitos reservados.
          </div>
        </footer>
      </div>

      {/* Global Drawers & Modals */}
      <CommandPalette />
      <NotificationDrawer />
      <ToastContainer />
    </div>
  );
};
