import { create } from 'zustand';

interface AppState {
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  commandPaletteOpen: boolean;
  notificationDrawerOpen: boolean;
  theme: 'dark' | 'light';
  selectedCompany: string;
  companies: string[];

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleNotificationDrawer: () => void;
  setNotificationDrawerOpen: (open: boolean) => void;
  setCompany: (company: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  commandPaletteOpen: false,
  notificationDrawerOpen: false,
  theme: 'dark',
  selectedCompany: "N' Tandinho Transportes S.A. (Moçambique)",
  companies: [
    "N' Tandinho Transportes S.A. (Moçambique)",
    "N' Tandinho Logistics (Malawi Branch)",
    "N' Tandinho Freight (South Africa Region)",
  ],

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleMobileSidebar: () => set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
  toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  toggleNotificationDrawer: () => set((state) => ({ notificationDrawerOpen: !state.notificationDrawerOpen })),
  setNotificationDrawerOpen: (open) => set({ notificationDrawerOpen: open }),
  setCompany: (company) => set({ selectedCompany: company }),
}));
