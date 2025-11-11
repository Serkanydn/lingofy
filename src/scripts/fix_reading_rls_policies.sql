-- Fix RLS policies for reading_content to allow admin operations
-- This allows admins to create, update, and delete reading content

-- Drop existing policies
DROP POLICY IF EXISTS "Allow admins to manage reading_content" ON public.reading_content;
DROP POLICY IF EXISTS "Allow admins full access to reading_content" ON public.reading_content;
DROP POLICY IF EXISTS "Enable insert for admins" ON public.reading_content;
DROP POLICY IF EXISTS "Enable update for admins" ON public.reading_content;
DROP POLICY IF EXISTS "Enable delete for admins" ON public.reading_content;

-- Allow public read access (everyone can view reading content)
DROP POLICY IF EXISTS "Allow public read access" ON public.reading_content;
CREATE POLICY "Allow public read access"
  ON public.reading_content
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Allow admins to INSERT reading content
CREATE POLICY "Allow admins to insert reading_content"
  ON public.reading_content
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Allow admins to UPDATE reading content
CREATE POLICY "Allow admins to update reading_content"
  ON public.reading_content
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Allow admins to DELETE reading content
CREATE POLICY "Allow admins to delete reading_content"
  ON public.reading_content
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Verify policies are set
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'reading_content'
ORDER BY policyname;
