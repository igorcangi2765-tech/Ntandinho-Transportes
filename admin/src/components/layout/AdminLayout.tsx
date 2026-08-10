import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppStore } from '../../stores/useAppStore';
import { CommandPalette } from '../search/CommandPalette';
import { NotificationDrawer } from '../search/NotificationDrawer';
import { ToastContainer } from '../feedback/ToastContainer';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';

export const AdminLayout: React.FC = () => {
  const {
    toggleCommandPalette,
    setCommandPaletteOpen,
    setNotificationDrawerOpen,
    setMobileSidebarOpen,
    theme,
  } = useAppStore();

  // Ensure theme class on root element
  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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
    <div className="h-screen w-full overflow-hidden bg-background text-text-primary flex font-sans relative selection:bg-[#F6A823] selection:text-[#0B132B]">
      {/* Fixed Sidebar Navigation */}
      <Sidebar />

      {/* Independent Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden transition-all duration-300 ease-in-out">
        <Header />

        {/* Independent Page Scroll Area */}
        <main className="flex-1 p-3 sm:p-6 md:p-8 overflow-y-auto overflow-x-hidden relative custom-scrollbar max-w-full w-full">
          <Outlet />
        </main>

      </div>

      {/* Global Drawers & Modals */}
      <CommandPalette />
      <NotificationDrawer />
      <ToastContainer />
    </div>
  );
};
