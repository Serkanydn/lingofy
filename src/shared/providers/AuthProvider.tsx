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
    let mounted = true;
    
    const initializeAuth = async () => {
      const { supabase } = await import('@/shared/lib/supabase/client')
      
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user && mounted) {
        store.setUser(session.user)
        console.log('session.user',session.user);
        
        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

          console.log('profile',profile);
          
        if (profile && mounted) {
          store.setProfile(profile)
        }
      }

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;
        
        store.setUser(session?.user ?? null)
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            
          if (mounted) {
            store.setProfile(profile ?? null)
          }
        } else {
          store.setProfile(null)
        }
      })

      return () => {
        subscription.unsubscribe()
        mounted = false
      }
    }

    initializeAuth()
    return () => {
      mounted = false
    }
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
