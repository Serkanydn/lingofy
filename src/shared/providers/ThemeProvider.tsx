'use client';

import { useEffect } from 'react';
import { useThemeStore } from '../hooks/useTheme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode, isDark } = useThemeStore();

  useEffect(() => {
    // Apply theme on mount
    if (mode === 'system') {
      const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemIsDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [mode, isDark]);

  return <>{children}</>;
}
