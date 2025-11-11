-- Force Schema Cache Reload in Supabase
-- Run this after creating tables to refresh PostgREST cache

-- Method 1: Notify PostgREST to reload
NOTIFY pgrst, 'reload schema';

-- Method 2: If above doesn't work, manually refresh by toggling RLS
-- This forces Supabase to recognize the new tables
DO $$ 
BEGIN
  -- Toggle RLS on quiz_content if it exists
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'quiz_content'
  ) THEN
    EXECUTE 'ALTER TABLE public.quiz_content DISABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.quiz_content ENABLE ROW LEVEL SECURITY';
    RAISE NOTICE 'Refreshed quiz_content table cache';
  END IF;

  -- Toggle RLS on reading_content
  EXECUTE 'ALTER TABLE public.reading_content DISABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE public.reading_content ENABLE ROW LEVEL SECURITY';
  RAISE NOTICE 'Refreshed reading_content table cache';

  -- Toggle RLS on questions
  EXECUTE 'ALTER TABLE public.questions DISABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY';
  RAISE NOTICE 'Refreshed questions table cache';
END $$;

-- Verify the schema is now accessible
SELECT 
  'Schema cache refreshed! Tables available:' as message,
  array_agg(table_name) as tables
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('quiz_content', 'reading_content', 'questions', 'question_options');
