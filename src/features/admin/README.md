# Admin Feature Structure

## Overview

The admin feature has been reorganized following the **feature-based architecture** pattern as outlined in the project documentation. This structure ensures better scalability, maintainability, and clear separation of concerns.

## Directory Structure

```
features/admin/
├── shared/                      # Shared resources across all admin sub-features
│   ├── components/              # Common UI components
│   │   ├── AdminHeader.tsx
│   │   ├── AdminSidebar.tsx
│   │   ├── StatsCard.tsx
│   │   ├── PageHeader.tsx
│   │   ├── ContentCard.tsx
│   │   ├── FilterBar.tsx
│   │   ├── Pagination.tsx
│   │   ├── DeleteConfirmDialog.tsx
│   │   └── index.ts
│   └── index.ts
├── features/                    # Sub-features of admin
│   ├── dashboard/               # Admin dashboard
│   │   ├── hooks/
│   │   │   ├── useAdminStats.ts
│   │   │   └── index.ts
│   │   ├── pages/
│   │   │   ├── AdminDashboardPageClient.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── grammar/                 # Grammar management
│   │   ├── components/
│   │   │   ├── AddGrammarDialog.tsx
│   │   │   ├── EditGrammarDialog.tsx
│   │   │   ├── AddGrammarCategoryDialog.tsx
│   │   │   ├── EditGrammarCategoryDialog.tsx
│   │   │   ├── AddQuestionDialog.tsx
│   │   │   ├── EditQuestionDialog.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useGrammarTopics.ts
│   │   │   ├── useGrammarCategories.ts
│   │   │   ├── useGrammarQuestions.ts
│   │   │   └── index.ts
│   │   ├── pages/
│   │   │   ├── GrammarPageClient.tsx
│   │   │   ├── GrammarCategoriesPageClient.tsx
│   │   │   ├── GrammarQuestionsPageClient.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── listening/               # Listening content management
│   │   ├── components/
│   │   │   ├── AddListeningDialog.tsx
│   │   │   ├── EditListeningDialog.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useListeningContent.ts
│   │   │   └── index.ts
│   │   ├── pages/
│   │   │   ├── ListeningPageClient.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── reading/                 # Reading content management
│   │   ├── components/
│   │   │   ├── AddReadingDialog.tsx
│   │   │   ├── EditReadingDialog.tsx
│   │   │   ├── QuestionManager.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useReadingContent.ts
│   │   │   └── index.ts
│   │   ├── pages/
│   │   │   ├── ReadingPageClient.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   └── users/                   # User management
│       ├── components/
│       │   ├── UserDetailsDialog.tsx
│       │   └── index.ts
│       ├── hooks/
│       │   ├── useUsers.ts
│       │   └── index.ts
│       ├── pages/
│       │   ├── UsersPageClient.tsx
│       │   └── index.ts
│       └── index.ts
```

## Import Patterns

### Importing Shared Components

Shared components (used across multiple admin sub-features) should be imported from the shared module:

```typescript
import { PageHeader, ContentCard, FilterBar, Pagination, DeleteConfirmDialog } from '@/features/admin/shared/components';
```

### Importing from Sub-Features

Each sub-feature can be imported as a whole or by specific items:

```typescript
// Import entire sub-feature
import { GrammarPageClient, AddGrammarDialog, useGrammarTopics } from '@/features/admin/features/grammar';

// Import from specific layers within a sub-feature
import { AddGrammarDialog, EditGrammarDialog } from '@/features/admin/features/grammar/components';
import { useGrammarTopics } from '@/features/admin/features/grammar/hooks';
import { GrammarPageClient } from '@/features/admin/features/grammar/pages';
```

### Importing Within a Sub-Feature

When importing within the same sub-feature, use relative paths:

```typescript
// In a page component
import { AddGrammarDialog, EditGrammarDialog } from '../components';
import { useGrammarTopics, useDeleteGrammarTopic } from '../hooks';

// In a dialog component
import { useGrammarTopics } from '../hooks';
```

## Key Principles

### 1. Shared Resources

Components, hooks, or utilities used by **2 or more sub-features** should be placed in the `shared/` folder.

**Examples of shared components:**
- `PageHeader`: Used by all admin pages
- `ContentCard`: Wrapper for content sections
- `FilterBar`: Search and filtering UI
- `Pagination`: Pagination controls
- `DeleteConfirmDialog`: Reusable delete confirmation
- `AdminHeader` & `AdminSidebar`: Layout components

### 2. Sub-Feature Isolation

Each sub-feature is self-contained:
- ✅ Has its own `components/`, `hooks/`, and `pages/`
- ✅ Exports everything through `index.ts` files
- ✅ Uses relative imports within itself
- ❌ Does NOT import from other sub-features directly
- ❌ Does NOT share code without going through `shared/`

### 3. Layer Responsibilities

**Components Layer (`components/`)**
- UI presentation and user interaction
- Uses hooks from the same sub-feature
- Imports shared components from admin/shared
- No business logic or API calls

**Hooks Layer (`hooks/`)**
- Business logic and state management
- API calls through services
- React Query for server state
- No UI rendering

**Pages Layer (`pages/`)**
- Main page components
- Orchestrates components and hooks
- Handles routing and layout

## Examples

### Creating a New Admin Sub-Feature

Let's say you want to add a "Statistics" sub-feature:

```bash
features/admin/features/statistics/
├── components/
│   ├── ChartCard.tsx
│   ├── ExportDialog.tsx
│   └── index.ts
├── hooks/
│   ├── useStatistics.ts
│   └── index.ts
├── pages/
│   ├── StatisticsPageClient.tsx
│   └── index.ts
└── index.ts
```

**Step 1: Create the hooks**

```typescript
// features/admin/features/statistics/hooks/useStatistics.ts
import { useQuery } from '@tanstack/react-query';
import { statisticsService } from '@/shared/services/statisticsService';

export function useStatistics() {
  return useQuery({
    queryKey: ['admin-statistics'],
    queryFn: statisticsService.getAll,
  });
}
```

**Step 2: Create the components**

```typescript
// features/admin/features/statistics/components/ChartCard.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';

interface ChartCardProps {
  title: string;
  data: any[];
}

export function ChartCard({ title, data }: ChartCardProps) {
  return (
    <Card>
      <CardContent>
        <h3>{title}</h3>
        {/* Chart rendering */}
      </CardContent>
    </Card>
  );
}
```

**Step 3: Create the page**

```typescript
// features/admin/features/statistics/pages/StatisticsPageClient.tsx
'use client';

import { PageHeader, ContentCard } from '@/features/admin/shared/components';
import { ChartCard } from '../components';
import { useStatistics } from '../hooks';

export function StatisticsPageClient() {
  const { data: stats, isLoading } = useStatistics();

  return (
    <div className="min-h-screen py-8">
      <PageHeader
        icon={<span>📊</span>}
        iconBgClass="bg-gradient-to-br from-blue-400 to-blue-600"
        title="Statistics"
        description="View detailed statistics"
      />
      <ContentCard>
        <ChartCard title="User Growth" data={stats?.userGrowth || []} />
      </ContentCard>
    </div>
  );
}
```

**Step 4: Create index exports**

```typescript
// features/admin/features/statistics/index.ts
export * from './components';
export * from './hooks';
export * from './pages';
```

**Step 5: Use in app route**

```typescript
// app/(admin)/admin/statistics/page.tsx
import { StatisticsPageClient } from '@/features/admin/features/statistics';

export default function StatisticsPage() {
  return <StatisticsPageClient />;
}
```

### Adding a New Shared Component

If you need a component that will be used by multiple sub-features:

```typescript
// features/admin/shared/components/DataTable.tsx
'use client';

import { Table } from '@/components/ui/table';

interface DataTableProps {
  columns: any[];
  data: any[];
}

export function DataTable({ columns, data }: DataTableProps) {
  return <Table>{/* Table rendering */}</Table>;
}
```

Then export it:

```typescript
// features/admin/shared/components/index.ts
export { AdminHeader } from './AdminHeader';
export { AdminSidebar } from './AdminSidebar';
// ... other exports
export { DataTable } from './DataTable';
```

## Benefits of This Structure

### ✅ Scalability
- Easy to add new admin sub-features
- Clear boundaries between features
- Each feature can grow independently

### ✅ Maintainability
- Easy to locate feature-specific code
- Changes to one feature don't affect others
- Clear import patterns

### ✅ Collaboration
- Multiple developers can work on different sub-features
- Reduced merge conflicts
- Clear ownership of code

### ✅ Testing
- Features can be tested in isolation
- Easy to mock dependencies
- Clear test boundaries

### ✅ Performance
- Can implement code splitting per sub-feature
- Tree-shaking works better with clear boundaries
- Easier to identify performance bottlenecks

## Migration Notes

The old structure:
```
features/admin/
├── components/       # All components mixed together
├── hooks/           # All hooks mixed together
└── pages/           # All pages mixed together
```

Has been reorganized to:
```
features/admin/
├── shared/          # Common components used across features
└── features/        # Sub-features with their own structure
    ├── dashboard/
    ├── grammar/
    ├── listening/
    ├── reading/
    └── users/
```

All imports have been updated to reflect the new structure. The old folders can be safely removed after verifying everything works.

## Related Documentation

- [Feature-Based Structure](../../docs/02-architecture/01-feature-based-structure.md)
- [Component Architecture](../../docs/03-code-standards/02-component-architecture.md)
- [Design Patterns](../../docs/03-code-standards/01-design-patterns.md)

---

Last Updated: November 2025
