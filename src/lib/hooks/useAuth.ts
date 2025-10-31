import { create } from "zustand";
import { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  is_premium: boolean;
  premium_expires_at: string | null;
}

interface AuthStore {
  user: User | null;
  profile: Profile | null;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  isPremium: () => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  profile: null,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  isPremium: () => {
    const { profile } = get();
    if (!profile?.is_premium) return false;
    if (!profile.premium_expires_at) return false;
    return new Date(profile.premium_expires_at) > new Date();
  },
  logout: () => set({ user: null, profile: null }),
}));
