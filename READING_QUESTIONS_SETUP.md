# Reading Questions Setup Guide

## Database Migration Required

To enable reading questions functionality, you need to run the migration script to add the necessary database tables and columns.

## Steps to Apply Migration

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file: `src/scripts/add_reading_questions_support.sql`
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **Run** to execute

### Option 2: Using Supabase CLI

```bash
# From your project root
npx supabase db push --file src/scripts/add_reading_questions_support.sql
```

### Option 3: Using psql

```bash
psql -h <your-db-host> -U postgres -d postgres -f src/scripts/add_reading_questions_support.sql
```

## What This Migration Does

1. ✅ Creates `quiz_content` table (if missing)
2. ✅ Adds `content_id` column to `reading_content` table
3. ✅ Creates `question_type` enum (multiple_choice, fill_blank, true_false)
4. ✅ Adds `type` and `order_index` columns to `questions` table
5. ✅ Sets up RLS policies for admin-only write access
6. ✅ Creates performance indexes

## Verify Migration

After running the migration, verify it worked:

```sql
-- Check if quiz_content table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'quiz_content'
);

-- Check if content_id column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'reading_content' 
AND column_name = 'content_id';

-- Check if question type enum exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'questions' 
AND column_name = 'type';
```

## Features Now Available

Once migration is complete, you can:

- ✅ Add questions when creating reading content
- ✅ Edit questions for existing reading content
- ✅ Use 3 question types:
  - **Multiple Choice**: 2+ options with one correct
  - **Fill in the Blank**: Text input answer
  - **True/False**: Binary choice
- ✅ Reorder questions with drag handles
- ✅ Assign points per question
- ✅ View question count in admin table

## Troubleshooting

### Error: "table quiz_content does not exist"
→ Run the migration script in Supabase SQL Editor

### Error: "column content_id does not exist"
→ The migration script handles this automatically

### Error: "type question_type already exists"
→ This is safe to ignore, means the enum was already created

## Need Help?

If you encounter any issues, check:
1. You're logged in as an admin user
2. The migration script ran without errors
3. Your Supabase project has the latest schema
