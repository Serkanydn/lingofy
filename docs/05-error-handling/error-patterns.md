# Error Handling Patterns

## Overview

Proper error handling is crucial for application stability and user experience. This document outlines error handling patterns and best practices.

## Error Types

### 1. Application Errors

```typescript
// shared/types/error.types.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409);
    this.name = 'ConflictError';
  }
}
```

## Service Layer Error Handling

### 1. Service with Try-Catch

```typescript
// features/grammar/services/grammarService.ts
import { createClient } from '@/shared/lib/supabase/client';
import { AppError, NotFoundError } from '@/shared/types/error.types';
import type { Grammar, CreateGrammarInput } from '../types/grammar.types';

class GrammarService {
  private supabase = createClient();

  async getAll(): Promise {
    try {
      const { data, error } = await this.supabase
        .from('grammar_topics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new AppError(
          'Failed to fetch grammar topics',
          'FETCH_ERROR',
          500,
          error
        );
      }

      return data;
    } catch (error) {
      if (error instanceof AppError) throw error;
      
      throw new AppError(
        'An unexpected error occurred',
        'UNKNOWN_ERROR',
        500,
        error
      );
    }
  }

  async getById(id: string): Promise {
    try {
      const { data, error } = await this.supabase
        .from('grammar_topics')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError('Grammar topic');
        }
        throw new AppError('Failed to fetch grammar topic', 'FETCH_ERROR', 500, error);
      }

      return data;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('An unexpected error occurred', 'UNKNOWN_ERROR', 500, error);
    }
  }

  async create(input: CreateGrammarInput): Promise {
    try {
      const { data, error } = await this.supabase
        .from('grammar_topics')
        .insert(input)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique violation
          throw new ConflictError('Grammar topic with this title already exists');
        }
        throw new AppError('Failed to create grammar topic', 'CREATE_ERROR', 500, error);
      }

      return data;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('An unexpected error occurred', 'UNKNOWN_ERROR', 500, error);
    }
  }

  async delete(id: string): Promise {
    try {
      const { error } = await this.supabase
        .from('grammar_topics')
        .delete()
        .eq('id', id);

      if (error) {
        throw new AppError('Failed to delete grammar topic', 'DELETE_ERROR', 500, error);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('An unexpected error occurred', 'UNKNOWN_ERROR', 500, error);
    }
  }
}

export const grammarService = new GrammarService();
```

### 2. Result Pattern (Alternative)

```typescript
// shared/types/result.types.ts
export type Result =
  | { success: true; data: T }
  | { success: false; error: E };

// Service using Result pattern
class GrammarService {
  async getAll(): Promise<Result> {
    try {
      const { data, error } = await this.supabase
        .from('grammar_topics')
        .select('*');

      if (error) {
        return {
          success: false,
          error: new AppError('Failed to fetch grammar topics', 'FETCH_ERROR'),
        };
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: new AppError('An unexpected error occurred', 'UNKNOWN_ERROR'),
      };
    }
  }
}

// Usage
const result = await grammarService.getAll();
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error.message);
}
```

## Hook Error Handling

### 1. React Query Error Handling

```typescript
// features/grammar/hooks/useGrammar.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { grammarService } from '../services';
import { AppError } from '@/shared/types/error.types';

export function useGrammar() {
  const queryClient = useQueryClient();

  const { data: grammars, isLoading, error } = useQuery({
    queryKey: ['grammars'],
    queryFn: grammarService.getAll,
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error instanceof AppError && error.statusCode < 500) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const createGrammar = useMutation({
    mutationFn: grammarService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grammars'] });
      toast.success('Grammar topic created successfully');
    },
    onError: (error: AppError) => {
      if (error instanceof AppError) {
        toast.error(error.message);
      } else {
        toast.error('Failed to create grammar topic');
      }
      console.error('Create error:', error);
    },
  });

  const deleteGrammar = useMutation({
    mutationFn: grammarService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grammars'] });
      toast.success('Grammar topic deleted successfully');
    },
    onError: (error: AppError) => {
      toast.error(error.message || 'Failed to delete grammar topic');
      console.error('Delete error:', error);
    },
  });

  return {
    grammars,
    isLoading,
    error,
    createGrammar: createGrammar.mutate,
    deleteGrammar: deleteGrammar.mutate,
    isCreating: createGrammar.isPending,
    isDeleting: deleteGrammar.isPending,
  };
}
```

### 2. Custom Error Hook

```typescript
// shared/hooks/useErrorHandler.ts
'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import { AppError } from '@/shared/types/error.types';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  customMessage?: string;
}

export function useErrorHandler() {
  const handleError = useCallback(
    (error: unknown, options: ErrorHandlerOptions = {}) => {
      const {
        showToast = true,
        logToConsole = true,
        customMessage,
      } = options;

      let message = customMessage || 'An error occurred';

      if (error instanceof AppError) {
        message = error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      if (showToast) {
        toast.error(message);
      }

      if (logToConsole) {
        console.error('Error:', error);
      }
    },
    []
  );

  return { handleError };
}

// Usage in component
export function Component() {
  const { handleError } = useErrorHandler();

  const fetchData = async () => {
    try {
      await someAsyncOperation();
    } catch (error) {
      handleError(error, {
        customMessage: 'Failed to fetch data',
      });
    }
  };

  return Fetch Data;
}
```

## Component Error Handling

### 1. Error Boundary

```typescript
// shared/components/ErrorBoundary.tsx
'use client';

import { Component, type ReactNode } from 'react';
import { AppError } from '@/shared/types/error.types';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        
          Something went wrong
          
            {this.state.error instanceof AppError
              ? this.state.error.message
              : 'An unexpected error occurred'}
          
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Try again
          
        
      );
    }

    return this.props.children;
  }
}

// Usage
}>
  

```

### 2. Error State in Components

```typescript
// features/grammar/components/GrammarList.tsx
'use client';

import { useGrammar } from '../hooks/useGrammar';
import { GrammarCard } from './GrammarCard';
import { GrammarSkeleton } from './GrammarSkeleton';

export function GrammarList() {
  const { grammars, isLoading, error } = useGrammar();

  if (isLoading) {
    return ;
  }

  if (error) {
    return (
      
        Failed to load grammar topics
        
          {error instanceof AppError ? error.message : 'An error occurred'}
        
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Retry
        
      
    );
  }

  if (!grammars || grammars.length === 0) {
    return (
      
        No grammar topics found
      
    );
  }

  return (
    
      {grammars.map((grammar) => (
        
      ))}
    
  );
}
```

## API Route Error Handling

### 1. Centralized Error Handler

```typescript
// shared/lib/api/errorHandler.ts
import { NextResponse } from 'next/server';
import { AppError } from '@/shared/types/error.types';
import { z } from 'zod';

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);

  // Zod validation errors
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: error.errors,
      },
      { status: 400 }
    );
  }

  // Application errors
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        ...(process.env.NODE_ENV === 'development' && { details: error.details }),
      },
      { status: error.statusCode }
    );
  }

  // Unknown errors
  return NextResponse.json(
    {
      error: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && {
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    },
    { status: 500 }
  );
}
```

### 2. API Route with Error Handling

```typescript
// app/api/grammar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/shared/lib/supabase/server';
import { handleApiError } from '@/shared/lib/api/errorHandler';
import { createGrammarSchema } from '@/features/grammar/types/validation';
import { AuthenticationError, ValidationError } from '@/shared/types/error.types';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new AuthenticationError();
    }

    const { data, error } = await supabase
      .from('grammar_topics')
      .select('*');

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new AuthenticationError();
    }

    const body = await request.json();
    const validatedData = createGrammarSchema.parse(body);

    const { data, error } = await supabase
      .from('grammar_topics')
      .insert(validatedData)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
```

## Logging Errors

### 1. Error Logger

```typescript
// shared/lib/logger.ts
interface LogContext {
  userId?: string;
  feature?: string;
  action?: string;
  metadata?: Record;
}

class Logger {
  private log(
    level: 'info' | 'warn' | 'error',
    message: string,
    context?: LogContext
  ) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...context,
    };

    // In production, send to logging service
    if (process.env.NODE_ENV === 'production') {
      // Send to Sentry, LogRocket, etc.
      console[level](JSON.stringify(logEntry));
    } else {
      console[level](message, context);
    }
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, error: unknown, context?: LogContext) {
    this.log('error', message, {
      ...context,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}

export const logger = new Logger();

// Usage
logger.error('Failed to create grammar', error, {
  userId: user.id,
  feature: 'grammar',
  action: 'create',
  metadata: { categoryId: data.category_id },
});
```

## Toast Notifications

### 1. Consistent Toast Messages

```typescript
// shared/lib/toast.ts
import { toast as sonnerToast } from 'sonner';
import { AppError } from '@/shared/types/error.types';

export const toast = {
  success: (message: string) => {
    sonnerToast.success(message);
  },

  error: (error: unknown, fallbackMessage: string = 'An error occurred') => {
    let message = fallbackMessage;

    if (error instanceof AppError) {
      message = error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    sonnerToast.error(message);
  },

  info: (message: string) => {
    sonnerToast.info(message);
  },

  warning: (message: string) => {
    sonnerToast.warning(message);
  },

  promise: (
    promise: Promise,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return sonnerToast.promise(promise, messages);
  },
};

// Usage
try {
  await grammarService.create(data);
  toast.success('Grammar topic created');
} catch (error) {
  toast.error(error, 'Failed to create grammar topic');
}
```

## Best Practices

### DO ✅

- Use custom error classes for different error types
- Handle errors at the appropriate level (service, hook, or component)
- Provide user-friendly error messages
- Log errors with context for debugging
- Use Error Boundaries for unexpected errors
- Validate input before processing
- Implement retry logic for transient failures
- Show loading states during async operations
- Handle both success and error cases in UI
- Use TypeScript for error type safety

### DON'T ❌

- Swallow errors silently
- Show technical error details to users
- Use generic error messages everywhere
- Forget to handle loading states
- Throw errors without catching them
- Log sensitive information
- Ignore validation errors
- Use `try-catch` everywhere unnecessarily
- Create error boundaries around every component
- Mix error handling patterns inconsistently

---

## Related Documentation

- [Security](./02-security.md)
- [TypeScript Practices](../04-typescript/01-typescript-practices.md)
- [Validation](../04-typescript/02-validation.md)