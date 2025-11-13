# Performance Optimization

## Overview

Performance optimization ensures fast load times, smooth interactions, and efficient resource usage. This document outlines optimization strategies for this Next.js application.

## Server Components Optimization

### 1. Use Server Components by Default

```typescript
// ✅ Server Component (default) - No JavaScript sent to client
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

// ❌ Client Component - Adds unnecessary JavaScript
'use client';
export default function GrammarPage() {
  const [grammars, setGrammars] = useState([]);
  // ...
}
```

### 2. Streaming with Suspense

```typescript
// app/(main)/grammar/page.tsx
import { Suspense } from 'react';
import { GrammarList } from '@/features/grammar/components/GrammarList';
import { GrammarSkeleton } from '@/features/grammar/components/GrammarSkeleton';

async function GrammarContent() {
  const supabase = await createClient();
  const { data } = await supabase.from('grammar_topics').select('*');
  
  return ;
}

export default function GrammarPage() {
  return (
    
      Grammar Topics
      }>
        
      
    
  );
}
```

## React Query Optimization

### 1. Stale Time & Cache Configuration

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
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            retry: 1,
          },
        },
      })
  );

  return (
    
      {children}
    
  );
}
```

### 2. Prefetching Data

```typescript
// app/(main)/grammar/page.tsx
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { GrammarPageClient } from '@/features/grammar/pages/GrammarPageClient';
import { grammarService } from '@/features/grammar/services';

export default async function GrammarPage() {
  const queryClient = new QueryClient();

  // Prefetch data on server
  await queryClient.prefetchQuery({
    queryKey: ['grammars'],
    queryFn: grammarService.getAll,
  });

  return (
    
      
    
  );
}
```

### 3. Optimistic Updates

```typescript
// features/words/hooks/useWords.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useWords() {
  const queryClient = useQueryClient();

  const deleteWord = useMutation({
    mutationFn: (id: string) => wordsService.delete(id),
    
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['words'] });
      
      const previous = queryClient.getQueryData(['words']);
      
      // Optimistically remove word
      queryClient.setQueryData(['words'], (old) =>
        old?.filter((word) => word.id !== id)
      );
      
      return { previous };
    },
    
    onError: (err, id, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(['words'], context.previous);
      }
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] });
    },
  });

  return { deleteWord };
}
```

## Component Optimization

### 1. React.memo for Pure Components

```typescript
import { memo } from 'react';

interface GrammarCardProps {
  grammar: Grammar;
  onClick?: (id: string) => void;
}

export const GrammarCard = memo(function GrammarCard({ 
  grammar, 
  onClick 
}: GrammarCardProps) {
  return (
    <Card onClick={() => onClick?.(grammar.id)}>
      
        {grammar.title}
      
      
        {grammar.description}
      
    
  );
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.grammar.id === nextProps.grammar.id &&
         prevProps.grammar.updated_at === nextProps.grammar.updated_at;
});
```

### 2. useCallback for Stable Callbacks

```typescript
'use client';

import { useCallback } from 'react';
import { useWords } from '../hooks/useWords';

export function WordsList() {
  const { deleteWord } = useWords();

  const handleDelete = useCallback((id: string) => {
    if (confirm('Are you sure?')) {
      deleteWord(id);
    }
  }, [deleteWord]);

  const handleEdit = useCallback((id: string) => {
    // Handle edit
  }, []);

  return (
    
      {words.map((word) => (
        
      ))}
    
  );
}
```

### 3. useMemo for Expensive Computations

```typescript
'use client';

import { useMemo } from 'react';

export function StatisticsPage({ data }: { data: UserProgress[] }) {
  const statistics = useMemo(() => {
    const totalQuestions = data.reduce((sum, p) => sum + p.questions_count, 0);
    const correctAnswers = data.reduce((sum, p) => sum + p.correct_answers, 0);
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    
    return {
      totalQuestions,
      correctAnswers,
      accuracy: accuracy.toFixed(2),
    };
  }, [data]);

  return (
    
      Total Questions: {statistics.totalQuestions}
      Correct Answers: {statistics.correctAnswers}
      Accuracy: {statistics.accuracy}%
    
  );
}
```

## Code Splitting & Dynamic Imports

### 1. Dynamic Imports for Heavy Components

```typescript
import dynamic from 'next/dynamic';

// Lazy load heavy component
const QuizContainer = dynamic(
  () => import('@/features/quiz/components/QuizContainer'),
  {
    loading: () => ,
    ssr: false, // Disable SSR if not needed
  }
);

export function QuizPage() {
  return (
    
      Quiz
      
    
  );
}
```

### 2. Route-Based Code Splitting

```typescript
// Automatic code splitting per route
// Each page bundle is loaded only when needed
app/
  (main)/
    grammar/page.tsx        → /grammar.js
    listening/page.tsx      → /listening.js
    reading/page.tsx        → /reading.js
    my-words/page.tsx       → /my-words.js
```

## Image Optimization

### 1. Next.js Image Component

```typescript
import Image from 'next/image';

export function UserAvatar({ user }: { user: User }) {
  return (
    <Image
      src={user.avatar_url || '/default-avatar.png'}
      alt={user.name}
      width={40}
      height={40}
      className="rounded-full"
      priority={false} // Set to true for above-the-fold images
    />
  );
}
```

### 2. Lazy Loading Images

```typescript
export function GrammarCard({ grammar }: { grammar: Grammar }) {
  return (
    
      {grammar.image_url && (
        <Image
          src={grammar.image_url}
          alt={grammar.title}
          width={300}
          height={200}
          loading="lazy" // Lazy load below-the-fold images
        />
      )}
      
        {grammar.title}
      
    
  );
}
```

## Database Query Optimization

### 1. Select Only Needed Fields

```typescript
// ❌ BAD: Fetch all fields
const { data } = await supabase
  .from('grammar_topics')
  .select('*');

// ✅ GOOD: Select only needed fields
const { data } = await supabase
  .from('grammar_topics')
  .select('id, title, description, difficulty_level');
```

### 2. Use Indexes

```sql
-- Create indexes for frequently queried columns
CREATE INDEX idx_grammar_category ON grammar_topics(category_id);
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_words_user ON user_words(user_id);
CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);

-- Composite indexes for common queries
CREATE INDEX idx_progress_user_date ON user_progress(user_id, created_at DESC);
CREATE INDEX idx_words_user_category ON user_words(user_id, category_id);
```

### 3. Pagination

```typescript
// features/grammar/services/grammarService.ts
async getAll(page: number = 1, pageSize: number = 20) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await this.supabase
    .from('grammar_topics')
    .select('*', { count: 'exact' })
    .range(from, to)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return {
    data,
    count,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}
```

## Audio Optimization

### 1. Lazy Load Howler.js

```typescript
import dynamic from 'next/dynamic';

const AudioPlayer = dynamic(
  () => import('@/features/reading/components/AudioPlayer'),
  {
    ssr: false, // Audio not needed on server
    loading: () => Loading audio player...,
  }
);
```

### 2. Preload Audio for Better UX

```typescript
'use client';

import { Howl } from 'howler';
import { useEffect, useRef } from 'react';

export function AudioPlayer({ src }: { src: string }) {
  const soundRef = useRef(null);

  useEffect(() => {
    // Preload audio
    soundRef.current = new Howl({
      src: [src],
      preload: true,
      html5: true, // Use HTML5 Audio for streaming
      onload: () => console.log('Audio loaded'),
      onloaderror: (id, error) => console.error('Load error:', error),
    });

    return () => {
      soundRef.current?.unload();
    };
  }, [src]);

  const play = () => soundRef.current?.play();
  const pause = () => soundRef.current?.pause();

  return (
    
      Play
      Pause
    
  );
}
```

## Bundle Size Optimization

### 1. Analyze Bundle Size

```bash
# Add to package.json
"scripts": {
  "analyze": "ANALYZE=true next build"
}

# Install bundle analyzer
npm install @next/bundle-analyzer
```

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ... other config
});
```

### 2. Tree Shaking

```typescript
// ✅ GOOD: Import only what you need
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';

// ❌ BAD: Import everything
import * as ReactQuery from '@tanstack/react-query';
import * as Supabase from '@supabase/supabase-js';
```

## Caching Strategies

### 1. Next.js Route Caching

```typescript
// app/(main)/grammar/page.tsx
export const revalidate = 3600; // Revalidate every hour

export default async function GrammarPage() {
  const data = await fetchGrammars();
  return ;
}
```

### 2. API Route Caching

```typescript
// app/api/grammar/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const data = await fetchGrammars();

  return NextResponse.json(
    { data },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  );
}
```

## Performance Monitoring

### 1. Web Vitals

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    
      
        {children}
        
        
      
    
  );
}
```

### 2. Custom Performance Tracking

```typescript
// shared/lib/performance.ts
export function measurePerformance(name: string, fn: () => void) {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start}ms`);
}

// Usage
measurePerformance('Data processing', () => {
  processData(largeDataset);
});
```

## Performance Checklist

### ✅ Server Components
- [ ] Use Server Components by default
- [ ] Add 'use client' only when needed
- [ ] Implement Streaming with Suspense
- [ ] Prefetch data for client components

### ✅ React Optimization
- [ ] Use React.memo for expensive components
- [ ] Implement useCallback for stable callbacks
- [ ] Use useMemo for expensive computations
- [ ] Optimize re-renders with proper dependencies

### ✅ Code Splitting
- [ ] Dynamic imports for heavy components
- [ ] Route-based code splitting
- [ ] Lazy load below-the-fold content
- [ ] Tree shake unused code

### ✅ Data Fetching
- [ ] Configure React Query properly (staleTime, gcTime)
- [ ] Implement pagination for large datasets
- [ ] Select only needed database fields
- [ ] Add database indexes for common queries

### ✅ Assets
- [ ] Use Next.js Image component
- [ ] Lazy load images and media
- [ ] Preload critical assets
- [ ] Optimize audio files

### ✅ Caching
- [ ] Implement route-level caching
- [ ] Add API response caching
- [ ] Configure React Query cache
- [ ] Use CDN for static assets

### ✅ Monitoring
- [ ] Track Web Vitals (LCP, FID, CLS)
- [ ] Monitor bundle size
- [ ] Analyze performance regularly
- [ ] Set performance budgets

---

## Related Documentation

- [Component Architecture](../03-code-standards/02-component-architecture.md)
- [Design Patterns](../03-code-standards/01-design-patterns.md)