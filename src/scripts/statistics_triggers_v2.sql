-- =====================================================
-- STATISTICS TRACKING SYSTEM (SIMPLIFIED)
-- Updated for actual database structure
-- =====================================================

-- Function to initialize user statistics
CREATE OR REPLACE FUNCTION public.initialize_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_statistics (user_id, last_activity_date)
  VALUES (NEW.id, CURRENT_DATE)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Create statistics record when new profile is created
DROP TRIGGER IF EXISTS trigger_initialize_user_statistics ON public.profiles;
CREATE TRIGGER trigger_initialize_user_statistics
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.initialize_user_statistics();

-- =====================================================
-- QUIZ COMPLETION TRACKING
-- Tracks when user completes reading or listening quizzes
-- =====================================================

CREATE OR REPLACE FUNCTION public.increment_quiz_completed()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_statistics (
    user_id, 
    total_quizzes_completed, 
    total_quiz_score,
    last_activity_date,
    updated_at
  )
  VALUES (
    NEW.user_id, 
    1, 
    NEW.score,
    CURRENT_DATE,
    NOW()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    total_quizzes_completed = user_statistics.total_quizzes_completed + 1,
    total_quiz_score = user_statistics.total_quiz_score + NEW.score,
    last_activity_date = CURRENT_DATE,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for quiz completion (using actual table: user_question_attempts)
DROP TRIGGER IF EXISTS trigger_quiz_completed ON public.user_question_attempts;
CREATE TRIGGER trigger_quiz_completed
  AFTER INSERT ON public.user_question_attempts
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_quiz_completed();

-- =====================================================
-- WORD ADDITION TRACKING
-- =====================================================

CREATE OR REPLACE FUNCTION public.increment_words_added()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_statistics (
    user_id, 
    total_words_added, 
    last_activity_date,
    updated_at
  )
  VALUES (
    NEW.user_id, 
    1, 
    CURRENT_DATE,
    NOW()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    total_words_added = user_statistics.total_words_added + 1,
    last_activity_date = CURRENT_DATE,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for word addition
DROP TRIGGER IF EXISTS trigger_word_added ON public.user_words;
CREATE TRIGGER trigger_word_added
  AFTER INSERT ON public.user_words
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_words_added();

-- =====================================================
-- WORD DELETION TRACKING (Decrement)
-- =====================================================

CREATE OR REPLACE FUNCTION public.decrement_words_added()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_statistics
  SET 
    total_words_added = GREATEST(0, total_words_added - 1),
    updated_at = NOW()
  WHERE user_id = OLD.user_id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for word deletion
DROP TRIGGER IF EXISTS trigger_word_deleted ON public.user_words;
CREATE TRIGGER trigger_word_deleted
  AFTER DELETE ON public.user_words
  FOR EACH ROW
  EXECUTE FUNCTION public.decrement_words_added();

-- =====================================================
-- USAGE DAYS CALCULATION
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_usage_days()
RETURNS TRIGGER AS $$
DECLARE
  last_date date;
  current_days integer;
BEGIN
  -- Get current last activity date and usage days
  SELECT last_activity_date, total_usage_days 
  INTO last_date, current_days
  FROM public.user_statistics
  WHERE user_id = NEW.user_id;
  
  -- If it's a new day, increment usage days
  IF last_date IS NULL OR last_date < CURRENT_DATE THEN
    UPDATE public.user_statistics
    SET 
      total_usage_days = COALESCE(current_days, 0) + 1,
      last_activity_date = CURRENT_DATE,
      updated_at = NOW()
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FLASHCARD PRACTICE TRACKING
-- =====================================================

CREATE OR REPLACE FUNCTION public.increment_flashcard_practice()
RETURNS void AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN;
  END IF;
  
  INSERT INTO public.user_statistics (
    user_id, 
    flashcard_practice_count, 
    last_activity_date,
    updated_at
  )
  VALUES (
    v_user_id, 
    1, 
    CURRENT_DATE,
    NOW()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    flashcard_practice_count = user_statistics.flashcard_practice_count + 1,
    last_activity_date = CURRENT_DATE,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- READING/LISTENING COMPLETION TRACKING
-- Track by detecting content type from content_id
-- =====================================================

CREATE OR REPLACE FUNCTION public.increment_content_completed()
RETURNS TRIGGER AS $$
DECLARE
  is_reading boolean;
  is_listening boolean;
BEGIN
  -- Check if content_id is a reading content
  SELECT EXISTS(
    SELECT 1 FROM public.reading_content WHERE id = NEW.content_id
  ) INTO is_reading;
  
  -- Check if content_id is a listening content
  SELECT EXISTS(
    SELECT 1 FROM public.listening_content WHERE id = NEW.content_id
  ) INTO is_listening;
  
  -- Update statistics based on content type
  IF is_reading THEN
    INSERT INTO public.user_statistics (
      user_id, 
      total_reading_completed,
      last_activity_date,
      updated_at
    )
    VALUES (
      NEW.user_id, 
      1,
      CURRENT_DATE,
      NOW()
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET
      total_reading_completed = user_statistics.total_reading_completed + 1,
      last_activity_date = CURRENT_DATE,
      updated_at = NOW();
  ELSIF is_listening THEN
    INSERT INTO public.user_statistics (
      user_id, 
      total_listening_completed,
      last_activity_date,
      updated_at
    )
    VALUES (
      NEW.user_id, 
      1,
      CURRENT_DATE,
      NOW()
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET
      total_listening_completed = user_statistics.total_listening_completed + 1,
      last_activity_date = CURRENT_DATE,
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to track reading/listening completion via quiz attempts
DROP TRIGGER IF EXISTS trigger_content_completed ON public.user_question_attempts;
CREATE TRIGGER trigger_content_completed
  AFTER INSERT ON public.user_question_attempts
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_content_completed();

-- =====================================================
-- MOST STUDIED LEVEL TRACKING
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_most_studied_level()
RETURNS void AS $$
DECLARE
  v_user_id uuid;
  v_most_level text;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN;
  END IF;
  
  -- Find the most studied level from reading and listening content via quiz attempts
  WITH level_counts AS (
    SELECT rc.level, COUNT(*) as count
    FROM public.user_question_attempts uqa
    JOIN public.reading_content rc ON uqa.content_id = rc.id
    WHERE uqa.user_id = v_user_id
    GROUP BY rc.level
    
    UNION ALL
    
    SELECT lc.level, COUNT(*) as count
    FROM public.user_question_attempts uqa
    JOIN public.listening_content lc ON uqa.content_id = lc.id
    WHERE uqa.user_id = v_user_id
    GROUP BY lc.level
  )
  SELECT level INTO v_most_level
  FROM level_counts
  GROUP BY level
  ORDER BY SUM(count) DESC
  LIMIT 1;
  
  IF v_most_level IS NOT NULL THEN
    UPDATE public.user_statistics
    SET 
      most_studied_level = v_most_level,
      updated_at = NOW()
    WHERE user_id = v_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

GRANT EXECUTE ON FUNCTION public.increment_flashcard_practice() TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_most_studied_level() TO authenticated;

-- =====================================================
-- INITIALIZE EXISTING USERS
-- =====================================================

-- Create statistics records for existing users who don't have one
INSERT INTO public.user_statistics (user_id, last_activity_date)
SELECT id, CURRENT_DATE
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_statistics WHERE user_id = p.id
)
ON CONFLICT (user_id) DO NOTHING;
