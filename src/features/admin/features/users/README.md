# Users Feature

## Overview

The Users feature provides admin functionality for managing user accounts, premium status, and subscription details. This feature follows all project documentation standards from `docs/main-navigation.md`.

## Structure

```
users/
├── components/          # UI components
│   ├── UserDetailsDialog.tsx   # View user details
│   ├── UserForm.tsx            # Edit user form (React Hook Form + Zod)
│   └── index.ts
├── hooks/              # Custom React hooks
│   ├── useUsers.ts             # User management hooks
│   └── index.ts
├── pages/              # Page components
│   ├── UsersPageClient.tsx     # Main users management page
│   └── index.ts
├── services/           # API communication layer
│   ├── userService.ts          # User CRUD operations
│   └── index.ts
├── types/              # TypeScript definitions
│   ├── user.types.ts           # Domain types
│   ├── validation.ts           # Zod schemas
│   └── index.ts
├── index.ts            # Feature exports
└── README.md           # This file
```

## Documentation Compliance

### ✅ Feature-Based Structure
Following: `docs/02-architecture/01-feature-based-structure.md`

- **Components Layer**: UI components using hooks (no business logic)
- **Hooks Layer**: Business logic and state management with React Query
- **Services Layer**: All API calls to Supabase
- **Types Layer**: TypeScript interfaces and Zod validation schemas

### ✅ Component Architecture
Following: `docs/03-code-standards/02-component-architecture.md`

- **Client Components**: All interactive components marked with `'use client'`
- **Props Interfaces**: TypeScript interfaces for all component props
- **Collapsible Form**: Inline form above table (grammar page pattern)

### ✅ Design Patterns
Following: `docs/03-code-standards/01-design-patterns.md`

- **Service Layer Pattern**: `userService` class for API operations
- **Custom Hook Pattern**: `useUsers`, `useUser`, `useUpdateUser` hooks
- **Form Pattern**: React Hook Form + Zod validation

### ✅ Naming Conventions
Following: `docs/03-code-standards/03-naming-conventions.md`

- **Files**: PascalCase for components, camelCase for hooks/services
- **Types**: PascalCase interfaces (no `I` prefix)
- **Hooks**: `use[Feature][Action]` pattern
- **Services**: `[feature]Service` pattern
- **Variables**: camelCase, boolean prefixes (`is`, `has`)

### ✅ TypeScript Practices
Following: `docs/04-typescript/typescript-practices.md`

- **Strict Mode**: No `any` types
- **Type Inference**: Using `z.infer<typeof schema>`
- **Proper Exports**: Type exports from types layer

### ✅ Validation
Following: `docs/04-typescript/validation.md`

- **Zod Schemas**: `updateUserSchema` for form validation
- **React Hook Form**: Integration with `zodResolver`
- **Type Safety**: Automatic type inference from schemas

## Components

### UserForm

Inline collapsible form for editing user details.

**Props:**
```typescript
interface UserFormProps {
  isOpen: boolean;
  onToggle: () => void;
  onSubmit: (data: UpdateUserFormData) => Promise<void>;
  initialData?: Partial<UpdateUserFormData>;
  isLoading?: boolean;
  mode: "edit";
  userEmail?: string;
}
```

**Features:**
- React Hook Form with Zod validation
- Collapsible design matching grammar page pattern
- Premium status toggle
- Conditional premium expiration date field
- Date formatting for input and submission
- Proper error handling and display

**Usage:**
```tsx
<UserForm
  isOpen={showForm}
  onToggle={() => setShowForm(!showForm)}
  onSubmit={handleSubmit}
  initialData={{
    full_name: user.full_name || undefined,
    is_premium: user.is_premium,
    premium_expires_at: user.premium_expires_at,
  }}
  isLoading={isUpdating}
  mode="edit"
  userEmail={user.email}
/>
```

### UserDetailsDialog

Modal dialog for viewing detailed user information.

## Hooks

### useUsers()

Fetches all users with pagination and sorting.

```typescript
const { data: users, isLoading, error } = useUsers();
```

### useUser(id)

Fetches a single user by ID.

```typescript
const { data: user, isLoading } = useUser(userId);
```

### useUpdateUser()

Mutation hook for updating user details.

```typescript
const updateUser = useUpdateUser();

updateUser.mutate({
  id: userId,
  data: {
    full_name: "John Doe",
    is_premium: true,
    premium_expires_at: "2025-12-31T23:59:59.000Z",
  },
});
```

## Services

### userService

Service class for user-related API operations.

**Methods:**
- `getAll(): Promise<User[]>` - Fetch all users
- `getById(id: string): Promise<User>` - Fetch user by ID
- `update(id: string, input: UpdateUserInput): Promise<User>` - Update user

**Example:**
```typescript
import { userService } from '../services';

// Get all users
const users = await userService.getAll();

// Update user
const updatedUser = await userService.update('user-id', {
  is_premium: true,
  premium_expires_at: new Date('2025-12-31').toISOString(),
});
```

## Types

### User

```typescript
interface User {
  id: string;
  email: string;
  full_name: string | null;
  is_premium: boolean;
  premium_expires_at: string | null;
  created_at: string;
  lemon_squeezy_customer_id: string | null;
  lemon_squeezy_subscription_id: string | null;
}
```

### UpdateUserInput

```typescript
interface UpdateUserInput {
  full_name?: string;
  is_premium?: boolean;
  premium_expires_at?: string | null;
}
```

### UpdateUserFormData

Validated form data type inferred from Zod schema.

```typescript
const updateUserSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  is_premium: z.boolean().optional(),
  premium_expires_at: z.string().datetime().nullable().optional(),
});

type UpdateUserFormData = z.infer<typeof updateUserSchema>;
```

## Best Practices

### DO ✅

- Use `useUpdateUser` hook in components
- Validate forms with Zod schemas
- Use proper TypeScript types
- Handle loading and error states
- Show toast notifications for user feedback
- Format dates consistently (ISO 8601)

### DON'T ❌

- Call Supabase directly in components
- Skip form validation
- Use `any` types
- Ignore error handling
- Store dates in inconsistent formats

## Related Documentation

- [Feature-Based Structure](../../../../../docs/02-architecture/01-feature-based-structure.md)
- [Component Architecture](../../../../../docs/03-code-standards/02-component-architecture.md)
- [Design Patterns](../../../../../docs/03-code-standards/01-design-patterns.md)
- [Validation with Zod](../../../../../docs/04-typescript/validation.md)
- [Naming Conventions](../../../../../docs/03-code-standards/03-naming-conventions.md)

## Future Enhancements

- [ ] Add user creation functionality
- [ ] Add user deletion with confirmation
- [ ] Add bulk operations (export, bulk premium assignment)
- [ ] Add user activity tracking
- [ ] Add subscription history view
- [ ] Add email notification triggers
