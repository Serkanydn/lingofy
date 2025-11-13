# TypeScript Practices

# TypeScript Practices

## Overview

This project uses **TypeScript 5** with strict mode enabled. This document outlines TypeScript best practices and patterns.

## TypeScript Configuration

### tsconfig.json (Core Settings)

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

## Type Definition Patterns

### 1. Interface vs Type

**Use Interface** for object shapes that may be extended:

```typescript
✅ CORRECT:
interface User {
  id: string;
  name: string;
  email: string;
}

interface PremiumUser extends User {
  premiumExpiresAt: Date;
  features: string[];
}
```

**Use Type** for unions, intersections, and complex types:

```typescript
✅ CORRECT:
type UserRole = 'user' | 'premium' | 'admin';
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
type ApiResponse = { data: T; error: string | null };
type Nullable = T | null;
```

### 2. Database Types

Generate from Supabase schema:

```typescript
// shared/types/database.types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      grammar_topics: {
        Row: {
          id: string;
          title: string;
          description: string;
          category_id: string;
          content: string;
          difficulty_level: 'beginner' | 'intermediate' | 'advanced';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit;
        Update: Partial;
      };
      // ... other tables
    };
    Views: {
      // ... views
    };
    Functions: {
      // ... functions
    };
  };
}

// Type helpers
export type Tables =
  Database['public']['Tables'][T]['Row'];

export type Insertable =
  Database['public']['Tables'][T]['Insert'];

export type Updatable =
  Database['public']['Tables'][T]['Update'];

// Usage
type Grammar = Tables;
type InsertGrammar = Insertable;
type UpdateGrammar = Updatable;
```

### 3. Feature Types

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

export interface GrammarWithCategory extends Grammar {
  category: GrammarCategory;
}

// Input types
export type CreateGrammarInput = Omit<
  Grammar,
  'id' | 'created_at' | 'updated_at'
>;

export type UpdateGrammarInput = Partial;
```

### 4. Service Types

```typescript
// features/grammar/types/service.types.ts
import type { Grammar, CreateGrammarInput } from './grammar.types';

export interface GrammarServiceResponse {
  data: Grammar | null;
  error: string | null;
}

export interface GrammarListResponse {
  data: Grammar[];
  count: number;
}

export interface PaginatedParams {
  page?: number;
  pageSize?: number;
  orderBy?: keyof Grammar;
  order?: 'asc' | 'desc';
}

export interface FilterParams {
  categoryId?: string;
  difficultyLevel?: DifficultyLevel;
  search?: string;
}
```

## Type Safety Patterns

### 1. Strict Function Signatures

```typescript
✅ CORRECT:
function calculateScore(
  answers: string[],
  correctAnswers: string[]
): number {
  return answers.filter((ans, i) => ans === correctAnswers[i]).length;
}

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString();
}

❌ WRONG:
function calculateScore(answers: any, correctAnswers: any): any {
  return answers.filter((ans: any, i: any) => ans === correctAnswers[i]).length;
}

function formatDate(date: any) {
  return new Date(date).toLocaleDateString();
}
```

### 2. Type Guards

```typescript
// Predicate type guards
function isGrammar(value: unknown): value is Grammar {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value &&
    'content' in value
  );
}

function isPremiumUser(user: User): user is PremiumUser {
  return 'premiumExpiresAt' in user && user.premiumExpiresAt !== null;
}

// Usage
const data = await fetchData();
if (isGrammar(data)) {
  console.log(data.title); // TypeScript knows this is Grammar
}
```

### 3. Discriminated Unions

```typescript
// Question types with discriminated union
type Question =
  | {
      type: 'multiple_choice';
      question: string;
      options: string[];
      correctAnswer: string;
    }
  | {
      type: 'true_false';
      question: string;
      correctAnswer: boolean;
    }
  | {
      type: 'fill_blank';
      question: string;
      correctAnswer: string;
    };

function renderQuestion(q: Question) {
  switch (q.type) {
    case 'multiple_choice':
      return ;
    case 'true_false':
      return ;
    case 'fill_blank':
      return ;
  }
}
```

### 4. Branded Types

```typescript
// Create branded types for type safety
type UserId = string & { readonly brand: unique symbol };
type GrammarId = string & { readonly brand: unique symbol };

function createUserId(id: string): UserId {
  return id as UserId;
}

function getUserById(id: UserId): User {
  // TypeScript ensures only UserId can be passed
  return users.find(u => u.id === id);
}

const userId = createUserId('user_123');
getUserById(userId); // ✅ OK
getUserById('random_string'); // ❌ Error
```

### 5. Const Assertions

```typescript
// Use 'as const' for literal types
const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
type DifficultyLevel = typeof DIFFICULTY_LEVELS[number];

const USER_ROLES = {
  USER: 'user',
  PREMIUM: 'premium',
  ADMIN: 'admin',
} as const;
type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Routes configuration
const ROUTES = {
  HOME: '/',
  GRAMMAR: '/grammar',
  LISTENING: '/listening',
  READING: '/reading',
} as const;
```

## Generic Types

### 1. Generic Functions

```typescript
function identity(value: T): T {
  return value;
}

function toArray(value: T): T[] {
  return [value];
}

function findById(
  items: T[],
  id: string
): T | undefined {
  return items.find(item => item.id === id);
}
```

### 2. Generic Components

```typescript
interface ListProps {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string;
}

export function List({ 
  items, 
  renderItem, 
  keyExtractor = (_, i) => i.toString() 
}: ListProps) {
  return (
    
      {items.map((item, index) => (
        
          {renderItem(item, index)}
        
      ))}
    
  );
}

// Usage
<List
  items={grammars}
  renderItem={(grammar) => }
  keyExtractor={(grammar) => grammar.id}
/>
```

### 3. Generic Service

```typescript
class BaseService {
  constructor(private tableName: string) {}

  async getAll(): Promise {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*');
    
    if (error) throw error;
    return data as T[];
  }

  async getById(id: string): Promise {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as T;
  }
}

class GrammarService extends BaseService {
  constructor() {
    super('grammar_topics');
  }

  async getByCategoryId(categoryId: string): Promise {
    const { data, error } = await supabase
      .from('grammar_topics')
      .select('*')
      .eq('category_id', categoryId);
    
    if (error) throw error;
    return data;
  }
}
```

## Utility Types

### 1. Built-in Utility Types

```typescript
// Partial - Make all properties optional
type UpdateGrammar = Partial;

// Required - Make all properties required
type RequiredGrammar = Required;

// Pick - Select specific properties
type GrammarPreview = Pick;

// Omit - Exclude specific properties
type CreateGrammar = Omit;

// Record - Create object type with specific keys and value type
type GrammarMap = Record;

// Exclude - Exclude types from union
type NonAdminRole = Exclude;

// Extract - Extract types from union
type AdminRole = Extract;

// NonNullable - Exclude null and undefined
type DefinedGrammar = NonNullable;

// ReturnType - Get return type of function
type ServiceReturn = ReturnType;

// Parameters - Get parameters of function
type ServiceParams = Parameters;
```

### 2. Custom Utility Types

```typescript
// Make specific properties optional
type WithOptional = Omit & Partial<Pick>;

type GrammarWithOptionalDescription = WithOptional;

// Make specific properties required
type WithRequired = T & Required<Pick>;

// Nullable type
type Nullable = T | null;

// Make all properties nullable
type AllNullable = {
  [K in keyof T]: T[K] | null;
};

// Deep partial
type DeepPartial = {
  [K in keyof T]?: T[K] extends object ? DeepPartial : T[K];
};
```

## React + TypeScript Patterns

### 1. Component Props

```typescript
// With children
interface CardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

// With event handlers
interface ButtonProps {
  onClick: () => void;
  onHover?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

// With render props
interface ListProps {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
}

// Extending HTML attributes
interface InputProps extends React.InputHTMLAttributes {
  label?: string;
  error?: string;
}
```

### 2. useState

```typescript
// Explicit type annotation
const [user, setUser] = useState(null);
const [grammars, setGrammars] = useState([]);
const [isLoading, setIsLoading] = useState(false);

// With initial value (type inference)
const [count, setCount] = useState(0); // Type: number
const [name, setName] = useState('John'); // Type: string
```

### 3. useRef

```typescript
// DOM element refs
const inputRef = useRef(null);
const divRef = useRef(null);

// Mutable value refs
const timeoutRef = useRef(null);
const countRef = useRef(0);
```

### 4. useCallback

```typescript
const handleSubmit = useCallback(
  (data: FormData): void => {
    // Implementation
  },
  [dependencies]
);

const handleDelete = useCallback(
  (id: string): Promise => {
    return deleteItem(id);
  },
  []
);
```

### 5. useMemo

```typescript
const sortedGrammars = useMemo(
  () => [...grammars].sort((a, b) => a.title.localeCompare(b.title)),
  [grammars]
);

const statistics = useMemo(
  () => calculateStatistics(data),
  [data]
);
```

### 6. Custom Hooks

```typescript
interface UseGrammarReturn {
  grammars: Grammar[];
  isLoading: boolean;
  error: Error | null;
  createGrammar: (input: CreateGrammarInput) => Promise;
  updateGrammar: (id: string, input: UpdateGrammarInput) => Promise;
  deleteGrammar: (id: string) => Promise;
}

export function useGrammar(): UseGrammarReturn {
  // Implementation
}
```

## Error Handling Types

```typescript
// Result type pattern
type Result =
  | { success: true; data: T }
  | { success: false; error: E };

async function fetchGrammar(id: string): Promise<Result> {
  try {
    const data = await grammarService.getById(id);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

// Usage
const result = await fetchGrammar('123');
if (result.success) {
  console.log(result.data.title);
} else {
  console.error(result.error.message);
}
```

## Type Assertions

### When to Use

```typescript
✅ ACCEPTABLE:
// When you have more information than TypeScript
const element = document.getElementById('root') as HTMLDivElement;

// Type narrowing after validation
const data = JSON.parse(jsonString) as Grammar;

// Working with libraries with poor types
const config = getConfig() as Config;

❌ AVOID:
// Suppressing legitimate errors
const value = unknownValue as any; // Bad!

// When proper type guards should be used
function process(value: unknown) {
  const user = value as User; // Use type guard instead
}
```

### Non-null Assertions

```typescript
✅ USE SPARINGLY:
// Only when you're 100% sure value exists
const user = users.find(u => u.id === id)!;
const element = document.getElementById('root')!;

✅ PREFERRED:
// Use optional chaining and nullish coalescing
const user = users.find(u => u.id === id);
if (!user) return;

const element = document.getElementById('root');
if (!element) throw new Error('Root element not found');
```

## Best Practices

### DO ✅

- Use strict TypeScript configuration
- Define explicit types for all function parameters and returns
- Use `interface` for object shapes that may extend
- Use `type` for unions and complex types
- Create type guards for runtime type checking
- Use discriminated unions for variant types
- Leverage utility types (Partial, Pick, Omit, etc.)
- Use const assertions for literal types
- Type React components properly
- Generate database types from schema

### DON'T ❌

- Use `any` type (use `unknown` if truly unknown)
- Suppress TypeScript errors with `@ts-ignore`
- Over-use type assertions
- Create overly complex type definitions
- Ignore TypeScript errors
- Use `Function` type (be specific with signatures)
- Mix `interface` and `type` arbitrarily
- Forget to type async functions
- Use enums (use const objects with `as const` instead)

---

## Related Documentation

- [Validation](./02-validation.md)
- [Design Patterns](../03-code-standards/01-design-patterns.md)
- [Error Patterns](../05-error-handling/01-error-patterns.md)