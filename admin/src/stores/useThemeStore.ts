import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'dark' | 'light';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const applyThemeToDOM = (theme: Theme) => {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      setTheme: (theme: Theme) => {
        const nextTheme = theme === 'light' ? 'light' : 'dark';
        applyThemeToDOM(nextTheme);
        set({ theme: nextTheme });
      },
      toggleTheme: () => {
        const currentTheme = get().theme;
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyThemeToDOM(nextTheme);
        set({ theme: nextTheme });
      },
    }),
    {
      name: 'ntandinho_theme_v3',
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          applyThemeToDOM(state.theme);
        }
      },
    }
  )
);
