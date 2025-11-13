# Feature Creation Guide

## Overview

This guide walks through creating a complete feature from scratch, following all project standards and patterns.

## Example: Creating a "Writing" Feature

### Step 1: Plan the Feature

**Requirements:**
- Users can view writing exercises by level (A1-C2)
- Each exercise has a prompt and evaluation criteria
- Users can submit their writing
- AI provides feedback on submissions
- Track user progress

**Data Structure:**
```typescript
WritingExercise {
  id: UUID
  title: string
  prompt: string
  level: Level
  word_count_min: number
  word_count_max: number
  criteria: string[]
  created_at: timestamp
}

WritingSubmission {
  id: UUID
  exercise_id: UUID
  user_id: UUID
  content: string
  word_count: number
  feedback: string
  score: number
  submitted_at: timestamp
}
```

### Step 2: Create Database Schema

```sql
-- scripts/create_writing_tables.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Writing exercises table
CREATE TABLE writing_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  prompt TEXT NOT NULL,
  level VARCHAR(10) NOT NULL CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  word_count_min INTEGER NOT NULL DEFAULT 50,
  word_count_max INTEGER NOT NULL DEFAULT 500,
  criteria JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Writing submissions table
CREATE TABLE writing_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exercise_id UUID NOT NULL REFERENCES writing_exercises(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  word_count INTEGER NOT NULL,
  feedback TEXT,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(exercise_id, user_id)
);

-- Indexes
CREATE INDEX idx_writing_exercises_level ON writing_exercises(level);
CREATE INDEX idx_writing_submissions_user ON writing_submissions(user_id);
CREATE INDEX idx_writing_submissions_exercise ON writing_submissions(exercise_id);

-- RLS Policies
ALTER TABLE writing_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can read exercises
CREATE POLICY "Users can read writing exercises"
  ON writing_exercises FOR SELECT
  USING (true);

-- Admins can manage exercises
CREATE POLICY "Admins can manage writing exercises"
  ON writing_exercises FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Users can read their own submissions
CREATE POLICY "Users can read own submissions"
  ON writing_submissions FOR SELECT
  USING (user_id = auth.uid());

-- Users can create their own submissions
CREATE POLICY "Users can create own submissions"
  ON writing_submissions FOR INSERT
  WITH CHECK (user_id = auth.uid());
```

### Step 3: Create Type Definitions

```typescript
// features/writing/types/writing.types.ts

export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface WritingExercise {
  id: string;
  title: string;
  prompt: string;
  level: Level;
  word_count_min: number;
  word_count_max: number;
  criteria: string[];
  created_at: string;
  updated_at: string;
}

export interface WritingSubmission {
  id: string;
  exercise_id: string;
  user_id: string;
  content: string;
  word_count: number;
  feedback: string | null;
  score: number | null;
  submitted_at: string;
}

export interface WritingSubmissionWithExercise extends WritingSubmission {
  exercise: WritingExercise;
}

// Input types
export type CreateWritingExerciseInput = Omit<
  WritingExercise,
  'id' | 'created_at' | 'updated_at'
>;

export type UpdateWritingExerciseInput = Partial;

export type CreateSubmissionInput = Pick<
  WritingSubmission,
  'exercise_id' | 'content' | 'word_count'
>;
```

```typescript
// features/writing/types/validation.ts

import { z } from 'zod';

export const levelSchema = z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);

export const writingExerciseSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3).max(200),
  prompt: z.string().min(20),
  level: levelSchema,
  word_count_min: z.number().int().positive().default(50),
  word_count_max: z.number().int().positive().default(500),
  criteria: z.array(z.string()),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const createWritingExerciseSchema = writingExerciseSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const submitWritingSchema = z.object({
  exercise_id: z.string().uuid(),
  content: z.string().min(20, 'Writing must be at least 20 characters'),
  word_count: z.number().int().positive(),
});

export type WritingExercise = z.infer;
export type CreateWritingExercise = z.infer;
export type SubmitWriting = z.infer;
```

### Step 4: Create Service Layer

```typescript
// features/writing/services/writingService.ts

import { createClient } from '@/shared/lib/supabase/client';
import { AppError, NotFoundError } from '@/shared/types/error.types';
import type {
  WritingExercise,
  CreateWritingExerciseInput,
  UpdateWritingExerciseInput,
  Level,
} from '../types/writing.types';

class WritingService {
  private supabase = createClient();

  async getAll(): Promise {
    try {
      const { data, error } = await this.supabase
        .from('writing_exercises')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError('Failed to fetch writing exercises', 'FETCH_ERROR');
    }
  }

  async getByLevel(level: Level): Promise {
    try {
      const { data, error } = await this.supabase
        .from('writing_exercises')
        .select('*')
        .eq('level', level)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError('Failed to fetch writing exercises', 'FETCH_ERROR');
    }
  }

  async getById(id: string): Promise {
    try {
      const { data, error } = await this.supabase
        .from('writing_exercises')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError('Writing exercise');
        }
        throw error;
      }

      return data;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch writing exercise', 'FETCH_ERROR');
    }
  }

  async create(input: CreateWritingExerciseInput): Promise {
    try {
      const { data, error } = await this.supabase
        .from('writing_exercises')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError('Failed to create writing exercise', 'CREATE_ERROR');
    }
  }

  async update(
    id: string,
    input: UpdateWritingExerciseInput
  ): Promise {
    try {
      const { data, error } = await this.supabase
        .from('writing_exercises')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError('Failed to update writing exercise', 'UPDATE_ERROR');
    }
  }

  async delete(id: string): Promise {
    try {
      const { error } = await this.supabase
        .from('writing_exercises')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      throw new AppError('Failed to delete writing exercise', 'DELETE_ERROR');
    }
  }
}

export const writingService = new WritingService();
```

```typescript
// features/writing/services/submissionService.ts

import { createClient } from '@/shared/lib/supabase/client';
import { AppError } from '@/shared/types/error.types';
import type {
  WritingSubmission,
  CreateSubmissionInput,
  WritingSubmissionWithExercise,
} from '../types/writing.types';

class SubmissionService {
  private supabase = createClient();

  async getUserSubmissions(): Promise {
    try {
      const { data, error } = await this.supabase
        .from('writing_submissions')
        .select(`
          *,
          exercise:writing_exercises(*)
        `)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return data as WritingSubmissionWithExercise[];
    } catch (error) {
      throw new AppError('Failed to fetch submissions', 'FETCH_ERROR');
    }
  }

  async submit(input: CreateSubmissionInput): Promise {
    try {
      const { data: user } = await this.supabase.auth.getUser();
      if (!user.user) throw new AppError('Not authenticated', 'AUTH_ERROR', 401);

      const { data, error } = await this.supabase
        .from('writing_submissions')
        .insert({
          ...input,
          user_id: user.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to submit writing', 'SUBMIT_ERROR');
    }
  }
}

export const submissionService = new SubmissionService();
```

```typescript
// features/writing/services/index.ts

export { writingService } from './writingService';
export { submissionService } from './submissionService';
```

### Step 5: Create Custom Hooks

```typescript
// features/writing/hooks/useWriting.ts

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { writingService } from '../services';
import type { Level } from '../types/writing.types';

export function useWriting(level?: Level) {
  const queryClient = useQueryClient();

  const { data: exercises, isLoading, error } = useQuery({
    queryKey: level ? ['writing', level] : ['writing'],
    queryFn: () => (level ? writingService.getByLevel(level) : writingService.getAll()),
  });

  const createExercise = useMutation({
    mutationFn: writingService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['writing'] });
      toast.success('Exercise created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create exercise');
      console.error(error);
    },
  });

  const deleteExercise = useMutation({
    mutationFn: writingService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['writing'] });
      toast.success('Exercise deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete exercise');
    },
  });

  return {
    exercises,
    isLoading,
    error,
    createExercise: createExercise.mutate,
    deleteExercise: deleteExercise.mutate,
    isCreating: createExercise.isPending,
    isDeleting: deleteExercise.isPending,
  };
}
```

```typescript
// features/writing/hooks/useWritingDetail.ts

'use client';

import { useQuery } from '@tanstack/react-query';
import { writingService } from '../services';

export function useWritingDetail(id: string) {
  const { data: exercise, isLoading, error } = useQuery({
    queryKey: ['writing', id],
    queryFn: () => writingService.getById(id),
    enabled: !!id,
  });

  return {
    exercise,
    isLoading,
    error,
  };
}
```

```typescript
// features/writing/hooks/useSubmission.ts

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { submissionService } from '../services';
import type { CreateSubmissionInput } from '../types/writing.types';

export function useSubmission() {
  const queryClient = useQueryClient();

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['writing-submissions'],
    queryFn: submissionService.getUserSubmissions,
  });

  const submitWriting = useMutation({
    mutationFn: (input: CreateSubmissionInput) => submissionService.submit(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['writing-submissions'] });
      toast.success('Writing submitted successfully');
    },
    onError: (error) => {
      toast.error('Failed to submit writing');
      console.error(error);
    },
  });

  return {
    submissions,
    isLoading,
    submitWriting: submitWriting.mutate,
    isSubmitting: submitWriting.isPending,
  };
}
```

### Step 6: Create Components

```typescript
// features/writing/components/WritingCard.tsx

'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import type { WritingExercise } from '../types/writing.types';

interface WritingCardProps {
  exercise: WritingExercise;
  onClick?: (id: string) => void;
}

export function WritingCard({ exercise, onClick }: WritingCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onClick?.(exercise.id)}
    >
      
        
          {exercise.title}
          {exercise.level}
        
      
      
        
          {exercise.prompt}
        
        
          {exercise.word_count_min}-{exercise.word_count_max} words
        
      
    
  );
}
```

```typescript
// features/writing/components/WritingForm.tsx

'use client';

import { useState } from 'react';
import { useSubmission } from '../hooks/useSubmission';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import type { WritingExercise } from '../types/writing.types';

interface WritingFormProps {
  exercise: WritingExercise;
  onSuccess?: () => void;
}

export function WritingForm({ exercise, onSuccess }: WritingFormProps) {
  const [content, setContent] = useState('');
  const { submitWriting, isSubmitting } = useSubmission();

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (wordCount < exercise.word_count_min) {
      toast.error(`Minimum ${exercise.word_count_min} words required`);
      return;
    }

    if (wordCount > exercise.word_count_max) {
      toast.error(`Maximum ${exercise.word_count_max} words allowed`);
      return;
    }

    submitWriting(
      {
        exercise_id: exercise.id,
        content,
        word_count: wordCount,
      },
      {
        onSuccess: () => {
          setContent('');
          onSuccess?.();
        },
      }
    );
  };

  return (
    
      
        Your Writing
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          rows={15}
          className="mt-2"
        />
        
           exercise.word_count_max ? 'text-destructive' : 'text-muted-foreground'}>
            {wordCount} / {exercise.word_count_min}-{exercise.word_count_max} words
          
        
      

      
        {isSubmitting ? 'Submitting...' : 'Submit Writing'}
      
    
  );
}
```

### Step 7: Create Page Components

```typescript
// app/(main)/writing/page.tsx

import { createClient } from '@/shared/lib/supabase/server';
import { WritingPageClient } from '@/features/writing/pages/WritingPageClient';

export default async function WritingPage() {
  const supabase = await createClient();
  
  const { data: exercises } = await supabase
    .from('writing_exercises')
    .select('*')
    .order('created_at', { ascending: false });

  return ;
}
```

```typescript
// features/writing/pages/WritingPageClient.tsx

'use client';

import { useState } from 'react';
import { WritingCard } from '../components/WritingCard';
import { LevelSelector } from '../components/LevelSelector';
import { useWriting } from '../hooks/useWriting';
import { useRouter } from 'next/navigation';
import type { WritingExercise, Level } from '../types/writing.types';

interface Props {
  initialExercises: WritingExercise[];
}

export function WritingPageClient({ initialExercises }: Props) {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState();
  
  const { exercises = initialExercises, isLoading } = useWriting(selectedLevel);

  return (
    
      Writing Exercises
      
      

      {isLoading ? (
        Loading...
      ) : (
        
          {exercises.map((exercise) => (
            <WritingCard
              key={exercise.id}
              exercise={exercise}
              onClick={(id) => router.push(`/writing/${id}`)}
            />
          ))}
        
      )}
    
  );
}
```

### Step 8: Create API Routes

```typescript
// app/api/writing/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/shared/lib/supabase/server';
import { handleApiError } from '@/shared/lib/api/errorHandler';
import { requireAuth } from '@/shared/lib/auth/apiAuth';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const supabase = await createClient();

    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');

    let query = supabase.from('writing_exercises').select('*');

    if (level) {
      query = query.eq('level', level);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    return handleApiError(error);
  }
}
```

---

## Summary

This example demonstrates:

1. ✅ Database schema with RLS policies
2. ✅ TypeScript types and validation schemas
3. ✅ Service layer with error handling
4. ✅ Custom hooks with React Query
5. ✅ Reusable components
6. ✅ Server and client page components
7. ✅ API routes with authentication

The pattern is consistent across all features and follows all project standards.

---

## Related Documentation

- [Templates](./02-templates.md)
- [Feature-Based Structure](../02-architecture/01-feature-based-structure.md)
- [Design Patterns](../03-code-standards/01-design-patterns.md)