import { useEffect } from 'react';
import { AppRouter } from './routes';
import { useThemeStore } from './stores/useThemeStore';

export default function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return <AppRouter />;
}
