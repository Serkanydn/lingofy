-- Create app_settings table for application configuration
-- This table should only have one row for global settings

CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'Learn Quiz English',
  site_description TEXT NOT NULL DEFAULT 'Master English through interactive quizzes',
  contact_email TEXT NOT NULL DEFAULT 'contact@learnquiz.com',
  support_email TEXT NOT NULL DEFAULT 'support@learnquiz.com',
  max_free_quizzes_per_day INTEGER NOT NULL DEFAULT 5 CHECK (max_free_quizzes_per_day >= 0 AND max_free_quizzes_per_day <= 100),
  enable_new_registrations BOOLEAN NOT NULL DEFAULT true,
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  maintenance_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for quick lookups
CREATE INDEX IF NOT EXISTS idx_app_settings_updated_at ON app_settings(updated_at DESC);

-- Add RLS policies
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read settings
CREATE POLICY "Allow authenticated users to read settings"
  ON app_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can update settings
CREATE POLICY "Allow admins to update settings"
  ON app_settings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Only admins can insert settings
CREATE POLICY "Allow admins to insert settings"
  ON app_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Insert initial default settings
INSERT INTO app_settings (
  site_name,
  site_description,
  contact_email,
  support_email,
  max_free_quizzes_per_day,
  enable_new_registrations,
  maintenance_mode,
  maintenance_message
) VALUES (
  'Learn Quiz English',
  'Master English through interactive quizzes',
  'contact@learnquiz.com',
  'support@learnquiz.com',
  5,
  true,
  false,
  null
)
ON CONFLICT (id) DO NOTHING;

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_app_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_app_settings_updated_at
  BEFORE UPDATE ON app_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_app_settings_updated_at();

-- Add comment to table
COMMENT ON TABLE app_settings IS 'Global application settings - should only contain one row';
