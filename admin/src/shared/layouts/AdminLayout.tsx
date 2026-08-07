import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '../utils/cn';
import { useAppStore } from '../stores/useAppStore';
import { CommandPalette } from '../components/search/CommandPalette';
import { NotificationDrawer } from '../components/search/NotificationDrawer';
import { ToastContainer } from '../components/feedback/ToastContainer';
import { EditProfileModal } from '../../components/profile/EditProfileModal';
import { ErrorBoundary } from '../components/feedback/ErrorBoundary';
import { PageLoader } from '../components/ui/PageLoader';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
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
    <div className="min-h-screen bg-[#020617] text-slate-200 flex font-sans relative selection:bg-brand-orange selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300 ease-in-out min-w-0',
          sidebarCollapsed ? 'md:ml-[72px]' : 'md:ml-[280px]'
        )}
      >
        <Header />

        {/* 8px spacing grid system: p-6 (24px) for desktop, p-4 (16px) for mobile */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto overflow-x-hidden relative">
          <div className="max-w-screen-2xl mx-auto">
            <ErrorBoundary>
              <Suspense fallback={<PageLoader message="A carregar interface..." />}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Outlet />
                  </motion.div>
                </AnimatePresence>
              </Suspense>
            </ErrorBoundary>
          </div>
        </main>
      </div>

      {/* Global Root Modals & Drawers (Highest Z-Index Layer) */}
      <CommandPalette />
      <NotificationDrawer />
      <EditProfileModal />
      <ToastContainer />
    </div>
  );
};
