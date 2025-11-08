-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.grammar_topics (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  category text NOT NULL CHECK (category = ANY (ARRAY['tenses'::text, 'modals'::text, 'conditionals'::text, 'passive-voice'::text, 'reported-speech'::text, 'articles'::text, 'prepositions'::text, 'phrasal-verbs'::text, 'tricky-topics'::text])),
  title text NOT NULL,
  explanation text NOT NULL,
  examples jsonb NOT NULL,
  mini_text text NOT NULL,
  order_index integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  quiz_content_id uuid,
  CONSTRAINT grammar_topics_pkey PRIMARY KEY (id),
  CONSTRAINT grammar_topics_quiz_content_id_fkey FOREIGN KEY (quiz_content_id) REFERENCES public.quiz_content(id)
);
CREATE TABLE public.listening_content (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  level text NOT NULL CHECK (level = ANY (ARRAY['A1'::text, 'A2'::text, 'B1'::text, 'B2'::text, 'C1'::text])),
  description text,
  audio_urls text NOT NULL,
  duration_seconds integer,
  transcript text,
  is_premium boolean DEFAULT false,
  order_index integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  quiz_content_id uuid,
  CONSTRAINT listening_content_pkey PRIMARY KEY (id),
  CONSTRAINT listening_content_quiz_content_id_fkey FOREIGN KEY (quiz_content_id) REFERENCES public.quiz_content(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text NOT NULL UNIQUE,
  full_name text,
  is_premium boolean DEFAULT false,
  premium_expires_at timestamp with time zone,
  lemon_squeezy_customer_id text,
  lemon_squeezy_subscription_id text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.quiz_content (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  content_id uuid NOT NULL,
  title text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quiz_content_pkey PRIMARY KEY (id)
);
CREATE TABLE public.quiz_options (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  question_id uuid NOT NULL,
  text text NOT NULL,
  is_correct boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quiz_options_pkey PRIMARY KEY (id),
  CONSTRAINT quiz_options_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.quiz_questions(id)
);
CREATE TABLE public.quiz_questions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  quiz_content_id uuid NOT NULL,
  question_text text NOT NULL,
  points integer DEFAULT 10,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quiz_questions_pkey PRIMARY KEY (id),
  CONSTRAINT quiz_questions_quiz_content_id_fkey FOREIGN KEY (quiz_content_id) REFERENCES public.quiz_content(id)
);
CREATE TABLE public.reading_content (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  level text NOT NULL CHECK (level = ANY (ARRAY['A1'::text, 'A2'::text, 'B1'::text, 'B2'::text, 'C1'::text])),
  content text NOT NULL,
  audio_urls text NOT NULL,
  is_premium boolean DEFAULT false,
  order_index integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  quiz_content_id uuid,
  CONSTRAINT reading_content_pkey PRIMARY KEY (id),
  CONSTRAINT reading_content_quiz_content_id_fkey FOREIGN KEY (quiz_content_id) REFERENCES public.quiz_content(id)
);
CREATE TABLE public.user_quiz_attempts (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  quiz_content_id uuid NOT NULL,
  answers jsonb NOT NULL,
  total_score integer NOT NULL,
  max_score integer NOT NULL,
  percentage numeric,
  completed_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_quiz_attempts_pkey PRIMARY KEY (id),
  CONSTRAINT user_quiz_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT user_quiz_attempts_quiz_content_id_fkey FOREIGN KEY (quiz_content_id) REFERENCES public.quiz_content(id)
);
CREATE TABLE public.user_statistics (
  user_id uuid NOT NULL,
  total_reading_completed integer DEFAULT 0,
  total_listening_completed integer DEFAULT 0,
  total_quizzes_completed integer DEFAULT 0,
  total_quiz_score integer DEFAULT 0,
  total_words_added integer DEFAULT 0,
  flashcard_practice_count integer DEFAULT 0,
  total_usage_days integer DEFAULT 0,
  last_activity_date date,
  most_studied_level text,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_statistics_pkey PRIMARY KEY (user_id),
  CONSTRAINT user_statistics_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.user_word_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  color text DEFAULT '#3b82f6'::text,
  icon text DEFAULT 'folder'::text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_word_categories_pkey PRIMARY KEY (id),
  CONSTRAINT word_categories_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.user_words (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  word text NOT NULL,
  source_type text,
  source_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  category_id uuid,
  description text,
  example_sentences text[],
  CONSTRAINT user_words_pkey PRIMARY KEY (id),
  CONSTRAINT user_words_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT user_words_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.user_word_categories(id)
);