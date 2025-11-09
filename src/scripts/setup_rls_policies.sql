-- Row Level Security Policies for Learn Quiz English

-- Enable RLS on all tables
alter table reading_content enable row level security;
alter table listening_content enable row level security;
alter table grammar_topics enable row level security;
alter table questions enable row level security;
alter table question_options enable row level security;
alter table quiz_content enable row level security;
alter table user_question_attempts enable row level security;
alter table profiles enable row level security;
alter table user_words enable row level security;


-- Create indexes
create index if not exists idx_user_words_user_id on user_words(user_id);
create index if not exists idx_user_words_word on user_words(word);

-- Public read policies (anyone can read content)
create policy "Public can read reading content"
  on reading_content for select
  using (true);

create policy "Public can read listening content"
  on listening_content for select
  using (true);

create policy "Public can read grammar topics"
  on grammar_topics for select
  using (true);

create policy "Public can read quiz questions"
  on questions for select
  using (true);

create policy "Public can read quiz options"
  on question_options for select
  using (true);

create policy "Public can read quiz content"
  on quiz_content for select
  using (true);

-- User-specific policies for profiles
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- User-specific policies for user_words
create policy "Users can view their own words"
  on user_words for select
  using (auth.uid() = user_id);

create policy "Users can insert their own words"
  on user_words for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own words"
  on user_words for update
  using (auth.uid() = user_id);

create policy "Users can delete their own words"
  on user_words for delete
  using (auth.uid() = user_id);

-- User-specific policies for quiz attempts
create policy "Users can view their own quiz attempts"
  on user_question_attempts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own quiz attempts"
  on user_question_attempts for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own quiz attempts"
  on user_question_attempts for select
  using (auth.uid() = user_id);
