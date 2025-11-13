# Grammar Feature

A comprehensive grammar learning feature with category-based organization, topic explanations, examples, practice texts, and integrated quizzes.

## Architecture

The grammar feature follows a **3-level hierarchy**:
1. **Grammar Hub** - Main page showing all grammar categories
2. **Category Page** - Lists all topics within a specific category
3. **Topic Detail** - Shows explanation, examples, practice text, and quiz

## Structure

```
src/features/grammar/
├── components/          # Reusable UI components
│   ├── CategoryCard.tsx        # Category card with icon, title, description
│   ├── TopicCard.tsx          # Topic card with score badge, title, CTA
│   ├── LoadingSkeleton.tsx     # Loading skeletons (hub & topic)
│   ├── EmptyState.tsx         # Empty state with emoji and message
│   ├── FreeBanner.tsx         # Banner highlighting free grammar
│   ├── Breadcrumb.tsx         # Navigation breadcrumb
│   ├── SortDropdown.tsx       # Sort dropdown (newest/oldest)
│   ├── Headers.tsx            # Category & topic headers
│   ├── ActionButtons.tsx      # Quiz & add word buttons
│   └── index.ts               # Component exports
├── hooks/               # Business logic hooks
│   ├── useGrammarCategoryLogic.ts  # Category page logic
│   ├── useGrammarTopicLogic.ts     # Topic page logic
│   └── index.ts                    # Hook exports
├── pages/               # Page client components
│   ├── GrammarHubPageClient.tsx        # Main hub page (164→71 lines)
│   ├── GrammarCategoryPageClient.tsx   # Category page (280→95 lines)
│   ├── GrammarTopicPageClient.tsx      # Topic page (270→108 lines)
│   └── index.ts                        # Page exports
├── services/            # API & data services
│   ├── grammarService.ts
│   ├── grammarCategoryService.ts
│   └── index.ts
├── types/               # TypeScript type definitions
│   ├── grammar.types.ts
│   ├── service.types.ts
│   └── category.types.ts
└── api/                 # API route handlers
```

## Components

### CategoryCard
Displays a grammar category with:
- Icon with gradient background
- Category name and description
- "Explore topics" CTA with arrow animation
- Hover effects (shadow, arrow translate)

**Props:**
- `category: GrammarCategory` - Category data (id, name, description, icon, slug)

### TopicCard
Displays a grammar topic with:
- Topic number badge
- Score badge (if user has completed)
- Title and explanation preview
- "Learn Now" button

**Props:**
- `topic: GrammarTopic` - Topic data (id, title, explanation)
- `categorySlug: string` - Parent category slug
- `index: number` - Topic index for numbering
- `score?: number` - User's score percentage (optional)

### LoadingSkeleton & TopicLoadingSkeleton
Animated loading skeletons for grid layouts:
- **LoadingSkeleton**: 6 cards for category grid
- **TopicLoadingSkeleton**: 6 cards for topic grid with header icons

### EmptyState
Displays when no data is available:
- Emoji icon with gradient background
- Title and description
- Centered layout

**Props:**
- `title: string` - Main heading
- `description: string` - Description text
- `emoji?: string` - Emoji icon (default: "📚")

### FreeBanner
Prominent banner highlighting that grammar is free:
- Sparkle emoji
- "Grammar is Free for Everyone!" title
- Explanation text with green gradient background

### Breadcrumb
Navigation breadcrumb trail:
- Clickable links (orange hover)
- Current page (non-clickable, gray)
- Slash separators

**Props:**
- `items: BreadcrumbItem[]` - Array of {label, href?}

### SortDropdown
Dropdown menu for sorting topics:
- Options: Newest, Oldest
- Clean dropdown UI with rounded corners

**Props:**
- `value: SortOption` - Current sort option
- `onChange: (value: SortOption) => void` - Sort change handler

### Headers (CategoryHeader, TopicHeader, ContentSection)
**CategoryHeader**: Category icon, name, description, topic count  
**TopicHeader**: Topic title with FREE/GRAMMAR badges  
**ContentSection**: Content sections with icon, title, and text/examples

## Hooks

### useGrammarCategoryLogic(categorySlug: string)
Manages category page business logic:
- Fetches category info and topics
- Fetches user attempts and scores
- Handles sorting (newest/oldest)
- Creates score map for quick lookup

**Returns:**
```typescript
{
  categoryInfo: GrammarCategory | undefined,
  topics: GrammarTopic[],
  scoreMap: Map<string, number>,
  sortBy: SortOption,
  setSortBy: (value: SortOption) => void,
  isLoading: boolean
}
```

### useGrammarTopicLogic(topicId: string)
Manages topic detail page business logic:
- Fetches topic details and quiz questions
- Handles quiz flow (show/hide)
- Handles text selection for word addition
- Submits quiz results

**Returns:**
```typescript
{
  topic: GrammarTopic | undefined,
  quizQuestions: QuizQuestion[] | undefined,
  showQuiz: boolean,
  showAddWord: boolean,
  selectedText: string,
  isLoading: boolean,
  handleTextSelection: () => void,
  handleQuizComplete: (score, maxScore, userAnswers) => Promise<void>,
  handleStartQuiz: () => void,
  handleExitQuiz: () => void,
  handleAddWord: () => void,
  handleCloseAddWord: () => void
}
```

## Pages

### GrammarHubPageClient
Main grammar hub displaying all categories.

**Features:**
- Category cards grid (3 columns)
- Free banner
- Loading skeleton
- Empty state when no categories

**Reduced from:** 164 lines → **71 lines** (57% reduction)

### GrammarCategoryPageClient
Category page listing all topics within a category.

**Features:**
- Breadcrumb navigation
- Category header with icon, name, description
- Sort dropdown (newest/oldest)
- Topic cards grid with scores
- Loading skeleton
- Empty state when no topics

**Props:**
- `categorySlug: string` - Category URL slug

**Reduced from:** 280 lines → **95 lines** (66% reduction)

### GrammarTopicPageClient
Topic detail page with explanation, examples, practice text, and quiz.

**Features:**
- Breadcrumb navigation
- Topic header with FREE/GRAMMAR badges
- Content sections: Explanation, Examples, Practice Text
- Text selection for word addition
- Quiz integration
- Add word dialog

**Props:**
- `categorySlug: string` - Category URL slug
- `topicId: string` - Topic ID

**Reduced from:** 270 lines → **108 lines** (60% reduction)

## Page Routes

### /grammar/page.tsx
```typescript
import { GrammarHubPageClient } from "@/features/grammar/pages/GrammarHubPageClient";

export default function GrammarPage() {
  return <GrammarHubPageClient />;
}
```

**Reduced from:** 164 lines → **5 lines** (97% reduction)

### /grammar/[category]/page.tsx
```typescript
import React from "react";
import { GrammarCategoryPageClient } from "@/features/grammar/pages/GrammarCategoryPageClient";

export default function GrammarCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = React.use(params);
  return <GrammarCategoryPageClient categorySlug={categorySlug} />;
}
```

**Reduced from:** 280 lines → **9 lines** (97% reduction)

### /grammar/[category]/[id]/page.tsx
```typescript
import React from "react";
import { GrammarTopicPageClient } from "@/features/grammar/pages/GrammarTopicPageClient";

export default function GrammarTopicPage({ params }: { params: Promise<{ category: string; id: string }> }) {
  const { category, id } = React.use(params);
  return <GrammarTopicPageClient categorySlug={category} topicId={id} />;
}
```

**Reduced from:** 270 lines → **9 lines** (97% reduction)

## Data Flow

### Grammar Hub
1. Fetches active categories from database
2. Displays category cards or empty state
3. Shows free banner
4. Links to category pages

### Category Page
1. Fetches category info by slug
2. Fetches topics for category
3. Fetches user attempts for score tracking
4. Allows sorting by date
5. Links to topic detail pages

### Topic Detail Page
1. Fetches topic details (title, explanation, examples, practice text)
2. Fetches quiz questions
3. Displays content sections with text selection
4. Shows quiz button if questions available
5. Handles quiz flow and submission
6. Allows adding words from selected text

## Integrations

### Quiz System
- Uses `QuizContainer` for quiz flow
- Submits results with `useQuizSubmit`
- Tracks user attempts and scores
- Displays score badges on topic cards

### Word System
- Uses `AddWordDialog` for adding words
- Supports text selection from all content sections
- Pre-fills selected text in dialog

### Authentication
- Uses `useAuth` for user context
- Tracks individual user progress
- Displays personalized scores

## Styling

- **Design System:** Tailwind CSS v4 with oklch colors
- **Shadows:** Clay shadow effect with hover enhancements
- **Gradients:** bg-linear-to-* syntax (orange, green, blue, amber, purple)
- **Rounded:** 2xl (16px) and 3xl (24px) corners
- **Animations:** Pulse (loading), translate (hover)
- **Dark Mode:** Full support with dark: variants

## Performance

- Client-side rendering for interactive features
- Server-side data fetching with React Query
- Optimistic UI updates
- Memoized sorting and score mapping
- Lazy loading of quiz questions

## Total Metrics

### Files Created
- **Components:** 9 files (43-107 lines each)
- **Hooks:** 2 files (62-89 lines each)
- **Pages:** 3 files (71-108 lines each)
- **Index Exports:** 3 files

### Page Route Reduction
- **3 route files:** 714 lines → 23 lines (97% reduction)
- **Average per route:** 238 lines → 8 lines

### Component Size
- **Smallest:** FreeBanner (43 lines)
- **Largest:** TopicCard (107 lines)
- **Average:** ~65 lines per component

## Benefits

1. **Maintainability:** Each component has single responsibility
2. **Reusability:** Components can be used across grammar pages
3. **Testability:** Small, focused units easy to test
4. **Readability:** Clear component hierarchy and naming
5. **Performance:** Optimized re-renders with memoization
6. **Scalability:** Easy to add new grammar features
7. **Consistency:** Uniform patterns across all pages

## Usage Example

```typescript
// Import and use grammar components
import { CategoryCard, TopicCard, FreeBanner } from "@/features/grammar/components";
import { useGrammarCategoryLogic } from "@/features/grammar/hooks";

// In a component
const { topics, scoreMap, sortBy, setSortBy } = useGrammarCategoryLogic(categorySlug);

return (
  <>
    <FreeBanner />
    <SortDropdown value={sortBy} onChange={setSortBy} />
    {topics.map((topic, i) => (
      <TopicCard 
        key={topic.id} 
        topic={topic} 
        categorySlug={categorySlug}
        index={i}
        score={scoreMap.get(topic.id)}
      />
    ))}
  </>
);
```
