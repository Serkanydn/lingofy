-- First, drop any existing conflicting policies
drop policy if exists "Users can view their own words" on user_words;
drop policy if exists "Users can insert their own words" on user_words;
drop policy if exists "Users can update their own words" on user_words;
drop policy if exists "Users can delete their own words" on user_words;

drop policy if exists "Public can read reading content" on reading_content;
drop policy if exists "Enable read access for all users to reading content" on reading_content;
drop policy if exists "Public can read listening content" on listening_content;
drop policy if exists "Enable read access for all users to listening content" on listening_content;
drop policy if exists "Public can read grammar topics" on grammar_topics;
drop policy if exists "Enable read access for all users to grammar topics" on grammar_topics;
drop policy if exists "Public can read quiz questions" on quiz_questions;
drop policy if exists "Enable read access for all users to quiz questions" on quiz_questions;
drop policy if exists "Public can read quiz options" on quiz_options;
drop policy if exists "Enable read access for all users to quiz options" on quiz_options;
drop policy if exists "Public can read quiz content" on quiz_content;
drop policy if exists "Enable read access for all users to quiz content" on quiz_content;

drop policy if exists "Users can view their own profile" on profiles;
drop policy if exists "Enable read access for users to their own profile" on profiles;
drop policy if exists "Users can update their own profile" on profiles;
drop policy if exists "Enable update access for users to their own profile" on profiles;
drop policy if exists "Users can insert their own profile" on profiles;
drop policy if exists "Enable insert access for users to their own profile" on profiles;

drop policy if exists "Users can view their own quiz attempts" on user_quiz_attempts;
drop policy if exists "Enable read access for users to their own quiz attempts" on user_quiz_attempts;
drop policy if exists "Users can insert their own quiz attempts" on user_quiz_attempts;
drop policy if exists "Enable insert access for users to their own quiz attempts" on user_quiz_attempts;

-- Recreate user_words table with proper structure
drop table if exists user_words cascade;

create table user_words (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  word text not null,
  translation text,
  example_sentence_en text,
  example_sentence_tr text,
  audio_url text,
  source_type text,
  source_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table user_words enable row level security;

-- Create indexes
create index idx_user_words_user_id on user_words(user_id);
create index idx_user_words_word on user_words(word);

-- Create policies for user_words with explicit checks
create policy "Enable read access for users to their own words"
  on user_words for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Enable insert access for users to their own words"
  on user_words for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Enable update access for users to their own words"
  on user_words for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Enable delete access for users to their own words"
  on user_words for delete
  to authenticated
  using (auth.uid() = user_id);

-- Public read policies for content tables
create policy "Enable read access for all users to reading content"
  on reading_content for select
  to authenticated, anon
  using (true);

create policy "Enable read access for all users to listening content"
  on listening_content for select
  to authenticated, anon
  using (true);

create policy "Enable read access for all users to grammar topics"
  on grammar_topics for select
  to authenticated, anon
  using (true);

create policy "Enable read access for all users to quiz questions"
  on quiz_questions for select
  to authenticated, anon
  using (true);

create policy "Enable read access for all users to quiz options"
  on quiz_options for select
  to authenticated, anon
  using (true);

create policy "Enable read access for all users to quiz content"
  on quiz_content for select
  to authenticated, anon
  using (true);

-- Profiles policies
create policy "Enable read access for users to their own profile"
  on profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Enable update access for users to their own profile"
  on profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Enable insert access for users to their own profile"
  on profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- Quiz attempts policies
create policy "Enable read access for users to their own quiz attempts"
  on user_quiz_attempts for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Enable insert access for users to their own quiz attempts"
  on user_quiz_attempts for insert
  to authenticated
  with check (auth.uid() = user_id);
