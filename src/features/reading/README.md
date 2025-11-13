# Reading Feature - Feature-Based Architecture

## Overview

The reading feature has been refactored following the project's feature-based architecture. All components are now properly organized within the `features/reading` directory, with clear separation of concerns.

## Directory Structure

```
features/reading/
├── components/
│   ├── ReadingCard.tsx          # Individual reading article card
│   ├── FilterBar.tsx            # Filter controls (sort, access, category)
│   ├── LoadingSkeleton.tsx      # Loading skeleton for card grid
│   ├── EmptyState.tsx           # No results state with clear filters
│   ├── Breadcrumb.tsx           # Navigation breadcrumb
│   ├── ReadingContentCard.tsx   # Full article content with audio & quiz
│   ├── AudioPlayer.tsx          # Audio playback component
│   ├── LevelCard.tsx            # Level selection card
│   └── index.ts                 # Component exports
├── hooks/
│   ├── useReading.ts            # Reading CRUD operations
│   ├── useReadingDetailLogic.ts # Detail page business logic
│   └── index.ts                 # Hook exports
├── pages/
│   ├── ReadingLevelPageClient.tsx   # Level listing page
│   ├── ReadingDetailPageClient.tsx  # Article detail page
│   └── index.ts                     # Page exports
├── services/
│   └── readingService.ts        # Reading API calls
├── types/
│   └── reading.types.ts         # TypeScript definitions
└── constants/
    └── levels.ts                # Level configurations
```

## Component Breakdown

### 1. **ReadingCard**
- **Purpose**: Display reading article preview in grid
- **Location**: `components/ReadingCard.tsx`
- **Props**: 
  - `reading: ReadingContent` - Article data
  - `level: Level` - Reading level
  - `isPremium: boolean` - User premium status
  - `onPremiumClick: () => void` - Premium lock click handler
  - `score?: number` - User's quiz score (if attempted)
- **Features**:
  - Category-based color coding
  - Premium lock indicator
  - Score display badge
  - Category emoji icons
  - Click protection for locked content
- **Usage**: Client component (`'use client'`)

### 2. **FilterBar**
- **Purpose**: Filtering and sorting controls
- **Location**: `components/FilterBar.tsx`
- **Props**: 
  - `sortBy: "newest" | "oldest"` - Sort order
  - `setSortBy: (value) => void` - Sort setter
  - `accessFilter: "all" | "free" | "premium"` - Access filter
  - `setAccessFilter: (value) => void` - Access filter setter
  - `categoryFilter: string` - Category filter
  - `setCategoryFilter: (value) => void` - Category setter
  - `categories: string[]` - Available categories
- **Features**:
  - Three dropdown menus (sort, access, category)
  - Active filter highlighting
  - Responsive design
- **Usage**: Client component

### 3. **LoadingSkeleton**
- **Purpose**: Loading state for article grid
- **Location**: `components/LoadingSkeleton.tsx`
- **Features**: Animated 6-card skeleton grid
- **Usage**: Client component

### 4. **EmptyState**
- **Purpose**: No results message
- **Location**: `components/EmptyState.tsx`
- **Props**:
  - `hasFilters: boolean` - Whether filters are applied
  - `onClearFilters: () => void` - Clear filters handler
- **Features**: Context-aware messaging, clear filters button
- **Usage**: Client component

### 5. **Breadcrumb**
- **Purpose**: Navigation breadcrumb
- **Location**: `components/Breadcrumb.tsx`
- **Props**:
  - `items: Array<{ label: string; href?: string }>` - Breadcrumb items
- **Features**: Multi-level navigation with optional links
- **Usage**: Client component

### 6. **ReadingContentCard**
- **Purpose**: Full article display with controls
- **Location**: `components/ReadingContentCard.tsx`
- **Props**:
  - `reading: ReadingContent` - Article data
  - `level: string` - Reading level
  - `onQuizClick: () => void` - Quiz button handler
  - `onAddWordClick: () => void` - Add word button handler
  - `onTextSelection: () => void` - Text selection handler
  - `hasQuiz: boolean` - Quiz availability
- **Features**:
  - Audio player integration
  - Text selection for word addition
  - Quiz button with disable state
  - Responsive paragraph formatting
- **Usage**: Client component

### 7. **LoadingState & NotFoundState**
- **Purpose**: Page-level loading and error states
- **Location**: `components/ReadingContentCard.tsx`
- **Features**: Full-page loading skeleton and 404 state
- **Usage**: Client components

## Hook Breakdown

### **useReading**
- **Purpose**: Handles reading CRUD operations
- **Location**: `hooks/useReading.ts`
- **Exports**:
  - `useReadingByLevel(level: Level)` - Fetch readings by level
  - `useReadingDetail(id: string)` - Fetch single reading
  - `useReadingAttempts(contentIds: string[], userId?: string)` - Fetch user attempts
- **Features**: React Query integration, loading states
- **Usage**: Client component hook

### **useReadingDetailLogic**
- **Purpose**: Business logic for reading detail page
- **Location**: `hooks/useReadingDetailLogic.ts`
- **Parameters**:
  - `contentId: string` - Reading content ID
  - `userId?: string` - Current user ID
- **Returns**:
  - `reading` - Reading content data
  - `isLoading` - Loading state
  - `quiz` - Transformed quiz content
  - `showQuiz` - Quiz visibility state
  - `setShowQuiz` - Quiz visibility setter
  - `showAddWord` - Add word dialog state
  - `setShowAddWord` - Dialog setter
  - `selectedText` - Selected text for word
  - `handleTextSelection` - Text selection handler
  - `handleQuizComplete` - Quiz completion handler
- **Features**:
  - Quiz integration with questions transformation
  - Text selection for vocabulary
  - Quiz submission with score tracking
- **Usage**: Client component hook

## Page Composition

### **ReadingLevelPageClient**
- **Purpose**: Complete level listing page
- **Location**: `pages/ReadingLevelPageClient.tsx`
- **Props**:
  - `params: Promise<{ level: string }>` - Async route params
- **Usage**: Client component (`'use client'`)
- **Composition**:
  ```tsx
  <div className="min-h-screen">
    <Breadcrumb items={[...]} />
    <h1>Level Title</h1>
    <FilterBar {...filters} />
    {filteredReadings.length > 0 ? (
      <div className="grid">
        {filteredReadings.map(reading => (
          <ReadingCard key={reading.id} {...} />
        ))}
      </div>
    ) : (
      <EmptyState {...} />
    )}
    <PaywallModal {...} />
  </div>
  ```

### **ReadingDetailPageClient**
- **Purpose**: Complete article detail page
- **Location**: `pages/ReadingDetailPageClient.tsx`
- **Usage**: Client component (`'use client'`)
- **Composition**:
  ```tsx
  {showQuiz ? (
    <QuizContainer {...} />
  ) : (
    <div className="min-h-screen">
      <Breadcrumb items={[...]} />
      <ReadingContentCard {...} />
      <AddWordDialog {...} />
    </div>
  )}
  ```

## Main Page Routes

### **app/(main)/reading/[level]/page.tsx**
```tsx
import { ReadingLevelPageClient } from '@/features/reading/pages';

export default function ReadingLevelPage({ params }) {
  return <ReadingLevelPageClient params={params} />;
}
```

### **app/(main)/reading/[level]/[id]/page.tsx**
```tsx
import { ReadingDetailPageClient } from '@/features/reading/pages';

export default function ReadingDetailPage() {
  return <ReadingDetailPageClient />;
}
```

Simple, clean, and follows Next.js App Router conventions.

## Architecture Compliance

✅ **Feature Isolation**: All reading-specific code in `features/reading/`  
✅ **Component Layer**: Pure presentation components (20-150 lines each)  
✅ **Hooks Layer**: Business logic separated from UI  
✅ **Services Layer**: API calls in dedicated service  
✅ **Types Layer**: Full TypeScript coverage  
✅ **Pages Layer**: Composition components for routes  
✅ **Index Exports**: Clean import paths through index.ts files  
✅ **No Cross-Feature Imports**: Uses shared layer for common utilities  

## Migration Summary

**Before**: 
- Monolithic 400+ line page components
- All logic, UI, and state in route files
- Difficult to test and maintain

**After**: 
- 7 focused components (20-100 lines each)
- 2 custom hooks for business logic
- 2 page composition components
- Clean separation of concerns
- Reusable, testable, maintainable code

## Related Documentation

- [Feature-Based Structure](../../docs/02-architecture/01-feature-based-structure.md)
- [Component Architecture](../../docs/03-code-standards/02-component-architecture.md)
- [Design Patterns](../../docs/03-code-standards/01-design-patterns.md)
