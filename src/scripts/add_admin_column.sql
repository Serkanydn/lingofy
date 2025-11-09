-- Add is_admin column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create an index for faster admin lookups
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin) WHERE is_admin = true;

-- Example: Set a user as admin (replace 'user-email@example.com' with actual admin email)
-- UPDATE public.profiles 
-- SET is_admin = true 
-- WHERE email = 'admin@example.com';
