-- Verify Reading Questions Setup
-- Run this to check if everything was created correctly

-- 1. Check if quiz_content table exists
SELECT 
  'quiz_content table' as item,
  CASE WHEN EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'quiz_content'
  ) THEN '✓ EXISTS' ELSE '✗ MISSING' END as status;

-- 2. Check if content_id column exists in reading_content
SELECT 
  'content_id column' as item,
  CASE WHEN EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'reading_content' 
    AND column_name = 'content_id'
  ) THEN '✓ EXISTS' ELSE '✗ MISSING' END as status;

-- 3. Check if question_type enum exists
SELECT 
  'question_type enum' as item,
  CASE WHEN EXISTS (
    SELECT FROM pg_type 
    WHERE typname = 'question_type'
  ) THEN '✓ EXISTS' ELSE '✗ MISSING' END as status;

-- 4. Check if questions.type column exists
SELECT 
  'questions.type column' as item,
  CASE WHEN EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'questions' 
    AND column_name = 'type'
  ) THEN '✓ EXISTS' ELSE '✗ MISSING' END as status;

-- 5. List all columns in reading_content
SELECT 
  'reading_content columns' as section,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'reading_content'
ORDER BY ordinal_position;

-- 6. List all columns in questions
SELECT 
  'questions columns' as section,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'questions'
ORDER BY ordinal_position;

-- 7. Show current reading_content structure
SELECT 
  'Current reading_content records' as info,
  COUNT(*) as total_records
FROM reading_content;

-- If everything is correct, you should see ✓ EXISTS for all items
