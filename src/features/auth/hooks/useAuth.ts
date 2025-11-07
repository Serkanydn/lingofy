import { useAuthStore } from "../store/useAuthStore";

// Hook for components to use auth state
export const useAuth = () => {
  const { user, profile, isLoading, isPremium, logout } = useAuthStore();

  return {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    isPremium: isPremium(),
    logout,
  };
};
