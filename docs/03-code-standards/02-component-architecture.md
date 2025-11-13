# Component Architecture

## Overview

This document defines the component architecture and standards for building React components in this project using Next.js 16 App Router.

## Server vs Client Components

### Default: Server Components

By default, ALL components in the `app/` directory are **Server Components**.

**Benefits**:
- Zero JavaScript sent to client
- Direct database access
- Server-side rendering
- Better SEO
- Improved performance

**Example**:
```typescript
// app/(main)/grammar/page.tsx
import { createClient } from '@/shared/lib/supabase/server';
import { GrammarList } from '@/features/grammar/components/GrammarList';

export default async function GrammarPage() {
  const supabase = await createClient();
  
  const { data: grammars } = await supabase
    .from('grammar_topics')
    .select('*');

  return ;
}
```

### When to Use Client Components

Add `'use client'` directive ONLY when you need:

1. **Interactivity**: onClick, onChange, etc.
2. **React Hooks**: useState, useEffect, useContext
3. **Browser APIs**: localStorage, window, document
4. **Event Listeners**: Mouse, keyboard, etc.
5. **React Query**: useQuery, useMutation
6. **Zustand**: Store hooks

**Example**:
```typescript
// features/grammar/components/GrammarCard.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/shared/components/ui/card';

export function GrammarCard({ grammar }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card onClick={() => setIsExpanded(!isExpanded)}>
      {/* Content */}
    
  );
}
```

## Component Types

### 1. Page Components

Location: `app/` directory or `features/[feature]/pages/`

**Server Page** (Preferred):
```typescript
// app/(main)/grammar/page.tsx
import { createClient } from '@/shared/lib/supabase/server';
import { GrammarPageClient } from '@/features/grammar/pages/GrammarPageClient';

export default async function GrammarPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('grammar_topics').select('*');

  return ;
}
```

**Client Page** (When needed):
```typescript
// features/grammar/pages/GrammarPageClient.tsx
'use client';

import { useGrammar } from '../hooks/useGrammar';

export function GrammarPageClient({ initialData }) {
  const { grammars } = useGrammar(initialData);
  
  return {/* Content */};
}
```

### 2. Layout Components

Location: `app/` directory with `layout.tsx`

```typescript
// app/(main)/layout.tsx
import { Sidebar } from '@/features/layout/components/Sidebar';
import { Navbar } from '@/features/layout/components/Navbar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
      
      
        
        {children}
      
    
  );
}
```

### 3. Feature Components

Location: `features/[feature]/components/`

**Naming Convention**:
- **Cards**: `[Feature]Card.tsx` (e.g., `GrammarCard.tsx`)
- **Lists**: `[Feature]List.tsx` (e.g., `GrammarList.tsx`)
- **Details**: `[Feature]Detail.tsx` (e.g., `GrammarDetail.tsx`)
- **Forms**: `[Feature]Form.tsx` (e.g., `GrammarForm.tsx`)
- **Modals**: `[Feature]Dialog.tsx` (e.g., `CreateGrammarDialog.tsx`)

**Example**:
```typescript
// features/grammar/components/GrammarCard.tsx
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import type { Grammar } from '../types/grammar.types';

interface GrammarCardProps {
  grammar: Grammar;
  onClick?: () => void;
}

export function GrammarCard({ grammar, onClick }: GrammarCardProps) {
  return (
    
      
        {grammar.title}
        {grammar.difficulty_level}
      
      
        
          {grammar.description}
        
      
    
  );
}
```

### 4. UI Components

Location: `shared/components/ui/`

Base components from Shadcn/ui. Should be generic and reusable.

```typescript
// shared/components/ui/button.tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border border-input hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
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
  extends React.ButtonHTMLAttributes,
    VariantProps {
  asChild?: boolean;
}

export const Button = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => {
    return (
      
    );
  }
);
Button.displayName = 'Button';
```

## Component Patterns

### 1. Props Interface

Always define props interface with TypeScript:

```typescript
interface ComponentProps {
  // Required props
  id: string;
  title: string;
  
  // Optional props
  description?: string;
  className?: string;
  
  // Callback props
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  
  // Children
  children?: React.ReactNode;
}

export function Component({ 
  id, 
  title, 
  description,
  className,
  onEdit,
  onDelete,
  children 
}: ComponentProps) {
  // Implementation
}
```

### 2. Default Props

Use default parameters instead of defaultProps:

```typescript
interface ComponentProps {
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function Component({ 
  variant = 'default',
  size = 'md'
}: ComponentProps) {
  // Implementation
}
```

### 3. Forwarding Refs

Use `forwardRef` for components that need ref access:

```typescript
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes {
  label?: string;
}

export const Input = forwardRef(
  ({ label, className, ...props }, ref) => {
    return (
      
        {label && {label}}
        <input
          ref={ref}
          className={cn('input-base', className)}
          {...props}
        />
      
    );
  }
);
Input.displayName = 'Input';
```

### 4. Compound Components

Use compound component pattern for complex UI:

```typescript
// features/quiz/components/QuizContainer.tsx
import { createContext, useContext, useState } from 'react';

const QuizContext = createContext(null);

function QuizContainer({ children }: { children: React.ReactNode }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  return (
    
      {children}
    
  );
}

function QuizHeader() {
  const context = useContext(QuizContext);
  return Question {context?.currentQuestion + 1};
}

function QuizContent({ children }: { children: React.ReactNode }) {
  return {children};
}

function QuizFooter({ children }: { children: React.ReactNode }) {
  return {children};
}

// Export as compound component
export const Quiz = Object.assign(QuizContainer, {
  Header: QuizHeader,
  Content: QuizContent,
  Footer: QuizFooter,
});

// Usage

  
  
    {/* Questions */}
  
  
    {/* Navigation */}
  

```

### 5. Render Props Pattern

Use for flexible rendering:

```typescript
interface ListProps {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyState?: React.ReactNode;
}

export function List({ items, renderItem, emptyState }: ListProps) {
  if (items.length === 0) {
    return <>{emptyState || No items}</>;
  }

  return (
    
      {items.map((item, index) => (
        {renderItem(item, index)}
      ))}
    
  );
}

// Usage
<List
  items={grammars}
  renderItem={(grammar) => }
  emptyState={No grammar topics found}
/>
```

## Styling Guidelines

### 1. Tailwind CSS Classes

Use Tailwind utility classes:

```typescript
export function Component() {
  return (
    
      Title
      
        Action
      
    
  );
}
```

### 2. Conditional Classes

Use `cn()` utility for conditional classes:

```typescript
import { cn } from '@/shared/lib/utils';

interface ButtonProps {
  variant?: 'default' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Button({ variant = 'default', size = 'md', className }: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-md font-medium transition-colors',
        {
          'bg-primary text-primary-foreground': variant === 'default',
          'bg-destructive text-destructive-foreground': variant === 'destructive',
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className
      )}
    />
  );
}
```

### 3. Component Variants with CVA

Use `class-variance-authority` for complex variants:

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  'rounded-lg border transition-all', // base classes
  {
    variants: {
      variant: {
        default: 'bg-card border-border',
        elevated: 'bg-card border-border shadow-lg',
        ghost: 'bg-transparent border-transparent',
      },
      padding: {
        none: 'p-0',
        sm: 'p-2',
        md: 'p-4',
        lg: 'p-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

interface CardProps extends VariantProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ variant, padding, className, children }: CardProps) {
  return (
    
      {children}
    
  );
}
```

## Performance Optimization

### 1. React.memo

Memoize components that receive stable props:

```typescript
import { memo } from 'react';

interface GrammarCardProps {
  grammar: Grammar;
}

export const GrammarCard = memo(function GrammarCard({ grammar }: GrammarCardProps) {
  return (
    
      
        {grammar.title}
      
    
  );
});
```

### 2. useCallback

Memoize callback functions:

```typescript
'use client';

import { useCallback } from 'react';

export function ParentComponent() {
  const handleEdit = useCallback((id: string) => {
    // Handle edit
  }, []);

  const handleDelete = useCallback((id: string) => {
    // Handle delete
  }, []);

  return (
    
  );
}
```

### 3. useMemo

Memoize expensive computations:

```typescript
'use client';

import { useMemo } from 'react';

export function Component({ items }: { items: Item[] }) {
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => 
      a.title.localeCompare(b.title)
    );
  }, [items]);

  return ;
}
```

### 4. Dynamic Imports

Lazy load heavy components:

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(
  () => import('./HeavyComponent'),
  {
    loading: () => ,
    ssr: false, // Disable SSR if needed
  }
);

export function Parent() {
  return ;
}
```

## Accessibility

### 1. Semantic HTML

Use proper HTML elements:

```typescript
export function Navigation() {
  return (
    
      
        Home
        About
      
    
  );
}
```

### 2. ARIA Attributes

Add ARIA attributes when needed:

```typescript
export function Button({ 
  children, 
  onClick, 
  isLoading 
}: ButtonProps) {
  return (
    
      {children}
    
  );
}
```

### 3. Keyboard Navigation

Ensure keyboard accessibility:

```typescript
export function Dialog({ isOpen, onClose }: DialogProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    
      {/* Content */}
    
  );
}
```

## Best Practices

### DO ✅

- Use Server Components by default
- Add `'use client'` only when necessary
- Define TypeScript interfaces for all props
- Use semantic HTML elements
- Implement proper accessibility
- Memoize expensive operations
- Keep components small and focused
- Use Tailwind utility classes
- Handle loading and error states
- Follow naming conventions

### DON'T ❌

- Mark everything as `'use client'`
- Use inline styles (use Tailwind)
- Create monolithic components
- Ignore TypeScript errors
- Skip accessibility features
- Forget to handle edge cases
- Use `any` types
- Ignore performance optimization
- Mix business logic with UI

---

## Related Documentation

- [Design Patterns](./01-design-patterns.md)
- [Naming Conventions](./03-naming-conventions.md)
- [TypeScript Practices](../04-typescript/01-typescript-practices.md)