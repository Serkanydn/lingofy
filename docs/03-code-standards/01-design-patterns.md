# Design Patterns

## Overview

This document outlines the core design patterns used throughout the project. Following these patterns ensures consistency, maintainability, and scalability.

## 1. Service Layer Pattern

### Purpose
Separate API communication from business logic and UI components.

### Structure

```typescript
// features/[feature]/services/featureService.ts
import { createClient } from '@/shared/lib/supabase/client';
import type { Feature, CreateFeatureInput } from '../types/feature.types';

class FeatureService {
  private supabase = createClient();

  async getAll(): Promise {
    const { data, error } = await this.supabase
      .from('features')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise {
    const { data, error } = await this.supabase
      .from('features')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(input: CreateFeatureInput): Promise {
    const { data, error } = await this.supabase
      .from('features')
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, input: Partial): Promise {
    const { data, error } = await this.supabase
      .from('features')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise {
    const { error } = await this.supabase
      .from('features')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

export const featureService = new FeatureService();
```

### Export Pattern

```typescript
// features/[feature]/services/index.ts
export { featureService } from './featureService';
export { anotherService } from './anotherService';
```

## 2. Custom Hook Pattern

### Purpose
Encapsulate business logic, state management, and side effects.

### Structure

```typescript
// features/[feature]/hooks/useFeature.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { featureService } from '../services';
import type { Feature, CreateFeatureInput } from '../types/feature.types';

export function useFeature() {
  const queryClient = useQueryClient();

  // Queries
  const {
    data: features,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['features'],
    queryFn: featureService.getAll,
  });

  // Mutations
  const createFeature = useMutation({
    mutationFn: (input: CreateFeatureInput) => featureService.create(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      toast.success('Feature created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create feature');
      console.error(error);
    },
  });

  const updateFeature = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial }) =>
      featureService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      toast.success('Feature updated successfully');
    },
    onError: () => {
      toast.error('Failed to update feature');
    },
  });

  const deleteFeature = useMutation({
    mutationFn: (id: string) => featureService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      toast.success('Feature deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete feature');
    },
  });

  return {
    features,
    isLoading,
    error,
    createFeature: createFeature.mutate,
    updateFeature: updateFeature.mutate,
    deleteFeature: deleteFeature.mutate,
    isCreating: createFeature.isPending,
    isUpdating: updateFeature.isPending,
    isDeleting: deleteFeature.isPending,
  };
}
```

### Hook with Parameters

```typescript
// features/[feature]/hooks/useFeatureDetail.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { featureService } from '../services';

export function useFeatureDetail(id: string) {
  const { data: feature, isLoading, error } = useQuery({
    queryKey: ['features', id],
    queryFn: () => featureService.getById(id),
    enabled: !!id, // Only fetch if id exists
  });

  return {
    feature,
    isLoading,
    error,
  };
}
```

## 3. Compound Component Pattern

### Purpose
Create flexible and composable UI components.

### Example: Card Component

```typescript
// shared/components/ui/card.tsx
import * as React from 'react';
import { cn } from '@/shared/lib/utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes
>(({ className, ...props }, ref) => (
  
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardTitle, CardContent };

// Usage

  
    Title
  
  
    Content here
  

```

## 4. Container/Presenter Pattern

### Purpose
Separate smart (container) components from dumb (presenter) components.

### Container Component (Smart)

```typescript
// features/grammar/pages/GrammarPage.tsx
'use client';

import { useGrammar } from '../hooks/useGrammar';
import { GrammarList } from '../components/GrammarList';
import { GrammarSkeleton } from '../components/GrammarSkeleton';

export function GrammarPage() {
  const { grammars, isLoading, error } = useGrammar();

  if (isLoading) return ;
  if (error) return Error loading grammar topics;

  return ;
}
```

### Presenter Component (Dumb)

```typescript
// features/grammar/components/GrammarList.tsx
import { GrammarCard } from './GrammarCard';
import type { Grammar } from '../types/grammar.types';

interface GrammarListProps {
  grammars: Grammar[];
}

export function GrammarList({ grammars }: GrammarListProps) {
  return (
    
      {grammars.map((grammar) => (
        
      ))}
    
  );
}
```

## 5. Form Pattern with React Hook Form + Zod

### Purpose
Type-safe form handling with validation.

### Implementation

```typescript
// features/[feature]/components/FeatureForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

const featureSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category_id: z.string().uuid('Invalid category'),
});

type FeatureFormData = z.infer;

interface FeatureFormProps {
  onSubmit: (data: FeatureFormData) => void;
  defaultValues?: Partial;
  isLoading?: boolean;
}

export function FeatureForm({ 
  onSubmit, 
  defaultValues,
  isLoading 
}: FeatureFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(featureSchema),
    defaultValues,
  });

  return (
    
      
        Title
        
        {errors.title && (
          {errors.title.message}
        )}
      

      
        Description
        
        {errors.description && (
          {errors.description.message}
        )}
      

      
        {isLoading ? 'Saving...' : 'Save'}
      
    
  );
}
```

## 6. Modal/Dialog Pattern

### Purpose
Consistent modal/dialog behavior across the app.

### Implementation

```typescript
// features/[feature]/components/CreateFeatureDialog.tsx
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { FeatureForm } from './FeatureForm';
import { useFeature } from '../hooks/useFeature';

export function CreateFeatureDialog() {
  const [open, setOpen] = useState(false);
  const { createFeature, isCreating } = useFeature();

  const handleSubmit = (data: FeatureFormData) => {
    createFeature(data, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    
      
        Create Feature
      
      
        
          Create New Feature
        
        
      
    
  );
}
```

## 7. Loading State Pattern

### Purpose
Consistent loading states across components.

### Skeleton Loading

```typescript
// features/[feature]/components/FeatureSkeleton.tsx
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Card, CardHeader, CardContent } from '@/shared/components/ui/card';

export function FeatureSkeleton() {
  return (
    
      {Array.from({ length: 6 }).map((_, i) => (
        
          
            
          
          
            
            
          
        
      ))}
    
  );
}
```

### Usage in Component

```typescript
export function FeaturePage() {
  const { features, isLoading } = useFeature();

  if (isLoading) {
    return ;
  }

  return ;
}
```

## 8. Error Boundary Pattern

### Purpose
Graceful error handling for components.

### Implementation

```typescript
// shared/components/ErrorBoundary.tsx
'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        
          Something went wrong
          
            {this.state.error?.message}
          
        
      );
    }

    return this.props.children;
  }
}
```

## 9. Optimistic Update Pattern

### Purpose
Improve perceived performance with optimistic updates.

### Implementation

```typescript
// features/[feature]/hooks/useFeatureOptimistic.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { featureService } from '../services';
import type { Feature } from '../types/feature.types';

export function useFeatureOptimistic() {
  const queryClient = useQueryClient();

  const updateFeature = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial }) =>
      featureService.update(id, data),
    
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['features'] });

      // Snapshot previous value
      const previous = queryClient.getQueryData(['features']);

      // Optimistically update
      queryClient.setQueryData(['features'], (old) =>
        old?.map((feature) =>
          feature.id === id ? { ...feature, ...data } : feature
        )
      );

      return { previous };
    },
    
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(['features'], context.previous);
      }
    },
    
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['features'] });
    },
  });

  return { updateFeature };
}
```

## 10. Zustand Store Pattern

### Purpose
Client-side state management for UI state.

### Implementation

```typescript
// features/[feature]/store/featureStore.ts
import { create } from 'zustand';

interface FeatureStore {
  // State
  selectedId: string | null;
  isModalOpen: boolean;
  filters: {
    search: string;
    category: string | null;
  };

  // Actions
  selectFeature: (id: string | null) => void;
  openModal: () => void;
  closeModal: () => void;
  setSearch: (search: string) => void;
  setCategory: (category: string | null) => void;
  resetFilters: () => void;
}

export const useFeatureStore = create((set) => ({
  // Initial state
  selectedId: null,
  isModalOpen: false,
  filters: {
    search: '',
    category: null,
  },

  // Actions
  selectFeature: (id) => set({ selectedId: id }),
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  setSearch: (search) =>
    set((state) => ({
      filters: { ...state.filters, search },
    })),
  setCategory: (category) =>
    set((state) => ({
      filters: { ...state.filters, category },
    })),
  resetFilters: () =>
    set({
      filters: { search: '', category: null },
    }),
}));
```

## Best Practices

### DO ✅

- Use service layer for ALL API calls
- Create custom hooks for business logic
- Keep components pure and presentational when possible
- Use TypeScript strictly with proper types
- Implement proper error handling
- Use React Query for server state
- Use Zustand for complex client state
- Optimize with proper loading states

### DON'T ❌

- Make API calls directly in components
- Mix business logic with UI logic
- Use `any` types
- Ignore error states
- Create unnecessary abstractions
- Use props drilling (use context/store instead)
- Forget to handle loading states

---

## Related Documentation

- [Component Architecture](./02-component-architecture.md)
- [TypeScript Practices](../04-typescript/01-typescript-practices.md)
- [Error Patterns](../05-error-handling/01-error-patterns.md)