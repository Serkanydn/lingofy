import { useAuthStore } from "../store/useAuthStore";

// Hook for components to use auth state
export const useAuth = () => {
  const { user, profile, isLoading, logout } = useAuthStore();

  // Compute isPremium and isAdmin based on profile
  const isPremium = (() => {
    // Admins have full access to premium content
    if (profile?.is_admin) return true;
    if (!profile?.is_premium) return false;
    if (!profile.premium_expires_at) return false;
    return new Date(profile.premium_expires_at) > new Date();
  })();

  const isAdmin = profile?.is_admin ?? false;

  return {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    isPremium,
    isAdmin,
    logout,
  };
};
