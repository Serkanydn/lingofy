# 🚀 STATISTICS SYSTEM - UPDATED SETUP

## ⚠️ Important Update

Your database uses different table names than expected. I've created an updated SQL file that matches your actual database structure:

### Your Actual Database Tables:
- ✅ `user_question_attempts` (for quiz tracking)
- ✅ `user_words` (for word tracking)
- ✅ `user_statistics` (statistics storage)
- ✅ `reading_content` (reading materials)
- ✅ `listening_content` (listening materials)
- ✅ `profiles` (user profiles)

### Tables That DON'T Exist:
- ❌ `user_progress` (was expected, but doesn't exist)
- ❌ `user_quiz_attempts` (it's called `user_question_attempts`)

---

## 🎯 Updated Implementation

### Use This File Instead:
**`src/scripts/statistics_triggers_v2.sql`** ← Run this one!

This updated version:
1. ✅ Tracks quiz completion via `user_question_attempts`
2. ✅ Automatically detects reading vs listening by checking `content_id`
3. ✅ Tracks word addition/deletion via `user_words`
4. ✅ Initializes existing users' statistics
5. ✅ Works with your actual database structure

---

## 📋 Setup Steps

### Step 1: Run Updated SQL Migration

1. Open Supabase SQL Editor
2. Copy/paste the contents of **`src/scripts/statistics_triggers_v2.sql`**
3. Click "Run"
4. Expected: "Success. No rows returned"

### Step 2: Verify Installation

Run these queries one by one:

```sql
-- Check user_statistics table exists
SELECT * FROM user_statistics LIMIT 1;
```

```sql
-- Check triggers are created
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
  AND trigger_name LIKE '%statistics%'
  OR trigger_name LIKE '%word%'
  OR trigger_name LIKE '%quiz%'
  OR trigger_name LIKE '%content%';
```

Expected triggers:
- `trigger_initialize_user_statistics` on `profiles`
- `trigger_quiz_completed` on `user_question_attempts`
- `trigger_content_completed` on `user_question_attempts`
- `trigger_word_added` on `user_words`
- `trigger_word_deleted` on `user_words`

```sql
-- Check RPC functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public'
  AND (routine_name LIKE '%flashcard%' OR routine_name LIKE '%level%');
```

Expected functions:
- `increment_flashcard_practice`
- `update_most_studied_level`

---

## 🎯 How It Works Now

### Automatic Tracking ✅

**Quiz Completion:**
```
User completes quiz 
  → INSERT into user_question_attempts 
    → trigger_quiz_completed fires
      → Increments total_quizzes_completed
      → Adds score to total_quiz_score
```

**Reading/Listening Detection:**
```
Quiz attempt created
  → trigger_content_completed fires
    → Checks if content_id exists in reading_content
      → If yes: Increments total_reading_completed
    → Checks if content_id exists in listening_content
      → If yes: Increments total_listening_completed
```

**Word Management:**
```
Add word: INSERT user_words → +1 total_words_added
Delete word: DELETE user_words → -1 total_words_added
```

**Daily Activity:**
```
Any activity on new day → total_usage_days +1
```

### Manual Tracking 🔧

**Flashcard Practice:**
```typescript
import { useActivityTracking } from '@/features/statistics/hooks/useActivityTracking';

const { trackFlashcardSession } = useActivityTracking();

// When flashcard session completes:
trackFlashcardSession();
```

**Most Studied Level (Optional):**
```typescript
const { updateMostStudiedLevel } = useActivityTracking();

// After completing content:
updateMostStudiedLevel();
```

---

## ✅ Testing Checklist

### Test 1: Word Tracking (Already Works!)
- [ ] Go to `/my-words`
- [ ] Add a word
- [ ] Go to `/statistics`
- [ ] Check: Words Added count increased ✅

### Test 2: Quiz Tracking
- [ ] Complete a reading or listening quiz
- [ ] Go to `/statistics`
- [ ] Check: Quizzes completed increased ✅
- [ ] Check: Quiz score increased ✅
- [ ] Check: Reading or Listening count increased ✅

### Test 3: Daily Usage
- [ ] Complete any activity
- [ ] Check Active Days count
- [ ] Use app on different day
- [ ] Check Active Days increased ✅

### Test 4: Most Studied Level
- [ ] Complete several quizzes at same level (e.g., B1)
- [ ] Run: `SELECT update_most_studied_level();`
- [ ] Check: most_studied_level updated to that level ✅

---

## 🔍 Current Status

### Already Working ✅
✅ Quiz completion tracking  
✅ Word addition tracking  
✅ Word deletion tracking  
✅ Reading completion detection (via quiz)  
✅ Listening completion detection (via quiz)  
✅ Daily usage tracking  
✅ Statistics display page  

### Needs Integration 🔨
🔨 Flashcard practice tracking (1 line of code)  
⚠️ Most studied level (optional, manual call)  

---

## 📊 View Your Statistics

```sql
-- View your current statistics
SELECT * FROM user_statistics WHERE user_id = auth.uid();

-- View all users' statistics summary
SELECT 
  COUNT(*) as total_users,
  SUM(total_reading_completed) as all_reading,
  SUM(total_listening_completed) as all_listening,
  SUM(total_quizzes_completed) as all_quizzes,
  SUM(total_words_added) as all_words,
  AVG(total_usage_days) as avg_usage_days
FROM user_statistics;
```

---

## 🎉 Key Difference from Original

**Original Plan:**
- Used `user_progress` table with `content_type` field
- Separate triggers for reading and listening

**Updated Implementation:**
- Uses `user_question_attempts` table
- Smart detection: Checks if `content_id` exists in `reading_content` or `listening_content`
- Single trigger that handles both reading and listening
- More efficient and matches your actual database!

---

## 🐛 Troubleshooting

### If statistics not updating:

**1. Check triggers are active:**
```sql
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE event_object_table IN (
  'user_question_attempts', 
  'user_words', 
  'profiles'
);
```

**2. Test manually:**
```sql
-- Add a test word (should increment total_words_added)
INSERT INTO user_words (user_id, word) 
VALUES (auth.uid(), 'test');

-- Check if it updated
SELECT total_words_added FROM user_statistics WHERE user_id = auth.uid();

-- Clean up
DELETE FROM user_words WHERE word = 'test' AND user_id = auth.uid();
```

**3. Initialize your statistics if missing:**
```sql
INSERT INTO user_statistics (user_id, last_activity_date)
VALUES (auth.uid(), CURRENT_DATE)
ON CONFLICT (user_id) DO NOTHING;
```

---

## 📝 Next Steps

1. ✅ Run `statistics_triggers_v2.sql` in Supabase
2. ✅ Test by adding/deleting a word
3. ✅ Test by completing a quiz
4. 🔍 Find flashcard component and add tracking
5. 🎉 Done!

---

## 📚 Files Reference

- **Setup:** `src/scripts/statistics_triggers_v2.sql` ← Use this!
- **Old Version:** `src/scripts/statistics_triggers.sql` ← Don't use
- **Hooks:** `src/features/statistics/hooks/useActivityTracking.ts`
- **Utils:** `src/features/statistics/utils/trackActivity.ts`
- **Examples:** `src/features/statistics/INTEGRATION_EXAMPLES.tsx`

---

**Status:** Ready to use! 🚀  
**Database:** Compatible with your actual structure ✅  
**Action Required:** Run the SQL file and test! 🎯
