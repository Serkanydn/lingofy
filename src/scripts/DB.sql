-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.app_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  site_name text NOT NULL DEFAULT 'Learn Quiz English'::text,
  site_description text NOT NULL DEFAULT 'Master English through interactive quizzes'::text,
  contact_email text NOT NULL DEFAULT 'contact@learnquiz.com'::text,
  support_email text NOT NULL DEFAULT 'support@learnquiz.com'::text,
  max_free_quizzes_per_day integer NOT NULL DEFAULT 5 CHECK (max_free_quizzes_per_day >= 0 AND max_free_quizzes_per_day <= 100),
  enable_new_registrations boolean NOT NULL DEFAULT true,
  maintenance_mode boolean NOT NULL DEFAULT false,
  maintenance_message text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT app_settings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.audio_assets (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  storage_url text NOT NULL UNIQUE,
  original_filename text,
  file_size_bytes integer,
  duration_seconds integer,
  format text CHECK (format = ANY (ARRAY['mp3'::text, 'wav'::text, 'ogg'::text, 'm4a'::text])),
  bitrate integer,
  sample_rate integer,
  content_type text CHECK (content_type = ANY (ARRAY['reading'::text, 'listening'::text, 'pronunciation'::text, 'general'::text])),
  language text DEFAULT 'en'::text,
  storage_provider text DEFAULT 'cloudflare_r2'::text,
  storage_bucket text,
  storage_path text,
  cdn_url text,
  is_optimized boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT audio_assets_pkey PRIMARY KEY (id)
);
CREATE TABLE public.grammar_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon text DEFAULT '📚'::text,
  color text DEFAULT '#3b82f6'::text,
  order integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT grammar_categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.grammar_topics (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  explanation text NOT NULL,
  examples jsonb NOT NULL,
  mini_text text NOT NULL,
  order integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  is_premium boolean DEFAULT false,
  category_id uuid,
  level text,
  CONSTRAINT grammar_topics_pkey PRIMARY KEY (id),
  CONSTRAINT grammar_topics_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.grammar_categories(id)
);
CREATE TABLE public.listening_content (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  level text NOT NULL CHECK (level = ANY (ARRAY['A1'::text, 'A2'::text, 'B1'::text, 'B2'::text, 'C1'::text])),
  duration_seconds integer,
  transcript text,
  is_premium boolean DEFAULT false,
  order integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  audio_asset_id uuid,
  CONSTRAINT listening_content_pkey PRIMARY KEY (id),
  CONSTRAINT listening_content_audio_asset_id_fkey FOREIGN KEY (audio_asset_id) REFERENCES public.audio_assets(id)
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
  is_admin boolean DEFAULT false,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.question_options (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  question_id uuid NOT NULL,
  text text NOT NULL,
  is_correct boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT question_options_pkey PRIMARY KEY (id),
  CONSTRAINT quiz_options_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id)
);
CREATE TABLE public.questions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  content_id uuid NOT NULL,
  text text NOT NULL,
  points integer DEFAULT 10,
  created_at timestamp with time zone DEFAULT now(),
  order smallint,
  type USER-DEFINED,
  CONSTRAINT questions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.reading_content (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  level text NOT NULL CHECK (level = ANY (ARRAY['A1'::text, 'A2'::text, 'B1'::text, 'B2'::text, 'C1'::text])),
  content text NOT NULL,
  is_premium boolean DEFAULT false,
  order integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  audio_asset_id uuid,
  CONSTRAINT reading_content_pkey PRIMARY KEY (id),
  CONSTRAINT reading_content_audio_asset_id_fkey FOREIGN KEY (audio_asset_id) REFERENCES public.audio_assets(id)
);
CREATE TABLE public.user_question_attempts (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  content_id uuid NOT NULL,
  answers jsonb NOT NULL,
  score integer NOT NULL,
  max_score integer NOT NULL,
  percentage numeric,
  completed_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_question_attempts_pkey PRIMARY KEY (id),
  CONSTRAINT user_quiz_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
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
  total_grammar_completed integer DEFAULT 0,
  CONSTRAINT user_statistics_pkey PRIMARY KEY (user_id),
  CONSTRAINT user_statistics_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.user_word_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  color text DEFAULT '#3b82f6'::text,
  icon text DEFAULT 'folder'::text,
  order integer NOT NULL DEFAULT 0,
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
  example_sentences ARRAY,
  CONSTRAINT user_words_pkey PRIMARY KEY (id),
  CONSTRAINT user_words_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT user_words_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.user_word_categories(id)
);