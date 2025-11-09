import { useAuthStore } from "../store/useAuthStore";

// Hook for components to use auth state
export const useAuth = () => {
  const { user, profile, isLoading, isPremium, isAdmin, logout } = useAuthStore();

  return {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    isPremium: isPremium(),
    isAdmin: isAdmin(),
    logout,
  };
};
