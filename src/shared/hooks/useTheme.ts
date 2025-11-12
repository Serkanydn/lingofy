import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeStore {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDark: false,
      toggleTheme: () =>
        set((state) => {
          const newTheme = !state.isDark;
          if (newTheme) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          return { isDark: newTheme };
        }),
      setTheme: (isDark) =>
        set(() => {
          if (isDark) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          return { isDark };
        }),
    }),
    {
      name: "theme",
      onRehydrateStorage: () => (state) => {
        // Apply theme after rehydration
        if (state?.isDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },
    }
  )
);

export function useTheme() {
  const { isDark, toggleTheme, setTheme } = useThemeStore();

  // Initialize theme on mount
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    // If no saved theme exists, use system preference
    if (localStorage.getItem("theme") === null && prefersDark) {
      setTheme(true);
    }
  }, [setTheme]);

  return { isDark, toggleTheme };
}
