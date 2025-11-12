# AI Development Guidelines for Learn Quiz English Project

## Project Overview
This is a Next.js 16 application built with React 19, TypeScript, Supabase, and modern frontend tooling. Follow these guidelines strictly when generating or modifying code.

---

## Technology Stack

### Core Framework
- **Next.js 16.0.1** with App Router
- **React 19.2.0** with React Compiler enabled
- **TypeScript 5**
- **Tailwind CSS 4**

### State Management & Data Fetching
- **Zustand 5.0.8** - Global state management
- **TanStack Query 5.90.5** - Server state management
- **React Hook Form 7.65.0** - Form state management

### Backend & Database
- **Supabase** - Authentication, database, and storage
- **@supabase/ssr** - Server-side rendering support
- **AWS S3** - File storage with presigned URLs

### UI Components
- **Radix UI** - Headless component primitives
- **shadcn/ui patterns** - Component architecture
- **Lucide React** - Icon system
- **Sonner** - Toast notifications

### Payment Integration
- **Stripe** - Payment processing
- **Lemon Squeezy** - Alternative payment provider

### Validation & Schemas
- **Zod 4.1.12** - Runtime type validation
- **@hookform/resolvers** - Form validation integration

---

## Code Quality Standards

### 1. Design Patterns

#### Repository Pattern
```typescript
// Use for data access layer
class UserRepository {
  async findById(id: string): Promise<User | null> {
    // Implementation
  }
  
  async create(data: CreateUserDto): Promise<User> {
    // Implementation
  }
}
```

#### Factory Pattern
```typescript
// Use for creating complex objects
class QuizFactory {
  static createQuiz(type: QuizType, options: QuizOptions): Quiz {
    switch (type) {
      case 'grammar':
        return new GrammarQuiz(options);
      case 'vocabulary':
        return new VocabularyQuiz(options);
      default:
        throw new Error('Invalid quiz type');
    }
  }
}
```

#### Strategy Pattern
```typescript
// Use for interchangeable algorithms
interface PaymentStrategy {
  processPayment(amount: number): Promise<PaymentResult>;
}

class StripePayment implements PaymentStrategy {
  async processPayment(amount: number): Promise<PaymentResult> {
    // Stripe implementation
  }
}

class LemonSqueezyPayment implements PaymentStrategy {
  async processPayment(amount: number): Promise<PaymentResult> {
    // Lemon Squeezy implementation
  }
}
```

#### Dependency Injection
```typescript
// Use for loose coupling
class QuizService {
  constructor(
    private repository: QuizRepository,
    private validator: QuizValidator
  ) {}
  
  async createQuiz(data: CreateQuizDto): Promise<Quiz> {
    await this.validator.validate(data);
    return this.repository.create(data);
  }
}
```

#### Observer Pattern (with Zustand)
```typescript
// Use for state management
interface AppStore {
  user: User | null;
  setUser: (user: User) => void;
  subscribe: (listener: () => void) => () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

### 2. Component Architecture

#### Server Components (Default)
```typescript
// app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('users').select('*');
  
  return <Dashboard data={data} />;
}
```

#### Client Components (When Needed)
```typescript
'use client';

// Use client components only for:
// - Event handlers
// - Hooks (useState, useEffect, etc.)
// - Browser APIs
// - Third-party libraries requiring window

import { useState } from 'react';

export function InteractiveQuiz() {
  const [answer, setAnswer] = useState('');
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Implementation */}
    </form>
  );
}
```

#### Compound Component Pattern
```typescript
// components/quiz/quiz.tsx
interface QuizContextValue {
  currentQuestion: number;
  totalQuestions: number;
}

const QuizContext = createContext<QuizContextValue | null>(null);

export function Quiz({ children }: { children: React.ReactNode }) {
  return (
    <QuizContext.Provider value={/* ... */}>
      <div className="quiz-container">{children}</div>
    </QuizContext.Provider>
  );
}

Quiz.Question = QuizQuestion;
Quiz.Answer = QuizAnswer;
Quiz.Progress = QuizProgress;
```

### 3. File Structure

# AI Development Guidelines for Learn Quiz English Project

## Project Overview
This is a Next.js 16 application built with React 19, TypeScript, Supabase, and modern frontend tooling. Follow these guidelines strictly when generating or modifying code.

---

## Technology Stack

### Core Framework
- **Next.js 16.0.1** with App Router
- **React 19.2.0** with React Compiler enabled
- **TypeScript 5**
- **Tailwind CSS 4**

### State Management & Data Fetching
- **Zustand 5.0.8** - Global state management
- **TanStack Query 5.90.5** - Server state management
- **React Hook Form 7.65.0** - Form state management

### Backend & Database
- **Supabase** - Authentication, database, and storage
- **@supabase/ssr** - Server-side rendering support
- **AWS S3** - File storage with presigned URLs

### UI Components
- **Radix UI** - Headless component primitives
- **shadcn/ui patterns** - Component architecture
- **Lucide React** - Icon system
- **Sonner** - Toast notifications

### Payment Integration
- **Stripe** - Payment processing
- **Lemon Squeezy** - Alternative payment provider

### Validation & Schemas
- **Zod 4.1.12** - Runtime type validation
- **@hookform/resolvers** - Form validation integration

---

## CRITICAL: Feature-Based Folder Structure

### YOU MUST USE FEATURE-BASED ARCHITECTURE

This project follows a **strict feature-based folder structure**. Every piece of code must be organized by feature, not by file type.

### ❌ WRONG - Type-Based Structure (DO NOT USE)
```
src/
  ├── components/
  │   ├── GrammarCard.tsx
  │   ├── ListeningPlayer.tsx
  │   ├── QuizContainer.tsx
  ├── hooks/
  │   ├── useGrammar.ts
  │   ├── useListening.ts
  │   ├── useQuiz.ts
  ├── services/
  │   ├── grammarService.ts
  │   ├── listeningService.ts
  │   ├── quizService.ts
```

### ✅ CORRECT - Feature-Based Structure (MUST USE)
```
src/
  └── features/
      ├── grammar/
      │   ├── components/
      │   │   ├── GrammarCard.tsx
      │   │   ├── GrammarDetail.tsx
      │   │   └── CategoryCard.tsx
      │   ├── hooks/
      │   │   ├── useGrammar.ts
      │   │   └── useGrammarCategories.ts
      │   ├── services/
      │   │   ├── grammarService.ts
      │   │   └── index.ts
      │   ├── types/
      │   │   └── grammar.types.ts
      │   ├── utils/
      │   │   └── grammarHelpers.ts
      │   └── constants/
      │       └── grammarLevels.ts
      │
      ├── listening/
      │   ├── components/
      │   ├── hooks/
      │   ├── services/
      │   ├── types/
      │   ├── utils/
      │   └── constants/
      │
      └── quiz/
          ├── components/
          ├── hooks/
          ├── services/
          ├── types/
          ├── utils/
          └── constants/
```

---

## Feature Structure Rules

### 1. Each Feature MUST Have This Structure

```
features/
  └── {feature-name}/
      ├── components/          # Feature-specific UI components
      ├── hooks/              # Feature-specific custom hooks
      ├── services/           # API calls and business logic
      ├── types/              # TypeScript type definitions
      ├── utils/              # Helper functions
      ├── constants/          # Constants and configurations
      └── store/              # State management (if needed)
```

### 2. Complete Feature List

Your project has these features. Each MUST follow the structure above:

#### Core Features
- **admin** - Admin panel functionality
- **auth** - Authentication and user management
- **grammar** - Grammar learning content
- **listening** - Listening exercises
- **reading** - Reading comprehension
- **quiz** - Quiz system and questions
- **words** - Vocabulary management
- **statistics** - User progress tracking
- **premium** - Premium subscription features
- **layout** - Navigation and layout components

### 3. Example: Grammar Feature Structure

```typescript
// features/grammar/components/GrammarCard.tsx
'use client';

import { Card } from '@/shared/components/ui/card';
import { useGrammar } from '../hooks/useGrammar';
import { GrammarTopic } from '../types/grammar.types';

export function GrammarCard({ topic }: { topic: GrammarTopic }) {
  const { isCompleted } = useGrammar(topic.id);
  
  return (
    <Card>
      <h3>{topic.title}</h3>
      {isCompleted && <Badge>Completed</Badge>}
    </Card>
  );
}

// features/grammar/hooks/useGrammar.ts
import { useQuery } from '@tanstack/react-query';
import { grammarService } from '../services/grammarService';

export function useGrammar(topicId: string) {
  const { data } = useQuery({
    queryKey: ['grammar', topicId],
    queryFn: () => grammarService.getById(topicId),
  });
  
  return {
    topic: data,
    isCompleted: data?.completed ?? false,
  };
}

// features/grammar/services/grammarService.ts
import { createClient } from '@/shared/lib/supabase/client';
import { GrammarTopic } from '../types/grammar.types';

export const grammarService = {
  async getById(id: string): Promise<GrammarTopic> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('grammar_topics')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async getAll(): Promise<GrammarTopic[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('grammar_topics')
      .select('*');
    
    if (error) throw error;
    return data;
  },
};

// features/grammar/types/grammar.types.ts
export interface GrammarTopic {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
  created_at: string;
}

export interface GrammarQuestion {
  id: string;
  topic_id: string;
  question: string;
  answer: string;
  type: 'multiple' | 'fillblank' | 'truefalse';
}

// features/grammar/constants/grammarLevels.ts
export const GRAMMAR_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;

export const LEVEL_COLORS = {
  beginner: 'bg-green-500',
  intermediate: 'bg-yellow-500',
  advanced: 'bg-red-500',
};
```

### 4. Shared Resources

Items used across multiple features go in `shared/`:

```
shared/
  ├── components/
  │   ├── ui/                    # shadcn/ui components
  │   │   ├── button.tsx
  │   │   ├── card.tsx
  │   │   ├── dialog.tsx
  │   │   └── ...
  │   ├── common/                # Reusable components
  │   │   ├── AudioPlayer.tsx
  │   │   ├── LoadingSpinner.tsx
  │   │   └── ErrorBoundary.tsx
  │   └── providers/             # Context providers
  │       ├── QueryProvider.tsx
  │       ├── ThemeProvider.tsx
  │       └── AuthProvider.tsx
  │
  ├── hooks/                     # Global hooks
  │   ├── useTheme.ts
  │   ├── useMediaQuery.ts
  │   └── useDebounce.ts
  │
  ├── lib/                       # Third-party integrations
  │   ├── supabase/
  │   │   ├── client.ts
  │   │   ├── server.ts
  │   │   └── middleware.ts
  │   ├── lemonsqueezy/
  │   │   ├── client.ts
  │   │   └── config.ts
  │   └── utils.ts
  │
  ├── services/                  # Shared services
  │   ├── base/
  │   │   ├── baseService.ts
  │   │   └── apiClient.ts
  │   ├── storage/
  │   │   └── audioUploadService.ts
  │   └── browser/
  │       ├── cookieService.ts
  │       └── localStorageService.ts
  │
  ├── types/                     # Global types
  │   ├── common.types.ts
  │   ├── database.types.ts
  │   └── api.types.ts
  │
  ├── utils/                     # Global utilities
  │   ├── validators.ts
  │   ├── formatters.ts
  │   └── helpers.ts
  │
  └── constants/                 # Global constants
      ├── config.ts
      ├── endpoints.ts
      └── errorMessages.ts
```

### 5. API Routes Structure

API routes MUST also follow feature boundaries:

```
app/api/
  ├── auth/
  │   └── callback/
  │       └── route.ts
  │
  ├── admin/
  │   ├── grammar/
  │   │   ├── categories/
  │   │   │   └── route.ts
  │   │   └── questions/
  │   │       └── route.ts
  │   ├── listening/
  │   │   └── route.ts
  │   └── users/
  │       └── route.ts
  │
  ├── grammar/
  │   ├── categories/
  │   │   └── route.ts
  │   └── topics/
  │       └── route.ts
  │
  ├── listening/
  │   ├── content/
  │   │   └── route.ts
  │   └── audio/
  │       ├── upload/
  │       │   └── route.ts
  │       └── delete/
  │           └── route.ts
  │
  ├── quiz/
  │   ├── submit/
  │   │   └── route.ts
  │   └── results/
  │       └── route.ts
  │
  └── premium/
      ├── checkout/
      │   └── route.ts
      └── webhook/
          └── route.ts
```

### 6. Import Rules

#### ✅ CORRECT Imports
```typescript
// Import from the same feature
import { GrammarCard } from '../components/GrammarCard';
import { useGrammar } from '../hooks/useGrammar';
import { grammarService } from '../services/grammarService';

// Import from shared
import { Button } from '@/shared/components/ui/button';
import { useTheme } from '@/shared/hooks/useTheme';
import { createClient } from '@/shared/lib/supabase/client';

// Import from other features (ONLY types and constants)
import type { QuizQuestion } from '@/features/quiz/types/quiz.types';
import { QUIZ_TYPES } from '@/features/quiz/constants/quizTypes';
```

#### ❌ WRONG Imports
```typescript
// DO NOT import components/hooks/services from other features
import { QuizContainer } from '@/features/quiz/components/QuizContainer';
import { useQuiz } from '@/features/quiz/hooks/useQuiz';
import { quizService } from '@/features/quiz/services/quizService';
```

**Rule**: Features should be loosely coupled. Only import types and constants from other features. If you need functionality from another feature, it should probably be in `shared/`.

### 7. File Naming Conventions

```typescript
// Components: PascalCase.tsx
GrammarCard.tsx
ListeningPlayer.tsx
QuizContainer.tsx

// Hooks: use-kebab-case.ts
use-grammar.ts
use-quiz-submit.ts
use-listening-player.ts

// Services: camelCase.ts
grammarService.ts
quizService.ts
listeningService.ts

// Types: kebab-case.types.ts
grammar.types.ts
quiz.types.ts
listening.types.ts

// Utils: kebab-case.ts
grammar-helpers.ts
quiz-validator.ts
score-calculator.ts

// Constants: camelCase.ts OR UPPER_SNAKE_CASE.ts
grammarLevels.ts
QUIZ_SETTINGS.ts
```

---

## When to Create a New Feature

Create a new feature folder when:

1. ✅ You're adding a distinct business domain (e.g., "flashcards", "achievements")
2. ✅ The feature has multiple related components, hooks, and services
3. ✅ The feature can be developed and tested independently
4. ✅ The feature has its own data models and business logic

DO NOT create a feature for:

1. ❌ Single utility functions (put in `shared/utils/`)
2. ❌ Reusable UI components (put in `shared/components/ui/`)
3. ❌ Generic hooks (put in `shared/hooks/`)
4. ❌ One-off components used in a single page

---

## Code Quality Standards

### 1. Design Patterns

#### Repository Pattern
```typescript
// features/grammar/services/grammarRepository.ts
class GrammarRepository {
  async findById(id: string): Promise<GrammarTopic | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('grammar_topics')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data;
  }
  
  async create(data: CreateGrammarDto): Promise<GrammarTopic> {
    const supabase = createClient();
    const { data: created, error } = await supabase
      .from('grammar_topics')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return created;
  }
}

export const grammarRepository = new GrammarRepository();
```

#### Service Layer Pattern
```typescript
// features/grammar/services/grammarService.ts
import { grammarRepository } from './grammarRepository';
import { grammarValidator } from '../utils/grammarValidator';

export const grammarService = {
  async getById(id: string) {
    const topic = await grammarRepository.findById(id);
    if (!topic) throw new Error('Topic not found');
    return topic;
  },
  
  async create(data: CreateGrammarDto) {
    // Validate
    await grammarValidator.validate(data);
    
    // Business logic
    const enrichedData = {
      ...data,
      slug: generateSlug(data.title),
      created_at: new Date().toISOString(),
    };
    
    // Persist
    return grammarRepository.create(enrichedData);
  },
};
```

#### Custom Hook Pattern
```typescript
// features/grammar/hooks/useGrammar.ts
export function useGrammar(topicId: string) {
  const queryClient = useQueryClient();
  
  const { data: topic, isLoading, error } = useQuery({
    queryKey: ['grammar', topicId],
    queryFn: () => grammarService.getById(topicId),
  });
  
  const updateMutation = useMutation({
    mutationFn: (data: UpdateGrammarDto) => 
      grammarService.update(topicId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grammar'] });
      toast.success('Updated successfully');
    },
  });
  
  return {
    topic,
    isLoading,
    error,
    update: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}
```

### 2. TypeScript Best Practices

```typescript
// features/grammar/types/grammar.types.ts

// Use strict types
export interface GrammarTopic {
  id: string;
  title: string;
  description: string;
  level: GrammarLevel;
  category_id: string;
  created_at: string;
  updated_at: string;
}

// Use enums or const assertions
export type GrammarLevel = 'beginner' | 'intermediate' | 'advanced';

// DTOs for API operations
export interface CreateGrammarDto {
  title: string;
  description: string;
  level: GrammarLevel;
  category_id: string;
}

export interface UpdateGrammarDto extends Partial<CreateGrammarDto> {}

// Utility types
export type GrammarWithCategory = GrammarTopic & {
  category: {
    id: string;
    name: string;
  };
};
```

### 3. Error Handling

```typescript
// features/grammar/services/grammarService.ts
export const grammarService = {
  async getById(id: string): Promise<GrammarTopic> {
    try {
      const topic = await grammarRepository.findById(id);
      
      if (!topic) {
        throw new Error('Grammar topic not found');
      }
      
      return topic;
    } catch (error) {
      console.error('Error fetching grammar topic:', error);
      throw error;
    }
  },
};

// features/grammar/components/GrammarDetail.tsx
'use client';

export function GrammarDetail({ id }: { id: string }) {
  const { topic, error, isLoading } = useGrammar(id);
  
  if (isLoading) return <Skeleton />;
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load grammar topic. Please try again.
        </AlertDescription>
      </Alert>
    );
  }
  
  return <div>{/* Render topic */}</div>;
}
```

### 4. Validation with Zod

```typescript
// features/grammar/utils/grammarValidator.ts
import { z } from 'zod';

export const grammarTopicSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  category_id: z.string().uuid(),
});

export const grammarValidator = {
  validate: (data: unknown) => grammarTopicSchema.parse(data),
  safeParse: (data: unknown) => grammarTopicSchema.safeParse(data),
};

// Use in API routes
// app/api/grammar/topics/route.ts
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = grammarValidator.validate(body);
    const topic = await grammarService.create(validatedData);
    return NextResponse.json(topic);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## Critical Rules Summary

1. **ALWAYS use feature-based structure** - Never organize by file type
2. **Each feature is self-contained** - components, hooks, services, types, utils, constants
3. **Shared resources go in shared/** - Reusable across features
4. **API routes follow feature boundaries** - `/api/grammar/`, `/api/quiz/`, etc.
5. **Only import types/constants from other features** - Keep features loosely coupled
6. **Use strict TypeScript** - No `any`, proper interfaces
7. **Validate all inputs** - Use Zod schemas
8. **Handle errors gracefully** - Try/catch, user-friendly messages
9. **Follow naming conventions** - PascalCase for components, camelCase for functions
10. **Document complex logic** - JSDoc for public APIs

---

## Examples of Common Tasks

### Creating a New Feature

```bash
# 1. Create feature structure
mkdir -p src/features/flashcards/{components,hooks,services,types,utils,constants}

# 2. Create files
touch src/features/flashcards/components/FlashcardItem.tsx
touch src/features/flashcards/hooks/useFlashcards.ts
touch src/features/flashcards/services/flashcardService.ts
touch src/features/flashcards/types/flashcard.types.ts

# 3. Implement following the patterns above
```

### Adding a New Component to Existing Feature

```typescript
// src/features/grammar/components/GrammarProgress.tsx
'use client';

import { Progress } from '@/shared/components/ui/progress';
import { useGrammar } from '../hooks/useGrammar';
import type { GrammarTopic } from '../types/grammar.types';

interface GrammarProgressProps {
  topic: GrammarTopic;
}

export function GrammarProgress({ topic }: GrammarProgressProps) {
  const { completionRate } = useGrammar(topic.id);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Progress</span>
        <span>{completionRate}%</span>
      </div>
      <Progress value={completionRate} />
    </div>
  );
}
```

---

Remember: **Consistency is key**. Always follow this structure, and the codebase will remain maintainable, scalable, and easy to understand.

### 4. Naming Conventions

#### Files
- **Components**: `PascalCase.tsx` (e.g., `QuizCard.tsx`)
- **Utilities**: `kebab-case.ts` (e.g., `format-date.ts`)
- **Hooks**: `use-kebab-case.ts` (e.g., `use-quiz-state.ts`)
- **Types**: `kebab-case.types.ts` (e.g., `quiz.types.ts`)

#### Variables & Functions
```typescript
// camelCase for variables and functions
const userName = 'John';
function getUserData() {}

// PascalCase for components and classes
function QuizCard() {}
class QuizService {}

// UPPER_SNAKE_CASE for constants
const MAX_QUIZ_ATTEMPTS = 3;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
```

### 5. TypeScript Best Practices

#### Strict Type Safety
```typescript
// ✅ Good - Explicit types
interface QuizQuestion {
  id: string;
  question: string;
  answers: string[];
  correctAnswer: number;
}

function getQuestion(id: string): Promise<QuizQuestion> {
  // Implementation
}

// ❌ Bad - Implicit any
function getQuestion(id) {
  // Implementation
}
```

#### Utility Types
```typescript
// Use built-in utility types
type PartialQuiz = Partial<Quiz>;
type ReadonlyQuiz = Readonly<Quiz>;
type QuizKeys = keyof Quiz;
type QuizId = Pick<Quiz, 'id'>;
type QuizWithoutId = Omit<Quiz, 'id'>;
```

#### Discriminated Unions
```typescript
// Use for type-safe state machines
type QuizState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Quiz }
  | { status: 'error'; error: Error };

function handleQuizState(state: QuizState) {
  switch (state.status) {
    case 'success':
      return state.data; // Type-safe access
    case 'error':
      return state.error.message;
    // ...
  }
}
```

### 6. Error Handling

#### API Routes
```typescript
// app/api/quiz/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate with Zod
    const validatedData = quizSchema.parse(body);
    
    // Process
    const result = await createQuiz(validatedData);
    
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Quiz creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### Client Components
```typescript
'use client';

import { toast } from 'sonner';

export function QuizForm() {
  async function handleSubmit(data: QuizFormData) {
    try {
      await createQuiz(data);
      toast.success('Quiz created successfully');
    } catch (error) {
      toast.error('Failed to create quiz');
      console.error(error);
    }
  }
}
```

### 7. Performance Optimization

#### React Query Configuration
```typescript
// lib/react-query.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      cacheTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

#### Dynamic Imports
```typescript
// Use for code splitting
import dynamic from 'next/dynamic';

const QuizEditor = dynamic(() => import('@/components/quiz/quiz-editor'), {
  loading: () => <QuizEditorSkeleton />,
  ssr: false, // Disable SSR if using browser APIs
});
```

#### Memoization
```typescript
import { useMemo, useCallback } from 'react';

export function QuizList({ quizzes }: { quizzes: Quiz[] }) {
  const sortedQuizzes = useMemo(
    () => quizzes.sort((a, b) => a.order - b.order),
    [quizzes]
  );
  
  const handleSelect = useCallback((id: string) => {
    // Handler logic
  }, []);
  
  return (
    // Implementation
  );
}
```

### 8. Security Best Practices

#### Environment Variables
```typescript
// Never expose sensitive keys to client
// ✅ Server-only
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// ✅ Client-safe (prefixed with NEXT_PUBLIC_)
const PUBLIC_STRIPE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
```

#### Input Validation
```typescript
// Always validate user input with Zod
import { z } from 'zod';

const quizSchema = z.object({
  title: z.string().min(3).max(100),
  questions: z.array(questionSchema).min(1).max(50),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});
```

#### Supabase RLS
```typescript
// Use Row Level Security policies
// Define policies in Supabase dashboard
// Access data through authenticated client only

const supabase = createClient();
const { data, error } = await supabase
  .from('quizzes')
  .select('*')
  .eq('user_id', userId); // Filtered by RLS
```

### 9. Testing Guidelines

#### Unit Tests
```typescript
// __tests__/utils/format-date.test.ts
import { formatDate } from '@/lib/utils/format-date';

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-01-01');
    expect(formatDate(date)).toBe('January 1, 2024');
  });
});
```

#### Component Tests
```typescript
// __tests__/components/quiz-card.test.tsx
import { render, screen } from '@testing-library/react';
import { QuizCard } from '@/components/quiz-card';

describe('QuizCard', () => {
  it('renders quiz title', () => {
    render(<QuizCard title="Test Quiz" />);
    expect(screen.getByText('Test Quiz')).toBeInTheDocument();
  });
});
```

### 10. Documentation

#### JSDoc Comments
```typescript
/**
 * Creates a new quiz with validation and user association
 * 
 * @param data - Quiz creation data
 * @param userId - ID of the user creating the quiz
 * @returns Promise resolving to created quiz
 * @throws {ValidationError} If quiz data is invalid
 * @throws {UnauthorizedError} If user is not authenticated
 * 
 * @example
 * ```typescript
 * const quiz = await createQuiz({
 *   title: 'Grammar Quiz',
 *   questions: [...]
 * }, user.id);
 * ```
 */
async function createQuiz(
  data: CreateQuizDto,
  userId: string
): Promise<Quiz> {
  // Implementation
}
```

---

## Critical Rules

1. **Always use TypeScript** - No implicit `any` types
2. **Validate all inputs** - Use Zod schemas
3. **Follow design patterns** - Maintain consistent architecture
4. **Use Server Components by default** - Only use Client Components when necessary
5. **Handle errors gracefully** - Provide meaningful error messages
6. **Optimize performance** - Use React Query, memoization, and code splitting
7. **Secure by default** - Validate, sanitize, and use RLS
8. **Write clean code** - Follow naming conventions and file structure
9. **Document complex logic** - Use JSDoc for public APIs
10. **Test critical paths** - Write tests for business logic

---

## Additional Notes

- Prefer composition over inheritance
- Keep components small and focused (Single Responsibility Principle)
- Use custom hooks to extract reusable logic
- Leverage TypeScript's type system fully
- Follow accessibility best practices (ARIA labels, semantic HTML)
- Use CSS variables and Tailwind utilities consistently
- Keep bundle size small (use dynamic imports for heavy components)
- Monitor and log errors appropriately
- Use environment-specific configurations

---

**Remember**: Code quality and maintainability are as important as functionality. Always write code that your future self and teammates can easily understand and modify.