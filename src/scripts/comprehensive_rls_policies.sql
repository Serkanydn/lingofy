-- =====================================================
-- Comprehensive Row Level Security Policies
-- For Learn Quiz English Application
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.grammar_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listening_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_word_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_statistics ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PUBLIC READ POLICIES (Content accessible to all)
-- =====================================================

-- Grammar Topics - Public Read
CREATE POLICY "Anyone can read grammar topics"
  ON public.grammar_topics
  FOR SELECT
  USING (true);

-- Listening Content - Public Read (with premium check in application)
CREATE POLICY "Anyone can read listening content"
  ON public.listening_content
  FOR SELECT
  USING (true);

-- Reading Content - Public Read (with premium check in application)
CREATE POLICY "Anyone can read reading content"
  ON public.reading_content
  FOR SELECT
  USING (true);

-- Quiz Content - Public Read
CREATE POLICY "Anyone can read quiz content"
  ON public.quiz_content
  FOR SELECT
  USING (true);

-- Quiz Questions - Public Read
CREATE POLICY "Anyone can read quiz questions"
  ON public.quiz_questions
  FOR SELECT
  USING (true);

-- Quiz Options - Public Read
CREATE POLICY "Anyone can read quiz options"
  ON public.quiz_options
  FOR SELECT
  USING (true);

-- =====================================================
-- PROFILES POLICIES (User own data)
-- =====================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- USER WORDS POLICIES
-- =====================================================

-- Users can view their own words
CREATE POLICY "Users can view own words"
  ON public.user_words
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own words
CREATE POLICY "Users can insert own words"
  ON public.user_words
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own words
CREATE POLICY "Users can update own words"
  ON public.user_words
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own words
CREATE POLICY "Users can delete own words"
  ON public.user_words
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- USER WORD CATEGORIES POLICIES
-- =====================================================

-- Users can view their own categories
CREATE POLICY "Users can view own word categories"
  ON public.user_word_categories
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own categories
CREATE POLICY "Users can insert own word categories"
  ON public.user_word_categories
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own categories
CREATE POLICY "Users can update own word categories"
  ON public.user_word_categories
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own categories
CREATE POLICY "Users can delete own word categories"
  ON public.user_word_categories
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- USER QUIZ ATTEMPTS POLICIES
-- =====================================================

-- Users can view their own quiz attempts
CREATE POLICY "Users can view own quiz attempts"
  ON public.user_quiz_attempts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own quiz attempts
CREATE POLICY "Users can insert own quiz attempts"
  ON public.user_quiz_attempts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own quiz attempts
CREATE POLICY "Users can update own quiz attempts"
  ON public.user_quiz_attempts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- USER STATISTICS POLICIES
-- =====================================================

-- Users can view their own statistics
CREATE POLICY "Users can view own statistics"
  ON public.user_statistics
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own statistics
CREATE POLICY "Users can insert own statistics"
  ON public.user_statistics
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own statistics
CREATE POLICY "Users can update own statistics"
  ON public.user_statistics
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- ADMIN POLICIES (Optional - for future admin panel)
-- =====================================================

-- Note: Create admin role and policies when admin panel is needed
-- Example structure:
-- CREATE POLICY "Admins can manage all content"
--   ON public.grammar_topics
--   FOR ALL
--   USING (auth.jwt() ->> 'role' = 'admin');
