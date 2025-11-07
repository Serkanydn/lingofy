-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Create enum for levels
create type content_level as enum ('A1', 'A2', 'B1', 'B2', 'C1');
create type content_type as enum ('reading', 'listening', 'grammar');

-- Reading Content Table
create table if not exists reading_content (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  level content_level not null,
  content text not null,
  audio_urls text[] not null default '{}',
  is_premium boolean not null default false,
  order_index integer not null,
  created_at timestamptz not null default now()
);

-- Quiz Questions Table
create table if not exists quiz_questions (
  id uuid primary key default uuid_generate_v4(),
  content_type content_type not null,
  content_id uuid not null,my 
  question_text text not null,
  options text[] not null,
  correct_answer integer not null,
  explanation text,
  order_index integer not null,
  created_at timestamptz not null default now(),
  constraint check_content_type check (
    (content_type = 'reading' AND EXISTS (SELECT 1 FROM reading_content WHERE id = content_id)) OR
    (content_type = 'listening' AND EXISTS (SELECT 1 FROM listening_content WHERE id = content_id)) OR
    (content_type = 'grammar' AND EXISTS (SELECT 1 FROM grammar_topics WHERE id = content_id))
  )
);

-- Create indexes for quiz questions
create index if not exists idx_quiz_questions_content_id on quiz_questions(content_id);
create index if not exists idx_quiz_questions_content_type on quiz_questions(content_type);

-- Grammar Topics Table
create table if not exists grammar_topics (
  id uuid primary key default uuid_generate_v4(),
  category text not null,
  title text not null,
  explanation text not null,
  examples text[] not null,
  mini_text text not null,
  order_index integer not null,
  created_at timestamptz not null default now()
);

-- Listening Content Table
create table if not exists listening_content (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  level content_level not null,
  description text not null,
  audio_urls text[] not null,
  duration_seconds integer not null,
  transcript text not null,
  is_premium boolean not null default false,
  order_index integer not null,
  created_at timestamptz not null default now()
);

-- Create indexes for frequently accessed columns
create index if not exists idx_reading_content_level on reading_content(level);
create index if not exists idx_listening_content_level on listening_content(level);
create index if not exists idx_grammar_topics_category on grammar_topics(category);