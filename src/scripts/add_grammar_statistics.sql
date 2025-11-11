-- Add grammar completed column to user_statistics table
ALTER TABLE public.user_statistics
ADD COLUMN IF NOT EXISTS total_grammar_completed integer DEFAULT 0;

-- Update the increment_content_completed function to detect grammar
CREATE OR REPLACE FUNCTION public.increment_content_completed()
RETURNS TRIGGER AS $$
DECLARE
  is_reading boolean;
  is_listening boolean;
  is_grammar boolean;
BEGIN
  -- Check if content_id is a reading content
  SELECT EXISTS(
    SELECT 1 FROM public.reading_content WHERE id = NEW.content_id
  ) INTO is_reading;
  
  -- Check if content_id is a listening content
  SELECT EXISTS(
    SELECT 1 FROM public.listening_content WHERE id = NEW.content_id
  ) INTO is_listening;
  
  -- Check if content_id is a grammar topic
  SELECT EXISTS(
    SELECT 1 FROM public.grammar_topics WHERE id = NEW.content_id
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
