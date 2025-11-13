# Naming Conventions

## Overview

Consistent naming conventions improve code readability and maintainability. This document outlines all naming standards used in the project.

## File Naming

### Components

**Format**: `PascalCase.tsx`

```
✅ CORRECT:
GrammarCard.tsx
ListeningPlayer.tsx
CreateQuizDialog.tsx
AudioUploadForm.tsx

❌ WRONG:
grammar-card.tsx
grammarCard.tsx
grammar_card.tsx
```

### Hooks

**Format**: `camelCase.ts` starting with `use`

```
✅ CORRECT:
useGrammar.ts
useAuth.ts
useListening.ts
useQuizSubmit.ts

❌ WRONG:
UseGrammar.ts
grammar-hook.ts
grammarHook.ts
```

### Services

**Format**: `camelCase.ts` ending with `Service`

```
✅ CORRECT:
grammarService.ts
authService.ts
cloudflareService.ts
audioUploadService.ts

❌ WRONG:
GrammarService.ts
grammar-service.ts
grammar_service.ts
```

### Types

**Format**: `camelCase.types.ts`

```
✅ CORRECT:
grammar.types.ts
auth.types.ts
service.types.ts
quiz.types.ts

❌ WRONG:
GrammarTypes.ts
grammar-types.ts
types.ts (too generic)
```

### Utilities

**Format**: `camelCase.ts`

```
✅ CORRECT:
quizValidator.ts
scoreCalculator.ts
dateFormatter.ts
stringHelpers.ts

❌ WRONG:
QuizValidator.ts
quiz-validator.ts
utils.ts (too generic)
```

### Pages

**Format**: `page.tsx` (Next.js convention)

```
✅ CORRECT:
app/(main)/grammar/page.tsx
app/(admin)/admin/page.tsx
app/api/grammar/route.ts

❌ WRONG:
app/(main)/grammar/Grammar.tsx
app/(main)/grammar/index.tsx
```

### API Routes

**Format**: `route.ts` (Next.js convention)

```
✅ CORRECT:
app/api/grammar/route.ts
app/api/auth/callback/route.ts
app/api/quiz/submit/route.ts

❌ WRONG:
app/api/grammar/index.ts
app/api/grammar/grammar.ts
```

## Directory Naming

### Feature Directories

**Format**: `kebab-case`

```
✅ CORRECT:
features/grammar/
features/listening/
features/my-words/
features/quiz/

❌ WRONG:
features/Grammar/
features/Listening/
features/myWords/
features/my_words/
```

### Route Groups

**Format**: `(kebab-case)` (Next.js convention)

```
✅ CORRECT:
app/(main)/
app/(admin)/
app/(auth)/

❌ WRONG:
app/main/
app/Main/
app/(Main)/
```

## Variable Naming

### Constants

**Format**: `SCREAMING_SNAKE_CASE`

```typescript
✅ CORRECT:
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const API_BASE_URL = 'https://api.example.com';
const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;

❌ WRONG:
const maxFileSize = 10 * 1024 * 1024;
const apiBaseUrl = 'https://api.example.com';
const difficultyLevels = ['beginner', 'intermediate', 'advanced'];
```

### Variables & Functions

**Format**: `camelCase`

```typescript
✅ CORRECT:
const userName = 'John';
const isLoading = false;
const selectedCategory = null;

function handleSubmit() {}
function calculateScore() {}
function formatDate() {}

❌ WRONG:
const UserName = 'John';
const is_loading = false;
const SelectedCategory = null;

function HandleSubmit() {}
function calculate_score() {}
function FormatDate() {}
```

### Boolean Variables

**Prefix**: `is`, `has`, `should`, `can`

```typescript
✅ CORRECT:
const isLoading = false;
const hasError = true;
const shouldRender = false;
const canEdit = true;
const isAuthenticated = false;
const hasPermission = true;

❌ WRONG:
const loading = false;
const error = true;
const render = false;
const edit = true;
```

### Arrays

**Format**: Plural nouns

```typescript
✅ CORRECT:
const grammars = [];
const users = [];
const categories = [];
const items = [];

❌ WRONG:
const grammarList = [];
const userArray = [];
const categoryArr = [];
const item = []; // Should be plural
```

### Objects

**Format**: Singular nouns

```typescript
✅ CORRECT:
const user = { name: 'John', email: 'john@example.com' };
const grammar = { id: '1', title: 'Present Simple' };
const config = { apiUrl: '...', timeout: 5000 };

❌ WRONG:
const users = { name: 'John' }; // Should be singular
const grammars = { id: '1' }; // Should be singular
```

## Component Naming

### React Components

**Format**: `PascalCase`

```typescript
✅ CORRECT:
export function GrammarCard() {}
export function ListeningPlayer() {}
export function QuizContainer() {}
export function AudioUploadDialog() {}

❌ WRONG:
export function grammarCard() {}
export function listening_player() {}
export function quiz-container() {}
```

### Component Props Interface

**Format**: `[ComponentName]Props`

```typescript
✅ CORRECT:
interface GrammarCardProps {
  grammar: Grammar;
  onClick?: () => void;
}

interface ListeningPlayerProps {
  audioUrl: string;
  onEnd?: () => void;
}

❌ WRONG:
interface GrammarCardProperties {}
interface IGrammarCardProps {}
interface GrammarCard_Props {}
interface Props {} // Too generic
```

## Type Naming

### Interfaces

**Format**: `PascalCase` (NO prefix)

```typescript
✅ CORRECT:
interface User {
  id: string;
  name: string;
  email: string;
}

interface Grammar {
  id: string;
  title: string;
}

❌ WRONG:
interface IUser {} // No I prefix
interface UserInterface {}
interface user {} // Should be PascalCase
```

### Types

**Format**: `PascalCase`

```typescript
✅ CORRECT:
type UserRole = 'user' | 'premium' | 'admin';
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
type ApiResponse = { data: T; error: string | null };

❌ WRONG:
type userRole = 'user' | 'premium' | 'admin';
type DIFFICULTY_LEVEL = 'beginner' | 'intermediate' | 'advanced';
```

### Enums

**Format**: `PascalCase` (Avoid enums, use `as const` instead)

```typescript
✅ CORRECT (Preferred):
const UserRole = {
  USER: 'user',
  PREMIUM: 'premium',
  ADMIN: 'admin',
} as const;

type UserRole = typeof UserRole[keyof typeof UserRole];

✅ ACCEPTABLE:
enum UserRole {
  USER = 'user',
  PREMIUM = 'premium',
  ADMIN = 'admin',
}

❌ WRONG:
const userRole = { ... }; // Should be PascalCase
enum user_role { ... } // Should be PascalCase
```

### Generic Types

**Format**: Single uppercase letter or descriptive PascalCase

```typescript
✅ CORRECT:
type ApiResponse = { data: T; error: string | null };
type Paginated = { items: TData[]; total: number };
function identity(value: T): T { return value; }

❌ WRONG:
type ApiResponse = { ... }; // Should be uppercase
type Paginated = { ... }; // Should be uppercase
```

## Hook Naming

### Custom Hooks

**Format**: `use[Feature][Action]`

```typescript
✅ CORRECT:
export function useGrammar() {}
export function useGrammarCategories() {}
export function useAuth() {}
export function useQuizSubmit() {}
export function useListeningPlayer() {}

❌ WRONG:
export function grammarHook() {}
export function useGetGrammar() {} // Redundant 'Get'
export function useGrammarHook() {} // Redundant 'Hook'
```

### Hook Return Values

**Format**: Descriptive names

```typescript
✅ CORRECT:
export function useGrammar() {
  return {
    grammars,
    isLoading,
    error,
    createGrammar,
    updateGrammar,
    deleteGrammar,
  };
}

❌ WRONG:
export function useGrammar() {
  return {
    data, // Too generic
    loading, // Should be isLoading
    err, // Should be error
    create, // Should be createGrammar
  };
}
```

## Service Naming

### Service Class

**Format**: `[Feature]Service`

```typescript
✅ CORRECT:
class GrammarService {
  async getAll() {}
  async getById(id: string) {}
  async create(data: CreateInput) {}
  async update(id: string, data: UpdateInput) {}
  async delete(id: string) {}
}

export const grammarService = new GrammarService();

❌ WRONG:
class Grammar_Service {}
class grammarservice {}
class ServiceGrammar {}
```

### Service Methods

**Format**: `verb + noun`

```typescript
✅ CORRECT:
getAll()
getById(id: string)
getByCategory(categoryId: string)
create(data: Input)
update(id: string, data: Input)
delete(id: string)
uploadFile(file: File)
downloadContent(id: string)

❌ WRONG:
all() // Missing verb
byId(id: string) // Missing verb
new(data: Input) // Reserved keyword
remove(id: string) // Use 'delete' instead
```

## Event Handler Naming

### Format: `handle[Event]`

```typescript
✅ CORRECT:
const handleClick = () => {};
const handleSubmit = () => {};
const handleChange = (value: string) => {};
const handleDelete = (id: string) => {};
const handleUpload = (file: File) => {};

❌ WRONG:
const onClick = () => {}; // Use 'handle' prefix
const submitHandler = () => {}; // Use 'handle' prefix
const onChangeHandler = () => {}; // Inconsistent
```

### In Components

```typescript
✅ CORRECT:
Click



❌ WRONG:
Click

```

## Database Naming

### Table Names

**Format**: `snake_case`, plural

```sql
✅ CORRECT:
grammar_topics
grammar_categories
listening_content
reading_passages
user_statistics

❌ WRONG:
GrammarTopics
grammar_topic (should be plural)
grammarTopics (use snake_case)
```

### Column Names

**Format**: `snake_case`

```sql
✅ CORRECT:
user_id
created_at
updated_at
difficulty_level
is_premium
premium_expires_at

❌ WRONG:
userId
CreatedAt
difficultyLevel
isPremium
```

## Environment Variables

**Format**: `SCREAMING_SNAKE_CASE`

```bash
✅ CORRECT:
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
LEMONSQUEEZY_API_KEY
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY

❌ WRONG:
next_public_supabase_url
NextPublicSupabaseUrl
supabase-url
```

## CSS Class Naming

### Tailwind Utility Classes

**Format**: Tailwind's predefined classes

```typescript
✅ CORRECT:




❌ WRONG:


```

### Custom CSS Classes (Avoid)

If you must use custom classes:

**Format**: `kebab-case`

```css
✅ CORRECT:
.custom-container {}
.feature-card {}
.audio-player {}

❌ WRONG:
.customContainer {}
.FeatureCard {}
.audio_player {}
```

## Import/Export Naming

### Default Exports

```typescript
✅ CORRECT:
// GrammarCard.tsx
export default function GrammarCard() {}

// Import
import GrammarCard from './GrammarCard';

❌ WRONG:
// Export as Grammar
export default function Grammar() {}

// Import with different name
import Card from './GrammarCard'; // Confusing
```

### Named Exports

```typescript
✅ CORRECT:
// services/index.ts
export { grammarService } from './grammarService';
export { authService } from './authService';

// Import
import { grammarService, authService } from '../services';

❌ WRONG:
export { grammarService as grammar };
export { authService as Auth };
```

## API Endpoint Naming

**Format**: `kebab-case`, RESTful

```
✅ CORRECT:
GET    /api/grammar
GET    /api/grammar/:id
POST   /api/grammar
PATCH  /api/grammar/:id
DELETE /api/grammar/:id
POST   /api/quiz/submit
GET    /api/user/statistics

❌ WRONG:
GET    /api/getGrammar
GET    /api/grammar/getById/:id
POST   /api/createGrammar
POST   /api/grammar/create
```

## Summary Checklist

- ✅ **Files**: PascalCase for components, camelCase for others
- ✅ **Components**: PascalCase
- ✅ **Variables/Functions**: camelCase
- ✅ **Constants**: SCREAMING_SNAKE_CASE
- ✅ **Types/Interfaces**: PascalCase
- ✅ **Hooks**: use[Feature][Action]
- ✅ **Event Handlers**: handle[Event]
- ✅ **Booleans**: is/has/should/can prefix
- ✅ **Arrays**: Plural nouns
- ✅ **Database**: snake_case
- ✅ **Directories**: kebab-case
- ✅ **API Routes**: kebab-case, RESTful

---

## Related Documentation

- [Design Patterns](./01-design-patterns.md)
- [Component Architecture](./02-component-architecture.md)
- [TypeScript Practices](../04-typescript/01-typescript-practices.md)