import { User } from '@supabase/supabase-js'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  is_premium: boolean
  premium_expires_at: string | null
  created_at: string
}

export interface AuthStore {
  user: User | null
  profile: Profile | null
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  isPremium: () => boolean
  logout: () => void
}

export type SignInCredentials = {
  email: string
  password: string
}

export type SignUpCredentials = SignInCredentials & {
  full_name: string
}

export type UpdateProfileData = {
  full_name?: string
  avatar_url?: string
}