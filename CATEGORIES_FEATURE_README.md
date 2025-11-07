# Word Categories Feature - Implementation Guide

## Overview
This feature adds folder-like category organization to the "My Words" page, allowing users to organize their vocabulary into custom categories.

## What's Been Created

### 1. Database Migration
- **File**: `src/scripts/add_word_categories.sql`
- Creates `word_categories` table with RLS policies
- Adds `category_id` foreign key to `user_words` table
- Includes indexes for performance

### 2. Service Layer
- **File**: `src/features/words/services/categoryService.ts`
- CRUD operations for categories
- Category assignment to words
- Category reordering functionality

### 3. React Hooks
- **File**: `src/features/words/hooks/useWords.ts`
- `useWordCategories()` - Fetch user's categories
- `useCreateCategory()` - Create new category
- `useUpdateCategory()` - Update category details
- `useDeleteCategory()` - Delete category (moves words to uncategorized)
- `useAssignWordToCategory()` - Assign/remove word from category

### 4. Updated UI Components
- **File**: `src/app/(main)/my-words/page-with-categories.tsx` - New My Words page with categories
- **File**: `src/features/words/components/WordCard.tsx` - Updated with category selector

## Installation Steps

### Step 1: Run Database Migration

**Option A: Using Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `src/scripts/add_word_categories.sql`
4. Paste and run the SQL

**Option B: Using Supabase CLI**
```powershell
supabase db push
```

### Step 2: Update Database Types (TypeScript)

The code uses type assertions (`as any`) to handle missing database types. To fix this properly:

**Option A: Generate types from Supabase**
```powershell
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/shared/types/database.types.ts
```

**Option B: Manually add to your database types**
Add to `src/shared/types/database.types.ts`:
```typescript
export interface Database {
  public: {
    Tables: {
      // ... existing tables
      word_categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          icon: string | null;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color: string;
          icon?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          color?: string;
          icon?: string | null;
          order_index?: number;
          updated_at?: string;
        };
      };
      user_words: {
        Row: {
          // ... existing fields
          category_id: string | null;
        };
        // ... Update Insert and Update types similarly
      };
    };
  };
}
```

### Step 3: Replace the My Words Page

**Option A: Replace existing file**
```powershell
Remove-Item "src\app\(main)\my-words\page.tsx"
Rename-Item "src\app\(main)\my-words\page-with-categories.tsx" "page.tsx"
```

**Option B: Test first, then replace**
1. Keep both files
2. Temporarily change the route in your app
3. Test the new page thoroughly
4. Then do the replacement

## Features Included

### User Features
1. **Category Sidebar**
   - View all categories
   - See word count per category
   - Filter words by category
   - "All Words" and "Uncategorized" views

2. **Category Management**
   - Create categories with custom names and colors
   - Visual color picker
   - Delete categories (words move to uncategorized)
   - Edit category details

3. **Word Organization**
   - Assign words to categories from word cards
   - Dropdown selector with color indicators
   - Move words between categories easily
   - Search works across all categories

4. **Flashcard Practice**
   - Practice filtered words by category
   - Or practice all words

### Technical Features
- Row Level Security (RLS) policies ensure data privacy
- Optimistic updates for smooth UX
- React Query for efficient data fetching
- Proper cleanup when deleting categories

## Database Schema

### `word_categories` Table
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key to auth.users)
- name (text, not null)
- color (text, not null, default '#3b82f6')
- icon (text, nullable)
- order_index (integer, default 0)
- created_at (timestamp)
- updated_at (timestamp)
```

### `user_words` Table Update
```sql
- category_id (uuid, foreign key to word_categories)
  * Nullable - words can exist without a category
  * ON DELETE SET NULL - removes category assignment when category deleted
```

## Security (RLS Policies)

All category operations are restricted to the category owner:
- Users can only view their own categories
- Users can only create categories for themselves
- Users can only update/delete their own categories
- Category assignments validated against user_id

## Known Issues & Limitations

1. **TypeScript Errors**: The service file has type assertion warnings because the database types don't include the new table. This is cosmetic and doesn't affect runtime behavior.

2. **Category Reordering**: The UI doesn't currently include drag-and-drop reordering, but the backend supports it via `reorderCategories()`.

3. **Category Icons**: The schema supports icons, but the UI only uses colors currently.

## Future Enhancements

- [ ] Drag-and-drop category reordering
- [ ] Icon picker for categories
- [ ] Bulk word operations (move multiple words at once)
- [ ] Category templates (suggested categories for common topics)
- [ ] Category statistics (learning progress per category)
- [ ] Export/import categories with words

## Troubleshooting

### Categories not showing up
- Ensure the SQL migration ran successfully
- Check browser console for errors
- Verify RLS policies are active in Supabase

### TypeScript errors
- Update database types as described in Step 2
- Or ignore with `// @ts-ignore` comments if types are too complex

### Words not filtering by category
- Check that `category_id` was added to `user_words` table
- Verify foreign key constraint exists
- Clear React Query cache: `queryClient.clear()`

## Testing Checklist

- [ ] Run database migration
- [ ] Create a new category
- [ ] Assign words to category
- [ ] Filter by category
- [ ] Move word between categories
- [ ] Delete category (check words become uncategorized)
- [ ] Search within filtered category
- [ ] Practice flashcards from specific category
- [ ] Create multiple categories with different colors
- [ ] Check "All Words" and "Uncategorized" views

## Questions or Issues?

If you encounter any issues during implementation, check:
1. Supabase logs for database errors
2. Browser console for frontend errors
3. Network tab for failed API requests
4. RLS policies in Supabase dashboard
