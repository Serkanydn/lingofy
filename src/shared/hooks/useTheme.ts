import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeMode = "light" | "dark" | "system";

interface ThemeStore {
  mode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  syncSystemTheme: () => void;
}

const getSystemTheme = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const applyTheme = (isDark: boolean) => {
  if (typeof document === "undefined") return;
  
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      mode: "system",
      isDark: false,
      
      toggleTheme: () => {
        const currentMode = get().mode;
        const currentIsDark = get().isDark;
        
        // If in system mode, switch to explicit light/dark
        if (currentMode === "system") {
          const newMode = currentIsDark ? "light" : "dark";
          const newIsDark = newMode === "dark";
          applyTheme(newIsDark);
          set({ mode: newMode, isDark: newIsDark });
        } else {
          // Toggle between light and dark
          const newMode = currentMode === "dark" ? "light" : "dark";
          const newIsDark = newMode === "dark";
          applyTheme(newIsDark);
          set({ mode: newMode, isDark: newIsDark });
        }
      },
      
      setTheme: (mode: ThemeMode) => {
        if (mode === "system") {
          const systemIsDark = getSystemTheme();
          applyTheme(systemIsDark);
          set({ mode: "system", isDark: systemIsDark });
        } else {
          const isDark = mode === "dark";
          applyTheme(isDark);
          set({ mode, isDark });
        }
      },
      
      syncSystemTheme: () => {
        const currentMode = get().mode;
        if (currentMode === "system") {
          const systemIsDark = getSystemTheme();
          applyTheme(systemIsDark);
          set({ isDark: systemIsDark });
        }
      },
    }),
    {
      name: "theme",
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        
        // Apply theme after rehydration
        if (state.mode === "system") {
          const systemIsDark = getSystemTheme();
          applyTheme(systemIsDark);
          state.isDark = systemIsDark;
        } else {
          applyTheme(state.isDark);
        }
      },
    }
  )
);

export function useTheme() {
  const { mode, isDark, toggleTheme, setTheme, syncSystemTheme } = useThemeStore();

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      syncSystemTheme();
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } 
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [syncSystemTheme]);

  return { 
    mode, 
    isDark, 
    toggleTheme, 
    setTheme 
  };
}
