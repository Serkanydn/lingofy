-- Add LemonSqueezy integration columns to profiles table
-- Run this migration in your Supabase SQL Editor

-- Add lemon_squeezy_customer_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'lemon_squeezy_customer_id'
  ) THEN
    ALTER TABLE public.profiles 
    ADD COLUMN lemon_squeezy_customer_id text;
  END IF;
END $$;

-- Add lemon_squeezy_subscription_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'lemon_squeezy_subscription_id'
  ) THEN
    ALTER TABLE public.profiles 
    ADD COLUMN lemon_squeezy_subscription_id text;
  END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_lemon_customer 
  ON public.profiles(lemon_squeezy_customer_id) 
  WHERE lemon_squeezy_customer_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_lemon_subscription 
  ON public.profiles(lemon_squeezy_subscription_id) 
  WHERE lemon_squeezy_subscription_id IS NOT NULL;

-- Verify the columns were added
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
  AND column_name LIKE 'lemon_squeezy%'
ORDER BY column_name;
