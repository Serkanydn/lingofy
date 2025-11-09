import { create } from "zustand";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/shared/lib/supabase/client";
import { Profile } from "../types/auth.types";

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
    console.log("initialize");
    try {
      // Get initial session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("session", session);

      if (session?.user) {
        set({ user: session.user });

        // Fetch user profile
        const { data: profile } = (await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()) as { data: Profile };

        console.log("profile", profile);
        if (profile) {
          const formattedProfile: Profile = {
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
            is_premium: profile.is_premium,
            premium_expires_at: profile.premium_expires_at,
            is_admin: (profile as any).is_admin ?? false,
            created_at: (profile as any).created_at,
          };
          set({ profile: formattedProfile });
        }
      }

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        set({ user: session?.user ?? null });

        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (profile) {
            const formattedProfile: Profile = {
              id: (profile as any).id,
              email: (profile as any).email,
              full_name: (profile as any).full_name,
              avatar_url: (profile as any).avatar_url,
              is_premium: (profile as any).is_premium,
              premium_expires_at: (profile as any).premium_expires_at,
              is_admin: (profile as any).is_admin ?? false,
              created_at: (profile as any).created_at,
            };
            set({ profile: formattedProfile });
          }
        } else {
          set({ profile: null });
        }
      });
    } catch (error) {
      console.error("Auth initialization failed:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({
        user: null,
        profile: null,
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },
}));
