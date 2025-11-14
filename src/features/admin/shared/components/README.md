# Admin Shared Components

## Overview

This directory contains reusable UI components specifically designed for the admin feature. These components follow the project's feature-based architecture and provide consistent styling and functionality across all admin pages.

## Components

### DataTable

A flexible, type-safe table component for displaying tabular data with consistent styling.

#### Features

- **Type-safe columns**: Define columns with TypeScript generics
- **Custom rendering**: Flexible cell rendering with render functions
- **Loading states**: Built-in loading indicator
- **Empty states**: Customizable empty state messaging
- **Row click handlers**: Optional row interaction
- **Responsive**: Works with Tailwind's responsive utilities

#### Usage

```typescript
import { DataTable, type DataTableColumn } from '@/features/admin/shared/components';

type MyData = {
  id: string;
  name: string;
  status: boolean;
  createdAt: string;
};

function MyPage() {
  const { data, isLoading } = useMyData();
  
  const columns: DataTableColumn<MyData>[] = [
    {
      header: 'Name',
      accessor: 'name', // Direct property access
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (item) => ( // Custom rendering
        <Badge>{item.status ? 'Active' : 'Inactive'}</Badge>
      ),
    },
    {
      header: 'Created',
      accessor: 'createdAt',
      render: (item) => (
        <div>{new Date(item.createdAt).toLocaleDateString()}</div>
      ),
      className: 'text-sm', // Optional column styling
    },
    {
      header: 'Actions',
      accessor: (item) => item.id, // Function accessor
      className: 'text-right',
      render: (item) => (
        <Button onClick={() => handleEdit(item)}>Edit</Button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data || []}
      keyExtractor={(item) => item.id}
      isLoading={isLoading}
      emptyState={<div>No data found</div>} // Optional
      onRowClick={(item) => console.log(item)} // Optional
    />
  );
}
```

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `columns` | `DataTableColumn<T>[]` | Yes | Array of column definitions |
| `data` | `T[]` | Yes | Array of data items to display |
| `keyExtractor` | `(item: T) => string` | Yes | Function to extract unique key from each item |
| `isLoading` | `boolean` | No | Shows loading state (default: false) |
| `emptyState` | `ReactNode` | No | Custom empty state component |
| `onRowClick` | `(item: T) => void` | No | Handler for row clicks |

#### Column Definition

```typescript
interface DataTableColumn<T> {
  header: string;                              // Column header text
  accessor: keyof T | ((item: T) => ReactNode); // Property key or function
  className?: string;                          // Optional CSS classes
  render?: (item: T) => ReactNode;            // Optional custom renderer
}
```

### Other Components

- **PageHeader**: Consistent page headers with icon, title, description, and actions
- **ContentCard**: Wrapper for main content sections with optional filters
- **FilterBar**: Search and filter controls for data tables
- **Pagination**: Pagination controls with items per page selector
- **DeleteConfirmDialog**: Confirmation dialog for delete actions
- **StatsCard**: Display key metrics and statistics

## Examples

### Grammar Management Page

```typescript
const columns: DataTableColumn<GrammarTopic>[] = [
  {
    header: 'Title',
    accessor: 'title',
    render: (topic) => (
      <div>
        <div className="font-medium">{topic.title}</div>
        <div className="text-sm text-gray-500">{topic.description}</div>
      </div>
    ),
  },
  {
    header: 'Type',
    accessor: 'is_premium',
    render: (topic) =>
      topic.is_premium ? (
        <Badge className="bg-orange-500">Premium</Badge>
      ) : (
        <Badge variant="secondary">Free</Badge>
      ),
  },
  {
    header: 'Actions',
    accessor: (topic) => topic.id,
    className: 'text-right',
    render: (topic) => (
      <div className="space-x-2">
        <Button variant="ghost" size="sm" onClick={() => handleEdit(topic)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => handleDelete(topic)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
```

### Users Management Page

```typescript
const columns: DataTableColumn<User>[] = [
  {
    header: 'User',
    accessor: 'full_name',
    render: (user) => (
      <div className="font-medium">{user.full_name || 'Anonymous'}</div>
    ),
  },
  {
    header: 'Status',
    accessor: 'is_premium',
    render: (user) =>
      user.is_premium ? (
        <Badge className="bg-orange-500">Premium</Badge>
      ) : (
        <Badge variant="outline">Free</Badge>
      ),
  },
];
```

## Best Practices

1. **Define clear column types**: Always use TypeScript generics for type safety
2. **Extract complex renders**: Move complex cell renderers to separate functions for readability
3. **Use consistent styling**: Apply className to columns for consistent table layouts
4. **Handle loading**: Always pass isLoading prop for better UX
5. **Provide empty states**: Give users clear feedback when no data is available
6. **Keep actions accessible**: Use proper button variants and sizes for action columns

## Related Documentation

- [Feature-Based Architecture](../../../../../docs/02-architecture/01-feature-based-structure.md)
- [Component Architecture](../../../../../docs/03-code-standards/02-component-architecture.md)
- [Naming Conventions](../../../../../docs/03-code-standards/03-naming-conventions.md)
