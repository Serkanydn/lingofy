"use client";

import { ReactNode, createContext, useContext, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { useAuthStore } from "@/features/auth/hooks/useAuth";
import { AuthStore, Profile } from "@/features/auth/types/auth.types";

export const AuthContext = createContext<{
  isAuthenticated: boolean;
  isPremium: boolean;
  user: User | null;
  profile: Profile | null;
}>({
  isAuthenticated: false,
  isPremium: false,
  user: null,
  profile: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const store = useAuthStore();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      const { supabase } = await import("@/shared/lib/supabase/client");

      // Get initial session
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          store.setUser(session.user);

          // Fetch user profile
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (profile && mounted) {
            const formattedProfile: Profile = {
              id: profile.id,
              email: profile.email,
              full_name: profile.full_name,
              avatar_url: profile.avatar_url,
              is_premium: profile.is_premium,
              premium_expires_at: profile.premium_expires_at,
              created_at: profile.created_at
            };
            store.setProfile(formattedProfile);
          }
        }
      } finally {
        if (mounted) {
        }
      }

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;

        store.setUser(session?.user ?? null);

        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (mounted && profile) {
            const formattedProfile: Profile = {
              id: profile.id,
              email: profile.email,
              full_name: profile.full_name,
              avatar_url: profile.avatar_url,
              is_premium: profile.is_premium,
              premium_expires_at: profile.premium_expires_at,
              created_at: profile.created_at
            };
            store.setProfile(formattedProfile);
          } else if (mounted) {
            store.setProfile(null);
          }
        } else {
          store.setProfile(null);
        }
      });

      return () => {
        subscription.unsubscribe();
        mounted = false;
      };
    };

    initializeAuth();
    return () => {
      mounted = false;
    };
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
