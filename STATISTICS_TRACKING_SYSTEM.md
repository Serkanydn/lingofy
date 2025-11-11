# Statistics Tracking System

Comprehensive automatic statistics tracking for all user activities in the Learn Quiz English app.

## 🎯 Overview

This system automatically tracks and updates user statistics whenever they:
- ✅ Complete reading content
- ✅ Complete listening content  
- ✅ Complete quizzes
- ✅ Add words to their collection
- ✅ Delete words
- ✅ Practice with flashcards
- ✅ Track daily usage and streaks

## 📊 Tracked Statistics

| Statistic | Type | Description |
|-----------|------|-------------|
| `total_reading_completed` | integer | Total reading exercises completed |
| `total_listening_completed` | integer | Total listening exercises completed |
| `total_quizzes_completed` | integer | Total quizzes taken |
| `total_quiz_score` | integer | Sum of all quiz scores |
| `total_words_added` | integer | Total words in user's collection |
| `flashcard_practice_count` | integer | Number of flashcard practice sessions |
| `total_usage_days` | integer | Total unique days user was active |
| `last_activity_date` | date | Most recent activity date |
| `most_studied_level` | text | Level with most completions |

## 🔧 Implementation

### 1. Database Triggers (Automatic)

Most statistics are tracked **automatically** via PostgreSQL triggers. No code changes needed in your app!

**Reading Completion:**
```sql
-- Automatically increments when user_progress row inserted with:
-- content_type = 'reading' AND completed = true
```

**Listening Completion:**
```sql
-- Automatically increments when user_progress row inserted with:
-- content_type = 'listening' AND completed = true
```

**Quiz Completion:**
```sql
-- Automatically increments when user_quiz_attempts row inserted
-- Also adds quiz score to total_quiz_score
```

**Word Addition:**
```sql
-- Automatically increments when user_words row inserted
```

**Word Deletion:**
```sql
-- Automatically decrements when user_words row deleted
```

**Usage Days:**
```sql
-- Automatically increments total_usage_days when last_activity_date changes to new day
```

### 2. Manual Tracking (For Special Cases)

Some activities require manual tracking using React hooks:

#### Flashcard Practice

```typescript
import { useActivityTracking } from '@/features/statistics/hooks/useActivityTracking';

function FlashcardComponent() {
  const { trackFlashcardSession } = useActivityTracking();
  
  const handlePracticeComplete = async () => {
    // Your flashcard logic...
    
    // Track the session
    trackFlashcardSession();
  };
  
  return <button onClick={handlePracticeComplete}>Complete Practice</button>;
}
```

#### Most Studied Level Update

```typescript
import { useActivityTracking } from '@/features/statistics/hooks/useActivityTracking';

function ContentCompletionComponent() {
  const { updateMostStudiedLevel } = useActivityTracking();
  
  const handleComplete = async () => {
    // Complete the content...
    
    // Update most studied level
    updateMostStudiedLevel();
  };
}
```

#### Manual Fallback Tracking

If triggers aren't working, use manual tracking:

```typescript
import { useActivityTracking } from '@/features/statistics/hooks/useActivityTracking';

function QuizComponent() {
  const { trackQuiz } = useActivityTracking();
  const user = useUser();
  
  const handleQuizSubmit = async (score: number) => {
    // Your quiz logic...
    
    // Manual tracking (only if trigger isn't working)
    trackQuiz(user.id, score);
  };
}
```

## 🚀 Setup Instructions

### Step 1: Run SQL Migration

Execute the triggers script in your Supabase SQL Editor:

```bash
# The script is located at:
src/scripts/statistics_triggers.sql
```

This will create:
- ✅ All database triggers
- ✅ Helper functions (increment_flashcard_practice, update_most_studied_level)
- ✅ Automatic user_statistics initialization

### Step 2: Verify Triggers

Check that triggers are active:

```sql
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
  AND event_object_table IN (
    'user_progress', 
    'user_quiz_attempts', 
    'user_words'
  );
```

Expected results:
- `trigger_reading_completed` on `user_progress`
- `trigger_listening_completed` on `user_progress`
- `trigger_quiz_completed` on `user_quiz_attempts`
- `trigger_word_added` on `user_words`
- `trigger_word_deleted` on `user_words`

### Step 3: Import Tracking Hooks

The tracking utilities are already created:
- ✅ `/src/features/statistics/utils/trackActivity.ts`
- ✅ `/src/features/statistics/hooks/useActivityTracking.ts`

No additional setup needed!

## 📋 Integration Checklist

### Automatic (Already Working) ✅
- [x] Reading completion tracking
- [x] Listening completion tracking
- [x] Quiz completion tracking
- [x] Word addition tracking
- [x] Word deletion tracking
- [x] Daily usage tracking

### Manual Integration Needed 🔨

#### 1. Flashcard Practice
**Location:** Find your flashcard practice completion handler

```typescript
// Example integration
import { useActivityTracking } from '@/features/statistics/hooks/useActivityTracking';

// In your flashcard component:
const { trackFlashcardSession } = useActivityTracking();

// When practice session completes:
const handleSessionComplete = () => {
  trackFlashcardSession();
};
```

#### 2. Most Studied Level
**Location:** Add to reading/listening/quiz completion handlers

```typescript
import { useActivityTracking } from '@/features/statistics/hooks/useActivityTracking';

const { updateMostStudiedLevel } = useActivityTracking();

// After any content completion:
const handleContentComplete = async () => {
  // Existing completion logic...
  
  // Update most studied level
  updateMostStudiedLevel();
};
```

## 🧪 Testing

### Test Statistics Updates

```typescript
// 1. Complete a reading exercise
// Expected: total_reading_completed +1

// 2. Complete a listening exercise  
// Expected: total_listening_completed +1

// 3. Complete a quiz with score
// Expected: total_quizzes_completed +1, total_quiz_score +score

// 4. Add a word
// Expected: total_words_added +1

// 5. Delete a word
// Expected: total_words_added -1

// 6. Do any activity on a new day
// Expected: total_usage_days +1, last_activity_date updated
```

### View Statistics

```typescript
import { useStatistics } from '@/features/statistics/hooks/useStatistics';

function StatsDisplay() {
  const { data: stats } = useStatistics();
  
  console.log('User Statistics:', stats);
  // Shows all tracked statistics
}
```

## 🔍 Troubleshooting

### Statistics not updating?

1. **Check triggers are active:**
```sql
SELECT * FROM pg_trigger WHERE tgname LIKE '%statistics%';
```

2. **Check RLS policies:**
```sql
SELECT * FROM pg_policies WHERE tablename = 'user_statistics';
```

3. **Use manual tracking as fallback:**
```typescript
const { trackReading, trackListening, trackQuiz } = useActivityTracking();
// Call these manually if triggers fail
```

### Check activity in real-time:

```sql
SELECT * FROM user_statistics WHERE user_id = '<your-user-id>';
```

## 📊 Statistics Display

Statistics are automatically displayed on the `/statistics` page with:
- 📚 Reading completions (blue card)
- 🎧 Listening completions (purple card)
- 🎯 Quiz completions (orange card)
- 📝 Words added (green card)
- 📈 Total activities (amber card)
- 📅 Active days (pink card)
- 🎯 Success rate (indigo card)

All statistics update in real-time when activities are completed!

## 🎨 Design System

Statistics cards follow the claymorphism design:
- Rounded corners: `rounded-2xl` / `rounded-3xl`
- Soft shadows: `shadow-[0_8px_30px]`
- Icon badges: `w-12 h-12 rounded-2xl` with gradient backgrounds
- Smooth transitions: `duration-300`
- Color coding by activity type

## 🔐 Security

All database functions use `SECURITY DEFINER` and:
- ✅ Verify user authentication via `auth.uid()`
- ✅ Enforce RLS policies
- ✅ Prevent unauthorized updates
- ✅ Handle errors gracefully

## 📝 Notes

- **Usage days calculation:** Automatically increments when `last_activity_date` changes
- **Most studied level:** Calculated from user_progress table by counting completions per level
- **Quiz success rate:** Calculated as `(total_quiz_score / (total_quizzes_completed * 10)) * 100`
- **Total activities:** Sum of reading + listening + quizzes completed

## 🚀 Future Enhancements

Potential additions:
- Streak tracking (consecutive days)
- Weekly/monthly reports
- Achievement badges
- Leaderboards
- Study time tracking
- Category-specific statistics
- Level progress tracking
