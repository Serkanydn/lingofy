-- Add support for reading questions
-- This script adds the missing quiz_content table and content_id column to reading_content

-- 1. Create quiz_content table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.quiz_content (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL,
  title text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quiz_content_pkey PRIMARY KEY (id)
);

-- 2. Add content_id column to reading_content if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'reading_content' 
    AND column_name = 'content_id'
  ) THEN
    ALTER TABLE public.reading_content 
    ADD COLUMN content_id uuid;
    
    -- Add foreign key constraint
    ALTER TABLE public.reading_content
    ADD CONSTRAINT reading_content_content_id_fkey 
    FOREIGN KEY (content_id) REFERENCES public.quiz_content(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 3. Ensure questions table has type column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'questions' 
    AND column_name = 'type'
  ) THEN
    -- Create enum type for question types
    CREATE TYPE question_type AS ENUM ('multiple_choice', 'fill_blank', 'true_false');
    
    ALTER TABLE public.questions 
    ADD COLUMN type question_type DEFAULT 'multiple_choice';
  END IF;
END $$;

-- 4. Ensure questions table has order_index column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'questions' 
    AND column_name = 'order_index'
  ) THEN
    ALTER TABLE public.questions 
    ADD COLUMN order_index smallint DEFAULT 1;
  END IF;
END $$;

-- 5. Add RLS policies for quiz_content
ALTER TABLE public.quiz_content ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to quiz_content" ON public.quiz_content;
DROP POLICY IF EXISTS "Allow admins to manage quiz_content" ON public.quiz_content;

-- Allow all users to read quiz content
CREATE POLICY "Allow public read access to quiz_content"
  ON public.quiz_content FOR SELECT
  TO authenticated, anon
  USING (true);

-- Only admins can insert/update/delete quiz content
CREATE POLICY "Allow admins to manage quiz_content"
  ON public.quiz_content FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- 6. Add RLS policies for questions
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to questions" ON public.questions;
DROP POLICY IF EXISTS "Allow admins to manage questions" ON public.questions;

-- Allow all users to read questions
CREATE POLICY "Allow public read access to questions"
  ON public.questions FOR SELECT
  TO authenticated, anon
  USING (true);

-- Only admins can manage questions
CREATE POLICY "Allow admins to manage questions"
  ON public.questions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- 7. Add RLS policies for question_options
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to question_options" ON public.question_options;
DROP POLICY IF EXISTS "Allow admins to manage question_options" ON public.question_options;

-- Allow all users to read question options
CREATE POLICY "Allow public read access to question_options"
  ON public.question_options FOR SELECT
  TO authenticated, anon
  USING (true);

-- Only admins can manage question options
CREATE POLICY "Allow admins to manage question_options"
  ON public.question_options FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- 8. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_content_content_id 
  ON public.quiz_content(content_id);

CREATE INDEX IF NOT EXISTS idx_questions_content_id 
  ON public.questions(content_id);

CREATE INDEX IF NOT EXISTS idx_questions_order 
  ON public.questions(content_id, order_index);

CREATE INDEX IF NOT EXISTS idx_question_options_question_id 
  ON public.question_options(question_id);

CREATE INDEX IF NOT EXISTS idx_reading_content_content_id 
  ON public.reading_content(content_id);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Reading questions support has been successfully added!';
END $$;
