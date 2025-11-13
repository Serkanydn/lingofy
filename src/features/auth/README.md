# Auth Feature - Login & Register Components

## Overview

The authentication functionality has been refactored following the project's feature-based architecture. All components are now properly organized within the `features/auth` directory, supporting both login and registration flows.

## Directory Structure

```
features/auth/
├── components/
│   ├── AuthBrandingPanel.tsx    # Left panel with branding and features
│   ├── AuthMobileLogo.tsx       # Mobile-only logo display
│   ├── GoogleLoginButton.tsx    # Google OAuth button
│   ├── AuthDivider.tsx          # "Or continue with email" divider
│   ├── LoginForm.tsx            # Email/password login form
│   ├── RegisterForm.tsx         # Email/password registration form
│   ├── AuthFooter.tsx           # Terms and privacy links
│   └── index.ts                 # Component exports
├── hooks/
│   ├── useLogin.ts              # Login logic and handlers
│   ├── useRegister.ts           # Registration logic and handlers
│   └── index.ts                 # Hook exports
├── pages/
│   ├── LoginPageClient.tsx      # Complete login page composition
│   ├── RegisterPageClient.tsx   # Complete register page composition
│   └── index.ts                 # Page exports
├── services/
│   └── authService.ts           # Authentication API calls
├── types/
│   └── validation.ts            # Zod schemas and types
└── store/
```

## Component Breakdown

### 1. **AuthBrandingPanel**
- **Purpose**: Displays branding, features, and quote on desktop
- **Location**: `components/AuthBrandingPanel.tsx`
- **Props**: None
- **Usage**: Server or Client component
- **Responsive**: Hidden on mobile (`lg:hidden`)

### 2. **AuthMobileLogo**
- **Purpose**: Shows app logo on mobile devices
- **Location**: `components/AuthMobileLogo.tsx`
- **Props**: None
- **Usage**: Server or Client component
- **Responsive**: Hidden on desktop (`lg:hidden`)

### 3. **GoogleLoginButton**
- **Purpose**: Google OAuth sign-in button
- **Location**: `components/GoogleLoginButton.tsx`
- **Props**: 
  - `onGoogleLogin: () => void` - Click handler
  - `isLoading?: boolean` - Loading state
- **Usage**: Client component (`'use client'`)

### 4. **AuthDivider**
- **Purpose**: Visual separator with text
- **Location**: `components/AuthDivider.tsx`
- **Props**: None
- **Usage**: Server or Client component

### 5. **LoginForm**
- **Purpose**: Email/password form with React Hook Form & Zod
- **Location**: `components/LoginForm.tsx`
- **Props**: 
  - `onSubmit: (data: LoginInput) => Promise<void>` - Form submit handler
  - `isSubmitting?: boolean` - Submitting state
- **Features**:
  - Email validation
  - Password visibility toggle
  - Forgot password link
  - Loading states
- **Usage**: Client component (`'use client'`)

### 6. **RegisterForm**
- **Purpose**: Registration form with name, email, and password
- **Location**: `components/RegisterForm.tsx`
- **Props**: 
  - `onSubmit: (data: RegisterInput) => Promise<void>` - Form submit handler
  - `isSubmitting?: boolean` - Submitting state
- **Features**:
  - Full name field
  - Email validation
  - Password strength validation
  - Password confirmation
  - Password visibility toggles
  - Loading states
- **Usage**: Client component (`'use client'`)

### 7. **AuthFooter**
- **Purpose**: Terms and privacy policy links
- **Location**: `components/AuthFooter.tsx`
- **Props**: None
- **Usage**: Server or Client component

## Hook Breakdown

### **useLogin**
- **Purpose**: Handles all login logic
- **Location**: `hooks/useLogin.ts`
- **Returns**:
  - `handleEmailLogin: (data: LoginInput) => Promise<void>`
  - `handleGoogleLogin: () => Promise<void>`
- **Features**:
  - Email/password authentication
  - Google OAuth authentication
  - Error handling with toast notifications
  - Navigation after successful login
- **Usage**: Client component hook

### **useRegister**
- **Purpose**: Handles all registration logic
- **Location**: `hooks/useRegister.ts`
- **Returns**:
  - `handleEmailRegister: (data: RegisterInput) => Promise<void>`
  - `handleGoogleRegister: () => Promise<void>`
- **Features**:
  - Email/password registration
  - Google OAuth registration
  - User metadata support (full_name)
  - Error handling with toast notifications
  - Navigation to login page after success
  - Email confirmation notification
- **Usage**: Client component hook

## Page Composition

### **LoginPageClient**
- **Purpose**: Complete login page assembled from components
- **Location**: `pages/LoginPageClient.tsx`
- **Usage**: Client component (`'use client'`)
- **Composition**:
  ```tsx
  <div className="min-h-screen flex">
    <AuthBrandingPanel />
    <div className="flex-1">
      <AuthMobileLogo />
      <Card>
        <GoogleLoginButton />
        <AuthDivider />
        <LoginForm />
        <SignUpLink />
      </Card>
      <AuthFooter />
    </div>
  </div>
  ```

### **RegisterPageClient**
- **Purpose**: Complete registration page assembled from components
- **Location**: `pages/RegisterPageClient.tsx`
- **Usage**: Client component (`'use client'`)
- **Composition**:
  ```tsx
  <div className="min-h-screen flex">
    <AuthBrandingPanel />
    <div className="flex-1">
      <AuthMobileLogo />
      <Card>
        <GoogleLoginButton />
        <AuthDivider />
        <RegisterForm />
        <SignInLink />
      </Card>
      <AuthFooter />
    </div>
  </div>
  ```

## Main Page Routes

### **app/(auth)/login/page.tsx**
```tsx
import { LoginPageClient } from '@/features/auth/pages/LoginPageClient'

export default function LoginPage() {
  return <LoginPageClient />
}
```

### **app/(auth)/register/page.tsx**
```tsx
import { RegisterPageClient } from '@/features/auth/pages/RegisterPageClient'

export default function RegisterPage() {
  return <RegisterPageClient />
}
```

Simple, clean, and follows Next.js App Router conventions.

## Benefits of This Architecture

### ✅ **Separation of Concerns**
- Each component has a single responsibility
- Easy to understand and maintain
- Clear boundaries between UI and logic

### ✅ **Reusability**
- Components can be reused across auth pages (login, register, etc.)
- `AuthBrandingPanel` can be used on register page
- `GoogleLoginButton` can be used anywhere OAuth is needed

### ✅ **Testability**
- Each component can be tested independently
- Hooks can be tested without UI
- Easy to mock dependencies

### ✅ **Type Safety**
- Full TypeScript support
- Zod validation with type inference
- Props are properly typed

### ✅ **Feature Isolation**
- All auth-related code is in `features/auth`
- No cross-feature dependencies
- Easy to locate and modify

### ✅ **Scalability**
- Easy to add new auth methods (GitHub, Twitter, etc.)
- Simple to add new auth pages (register, reset password, etc.)
- Component library grows with feature

## Usage Example

### Adding a Forgot Password Page

1. **Create ForgotPasswordForm component**:
```tsx
// features/auth/components/ForgotPasswordForm.tsx
export function ForgotPasswordForm({ onSubmit }: ForgotPasswordFormProps) {
  // Email-only form for password reset
}
```

2. **Create useForgotPassword hook**:
```tsx
// features/auth/hooks/useForgotPassword.ts
export function useForgotPassword() {
  // Handle password reset logic
}
```

3. **Create ForgotPasswordPageClient**:
```tsx
// features/auth/pages/ForgotPasswordPageClient.tsx
export function ForgotPasswordPageClient() {
  return (
    <div className="min-h-screen flex">
      <AuthBrandingPanel /> {/* Reused! */}
      <div className="flex-1">
        <AuthMobileLogo /> {/* Reused! */}
        <Card>
          <ForgotPasswordForm /> {/* New! */}
        </Card>
        <AuthFooter /> {/* Reused! */}
      </div>
    </div>
  )
}
```

4. **Create page route**:
```tsx
// app/(auth)/forgot-password/page.tsx
import { ForgotPasswordPageClient } from '@/features/auth/pages'

export default function ForgotPasswordPage() {
  return <ForgotPasswordPageClient />
}
```

## Component API Reference

### GoogleLoginButton Props
```typescript
interface GoogleLoginButtonProps {
  onGoogleLogin: () => void
  isLoading?: boolean
}
```

### LoginForm Props
```typescript
interface LoginFormProps {
  onSubmit: (data: LoginInput) => Promise<void>
  isSubmitting?: boolean
}
```

### RegisterForm Props
```typescript
interface RegisterFormProps {
  onSubmit: (data: RegisterInput) => Promise<void>
  isSubmitting?: boolean
}
```

### useLogin Return Type
```typescript
interface UseLoginReturn {
  handleEmailLogin: (data: LoginInput) => Promise<void>
  handleGoogleLogin: () => Promise<void>
}
```

### useRegister Return Type
```typescript
interface UseRegisterReturn {
  handleEmailRegister: (data: RegisterInput) => Promise<void>
  handleGoogleRegister: () => Promise<void>
}
```

## Best Practices

### DO ✅
- Use components from `features/auth/components` for auth UI
- Use `useLogin` hook for auth logic
- Keep components small and focused
- Export components through index files
- Add JSDoc comments to components

### DON'T ❌
- Put auth logic in components
- Import from other features
- Create duplicate components
- Skip type definitions
- Forget to export new components

## Related Documentation

- [Feature-Based Architecture](../../docs/02-architecture/01-feature-based-structure.md)
- [Component Architecture](../../docs/03-code-standards/02-component-architecture.md)
- [Validation with Zod](../../docs/04-typescript/validation.md)

## Migration Notes

The auth pages have been migrated from monolithic components to a feature-based architecture:

**Before**: 
- Single 100+ line components in `app/(auth)/login/page.tsx` and `app/(auth)/register/page.tsx`
- All logic, UI, and state in one file per page

**After**: 
- 7 focused components (6 shared + RegisterForm)
- 2 custom hooks for logic (useLogin, useRegister)
- 2 page composition components
- Clean, maintainable, reusable code
- Shared components reduce duplication (AuthBrandingPanel, GoogleLoginButton, etc.)

---

Last Updated: November 2025
