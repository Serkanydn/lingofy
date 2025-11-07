-- Add categories feature to user_words

-- Create word_categories table
create table if not exists word_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text default '#3b82f6',
  icon text default 'folder',
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add category_id to user_words table
alter table user_words 
  add column if not exists category_id uuid references word_categories(id) on delete set null;

-- Create indexes
create index if not exists idx_word_categories_user_id on word_categories(user_id);
create index if not exists idx_user_words_category_id on user_words(category_id);

-- Enable RLS on word_categories
alter table word_categories enable row level security;

-- Create policies for word_categories
create policy "Users can view their own categories"
  on word_categories for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own categories"
  on word_categories for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own categories"
  on word_categories for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own categories"
  on word_categories for delete
  to authenticated
  using (auth.uid() = user_id);

-- Insert default categories for existing users (optional)
-- You can run this manually if you want to add default categories
-- insert into word_categories (user_id, name, color, icon, order_index)
-- select 
--   id as user_id,
--   'General' as name,
--   '#3b82f6' as color,
--   'folder' as icon,
--   0 as order_index
-- from auth.users
-- where not exists (
--   select 1 from word_categories where word_categories.user_id = auth.users.id
-- );
