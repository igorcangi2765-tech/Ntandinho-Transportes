import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
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
    <div className="h-screen w-full overflow-hidden bg-background text-text-primary flex font-sans relative selection:bg-[#F6A823] selection:text-[#0B132B]">
      {/* Fixed Sidebar Navigation */}
      <Sidebar />

      {/* Independent Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden transition-all duration-300 ease-in-out">
        <Header />

        {/* Independent Page Scroll Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto overflow-x-hidden relative custom-scrollbar">
          <div className="w-full">
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

      {/* Global Root Modals & Drawers */}
      <CommandPalette />
      <NotificationDrawer />
      <EditProfileModal />
      <ToastContainer />
    </div>
  );
};
