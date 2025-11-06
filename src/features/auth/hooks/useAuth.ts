import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

// Hook for components to use auth state
export const useAuth = () => {
  const { user, profile, isLoading, initialize, isPremium, logout } =
    useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    isPremium: isPremium(),
    logout,
  };
};
