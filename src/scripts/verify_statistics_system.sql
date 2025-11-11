-- =====================================================
-- STATISTICS SYSTEM VERIFICATION & TESTING
-- Run this to verify the statistics system is set up correctly
-- =====================================================

-- 1. Check if user_statistics table exists
SELECT 
  table_name, 
  column_name, 
  data_type, 
  column_default
FROM information_schema.columns
WHERE table_name = 'user_statistics'
ORDER BY ordinal_position;

-- Expected: 11 rows (user_id, 9 stat fields, updated_at)

-- =====================================================

-- 2. Check all triggers are active
SELECT 
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND (
    trigger_name LIKE '%statistics%' OR
    trigger_name LIKE '%reading_completed%' OR
    trigger_name LIKE '%listening_completed%' OR
    trigger_name LIKE '%quiz_completed%' OR
    trigger_name LIKE '%word_added%' OR
    trigger_name LIKE '%word_deleted%'
  )
ORDER BY event_object_table, trigger_name;

-- Expected: 6 triggers
-- - trigger_initialize_user_statistics (profiles)
-- - trigger_reading_completed (user_progress)
-- - trigger_listening_completed (user_progress)
-- - trigger_quiz_completed (user_quiz_attempts)
-- - trigger_word_added (user_words)
-- - trigger_word_deleted (user_words)

-- =====================================================

-- 3. Check RPC functions exist
SELECT 
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND (
    routine_name LIKE '%statistics%' OR
    routine_name LIKE '%flashcard%' OR
    routine_name LIKE '%studied_level%'
  )
ORDER BY routine_name;

-- Expected functions:
-- - increment_flashcard_practice
-- - increment_listening_completed
-- - increment_quiz_completed
-- - increment_reading_completed
-- - increment_words_added
-- - decrement_words_added
-- - initialize_user_statistics
-- - update_most_studied_level
-- - update_usage_days

-- =====================================================

-- 4. Test reading completion tracking
-- (Run this with a real user_id and content_id)
/*
DO $$
DECLARE
  test_user_id uuid := '<YOUR_USER_ID>';
  test_content_id uuid := '<SOME_CONTENT_ID>';
  before_count integer;
  after_count integer;
BEGIN
  -- Get current count
  SELECT total_reading_completed INTO before_count
  FROM user_statistics
  WHERE user_id = test_user_id;
  
  -- Simulate reading completion
  INSERT INTO user_progress (user_id, content_id, content_type, completed)
  VALUES (test_user_id, test_content_id, 'reading', true);
  
  -- Get new count
  SELECT total_reading_completed INTO after_count
  FROM user_statistics
  WHERE user_id = test_user_id;
  
  -- Report
  RAISE NOTICE 'Before: %, After: %', before_count, after_count;
  
  -- Cleanup
  DELETE FROM user_progress 
  WHERE user_id = test_user_id AND content_id = test_content_id;
END $$;
*/

-- =====================================================

-- 5. View current statistics for a user
-- Replace with actual user_id
/*
SELECT 
  total_reading_completed,
  total_listening_completed,
  total_quizzes_completed,
  total_quiz_score,
  total_words_added,
  flashcard_practice_count,
  total_usage_days,
  last_activity_date,
  most_studied_level,
  updated_at
FROM user_statistics
WHERE user_id = '<YOUR_USER_ID>';
*/

-- =====================================================

-- 6. Test manual RPC functions
-- Test flashcard tracking (run when authenticated)
/*
SELECT increment_flashcard_practice();
*/

-- Test most studied level update (run when authenticated)
/*
SELECT update_most_studied_level();
*/

-- =====================================================

-- 7. Check RLS policies on user_statistics
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'user_statistics';

-- Should have policies allowing users to:
-- - SELECT their own statistics
-- - UPDATE their own statistics (for triggers)
-- - INSERT their own statistics (for initialization)

-- =====================================================

-- 8. Summary report for all users
SELECT 
  COUNT(*) as total_users,
  SUM(total_reading_completed) as all_reading_completed,
  SUM(total_listening_completed) as all_listening_completed,
  SUM(total_quizzes_completed) as all_quizzes_completed,
  SUM(total_words_added) as all_words_added,
  AVG(total_usage_days) as avg_usage_days,
  MAX(last_activity_date) as most_recent_activity
FROM user_statistics;

-- =====================================================

-- 9. Users with most activity
SELECT 
  us.user_id,
  p.full_name,
  us.total_reading_completed + us.total_listening_completed + us.total_quizzes_completed as total_activities,
  us.total_usage_days,
  us.most_studied_level,
  us.last_activity_date
FROM user_statistics us
LEFT JOIN profiles p ON p.id = us.user_id
ORDER BY total_activities DESC
LIMIT 10;

-- =====================================================

-- 10. Missing statistics (users without stats record)
SELECT 
  p.id as user_id,
  p.full_name,
  p.created_at as user_created
FROM profiles p
LEFT JOIN user_statistics us ON us.user_id = p.id
WHERE us.user_id IS NULL;

-- If any users are missing, run:
/*
INSERT INTO user_statistics (user_id, last_activity_date)
SELECT id, CURRENT_DATE
FROM profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM user_statistics WHERE user_id = p.id
);
*/
