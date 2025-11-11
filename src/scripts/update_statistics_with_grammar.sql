-- =====================================================
-- COMPLETE STATISTICS SYSTEM WITH GRAMMAR SUPPORT
-- Run this to update your statistics tracking
-- =====================================================

-- Add grammar column if it doesn't exist
ALTER TABLE public.user_statistics
ADD COLUMN IF NOT EXISTS total_grammar_completed integer DEFAULT 0;

-- Update the content completion tracking to include grammar
CREATE OR REPLACE FUNCTION public.increment_content_completed()
RETURNS TRIGGER AS $$
DECLARE
  is_reading boolean;
  is_listening boolean;
  is_grammar boolean;
BEGIN
  -- Check if content_id is a reading content
  SELECT EXISTS(
    SELECT 1 FROM public.reading_content WHERE id = NEW.content_id::uuid
  ) INTO is_reading;
  
  -- Check if content_id is a listening content
  SELECT EXISTS(
    SELECT 1 FROM public.listening_content WHERE id = NEW.content_id::uuid
  ) INTO is_listening;
  
  -- Check if content_id is a grammar topic
  SELECT EXISTS(
    SELECT 1 FROM public.grammar_topics WHERE id = NEW.content_id::uuid
  ) INTO is_grammar;
  
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
  ELSIF is_grammar THEN
    INSERT INTO public.user_statistics (
      user_id, 
      total_grammar_completed,
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
      total_grammar_completed = user_statistics.total_grammar_completed + 1,
      last_activity_date = CURRENT_DATE,
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger (it already exists, just ensuring it's using the updated function)
DROP TRIGGER IF EXISTS trigger_content_completed ON public.user_question_attempts;
CREATE TRIGGER trigger_content_completed
  AFTER INSERT ON public.user_question_attempts
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_content_completed();

-- Test the grammar tracking
-- Run this to verify it's working:
-- SELECT * FROM user_statistics WHERE user_id = auth.uid();
