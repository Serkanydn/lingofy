"use client";

import { ReactNode, createContext, useContext, useEffect } from "react";
import { useAuthStore } from "@/shared/hooks/useAuth";
import { User } from "@supabase/supabase-js";
import { AuthStore } from "@/shared/lib/store/authStore";

export const AuthContext = createContext<{
  isAuthenticated: boolean;
  isPremium: boolean;
  user: User | null;
  profile: AuthStore["profile"];
}>({
  isAuthenticated: false,
  isPremium: false,
  user: null,
  profile: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const store = useAuthStore();

  useEffect(() => {
    // Initialize auth state from local storage or session
    // This will be handled by useAuthStore
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!store.user,
        isPremium: store.isPremium(),
        user: store.user,
        profile: store.profile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
