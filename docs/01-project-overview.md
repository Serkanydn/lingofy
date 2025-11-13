# Project Overview

## Project Description

**Learn Quiz English** is a comprehensive English learning platform featuring grammar exercises, listening comprehension, reading passages, and vocabulary management with a premium subscription model.

## Core Features

### 1. **Grammar Module**
- Category-based grammar topics
- Multiple question types (Multiple Choice, True/False, Fill in the Blank)
- Progress tracking and statistics
- Admin management interface

### 2. **Listening Module**
- Level-based content (A1, A2, B1, B2, C1, C2)
- Audio playback with Howler.js
- Quiz integration
- Progress tracking

### 3. **Reading Module**
- Level-based passages
- Audio support for text
- Comprehension questions
- Vocabulary highlighting

### 4. **Vocabulary (My Words)**
- Personal word collection
- Category organization
- Flashcard practice mode
- Word statistics

### 5. **Premium System**
- LemonSqueezy integration
- Feature gating
- Subscription management
- Webhook handling

### 6. **Admin Panel**
- Content management (CRUD operations)
- User management
- Statistics dashboard
- Media upload (audio files)

## Technology Stack

### Core Framework
```json
{
  "framework": "Next.js 16",
  "routing": "App Router",
  "rendering": "Server Components (default) + Client Components (selective)",
  "language": "TypeScript 5"
}
```

### Backend & Database
```json
{
  "database": "Supabase (PostgreSQL)",
  "authentication": "Supabase Auth",
  "storage": "AWS S3 (Cloudflare R2)",
  "api": "Next.js API Routes"
}
```

### State Management
```json
{
  "server_state": "TanStack Query (React Query v5)",
  "client_state": "Zustand",
  "form_state": "React Hook Form + Zod"
}
```

### UI & Styling
```json
{
  "ui_library": "Shadcn/ui (Radix UI primitives)",
  "styling": "Tailwind CSS v4",
  "animations": "tw-animate-css",
  "icons": "Lucide React",
  "toasts": "Sonner"
}
```

### Payment & Media
```json
{
  "payment": "LemonSqueezy",
  "audio": "Howler.js",
  "file_upload": "AWS SDK (S3)"
}
```

## Architecture Highlights

### 1. **Feature-Based Structure**
Each feature is completely self-contained:
```
features/[feature-name]/
├── components/     # Feature-specific UI components
├── hooks/          # Custom React hooks
├── services/       # API communication layer
├── types/          # TypeScript definitions
├── store/          # Zustand stores (if needed)
├── pages/          # Page components (if needed)
└── utils/          # Utility functions
```

### 2. **Route Groups**
```
app/
├── (auth)/         # Authentication pages
├── (main)/         # Main application (requires auth)
├── (admin)/        # Admin panel (requires admin role)
└── api/            # API routes
```

### 3. **Shared Resources**
```
shared/
├── components/     # Reusable UI components
├── hooks/          # Common hooks (useTheme, etc.)
├── lib/            # Third-party integrations
├── services/       # Common services
└── types/          # Shared type definitions
```

## Project Principles

### 1. **Type Safety First**
- Strict TypeScript mode enabled
- No `any` types allowed
- Zod schemas for runtime validation
- Type-safe database queries with generated types

### 2. **Server-First Approach**
- Server Components by default
- Client Components only when needed (interactivity, hooks)
- Minimize client-side JavaScript bundle
- Leverage Next.js server actions where appropriate

### 3. **Feature Isolation**
- Each feature is independent
- No cross-feature imports (use shared/ for common code)
- Self-documenting through structure
- Easy to test and maintain

### 4. **Security by Design**
- Row Level Security (RLS) policies in Supabase
- Input validation on both client and server
- Secure API routes with authentication checks
- Proper error handling without exposing internals

### 5. **Performance Optimization**
- React Query for efficient data fetching
- Optimistic updates where applicable
- Image and audio lazy loading
- Database indexing for common queries

## User Roles

### Regular User
- Access to all learning modules
- Personal vocabulary management
- Statistics tracking
- Limited features (freemium)

### Premium User
- All regular user features
- Unlimited access to premium content
- Advanced statistics
- Priority support

### Admin
- Full content management (CRUD)
- User management and statistics
- Media upload and management
- System monitoring

## Data Flow

### Client → Server
```
User Action
  → Client Component (validation)
    → Custom Hook (business logic)
      → Service Layer (API call)
        → API Route (auth check)
          → Supabase (RLS check)
            → Database
```

### Server → Client
```
Database
  → Supabase (RLS filter)
    → API Route (transform data)
      → Service Layer (type casting)
        → React Query (cache)
          → Component (render)
```

## Environment Variables

Required environment variables (see `.env.local`):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# LemonSqueezy
LEMONSQUEEZY_API_KEY=
LEMONSQUEEZY_STORE_ID=
LEMONSQUEEZY_WEBHOOK_SECRET=

# AWS S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=

# App
NEXT_PUBLIC_APP_URL=
```

## Key Dependencies

### Production
- `next@16.0.1` - Framework
- `react@19.2.0` - UI library
- `@supabase/supabase-js@^2.78.0` - Database client
- `@tanstack/react-query@^5.90.5` - Server state management
- `zustand@^5.0.8` - Client state management
- `zod@^4.1.12` - Schema validation
- `react-hook-form@^7.65.0` - Form management
- `@lemonsqueezy/lemonsqueezy.js@^4.0.0` - Payment processing
- `howler@^2.2.4` - Audio playback

### Development
- `typescript@^5` - Type checking
- `eslint@^9` - Linting
- `tailwindcss@^4` - Styling

---

## Next Steps

- Review [Feature-Based Structure](./02-architecture/01-feature-based-structure.md) to understand the architecture
- Check [Design Patterns](./03-code-standards/01-design-patterns.md) for coding guidelines
- Read [TypeScript Practices](./04-typescript/01-typescript-practices.md) for type safety rules