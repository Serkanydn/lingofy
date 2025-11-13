# Shared Resources

## Overview

The `shared/` directory contains reusable code that is used across multiple features. This is the ONLY place where cross-feature code should live.

## Shared Directory Structure

```
shared/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Shadcn)
│   ├── layout/         # Layout components
│   └── providers/      # React context providers
├── hooks/              # Common React hooks
├── lib/                # Third-party library integrations
│   ├── supabase/       # Supabase clients
│   ├── lemonsqueezy/   # Payment integration
│   └── auth/           # Authentication utilities
├── services/           # Common services
│   └── supabase/       # Base Supabase service
├── types/              # Shared TypeScript types
└── providers/          # Global providers

```

## When to Use Shared

### ✅ Move to Shared When:
- Code is used by **3 or more features**
- Component is truly generic (Button, Card, Dialog)
- Service is infrastructure-level (Supabase client, Auth)
- Type is used across multiple features
- Hook provides common functionality (useTheme, useMediaQuery)

### ❌ Keep in Feature When:
- Code is feature-specific
- Only 1-2 features need it
- Business logic is tightly coupled to feature
- Type is domain-specific

## Component Categories

### 1. UI Components (`shared/components/ui/`)

Base UI components from Shadcn/ui. These are primitive building blocks.

**DO**:
```typescript
// shared/components/ui/button.tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border border-input bg-background hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

**Available UI Components**:
- `alert.tsx`, `alert-dialog.tsx`
- `avatar.tsx`
- `badge.tsx`
- `button.tsx`
- `card.tsx`
- `checkbox.tsx`
- `dialog.tsx`
- `dropdown-menu.tsx`
- `input.tsx`
- `label.tsx`
- `progress.tsx`
- `select.tsx`
- `separator.tsx`
- `skeleton.tsx`
- `slider.tsx`
- `table.tsx`
- `tabs.tsx`
- `textarea.tsx`

### 2. Layout Components (`shared/components/layout/`)

**DO NOT create feature-specific layouts here**. Only truly reusable layout patterns.

Currently empty - layouts should live in feature directories or app routes.

### 3. Provider Components (`shared/components/providers/`)

React context providers for global state.

```typescript
// shared/components/providers/QueryProvider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

## Common Hooks

### 1. `useTheme.ts`

```typescript
// shared/hooks/useTheme.ts
'use client';

import { useTheme as useNextTheme } from 'next-themes';

export function useTheme() {
  const { theme, setTheme, systemTheme } = useNextTheme();
  
  return {
    theme: theme === 'system' ? systemTheme : theme,
    setTheme,
    isDark: (theme === 'system' ? systemTheme : theme) === 'dark',
  };
}
```

### Creating New Shared Hooks

Only create hooks that are:
- Used by multiple features
- Generic and reusable
- Infrastructure-related

**Example**:
```typescript
// shared/hooks/useMediaQuery.ts
'use client';

import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// Usage
export function useIsMobile() {
  return useMediaQuery('(max-width: 768px)');
}
```

## Library Integrations

### 1. Supabase (`shared/lib/supabase/`)

**Client for Client Components**:
```typescript
// shared/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/shared/types/database.types';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**Client for Server Components**:
```typescript
// shared/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/shared/types/database.types';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

**Middleware**:
```typescript
// shared/lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect routes
  if (!user && !request.nextUrl.pathname.startsWith('/login')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
```

### 2. LemonSqueezy (`shared/lib/lemonsqueezy/`)

```typescript
// shared/lib/lemonsqueezy/client.ts
import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

export function setupLemonSqueezy() {
  lemonSqueezySetup({
    apiKey: process.env.LEMONSQUEEZY_API_KEY!,
    onError: (error) => {
      console.error('LemonSqueezy Error:', error);
      throw error;
    },
  });
}
```

### 3. Utilities (`shared/lib/utils.ts`)

```typescript
// shared/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

## Common Services

### 1. Base Service (`shared/services/supabase/baseService.ts`)

```typescript
// shared/services/supabase/baseService.ts
import { createClient } from '@/shared/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/types/database.types';

export abstract class BaseService {
  protected supabase: SupabaseClient<Database>;

  constructor() {
    this.supabase = createClient();
  }

  protected handleError(error: unknown): never {
    console.error('Service Error:', error);
    throw error;
  }
}
```

### 2. Storage Services

```typescript
// shared/services/cloudflareService.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

class CloudflareService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: process.env.AWS_ENDPOINT,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    this.bucketName = process.env.AWS_BUCKET_NAME!;
  }

  async uploadFile(
    file: File,
    folder: string
  ): Promise<{ url: string; key: string }> {
    const key = `${folder}/${Date.now()}-${file.name}`;
    const buffer = await file.arrayBuffer();

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: Buffer.from(buffer),
        ContentType: file.type,
      })
    );

    const url = `${process.env.AWS_PUBLIC_URL}/${key}`;
    return { url, key };
  }
}

export const cloudflareService = new CloudflareService();
```

## Shared Types

### 1. Database Types (`shared/types/database.types.ts`)

Generated from Supabase schema:

```typescript
// shared/types/database.types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      grammar_topics: {
        Row: {
          id: string;
          title: string;
          description: string;
          category_id: string;
          content: string;
          difficulty_level: 'beginner' | 'intermediate' | 'advanced';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Row, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Insert>;
      };
      // ... other tables
    };
  };
}
```

### 2. Common Types (`shared/types/common.types.ts`)

```typescript
// shared/types/common.types.ts
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type UserRole = 'user' | 'premium' | 'admin';

export interface SelectOption {
  value: string;
  label: string;
}
```

## Import Rules

### ✅ CORRECT Imports

```typescript
// Features can import from shared
import { Button } from '@/shared/components/ui/button';
import { createClient } from '@/shared/lib/supabase/client';
import { useTheme } from '@/shared/hooks/useTheme';
import type { ApiResponse } from '@/shared/types/common.types';
```

### ❌ WRONG Imports

```typescript
// Shared CANNOT import from features
import { GrammarCard } from '@/features/grammar/components/GrammarCard'; // WRONG!

// Features CANNOT import from other features
import { useReading } from '@/features/reading/hooks/useReading'; // WRONG!
```

## Best Practices

### DO ✅

- Use shared for truly generic code
- Keep shared components simple and reusable
- Document shared utilities well
- Use TypeScript strictly
- Export through index files
- Version shared components carefully

### DON'T ❌

- Put feature-specific logic in shared
- Create shared components prematurely
- Import from features into shared
- Add unnecessary abstractions
- Modify shared code without testing all usages

## Migration Checklist

When moving code to shared:

1. ✅ Ensure it's used by 3+ features
2. ✅ Remove feature-specific logic
3. ✅ Add proper TypeScript types
4. ✅ Update all imports across features
5. ✅ Add documentation
6. ✅ Test all dependent features

---

## Related Documentation

- [Feature-Based Structure](./01-feature-based-structure.md)
- [Component Architecture](../03-code-standards/02-component-architecture.md)
- [TypeScript Practices](../04-typescript/01-typescript-practices.md)