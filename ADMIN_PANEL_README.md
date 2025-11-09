# Admin Panel

A comprehensive admin panel for managing the Learn Quiz English platform.

## Features

### 📊 Dashboard
- Overview of platform statistics
- Total users and premium users count
- Content statistics (reading, listening, grammar)
- Total quizzes taken

### 👥 User Management
- View all registered users
- See premium status and expiration dates
- Search users by email or name
- User actions (toggle premium, view details, delete)

### 📚 Grammar Topics Management
- Add new grammar topics with examples
- Organize by categories (tenses, modals, conditionals, etc.)
- Set order for topic display
- Include explanations and practice texts

### 📖 Reading Content Management
- Add reading texts for different CEFR levels (A1-C1)
- Set premium/free access
- Include audio URLs
- Manage content ordering

### 🎧 Listening Content Management
- Add audio lessons with transcripts
- Set duration and level
- Premium content control
- Organize by difficulty

## Access

The admin panel is accessible at `/admin` route.

**Important:** Currently, there is no authentication middleware. You should add admin role checking before deploying to production.

## Routes

- `/admin` - Dashboard
- `/admin/users` - User management
- `/admin/grammar` - Grammar topics
- `/admin/reading` - Reading content
- `/admin/listening` - Listening content
- `/admin/premium` - Premium settings (to be implemented)
- `/admin/settings` - General settings (to be implemented)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **The admin panel uses existing database tables:**
   - `profiles` - User data
   - `grammar_topics` - Grammar content
   - `reading_content` - Reading texts
   - `listening_content` - Audio lessons
   - `user_question_attempts` - Quiz statistics

3. **Navigate to admin panel:**
   ```
   http://localhost:3000/admin
   ```

## TODO: Security Implementation

⚠️ **IMPORTANT**: Before production, implement proper admin authentication:

1. **Add admin role to profiles table:**
   ```sql
   ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
   ```

2. **Create admin middleware:**
   ```typescript
   // src/middleware/admin.ts
   export async function adminMiddleware(req: NextRequest) {
     const { user } = await getUser();
     
     if (!user) {
       return NextResponse.redirect('/login');
     }
     
     const { data: profile } = await supabase
       .from('profiles')
       .select('is_admin')
       .eq('id', user.id)
       .single();
     
     if (!profile?.is_admin) {
       return NextResponse.redirect('/');
     }
     
     return NextResponse.next();
   }
   ```

3. **Apply middleware to admin routes in `middleware.ts`:**
   ```typescript
   export const config = {
     matcher: '/admin/:path*',
   };
   ```

## Adding Features

### Add a new admin page:

1. Create page in `src/app/(admin)/admin/[feature]/page.tsx`
2. Add navigation item in `src/features/admin/components/AdminSidebar.tsx`
3. Create corresponding hooks in `src/features/admin/hooks/`
4. Add any dialogs/components in `src/features/admin/components/`

### Example structure:
```
src/
├── app/
│   └── (admin)/
│       └── admin/
│           └── your-feature/
│               └── page.tsx
├── features/
│   └── admin/
│       ├── components/
│       │   └── YourFeatureDialog.tsx
│       └── hooks/
│           └── useYourFeature.ts
```

## Components Used

- Shadcn/UI components (Card, Button, Table, etc.)
- Radix UI primitives
- TanStack Query for data fetching
- Sonner for toast notifications

## Notes

- All mutations show success/error toasts
- Tables are sortable and searchable where applicable
- Forms include validation
- Data is automatically refreshed after mutations
- Responsive design for mobile/tablet admin use

## Future Enhancements

- [ ] Add quiz question management
- [ ] Bulk import/export functionality
- [ ] Content preview before publishing
- [ ] Analytics and reporting
- [ ] Activity logs
- [ ] Email notifications to users
- [ ] Premium plan management
- [ ] Content scheduling
