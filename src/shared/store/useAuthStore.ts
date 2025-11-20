import { create } from "zustand";
import { User } from "@supabase/supabase-js";
import { Profile } from "../types/model/auth.types";
import { authService } from "../services/supabase/authService";
import { userService } from "@/features/admin/features/users/services";
import { UserProfile } from "../types/model/user.types";

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  isPremium: () => boolean;
  isAdmin: () => boolean;

  // Auth operations
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ isLoading: loading }),

  isPremium: () => {
    const { profile } = get();
    // Admins have full access to premium content
    if (profile?.is_admin) return true;
    if (!profile?.is_premium) return false;
    if (!profile.premium_expires_at) return false;
    return new Date(profile.premium_expires_at) > new Date();
  },

  isAdmin: () => {
    const { profile } = get();
    return profile?.is_admin ?? false;
  },

  initialize: async () => {
    try {
      // Get initial session
      const session = await authService.getSession();
      console.log('session :>> ', session);

      if (session?.user) {
        // Fetch user profile
        const profile = await userService.getById(session.user.id);
        console.log('profile :>> ', profile);
        // Single state update with both user and profile
        set({ user: session.user, profile });
      }

      // Listen for auth changes
      // const subscription = authService.onAuthStateChange(
      //   async (event, session) => {
      //     set({ user: session?.user ?? null });

      //     if (!session?.user) {
      //       set({ profile: null });
      //       return;
      //     }
      //     const profile = await userService.getById(session.user.id);
      //     set({ profile: profile });
      //   }
      // );
    } catch (error) {
      console.error("Auth initialization failed:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await authService.signOut();
      set({
        user: null,
        profile: null,
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },
}));
