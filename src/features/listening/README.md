# Listening Feature

A feature-based module for listening comprehension exercises in the language learning application.

## Overview

The listening feature provides users with audio-based language learning exercises across different CEFR levels (A1, A2, B1, B2, C1, C2). Users can listen to audio content, read transcripts, take comprehension quizzes, and add new words to their vocabulary.

## Architecture

This feature follows the project's feature-based architecture pattern with clear separation of concerns:

```
src/features/listening/
├── components/          # Presentation components (30-150 lines each)
│   ├── ListeningCard.tsx           # Individual exercise card with duration & premium badge
│   ├── FilterBar.tsx               # Filtering controls (sort by date, access type)
│   ├── LoadingSkeleton.tsx         # Skeleton loader for grid view
│   ├── EmptyState.tsx              # Empty state with emoji & clear filters button
│   ├── Breadcrumb.tsx              # Navigation breadcrumb
│   ├── ListeningContentCard.tsx    # Main content display with audio player
│   └── index.ts                    # Component exports
├── hooks/              # Business logic & state management
│   ├── useListening.ts             # Data fetching hooks (existing)
│   ├── useListeningDetailLogic.ts  # Detail page business logic
│   └── index.ts                    # Hook exports
├── pages/              # Page composition components
│   ├── ListeningLevelPageClient.tsx    # Level listing page orchestration
│   ├── ListeningDetailPageClient.tsx   # Detail page orchestration
│   └── index.ts                        # Page exports
├── services/           # API & data layer (existing)
│   └── listeningService.ts
└── types/              # TypeScript type definitions (existing)
    └── service.types.ts
```

## Components

### ListeningCard (95 lines)
- **Purpose**: Displays individual listening exercise in grid view
- **Features**:
  - Duration display with Clock icon
  - Title truncation (2 lines)
  - Description truncation (2 lines)
  - Premium lock indicator
  - Access badge (Free/Premium)
  - Click protection for locked content
- **Props**: `listening`, `level`, `isPremium`, `onPremiumClick`

### FilterBar (107 lines)
- **Purpose**: Provides filtering and sorting controls
- **Features**:
  - Sort dropdown (Newest/Oldest)
  - Access type filter (All/Free/Premium)
  - Active filter highlighting with orange accent
  - Clay shadow design system
- **Props**: `sortBy`, `setSortBy`, `accessFilter`, `setAccessFilter`

### LoadingSkeleton (32 lines)
- **Purpose**: Animated loading state for grid view
- **Features**: 6-card skeleton grid with pulse animation

### EmptyState (41 lines)
- **Purpose**: Displays when no exercises match filters
- **Features**:
  - Emoji icon (🎧)
  - Contextual message
  - Clear filters button (conditional)
- **Props**: `accessFilter`, `onClearFilters`

### Breadcrumb (43 lines)
- **Purpose**: Navigation breadcrumb with link trail
- **Features**:
  - Dynamic item rendering
  - Orange hover states
  - Active/inactive styling
- **Props**: `items` (array of label/href objects)

### ListeningContentCard (212 lines)
- **Purpose**: Full listening exercise display with audio player
- **Features**:
  - Badge header with level and duration
  - Audio player integration
  - Transcript toggle with expand/collapse animation
  - Text selection for vocabulary addition
  - Quiz button (disabled if no questions)
  - Add word button (Plus icon)
  - Listening tip card with emoji
- **Props**: `listening`, `level`, `showTranscript`, `onToggleTranscript`, `onQuizClick`, `onAddWordClick`, `onTextSelection`, `hasQuiz`
- **Includes**: `LoadingState` and `NotFoundState` components

## Hooks

### useListeningDetailLogic (124 lines)
- **Purpose**: Centralizes business logic for detail page
- **Features**:
  - Fetches listening content via `useListeningDetail(contentId)`
  - Fetches questions via `useListeningQuestions(contentId)`
  - Transforms database questions to QuizQuestion format
  - Manages quiz state, transcript visibility, word addition
  - Text selection handler
  - Quiz completion with score submission
- **Returns**: `{ listening, isLoading, quiz, showQuiz, setShowQuiz, showTranscript, setShowTranscript, showAddWord, setShowAddWord, selectedText, setSelectedText, handleTextSelection, handleQuizComplete }`

### useListening (existing)
- **Purpose**: Data fetching hooks for all listening queries
- **Exports**: `useListening`, `useListeningByLevel`, `useListeningDetail`, `useListeningQuestions`

## Pages

### ListeningLevelPageClient (138 lines)
- **Purpose**: Orchestrates level listing page
- **Architecture**: Server component wrapper → Client component
- **Composition**:
  - Breadcrumb (Listening Hub → Level)
  - FilterBar (sort, access)
  - ListeningCard grid (3 columns)
  - EmptyState (conditional)
  - PaywallModal (conditional)
- **Features**:
  - Real-time filtering and sorting
  - Premium access control
  - User attempt tracking with scores

### ListeningDetailPageClient (97 lines)
- **Purpose**: Orchestrates detail page
- **Architecture**: Server component wrapper → Client component
- **Composition**:
  - Conditional rendering: QuizContainer OR detail page
  - Breadcrumb (Hub → Level → Exercise)
  - ListeningContentCard with audio player
  - AddWordDialog (modal)
- **Features**:
  - Quiz integration with state management
  - Transcript visibility control
  - Text selection for vocabulary
  - Loading and not-found states

## Page Routes

### `/listening/[level]/page.tsx` (8 lines)
Server component that imports and renders `ListeningLevelPageClient`.

### `/listening/[level]/[id]/page.tsx` (8 lines)
Server component that imports and renders `ListeningDetailPageClient`.

## Data Flow

1. **Level Page Flow**:
   ```
   Route (Server) → ListeningLevelPageClient
   → useListeningByLevel(level)
   → FilterBar controls + ListeningCard grid
   → Click: Navigate to detail OR show paywall
   ```

2. **Detail Page Flow**:
   ```
   Route (Server) → ListeningDetailPageClient
   → useListeningDetailLogic(id, userId)
   → ListeningContentCard (audio player, transcript)
   → Quiz: QuizContainer → handleQuizComplete
   → Text Selection: AddWordDialog
   ```

## State Management

### Level Page State
- `sortBy`: "newest" | "oldest"
- `accessFilter`: "all" | "free" | "premium"
- `showPaywall`: boolean

### Detail Page State (via useListeningDetailLogic)
- `showQuiz`: boolean (quiz modal visibility)
- `showTranscript`: boolean (transcript collapse state)
- `showAddWord`: boolean (add word dialog)
- `selectedText`: string (text selected by user)

## Integration Points

- **Quiz System**: `@/features/quiz` - QuizContainer, useQuizSubmit
- **Words System**: `@/features/words` - AddWordDialog
- **Auth System**: `@/features/auth` - useAuth for user context
- **Premium System**: `@/features/premium` - PaywallModal
- **Reading Feature**: `@/features/reading` - AudioPlayer component (reused)

## Styling

- **Design System**: Clay shadow cards with rounded-3xl corners
- **Color Scheme**: Orange accent (#f97316) for listening feature
- **Dark Mode**: Full dark mode support with oklch colors
- **Typography**: Inter font family (Next.js default)
- **Icons**: Lucide React 0.552.0

## TypeScript

All components are fully typed with:
- Strict mode enabled
- No `any` types in component props
- JSDoc comments for public APIs
- Proper type inference from hooks

## Testing Considerations

### Unit Tests
- Component rendering with various prop combinations
- Hook state transitions (quiz → transcript flow)
- Filter and sort logic

### Integration Tests
- Level page: Filter → Card click → Navigation
- Detail page: Audio play → Quiz → Score submission
- Text selection → Word addition

### E2E Tests
- Complete user journey: Browse → Select → Listen → Quiz → Pass
- Premium content access flow
- Audio playback across browsers

## Performance

- **Code Splitting**: Each page component is lazy-loaded
- **Data Fetching**: React Query with staleTime/cacheTime
- **Memoization**: useMemo for filtered content arrays
- **Image Optimization**: None required (audio-only content)
- **Bundle Size**: ~40KB gzipped (components + hooks)

## Future Enhancements

1. **Audio Features**:
   - Playback speed control (0.75x, 1x, 1.5x, 2x)
   - Timestamp markers in transcript
   - Download audio for offline use

2. **Learning Features**:
   - Repeat-after-me practice mode
   - Sentence-by-sentence replay
   - Pronunciation feedback (Web Speech API)

3. **Accessibility**:
   - Full keyboard navigation
   - Screen reader optimization
   - Transcript auto-scroll during playback

4. **Analytics**:
   - Listen completion tracking
   - Average playback speed
   - Replay counts per exercise

## Migration Notes

This feature was refactored from monolithic page components (400+ lines) to a feature-based architecture:

### Before
- `/listening/[level]/page.tsx`: 300+ lines with inline components
- `/listening/[level]/[id]/page.tsx`: 400+ lines with all logic

### After
- Components: 30-150 lines each
- Hooks: Centralized business logic
- Pages: 8 lines each (composition only)
- Reusable: 5 components shared across pages

## Related Documentation

- [Project Overview](../../docs/01-project-overview.md)
- [Feature-Based Structure](../../docs/02-architecture/01-feature-based-structure.md)
- [Component Architecture](../../docs/03-code-standards/02-component-architecture.md)
- [Reading Feature](../reading/README.md) - Similar pattern reference
