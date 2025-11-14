# Settings Feature

## Overview
Admin settings management feature for configuring application-wide settings with Zustand state management.

## Structure
Following the feature-based architecture from `docs/02-architecture/01-feature-based-structure.md`:

```
settings/
├── types/
│   ├── settings.types.ts    # Domain types (AppSettings, UpdateSettingsInput)
│   └── validation.ts         # Zod schemas (updateSettingsSchema)
├── services/
│   └── settingsService.ts    # API layer (get, update)
├── hooks/
│   └── useSettings.ts        # React Query hooks
├── store/
│   └── settingsStore.ts      # Zustand store for global state
├── components/
│   └── SettingsForm.tsx      # Settings form component
├── pages/
│   └── SettingsPageClient.tsx # Page component
└── index.ts                  # Feature exports
```

## State Management

### Zustand Store
The settings feature uses Zustand for global state management, making settings accessible throughout the entire application without prop drilling.

**Store Location**: `store/settingsStore.ts`

**Features**:
- Global settings state
- Automatic initialization on app load
- Getter methods with default fallbacks
- Loading and error states

**Usage**:
```typescript
import { useSettingsStore } from '@/features/admin/features/settings';

// In any component
const siteName = useSettingsStore((state) => state.getSiteName());
const isMaintenanceMode = useSettingsStore((state) => state.getIsMaintenanceMode());
```

### Available Getters
- `getSiteName()` - Returns site name (default: "Learn Quiz English")
- `getSiteDescription()` - Returns site description
- `getContactEmail()` - Returns contact email
- `getSupportEmail()` - Returns support email
- `getMaxFreeQuizzes()` - Returns max free quizzes per day
- `getIsRegistrationEnabled()` - Returns registration status
- `getIsMaintenanceMode()` - Returns maintenance mode status
- `getMaintenanceMessage()` - Returns maintenance message

### Initialization
Settings are automatically initialized when the app loads via the `SettingsInitializer` component in the root layout.

## Integration Points

### 1. Landing Page (`/`)
- Displays `siteName` in hero section
- Displays `siteDescription` in hero subtitle
- Shows maintenance page when `maintenanceMode` is enabled (for non-admins)

### 2. Main Page (`/main`)
- Displays `siteName` in welcome message
- Displays `siteDescription` below title

### 3. Registration Page (`/register`)
- Checks `isRegistrationEnabled` setting
- Shows disabled message if registration is turned off
- Provides links to home and login pages

### 4. Maintenance Mode
- When enabled, non-admin users see a maintenance page
- Displays custom `maintenanceMessage` if provided
- Admins can still access the site normally

## Database Setup

### 1. Run the migration script
Execute the SQL script to create the `app_settings` table:

```sql
-- File: src/scripts/create_app_settings_table.sql
```

This creates:
- `app_settings` table with all necessary columns
- RLS policies (read for authenticated, write for admins only)
- Indexes for performance
- Triggers for auto-updating `updated_at`
- Initial default settings row

### 2. Verify the table
After running the migration, verify the table exists:

```sql
SELECT * FROM app_settings;
```

### 3. Update Supabase Types (Optional)
To remove TypeScript warnings, regenerate Supabase types:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/shared/types/database.types.ts
```

## Features

### Settings Categories

#### 1. General Settings
- **Site Name**: Application name (3-100 characters)
- **Site Description**: Application description (10-500 characters)

#### 2. Contact Settings
- **Contact Email**: Public contact email
- **Support Email**: Technical support email

#### 3. Feature Settings
- **Max Free Quizzes Per Day**: Limit for non-premium users (0-100)
- **Enable New Registrations**: Toggle user registration

#### 4. Maintenance Mode
- **Maintenance Mode**: Site accessibility control
- **Maintenance Message**: Custom message during maintenance

## Usage

### Accessing the Settings Page
Navigate to `/admin/settings` in the admin panel.

### Updating Settings
1. Modify any field in the form
2. Click "Save Settings" button
3. Changes take effect immediately

### Default Values
If no settings exist, the following defaults are used:
- Site Name: "Learn Quiz English"
- Site Description: "Master English through interactive quizzes"
- Contact Email: "contact@learnquiz.com"
- Support Email: "support@learnquiz.com"
- Max Free Quizzes: 5 per day
- Registrations: Enabled
- Maintenance Mode: Disabled

## Components

### SettingsForm
React Hook Form with Zod validation featuring:
- Four card sections for settings categories
- Conditional fields (maintenance message only shows when enabled)
- Form state management with isDirty tracking
- Real-time validation
- Loading states

### SettingsPageClient
Client-side page component with:
- Loading state
- No settings warning
- Form submission handling
- Information box with important notes

## Hooks

### useSettings()
Fetches application settings using React Query.

```typescript
const { data: settings, isLoading } = useSettings();
```

### useUpdateSettings()
Mutation hook for updating settings.

```typescript
const updateSettings = useUpdateSettings();
await updateSettings.mutateAsync(data);
```

## Security

### RLS Policies
- **Read**: All authenticated users can read settings
- **Write**: Only admins can update settings
- **Insert**: Only admins can create initial settings

### Validation
- Email format validation
- String length constraints
- Number range validation (0-100 for quiz limits)
- Required field enforcement

## Documentation Compliance

This feature follows all standards from `main-navigation.md`:

✅ **Feature-Based Structure** - Self-contained with types/services/hooks/components  
✅ **Service Layer Pattern** - Clean separation of API logic  
✅ **Custom Hook Pattern** - React Query integration  
✅ **Form Pattern** - React Hook Form + Zod validation  
✅ **Type Safety** - Strict TypeScript with proper type definitions  
✅ **Naming Conventions** - Consistent file and variable naming  
✅ **Error Handling** - Proper error states and toast notifications  

## Route Integration
- Route: `/admin/settings`
- File: `src/app/(admin)/admin/settings/page.tsx`
- Sidebar: Already integrated with ⚙️ icon

## Notes
- The `app_settings` table should only contain one row (global settings)
- Maintenance mode prevents regular users from accessing the site
- Free quiz limits only apply to non-premium users
- Settings changes are immediate and affect all users
