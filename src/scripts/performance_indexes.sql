-- =====================================================
-- Performance Indexes for Learn Quiz English
-- Optimized for common query patterns
-- =====================================================

-- =====================================================
-- GRAMMAR TOPICS INDEXES
-- =====================================================

-- Index for filtering by category (common in UI navigation)
CREATE INDEX IF NOT EXISTS idx_grammar_topics_category 
  ON public.grammar_topics(category);

-- Index for ordering topics
CREATE INDEX IF NOT EXISTS idx_grammar_topics_order 
  ON public.grammar_topics(order_index);

-- Composite index for category filtering + ordering
CREATE INDEX IF NOT EXISTS idx_grammar_topics_category_order 
  ON public.grammar_topics(category, order_index);

-- Index for quiz content lookup
CREATE INDEX IF NOT EXISTS idx_grammar_topics_quiz_content 
  ON public.grammar_topics(content_id);

-- =====================================================
-- LISTENING CONTENT INDEXES
-- =====================================================

-- Index for filtering by level (A1, A2, B1, B2, C1)
CREATE INDEX IF NOT EXISTS idx_listening_content_level 
  ON public.listening_content(level);

-- Index for premium content filtering
CREATE INDEX IF NOT EXISTS idx_listening_content_premium 
  ON public.listening_content(is_premium);

-- Composite index for level + premium filtering
CREATE INDEX IF NOT EXISTS idx_listening_content_level_premium 
  ON public.listening_content(level, is_premium);

-- Index for ordering content
CREATE INDEX IF NOT EXISTS idx_listening_content_order 
  ON public.listening_content(order_index);

-- Index for quiz content lookup
CREATE INDEX IF NOT EXISTS idx_listening_content_quiz_content 
  ON public.listening_content(content_id);

-- =====================================================
-- READING CONTENT INDEXES
-- =====================================================

-- Index for filtering by level
CREATE INDEX IF NOT EXISTS idx_reading_content_level 
  ON public.reading_content(level);

-- Index for premium content filtering
CREATE INDEX IF NOT EXISTS idx_reading_content_premium 
  ON public.reading_content(is_premium);

-- Composite index for level + premium filtering
CREATE INDEX IF NOT EXISTS idx_reading_content_level_premium 
  ON public.reading_content(level, is_premium);

-- Index for ordering content
CREATE INDEX IF NOT EXISTS idx_reading_content_order 
  ON public.reading_content(order_index);

-- Index for quiz content lookup
CREATE INDEX IF NOT EXISTS idx_reading_content_quiz_content 
  ON public.reading_content(content_id);

-- =====================================================
-- QUIZ CONTENT INDEXES
-- =====================================================

-- Index for content_id lookup (joins with grammar/listening/reading)
CREATE INDEX IF NOT EXISTS idx_quiz_content_content_id 
  ON public.quiz_content(content_id);

-- Index for creation date (sorting recent quizzes)
CREATE INDEX IF NOT EXISTS idx_quiz_content_created 
  ON public.quiz_content(created_at DESC);

-- =====================================================
-- QUIZ QUESTIONS INDEXES
-- =====================================================

-- Index for quiz content lookup (most common query)
CREATE INDEX IF NOT EXISTS idx_questions_quiz_content 
  ON public.questions(content_id);

-- Composite index for quiz content + ordering
CREATE INDEX IF NOT EXISTS idx_questions_quiz_order 
  ON public.questions(content_id, points DESC);

-- =====================================================
-- QUIZ OPTIONS INDEXES
-- =====================================================

-- Index for question lookup (join with questions)
CREATE INDEX IF NOT EXISTS idx_question_options_question 
  ON public.question_options(question_id);

-- Index for finding correct answers quickly
CREATE INDEX IF NOT EXISTS idx_question_options_correct 
  ON public.question_options(question_id, is_correct) 
  WHERE is_correct = true;

-- =====================================================
-- USER WORDS INDEXES
-- =====================================================

-- Index for user's words lookup (most common query)
CREATE INDEX IF NOT EXISTS idx_user_words_user 
  ON public.user_words(user_id);

-- Index for word search (case-insensitive search)
CREATE INDEX IF NOT EXISTS idx_user_words_word_lower 
  ON public.user_words(LOWER(word));

-- Composite index for user + word lookup (checking duplicates)
CREATE INDEX IF NOT EXISTS idx_user_words_user_word 
  ON public.user_words(user_id, word);

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_user_words_category 
  ON public.user_words(category_id);

-- Composite index for user + category
CREATE INDEX IF NOT EXISTS idx_user_words_user_category 
  ON public.user_words(user_id, category_id);

-- Index for source type filtering
CREATE INDEX IF NOT EXISTS idx_user_words_source_type 
  ON public.user_words(source_type);

-- Composite index for source lookup
CREATE INDEX IF NOT EXISTS idx_user_words_source 
  ON public.user_words(source_type, source_id);

-- Index for recent words (ordering by date)
CREATE INDEX IF NOT EXISTS idx_user_words_created 
  ON public.user_words(user_id, created_at DESC);

-- =====================================================
-- USER WORD CATEGORIES INDEXES
-- =====================================================

-- Index for user's categories lookup
CREATE INDEX IF NOT EXISTS idx_user_word_categories_user 
  ON public.user_word_categories(user_id);

-- Composite index for user + order
CREATE INDEX IF NOT EXISTS idx_user_word_categories_user_order 
  ON public.user_word_categories(user_id, order_index);

-- =====================================================
-- USER QUIZ ATTEMPTS INDEXES
-- =====================================================

-- Index for user's attempts lookup
CREATE INDEX IF NOT EXISTS idx_user_question_attempts_user 
  ON public.user_question_attempts(user_id);

-- Index for quiz content lookup
CREATE INDEX IF NOT EXISTS idx_user_question_attempts_quiz 
  ON public.user_question_attempts(content_id);

-- Composite index for user + quiz (finding user's attempts on specific quiz)
CREATE INDEX IF NOT EXISTS idx_user_question_attempts_user_quiz 
  ON public.user_question_attempts(user_id, content_id);

-- Index for recent attempts
CREATE INDEX IF NOT EXISTS idx_user_question_attempts_recent 
  ON public.user_question_attempts(user_id, completed_at DESC);

-- Index for high scores
CREATE INDEX IF NOT EXISTS idx_user_question_attempts_score 
  ON public.user_question_attempts(user_id, percentage DESC);

-- =====================================================
-- PROFILES INDEXES
-- =====================================================

-- Index for email lookup (login, etc.)
CREATE INDEX IF NOT EXISTS idx_profiles_email 
  ON public.profiles(email);

-- Index for premium users
CREATE INDEX IF NOT EXISTS idx_profiles_premium 
  ON public.profiles(is_premium) 
  WHERE is_premium = true;

-- Index for premium expiration check
CREATE INDEX IF NOT EXISTS idx_profiles_premium_expires 
  ON public.profiles(premium_expires_at) 
  WHERE is_premium = true AND premium_expires_at IS NOT NULL;

-- Index for Lemon Squeezy customer lookup
CREATE INDEX IF NOT EXISTS idx_profiles_lemon_customer 
  ON public.profiles(lemon_squeezy_customer_id) 
  WHERE lemon_squeezy_customer_id IS NOT NULL;

-- Index for Lemon Squeezy subscription lookup
CREATE INDEX IF NOT EXISTS idx_profiles_lemon_subscription 
  ON public.profiles(lemon_squeezy_subscription_id) 
  WHERE lemon_squeezy_subscription_id IS NOT NULL;

-- =====================================================
-- USER STATISTICS INDEXES
-- =====================================================

-- Primary key already provides index on user_id
-- Add index for last activity date for reporting
CREATE INDEX IF NOT EXISTS idx_user_statistics_last_activity 
  ON public.user_statistics(last_activity_date DESC);

-- Index for most studied level statistics
CREATE INDEX IF NOT EXISTS idx_user_statistics_level 
  ON public.user_statistics(most_studied_level);

-- =====================================================
-- ADDITIONAL PERFORMANCE OPTIMIZATIONS
-- =====================================================

-- Enable autovacuum for all tables (if not already enabled)
-- This helps maintain index performance

-- Analyze tables to update statistics (run after seeding data)
-- ANALYZE public.grammar_topics;
-- ANALYZE public.listening_content;
-- ANALYZE public.reading_content;
-- ANALYZE public.quiz_content;
-- ANALYZE public.questions;
-- ANALYZE public.question_options;
-- ANALYZE public.user_words;
-- ANALYZE public.user_word_categories;
-- ANALYZE public.user_question_attempts;
-- ANALYZE public.profiles;
-- ANALYZE public.user_statistics;

-- =====================================================
-- INDEX USAGE MONITORING QUERIES (for future optimization)
-- =====================================================

-- To check if indexes are being used:
-- SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
-- FROM pg_stat_user_indexes
-- WHERE schemaname = 'public'
-- ORDER BY idx_scan DESC;

-- To find unused indexes:
-- SELECT schemaname, tablename, indexname
-- FROM pg_stat_user_indexes
-- WHERE idx_scan = 0 AND schemaname = 'public';

-- To check table sizes and index sizes:
-- SELECT
--   schemaname,
--   tablename,
--   pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
--   pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
--   pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS indexes_size
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
