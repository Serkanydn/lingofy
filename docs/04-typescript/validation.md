# Validation with Zod

## Overview

This project uses **Zod** for runtime validation and schema definition. Zod provides TypeScript-first schema validation with static type inference.

## Why Zod?

- ✅ TypeScript-first design
- ✅ Static type inference
- ✅ Composable schemas
- ✅ Detailed error messages
- ✅ Works with React Hook Form
- ✅ Zero dependencies

## Basic Schema Patterns

### 1. Primitive Types

```typescript
import { z } from 'zod';

// String
const nameSchema = z.string();
const emailSchema = z.string().email();
const urlSchema = z.string().url();
const uuidSchema = z.string().uuid();

// Number
const ageSchema = z.number();
const positiveSchema = z.number().positive();
const integerSchema = z.number().int();
const rangeSchema = z.number().min(1).max(100);

// Boolean
const isActiveSchema = z.boolean();

// Date
const dateSchema = z.date();
const createdAtSchema = z.string().datetime(); // ISO 8601

// Optional & Nullable
const optionalSchema = z.string().optional(); // string | undefined
const nullableSchema = z.string().nullable(); // string | null
const nullishSchema = z.string().nullish(); // string | null | undefined
```

### 2. Object Schemas

```typescript
import { z } from 'zod';

// Basic object
const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  age: z.number().int().positive(),
  isActive: z.boolean(),
});

// Type inference
type User = z.infer;
// Result: { id: string; name: string; email: string; age: number; isActive: boolean }

// Partial object (all properties optional)
const updateUserSchema = userSchema.partial();

// Pick specific fields
const userPreviewSchema = userSchema.pick({
  id: true,
  name: true,
  email: true,
});

// Omit specific fields
const createUserSchema = userSchema.omit({
  id: true,
});

// Extend schema
const premiumUserSchema = userSchema.extend({
  premiumExpiresAt: z.string().datetime(),
  features: z.array(z.string()),
});
```

### 3. Array Schemas

```typescript
// Array of strings
const tagsSchema = z.array(z.string());

// Array with constraints
const optionsSchema = z.array(z.string()).min(2).max(5);

// Array of objects
const grammarsSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
  })
);

// Non-empty array
const categoriesSchema = z.array(z.string()).nonempty();
```

### 4. Union & Enum Schemas

```typescript
// Literal union
const roleSchema = z.enum(['user', 'premium', 'admin']);
type Role = z.infer; // 'user' | 'premium' | 'admin'

// Union of different types
const idSchema = z.union([z.string(), z.number()]);

// Discriminated union
const questionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('multiple_choice'),
    question: z.string(),
    options: z.array(z.string()),
    correctAnswer: z.string(),
  }),
  z.object({
    type: z.literal('true_false'),
    question: z.string(),
    correctAnswer: z.boolean(),
  }),
  z.object({
    type: z.literal('fill_blank'),
    question: z.string(),
    correctAnswer: z.string(),
  }),
]);
```

## Feature Validation Schemas

### 1. Grammar Feature

```typescript
// features/grammar/types/validation.ts
import { z } from 'zod';

export const difficultyLevelSchema = z.enum([
  'beginner',
  'intermediate',
  'advanced',
]);

export const grammarCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100),
  description: z.string().min(10).max(500),
  order_index: z.number().int().nonnegative(),
});

export const grammarSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500),
  category_id: z.string().uuid('Invalid category ID'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  difficulty_level: difficultyLevelSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const createGrammarSchema = grammarSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const updateGrammarSchema = createGrammarSchema.partial();

// Type exports
export type Grammar = z.infer;
export type CreateGrammar = z.infer;
export type UpdateGrammar = z.infer;
```

### 2. Quiz Feature

```typescript
// features/quiz/types/validation.ts
import { z } from 'zod';

const baseQuestionSchema = z.object({
  id: z.string().uuid(),
  question_text: z.string().min(10, 'Question must be at least 10 characters'),
  explanation: z.string().optional(),
  points: z.number().int().positive().default(1),
});

export const multipleChoiceQuestionSchema = baseQuestionSchema.extend({
  type: z.literal('multiple_choice'),
  options: z.array(z.string()).min(2).max(6),
  correct_answer: z.string(),
});

export const trueFalseQuestionSchema = baseQuestionSchema.extend({
  type: z.literal('true_false'),
  correct_answer: z.boolean(),
});

export const fillBlankQuestionSchema = baseQuestionSchema.extend({
  type: z.literal('fill_blank'),
  correct_answer: z.string().min(1),
  case_sensitive: z.boolean().default(false),
});

export const questionSchema = z.discriminatedUnion('type', [
  multipleChoiceQuestionSchema,
  trueFalseQuestionSchema,
  fillBlankQuestionSchema,
]);

export const quizAnswerSchema = z.object({
  question_id: z.string().uuid(),
  user_answer: z.union([z.string(), z.boolean()]),
});

export const submitQuizSchema = z.object({
  quiz_id: z.string().uuid(),
  answers: z.array(quizAnswerSchema),
  time_spent: z.number().int().positive(),
});

export type Question = z.infer;
export type QuizAnswer = z.infer;
export type SubmitQuiz = z.infer;
```

### 3. Auth Feature

```typescript
// features/auth/types/validation.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  avatar_url: z.string().url().optional(),
});

export type LoginInput = z.infer;
export type RegisterInput = z.infer;
export type UpdateProfileInput = z.infer;
```

## Form Validation with React Hook Form

### 1. Basic Form Setup

```typescript
// features/grammar/components/GrammarForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createGrammarSchema, type CreateGrammar } from '../types/validation';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

interface GrammarFormProps {
  onSubmit: (data: CreateGrammar) => void;
  defaultValues?: Partial;
  isLoading?: boolean;
}

export function GrammarForm({ 
  onSubmit, 
  defaultValues,
  isLoading 
}: GrammarFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createGrammarSchema),
    defaultValues,
  });

  return (
    
      
        Title
        
        {errors.title && (
          
            {errors.title.message}
          
        )}
      

      
        Description
        
        {errors.description && (
          
            {errors.description.message}
          
        )}
      

      
        {isLoading ? 'Saving...' : 'Save'}
      
    
  );
}
```

### 2. Complex Form with Nested Fields

```typescript
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const questionFormSchema = z.object({
  question_text: z.string().min(10),
  options: z.array(
    z.object({
      text: z.string().min(1),
    })
  ).min(2).max(6),
  correct_answer: z.string(),
});

type QuestionFormData = z.infer;

export function QuestionForm() {
  const { register, control, handleSubmit, formState: { errors } } = 
    useForm({
      resolver: zodResolver(questionFormSchema),
      defaultValues: {
        options: [{ text: '' }, { text: '' }],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  const onSubmit = (data: QuestionFormData) => {
    console.log(data);
  };

  return (
    
      
      {errors.question_text && {errors.question_text.message}}

      {fields.map((field, index) => (
        
          
          {errors.options?.[index]?.text && (
            {errors.options[index]?.text?.message}
          )}
          <Button type="button" onClick={() => remove(index)}>
            Remove
          
        
      ))}

      <Button type="button" onClick={() => append({ text: '' })}>
        Add Option
      

      Submit
    
  );
}
```

## API Validation

### 1. Request Validation

```typescript
// app/api/grammar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createGrammarSchema } from '@/features/grammar/types/validation';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = createGrammarSchema.parse(body);
    
    // Process validated data
    const result = await createGrammar(validatedData);
    
    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: error.errors 
        },
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

### 2. Query Parameter Validation

```typescript
// app/api/grammar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  category: z.string().uuid().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  search: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Convert searchParams to object
    const params = Object.fromEntries(searchParams.entries());
    
    // Validate query parameters
    const validatedParams = querySchema.parse(params);
    
    // Use validated params
    const results = await fetchGrammars(validatedParams);
    
    return NextResponse.json({ data: results });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
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

## Custom Validations

### 1. Custom Error Messages

```typescript
const schema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(20, { message: 'Username must not exceed 20 characters' })
    .regex(/^[a-zA-Z0-9_]+$/, { 
      message: 'Username can only contain letters, numbers, and underscores' 
    }),
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email format' }),
});
```

### 2. Custom Refinements

```typescript
const passwordSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'], // Error will be attached to confirmPassword field
  });

// Multiple refinements
const dateRangeSchema = z
  .object({
    startDate: z.date(),
    endDate: z.date(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  })
  .refine((data) => {
    const daysDiff = (data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 30;
  }, {
    message: 'Date range cannot exceed 30 days',
    path: ['endDate'],
  });
```

### 3. Transform Data

```typescript
const userSchema = z.object({
  name: z.string().transform((val) => val.trim()),
  email: z.string().email().toLowerCase(),
  age: z.string().transform((val) => parseInt(val, 10)),
  tags: z.string().transform((val) => val.split(',').map(t => t.trim())),
});

// Input: { name: '  John  ', email: 'JOHN@EXAMPLE.COM', age: '25', tags: 'tag1, tag2, tag3' }
// Output: { name: 'John', email: 'john@example.com', age: 25, tags: ['tag1', 'tag2', 'tag3'] }
```

### 4. Preprocess Data

```typescript
const dateSchema = z.preprocess(
  (arg) => {
    if (typeof arg === 'string' || arg instanceof Date) {
      return new Date(arg);
    }
    return arg;
  },
  z.date()
);

// Accepts both string and Date, converts to Date
const result = dateSchema.parse('2024-01-01'); // Valid
const result2 = dateSchema.parse(new Date()); // Valid
```

## Async Validation

```typescript
const usernameSchema = z.string().refine(
  async (username) => {
    const exists = await checkUsernameExists(username);
    return !exists;
  },
  {
    message: 'Username already taken',
  }
);

// Use with parseAsync
const result = await usernameSchema.parseAsync('john_doe');
```

## Error Handling

### 1. Safe Parse

```typescript
const result = schema.safeParse(data);

if (result.success) {
  console.log(result.data); // Typed data
} else {
  console.error(result.error.errors); // Validation errors
}
```

### 2. Format Errors

```typescript
import { z } from 'zod';

function formatZodErrors(error: z.ZodError): Record {
  const formatted: Record = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    formatted[path] = err.message;
  });
  
  return formatted;
}

// Usage
try {
  schema.parse(data);
} catch (error) {
  if (error instanceof z.ZodError) {
    const formattedErrors = formatZodErrors(error);
    // { "email": "Invalid email", "password": "Too short" }
  }
}
```

## Best Practices

### DO ✅

- Define validation schemas close to feature types
- Use Zod for all form validation
- Validate API inputs on the server
- Use `safeParse` for user input
- Provide clear error messages
- Use `z.infer` for type inference
- Compose schemas for reusability
- Transform data when needed
- Use discriminated unions for variant types

### DON'T ❌

- Skip validation on API routes
- Use loose validation (`z.any()`)
- Ignore validation errors
- Validate on client only
- Create overly complex schemas
- Forget to handle validation errors
- Use magic strings for error messages
- Validate the same data multiple times

---

## Related Documentation

- [TypeScript Practices](./01-typescript-practices.md)
- [Error Patterns](../05-error-handling/01-error-patterns.md)
- [Design Patterns](../03-code-standards/01-design-patterns.md)