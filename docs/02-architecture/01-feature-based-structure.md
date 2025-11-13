# Feature-Based Architecture

## Overview

This project follows a **strict feature-based architecture** where each feature is completely self-contained. This approach ensures:

- **Scalability**: Easy to add new features without affecting existing ones
- **Maintainability**: Clear boundaries and responsibilities
- **Testability**: Isolated features are easier to test
- **Parallel Development**: Multiple developers can work without conflicts

## Core Principle

> **Each feature owns everything it needs and nothing more**

## Feature Structure

### Standard Feature Layout

```
features/
└── [feature-name]/
    ├── components/         # Feature-specific UI components
    │   ├── FeatureCard.tsx
    │   ├── FeatureDetail.tsx
    │   └── FeatureDialog.tsx
    ├── hooks/             # Custom React hooks
    │   ├── useFeature.ts
    │   └── useFeatureLogic.ts
    ├── services/          # API communication layer
    │   ├── index.ts       # Service exports
    │   └── featureService.ts
    ├── types/             # TypeScript definitions
    │   ├── feature.types.ts
    │   └── service.types.ts
    ├── store/             # Zustand stores (optional)
    │   └── featureStore.ts
    ├── pages/             # Page components (optional)
    │   └── FeaturePage.tsx
    ├── api/               # API route handlers (optional)
    │   └── [endpoint]/
    ├── utils/             # Feature-specific utilities (optional)
    │   └── featureHelpers.ts
    └── constants/         # Feature constants (optional)
        └── config.ts
```

## Layer Responsibilities

### 1. Components Layer

**Purpose**: Presentation and user interaction

**Rules**:
- ✅ Use feature-specific hooks
- ✅ Handle UI state and events
- ✅ Import from `shared/components/ui` for base components
- ❌ NO direct service calls
- ❌ NO business logic
- ❌ NO cross-feature imports

**Example**:
```typescript
// features/grammar/components/GrammarCard.tsx
'use client';

import { Card } from '@/shared/components/ui/card';
import { useGrammar } from '../hooks/useGrammar';
import type { Grammar } from '../types/grammar.types';

interface GrammarCardProps {
  grammar: Grammar;
}

export function GrammarCard({ grammar }: GrammarCardProps) {
  const { selectGrammar } = useGrammar();
  
  return (
    <Card onClick={() => selectGrammar(grammar.id)}>
      <h3>{grammar.title}</h3>
      <p>{grammar.description}</p>
    </Card>
  );
}
```

### 2. Hooks Layer

**Purpose**: Business logic and state management

**Rules**:
- ✅ Call services for data operations
- ✅ Handle loading/error states
- ✅ Implement optimistic updates
- ✅ Use React Query for server state
- ❌ NO UI rendering
- ❌ NO direct API calls (use services)

**Example**:
```typescript
// features/grammar/hooks/useGrammar.ts
'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { grammarService } from '../services';
import type { Grammar } from '../types/grammar.types';

export function useGrammar() {
  const { data: grammars, isLoading } = useQuery({
    queryKey: ['grammars'],
    queryFn: grammarService.getAll,
  });

  const selectGrammar = useMutation({
    mutationFn: (id: string) => grammarService.getById(id),
  });

  return {
    grammars,
    isLoading,
    selectGrammar: selectGrammar.mutate,
  };
}
```

### 3. Services Layer

**Purpose**: API communication and data transformation

**Rules**:
- ✅ Handle all API calls
- ✅ Transform API responses to typed objects
- ✅ Implement error handling
- ✅ Use Supabase client or fetch
- ❌ NO React hooks
- ❌ NO component logic
- ❌ NO state management

**Example**:
```typescript
// features/grammar/services/grammarService.ts
import { createClient } from '@/shared/lib/supabase/client';
import type { Grammar, GrammarResponse } from '../types/service.types';

class GrammarService {
  private supabase = createClient();

  async getAll(): Promise<Grammar[]> {
    const { data, error } = await this.supabase
      .from('grammar_topics')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<Grammar> {
    const { data, error } = await this.supabase
      .from('grammar_topics')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(grammar: Omit<Grammar, 'id'>): Promise<Grammar> {
    const { data, error } = await this.supabase
      .from('grammar_topics')
      .insert(grammar)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export const grammarService = new GrammarService();
```

### 4. Types Layer

**Purpose**: TypeScript type definitions

**Rules**:
- ✅ Define all feature-specific types
- ✅ Export types for external use
- ✅ Separate database types from UI types
- ❌ NO logic or functions
- ❌ NO default values

**Example**:
```typescript
// features/grammar/types/grammar.types.ts
export interface Grammar {
  id: string;
  title: string;
  description: string;
  category_id: string;
  content: string;
  difficulty_level: DifficultyLevel;
  created_at: string;
  updated_at: string;
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface GrammarCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  order_index: number;
}

// features/grammar/types/service.types.ts
import type { Grammar } from './grammar.types';

export interface GrammarResponse {
  data: Grammar[];
  count: number;
  error: string | null;
}

export interface CreateGrammarInput {
  title: string;
  description: string;
  category_id: string;
  content: string;
  difficulty_level: DifficultyLevel;
}
```

### 5. Store Layer (Optional)

**Purpose**: Client-side state management with Zustand

**When to Use**:
- Complex UI state that doesn't fit in React Query
- Global state needed across multiple components
- Temporary state (not persisted to server)

**Example**:
```typescript
// features/words/store/wordsStore.ts
import { create } from 'zustand';
import type { Word } from '../types';

interface WordsStore {
  selectedWords: string[];
  practiceMode: 'flashcard' | 'quiz' | null;
  toggleWordSelection: (wordId: string) => void;
  setPracticeMode: (mode: 'flashcard' | 'quiz' | null) => void;
  clearSelection: () => void;
}

export const useWordsStore = create<WordsStore>((set) => ({
  selectedWords: [],
  practiceMode: null,
  
  toggleWordSelection: (wordId) =>
    set((state) => ({
      selectedWords: state.selectedWords.includes(wordId)
        ? state.selectedWords.filter((id) => id !== wordId)
        : [...state.selectedWords, wordId],
    })),
  
  setPracticeMode: (mode) => set({ practiceMode: mode }),
  
  clearSelection: () => set({ selectedWords: [] }),
}));
```

## Cross-Feature Communication

### ❌ WRONG: Direct Import

```typescript
// features/reading/components/ReadingCard.tsx
import { grammarService } from '@/features/grammar/services'; // WRONG!
```

### ✅ CORRECT: Shared Layer

```typescript
// shared/services/contentService.ts
export const contentService = {
  getGrammar: () => import('@/features/grammar/services').then(m => m.grammarService),
  getReading: () => import('@/features/reading/services').then(m => m.readingService),
};

// features/reading/components/ReadingCard.tsx
import { contentService } from '@/shared/services/contentService';
```

## Feature Examples

### Example 1: Grammar Feature

```
features/grammar/
├── components/
│   ├── GrammarCard.tsx          # Display grammar topic
│   ├── GrammarDetail.tsx        # Show full grammar content
│   └── CategorySelector.tsx     # Category dropdown
├── hooks/
│   ├── useGrammar.ts           # CRUD operations
│   └── useGrammarCategories.ts # Category management
├── services/
│   ├── index.ts                # Export all services
│   ├── grammarService.ts       # Grammar API calls
│   └── grammarCategoryService.ts # Category API calls
├── types/
│   ├── grammar.types.ts        # Domain types
│   └── service.types.ts        # API types
└── pages/
    └── GrammarPage.tsx         # Main grammar page
```

### Example 2: Quiz Feature (With Utils)

```
features/quiz/
├── components/
│   ├── QuizContainer.tsx       # Main quiz wrapper
│   ├── QuizQuestion.tsx        # Question renderer
│   ├── QuizProgress.tsx        # Progress indicator
│   └── QuizResult.tsx          # Results display
├── hooks/
│   ├── useQuiz.ts             # Quiz state management
│   └── useQuizSubmit.ts       # Submit handling
├── services/
│   ├── index.ts
│   └── quizService.ts         # Quiz API
├── types/
│   ├── quiz.types.ts          # Quiz models
│   └── service.types.ts       # API contracts
└── utils/
    ├── quizValidator.ts       # Answer validation
    └── scoreCalculator.ts     # Score computation
```

### Example 3: Admin Feature (Complex)

```
features/admin/
├── components/
│   ├── AdminHeader.tsx
│   ├── AdminSidebar.tsx
│   ├── StatsCard.tsx
│   ├── AddGrammarDialog.tsx
│   ├── EditGrammarDialog.tsx
│   ├── DeleteConfirmDialog.tsx
│   └── UserDetailsDialog.tsx
├── hooks/
│   ├── useAdminStats.ts
│   ├── useGrammarTopics.ts
│   ├── useGrammarCategories.ts
│   ├── useListeningContent.ts
│   ├── useReadingContent.ts
│   └── useUsers.ts
└── services/
    └── (uses feature services via shared layer)
```

## API Routes Integration

API routes live in `app/api/` but are grouped by feature:

```
app/api/
├── grammar/
│   ├── route.ts              # GET /api/grammar
│   └── [id]/
│       └── route.ts          # GET /api/grammar/[id]
├── listening/
│   └── [level]/
│       └── route.ts
└── quiz/
    ├── submit/
    │   └── route.ts
    └── results/
        └── route.ts
```

**Route Handler Template**:
```typescript
// app/api/grammar/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/shared/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('grammar_topics')
      .select('*');

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch grammar topics' },
      { status: 500 }
    );
  }
}
```

## Migration Guide

### Adding a New Feature

1. Create feature directory: `features/new-feature/`
2. Set up folder structure (components, hooks, services, types)
3. Create service with API calls
4. Create hooks using the service
5. Build components using the hooks
6. Export from feature's `index.ts` if needed

### Moving Code to Shared

If code is used by 3+ features:
1. Move to `shared/` in appropriate subdirectory
2. Update all imports
3. Remove from feature directory

## Best Practices

### DO ✅

- Keep features independent
- Use services for ALL API calls
- Define types in the types layer
- Use React Query for server state
- Use Zustand only for complex UI state
- Export through index.ts files

### DON'T ❌

- Import from other features
- Put business logic in components
- Make API calls in hooks directly
- Use `any` types
- Create circular dependencies
- Mix concerns across layers

---

## Related Documentation

- [Shared Resources](./02-shared-resources.md)
- [Component Architecture](../03-code-standards/02-component-architecture.md)
- [Design Patterns](../03-code-standards/01-design-patterns.md)