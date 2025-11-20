import { User } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  is_premium: boolean;
  premium_expires_at: string | null;
  is_admin: boolean;
  created_at: string;
}

export type SignInCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = SignInCredentials & {
  full_name: string;
};

export type UpdateProfileData = {
  full_name?: string;
  avatar_url?: string;
};
