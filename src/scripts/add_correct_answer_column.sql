-- Add correct_answer column to questions table for fill_blank questions
-- This allows storing the correct answer directly in the question row

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'questions' 
    AND column_name = 'correct_answer'
  ) THEN
    ALTER TABLE public.questions 
    ADD COLUMN correct_answer text;
    
    RAISE NOTICE 'Added correct_answer column to questions table';
  ELSE
    RAISE NOTICE 'correct_answer column already exists';
  END IF;
END $$;

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';

-- Verify the column was added
SELECT 
  'questions table structure' as info,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'questions'
ORDER BY ordinal_position;
