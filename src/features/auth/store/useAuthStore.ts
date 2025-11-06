import { create } from "zustand";
import { useEffect } from "react";
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
    if (!profile?.is_premium) return false;
    if (!profile.premium_expires_at) return false;
    return new Date(profile.premium_expires_at) > new Date();
  },

  initialize: async () => {
    let cleanup: (() => void) | undefined;

    try {
      // Get initial session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        set({ user: session.user });

        // Fetch user profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          const formattedProfile: Profile = {
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
            is_premium: profile.is_premium,
            premium_expires_at: profile.premium_expires_at,
            created_at: profile.created_at,
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
              id: profile.id,
              email: profile.email,
              full_name: profile.full_name,
              avatar_url: profile.avatar_url,
              is_premium: profile.is_premium,
              premium_expires_at: profile.premium_expires_at,
              created_at: profile.created_at,
            };
            set({ profile: formattedProfile });
          }
        } else {
          set({ profile: null });
        }
      });

      cleanup = () => subscription.unsubscribe();
    } catch (error) {
      console.error("Auth initialization failed:", error);
    } finally {
      set({ isLoading: false });
    }

    // Setup cleanup in useEffect
    if (cleanup) {
      useEffect(() => cleanup, []);
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
