# Grammar Statistics Update

## ✅ Changes Made

### 1. Database Schema Update
**File:** `src/scripts/add_grammar_statistics.sql`

Added `total_grammar_completed` column to track grammar exercises.

**To apply:**
```sql
-- Run this in Supabase SQL Editor
ALTER TABLE public.user_statistics
ADD COLUMN IF NOT EXISTS total_grammar_completed integer DEFAULT 0;
```

### 2. Updated Statistics Page
**File:** `src/app/(main)/statistics/page.tsx`

**Changes:**
- ❌ Removed "Quizzes Completed" card (replaced with Grammar)
- ✅ Added "Grammar Completed" card with BookType icon (orange)
- ✅ Updated Total Activities calculation: `reading + listening + grammar` (not including quizzes)
- ✅ Changed icon from Trophy to BookType

**New Layout:**
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  📚 Reading │ │ 🎧 Listening│ │ 📖 Grammar  │ │  📝 Words   │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

### 3. Updated Trigger Function
**File:** `src/scripts/add_grammar_statistics.sql`

Updated `increment_content_completed()` to detect grammar topics by:
1. Checking if questions belong to `grammar_topics` table
2. Incrementing `total_grammar_completed` when grammar quiz is completed

### 4. Updated TypeScript Interfaces
**File:** `src/features/statistics/utils/trackActivity.ts`

Added `total_grammar_completed` to:
- `UserStatistics` interface
- `ManualTrackingParams` type

---

## 🎯 How It Works Now

When a user completes a quiz:

1. **Reading Quiz** → `content_id` in `reading_content` → +1 `total_reading_completed`
2. **Listening Quiz** → `content_id` in `listening_content` → +1 `total_listening_completed`
3. **Grammar Quiz** → Questions from `grammar_topics` → +1 `total_grammar_completed`

All are automatically tracked via the `trigger_content_completed` trigger!

---

## 📋 Setup Checklist

- [ ] Run `add_grammar_statistics.sql` in Supabase to add column
- [ ] Statistics page now shows Grammar instead of Quizzes ✅
- [ ] Total Activities = Reading + Listening + Grammar ✅
- [ ] TypeScript types updated ✅

---

## 📊 Statistics Display

**Main Cards (4):**
1. 📚 Reading Completed (blue)
2. 🎧 Listening Completed (purple)  
3. 📖 Grammar Completed (orange) ← NEW!
4. 📝 Words Learned (green)

**Additional Stats (3):**
1. 📈 Total Activities (reading + listening + grammar)
2. 📅 Active Days
3. 🎯 Success Rate (from quiz scores)

**Quiz Details:**
- Quiz Performance card still shows quiz scores
- Recent Quiz Results still shows quiz history
- But "Quizzes Completed" is removed from main stats

This makes sense because quizzes are the method of completing reading/listening/grammar exercises!

---

## 🚀 Next Step

Run this in Supabase SQL Editor:

```sql
-- Add grammar column
ALTER TABLE public.user_statistics
ADD COLUMN IF NOT EXISTS total_grammar_completed integer DEFAULT 0;

-- Update trigger function to detect grammar
-- Copy from: src/scripts/add_grammar_statistics.sql
```

Done! 🎉
