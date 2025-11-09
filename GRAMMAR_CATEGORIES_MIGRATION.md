# Grammar Categories Migration Guide

This guide explains how to migrate from enum-based grammar categories to a database-driven category system.

## Overview

Previously, grammar categories were defined as a TypeScript enum. Now they are stored in a `grammar_categories` table in the database, allowing for dynamic category management through the admin panel.

## Changes Made

### 1. Database Schema
- **New Table**: `grammar_categories` with fields:
  - `id` (uuid, primary key)
  - `name` (text)
  - `slug` (text, unique)
  - `description` (text, nullable)
  - `icon` (text, default: '📚')
  - `color` (text, default: '#3b82f6')
  - `order_index` (integer)
  - `is_active` (boolean)
  - `created_at` and `updated_at` (timestamps)

- **Modified Table**: `grammar_topics` 
  - Added `category_id` (uuid, foreign key to `grammar_categories`)
  - Kept old `category` field for backward compatibility during migration

### 2. Type System Updates
- Removed `GrammarCategory` enum from `src/shared/types/common.types.ts`
- Created new interface `GrammarCategory` in `src/features/grammar/types/category.types.ts`
- Updated all grammar-related types to use `category_id` instead of `category` string

### 3. Services
- **New**: `GrammarCategoryService` for CRUD operations on categories
- **Updated**: `GrammarService` to fetch categories with grammar topics using joins

### 4. Admin Interface
- **New Page**: `/admin/grammar/categories` for managing grammar categories
- **New Components**:
  - `AddGrammarCategoryDialog` - Create new categories
  - `EditGrammarCategoryDialog` - Edit existing categories
- **Updated Components**:
  - `AddGrammarDialog` - Fetches categories from DB
  - `EditGrammarDialog` - Fetches categories from DB
  - `GrammarAdminPage` - Updated to show category names

### 5. Hooks
- **New**: `useGrammarCategories` hook family for category management
- **Updated**: `useGrammarByCategory` to use `categoryId` instead of category string

## Migration Steps

### Step 1: Run Database Migration

```bash
# Execute the SQL migration in your Supabase SQL Editor
psql -f src/scripts/create_grammar_categories_table.sql
```

Or run it directly in Supabase Dashboard > SQL Editor:
```sql
-- Copy and paste contents of src/scripts/create_grammar_categories_table.sql
```

### Step 2: Seed Initial Categories

```bash
# Install dependencies if needed
npm install

# Run the seed script
npx tsx src/scripts/seed-grammar-categories.ts
```

This will:
1. Create the 9 default grammar categories
2. Link existing grammar topics to the new categories based on their old `category` field

### Step 3: Verify Migration

1. Check the database:
```sql
SELECT * FROM grammar_categories ORDER BY order_index;
SELECT id, title, category, category_id FROM grammar_topics LIMIT 10;
```

2. Test the admin interface:
   - Navigate to `/admin/grammar/categories`
   - Verify all categories are visible
   - Try creating/editing a category
   - Navigate to `/admin/grammar`
   - Verify topics show correct category names

### Step 4: Clean Up (Optional)

After confirming everything works, you can remove the old `category` column:

```sql
-- WARNING: Only run this after confirming all topics have category_id set
ALTER TABLE grammar_topics DROP COLUMN IF EXISTS category;
```

## New Features

### Admin Category Management
- Create, edit, and delete grammar categories
- Toggle category active status
- Customize category icon, color, and description
- Reorder categories

### Dynamic Category Selection
- Grammar topic forms now load categories from the database
- Categories can be added/removed without code changes
- Categories show icons and colors in the UI

## API Changes

### Before
```typescript
// Using enum values
const topics = await grammarService.getRulesByCategory('tenses');
```

### After
```typescript
// Using category ID from database
const categoryId = 'uuid-here';
const topics = await grammarService.getRulesByCategory(categoryId);

// Topics now include category object with full details
topics[0].category // { id, name, slug, icon, color, ... }
```

## Troubleshooting

### Issue: Categories not showing in dropdown
**Solution**: Ensure the seed script ran successfully and categories exist in the database.

### Issue: Existing topics show no category
**Solution**: Run the seed script which automatically links existing topics to categories based on their old `category` field.

### Issue: Type errors after migration
**Solution**: Restart your TypeScript server and clear the build cache:
```bash
rm -rf .next
npm run dev
```

## Rollback Plan

If you need to rollback:

1. Restore the enum in `src/shared/types/common.types.ts`
2. Revert grammar service changes
3. Optionally drop the new table:
```sql
DROP TABLE IF EXISTS grammar_categories CASCADE;
ALTER TABLE grammar_topics DROP COLUMN IF EXISTS category_id;
```

## Notes

- The old `category` text field is kept temporarily for backward compatibility
- All existing functionality continues to work during migration
- RLS policies ensure only authenticated users can manage categories
- Categories are cached on the client side for better performance
