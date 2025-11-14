# Form Validation Best Practices

## Overview

This guide covers best practices for form validation using React Hook Form, Zod, and TypeScript. These tools provide type-safe, performant form handling with minimal boilerplate.

## Technology Stack

- **React Hook Form**: Performant form state management with minimal re-renders
- **Zod**: TypeScript-first schema validation
- **TypeScript**: Type safety throughout the form lifecycle

## Core Principles

1. **Schema-First Approach**: Define validation rules in Zod schemas
2. **Type Safety**: Derive TypeScript types from Zod schemas
3. **User Experience**: Validate on blur, show errors clearly, disable submit on invalid state
4. **Accessibility**: Proper ARIA attributes and error associations
5. **Performance**: Minimize re-renders, use uncontrolled inputs when possible

---

## Basic Setup

### 1. Schema Definition

Always define your validation schema in a separate file for reusability:

```typescript
// schemas/user.schema.ts
import { z } from 'zod';

export const userFormSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  age: z
    .number({ invalid_type_error: 'Age must be a number' })
    .int('Age must be a whole number')
    .min(18, 'Must be at least 18 years old')
    .max(120, 'Invalid age'),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

// Infer TypeScript type from schema
export type UserFormData = z.infer<typeof userFormSchema>;
```

### 2. Form Component

```typescript
// components/UserForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userFormSchema, type UserFormData } from '@/schemas/user.schema';

export function UserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    mode: 'onBlur', // Validate on blur for better UX
    reValidateMode: 'onChange', // Re-validate on change after first submit
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      // API call
      await createUser(data);
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email')}
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <span id="email-error" role="alert">
            {errors.email.message}
          </span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

---

## Advanced Patterns

### 1. Nested Object Validation

```typescript
const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  zipCode: z.string().regex(/^\d{5}$/, 'Invalid ZIP code'),
});

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: addressSchema,
});

type ProfileFormData = z.infer<typeof profileSchema>;

// In component
<input {...register('address.street')} />
{errors.address?.street && <span>{errors.address.street.message}</span>}
```

### 2. Array Validation

```typescript
const contactSchema = z.object({
  type: z.enum(['email', 'phone']),
  value: z.string().min(1, 'Value is required'),
});

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contacts: z.array(contactSchema).min(1, 'At least one contact is required'),
});

// In component with useFieldArray
const { fields, append, remove } = useFieldArray({
  control,
  name: 'contacts',
});

{fields.map((field, index) => (
  <div key={field.id}>
    <input {...register(`contacts.${index}.value`)} />
    {errors.contacts?.[index]?.value && (
      <span>{errors.contacts[index].value.message}</span>
    )}
  </div>
))}
```

### 3. Conditional Validation

```typescript
const formSchema = z
  .object({
    accountType: z.enum(['personal', 'business']),
    companyName: z.string().optional(),
    taxId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.accountType === 'business') {
      if (!data.companyName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Company name is required for business accounts',
          path: ['companyName'],
        });
      }
      if (!data.taxId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tax ID is required for business accounts',
          path: ['taxId'],
        });
      }
    }
  });
```

### 4. Custom Validation Rules

```typescript
const passwordMatchSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Async validation (e.g., check email availability)
const emailSchema = z.string().email().refine(
  async (email) => {
    const response = await checkEmailAvailability(email);
    return response.isAvailable;
  },
  { message: 'Email is already taken' }
);
```

### 5. Cross-Field Validation

```typescript
const bookingSchema = z
  .object({
    checkIn: z.date({ required_error: 'Check-in date is required' }),
    checkOut: z.date({ required_error: 'Check-out date is required' }),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: 'Check-out date must be after check-in date',
    path: ['checkOut'],
  });
```

---

## Reusable Components

### Input Component with Error Handling

```typescript
// components/FormInput.tsx
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  registration: UseFormRegisterReturn;
}

export function FormInput({
  label,
  error,
  registration,
  ...props
}: FormInputProps) {
  const id = props.id || registration.name;

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        {...registration}
        {...props}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <span id={`${id}-error`} className="error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

// Usage
<FormInput
  label="Email"
  type="email"
  registration={register('email')}
  error={errors.email?.message}
/>
```

---

## Best Practices

### 1. Validation Modes

```typescript
// Choose appropriate mode based on use case
useForm({
  mode: 'onSubmit', // Default, validate on submit (best for simple forms)
  mode: 'onBlur', // Validate when field loses focus (better UX)
  mode: 'onChange', // Validate on every change (use sparingly, causes re-renders)
  mode: 'onTouched', // Validate after field is touched and on change
  mode: 'all', // Validate on blur and change
});
```

### 2. Error Display

```typescript
// ✅ Good: Show errors clearly with appropriate ARIA attributes
{errors.email && (
  <span className="error-message" role="alert">
    {errors.email.message}
  </span>
)}

// ❌ Bad: No ARIA attributes, unclear error location
{errors.email && <span>{errors.email.message}</span>}
```

### 3. Schema Organization

```typescript
// ✅ Good: Separate schemas, reusable components
// schemas/common.schema.ts
export const emailSchema = z.string().email('Invalid email');
export const passwordSchema = z.string().min(8, 'Min 8 characters');

// schemas/user.schema.ts
import { emailSchema, passwordSchema } from './common.schema';

export const userSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// ❌ Bad: All schemas in one file, duplicate validation logic
```

### 4. Type Safety

```typescript
// ✅ Good: Infer types from schemas
export const userSchema = z.object({
  email: z.string().email(),
  age: z.number(),
});

export type UserFormData = z.infer<typeof userSchema>;

// ❌ Bad: Manual type definition that can drift from schema
export interface UserFormData {
  email: string;
  age: number;
}
```

### 5. Default Values

```typescript
// ✅ Good: Provide default values that match schema
useForm<UserFormData>({
  resolver: zodResolver(userFormSchema),
  defaultValues: {
    email: '',
    age: 18,
    terms: false,
  },
});

// ❌ Bad: No default values or mismatched types
useForm<UserFormData>({
  resolver: zodResolver(userFormSchema),
});
```

### 6. Submit Button State

```typescript
// ✅ Good: Disable button during submission and when invalid
<button 
  type="submit" 
  disabled={isSubmitting || !isValid}
>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</button>

// ❌ Bad: No disabled state, allows multiple submissions
<button type="submit">Submit</button>
```

---

## Common Patterns

### 1. Multi-Step Form

```typescript
const step1Schema = z.object({
  email: z.string().email(),
});

const step2Schema = z.object({
  password: z.string().min(8),
});

const fullSchema = step1Schema.merge(step2Schema);

function MultiStepForm() {
  const [step, setStep] = useState(1);
  
  const form = useForm<z.infer<typeof fullSchema>>({
    resolver: zodResolver(step === 1 ? step1Schema : fullSchema),
  });

  // Handle step navigation and validation
}
```

### 2. Form with File Upload

```typescript
const formSchema = z.object({
  name: z.string().min(1),
  avatar: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, 'File is required')
    .refine(
      (files) => files?.[0]?.size <= 5000000,
      'File size must be less than 5MB'
    )
    .refine(
      (files) => ['image/jpeg', 'image/png'].includes(files?.[0]?.type),
      'Only JPEG and PNG files are allowed'
    ),
});

// In component
<input type="file" {...register('avatar')} accept="image/*" />
```

### 3. Dynamic Form Fields

```typescript
function DynamicForm() {
  const { control, watch } = useForm();
  const fieldType = watch('fieldType');

  return (
    <>
      <select {...register('fieldType')}>
        <option value="text">Text</option>
        <option value="number">Number</option>
      </select>

      {fieldType === 'text' && (
        <input type="text" {...register('textValue')} />
      )}
      {fieldType === 'number' && (
        <input type="number" {...register('numberValue')} />
      )}
    </>
  );
}
```

---

## Error Handling

### 1. Server-Side Validation Errors

```typescript
const onSubmit = async (data: UserFormData) => {
  try {
    await createUser(data);
  } catch (error) {
    if (error.response?.status === 422) {
      // Set server validation errors
      error.response.data.errors.forEach((err: any) => {
        setError(err.field, {
          type: 'server',
          message: err.message,
        });
      });
    }
  }
};
```

### 2. Global Form Errors

```typescript
const { setError, formState: { errors } } = useForm();

// Set global error
setError('root.serverError', {
  type: 'server',
  message: 'Something went wrong. Please try again.',
});

// Display global error
{errors.root?.serverError && (
  <div className="alert alert-error">
    {errors.root.serverError.message}
  </div>
)}
```

---

## Testing

### Unit Testing Schemas

```typescript
// schemas/user.schema.test.ts
import { describe, it, expect } from 'vitest';
import { userFormSchema } from './user.schema';

describe('userFormSchema', () => {
  it('should validate correct data', () => {
    const validData = {
      email: 'test@example.com',
      password: 'Password123',
      age: 25,
      terms: true,
    };

    const result = userFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const invalidData = {
      email: 'invalid-email',
      password: 'Password123',
      age: 25,
      terms: true,
    };

    const result = userFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Invalid email address');
    }
  });
});
```

### Testing Forms

```typescript
// components/UserForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserForm } from './UserForm';

describe('UserForm', () => {
  it('should show validation errors', async () => {
    const user = userEvent.setup();
    render(<UserForm />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });

  it('should submit valid data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<UserForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'Password123');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123',
      });
    });
  });
});
```

---

## Performance Optimization

### 1. Avoid Unnecessary Re-renders

```typescript
// ✅ Good: Use uncontrolled inputs with register
<input {...register('email')} />

// ❌ Bad: Controlled input causes re-render on every keystroke
const { watch, setValue } = useForm();
const email = watch('email');
<input value={email} onChange={(e) => setValue('email', e.target.value)} />
```

### 2. Lazy Validation

```typescript
// Only validate when needed
useForm({
  mode: 'onBlur', // Don't validate on every keystroke
  reValidateMode: 'onChange', // Re-validate after first error
});
```

### 3. Memoize Schemas

```typescript
// ✅ Good: Define schema outside component or use useMemo
const formSchema = z.object({ /* ... */ });

function MyForm() {
  const form = useForm({ resolver: zodResolver(formSchema) });
}

// ❌ Bad: Schema recreated on every render
function MyForm() {
  const formSchema = z.object({ /* ... */ });
  const form = useForm({ resolver: zodResolver(formSchema) });
}
```

---

## Security Considerations

1. **Client-Side Validation is Not Enough**: Always validate on the server
2. **Sanitize Inputs**: Use Zod transforms to sanitize data
3. **Rate Limiting**: Implement rate limiting for form submissions
4. **CSRF Protection**: Use CSRF tokens for state-changing operations

```typescript
// Sanitize input
const sanitizedSchema = z.object({
  username: z.string().trim().toLowerCase(),
  bio: z.string().transform((val) => sanitizeHtml(val)),
});
```

---

## Related Documentation

- [Design Patterns](../03-code-standards/01-design-patterns.md)
- [Component Architecture](../03-code-standards/02-component-architecture.md)
- [TypeScript Practices](../04-typescript/typescript-practices.md)
- [Error Patterns](../05-error-handling/error-patterns.md)
- [Security](../05-error-handling/security.md)