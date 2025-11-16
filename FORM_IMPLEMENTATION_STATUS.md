# Admin Dialog Forms Implementation - React Hook Form & Zod

## Summary

All admin dialog forms in `features/admin/features` have been updated to use:
- **React Hook Form** for form state management
- **Zod** for validation schemas
- **@hookform/resolvers/zod** for integration

## Implementation Overview

### 1. Validation Schemas Created

#### Grammar (`src/features/admin/features/grammar/types/validation.ts`)
- `grammarCategorySchema` - Category validation
- `grammarTopicSchema` - Topic validation
- `grammarQuestionSchema` - Question validation

#### Listening (`src/features/admin/features/listening/types/validation.ts`)
- `listeningExerciseSchema` - Exercise validation
- `questionSchema` - Discriminated union for different question types
- Supports: multiple_choice, fill_blank, true_false

#### Reading (`src/features/admin/features/reading/types/validation.ts`)
- `readingTextSchema` - Text validation
- `questionSchema` - Same discriminated union as listening

### 2. Completed Components

✅ `AddGrammarCategoryDialog.tsx` - Fully converted with react-hook-form
✅ `EditGrammarCategoryDialog.tsx` - Fully converted with react-hook-form

### 3. Pattern Used

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema, type FormData } from "../types/validation";

export function Dialog({ open, onClose }: Props) {
  const mutation = useMutation();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { /* defaults */ },
  });

  const onSubmit = async (data: FormData) => {
    await mutation.mutateAsync(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input {...register("fieldName")} />
        {errors.fieldName && (
          <p className="text-sm text-red-500">{errors.fieldName.message}</p>
        )}
        
        <Button type="submit" disabled={isSubmitting || mutation.isPending}>
          {isSubmitting || mutation.isPending ? "Saving..." : "Save"}
        </Button>
      </form>
    </Dialog>
  );
}
```

### 4. Key Features

#### Form Validation
- Real-time validation with Zod schemas
- Custom error messages
- Type-safe form data
- Automatic type inference with `z.infer<typeof schema>`

#### Form State Management
- `register()` - Register input fields
- `handleSubmit()` - Handle form submission
- `formState.errors` - Access validation errors
- `formState.isSubmitting` - Track submission state
- `reset()` - Reset form to defaults
- `watch()` - Watch specific fields
- `setValue()` - Programmatically set values

#### Number Fields
```typescript
<Input
  type="number"
  {...register("order_index", { valueAsNumber: true })}
/>
```

#### Checkbox Fields
```typescript
<input
  type="checkbox"
  {...register("is_active")}
/>
```

#### Custom onChange Handlers
```typescript
<Input
  {...register("name", {
    onChange: (e) => handleCustomLogic(e),
  })}
/>
```

## Remaining Components to Update

### Grammar Feature
- [x] `GrammarForm.tsx` – Category selection, UX improvements, sanitization
- [x] `GrammarPageClient.tsx` – Memoized filters, options, columns
- [ ] `AddGrammarDialog.tsx`
- [ ] `AddQuestionDialog.tsx`

### Listening Feature
- [ ] `AddListeningDialog.tsx`
- [ ] `EditListeningDialog.tsx`

### Reading Feature
- [ ] `AddReadingDialog.tsx`
- [ ] `EditReadingDialog.tsx`
- [ ] `QuestionManager.tsx`

### Users Feature
- [ ] `UserDetailsDialog.tsx` (Read-only, no validation needed)

## Template for Remaining Components

For components with file uploads and complex nested questions (Listening/Reading), use:

```typescript
import { useForm, useFieldArray } from "react-hook-form";

// For nested questions
const { fields, append, remove } = useFieldArray({
  control,
  name: "questions",
});

// For file uploads
const [audioFile, setAudioFile] = useState<File | null>(null);

const onSubmit = async (data: FormData) => {
  // Handle file upload first
  if (audioFile) {
    const audioAssetId = await uploadFile(audioFile);
    data.audio_asset_id = audioAssetId;
  }
  
  // Then submit form data
  await mutation.mutateAsync(data);
};
```

## Best Practices Followed

1. ✅ TypeScript strict mode - No `any` types
2. ✅ Validation schemas close to feature
3. ✅ Clear error messages
4. ✅ Consistent naming conventions
5. ✅ Proper loading states
6. ✅ Form reset after successful submission
7. ✅ Disabled buttons during submission
8. ✅ Type inference from Zod schemas

## Dependencies

Already installed in package.json:
- `react-hook-form`: ^7.65.0
- `@hookform/resolvers`: ^5.2.2
- `zod`: ^4.1.12

## Testing

After completing all components, test:
1. Form validation (try to submit invalid data)
2. Error messages display correctly
3. Form resets after successful submission
4. Loading states work properly
5. File uploads (for listening/reading)
6. Nested questions management

## Next Steps

1. Update `AddGrammarDialog.tsx` with topic validation
2. Update `AddQuestionDialog.tsx` with question validation
3. Update listening dialogs with exercise + question validation
4. Update reading dialogs with text + question validation
5. Update `QuestionManager.tsx` component to use useFieldArray
## Admin Grammar Form Test Scenarios

### Category Selection
- Open Admin Grammar page and click "Add Topic".
- Verify category dropdown is disabled during loading and shows appropriate placeholder.
- Select a category; ensure the badge shows the selected category name.
- Edit an existing topic; ensure the dropdown pre-selects `topic.category.id` or falls back to `topic.category_id`.

### Validation and Submission
- Try submitting without a category; expect validation error on category field.
- Provide a title shorter than 3 chars; expect validation error.
- Enter examples with duplicates and trailing spaces; expect duplicates removed and whitespace trimmed on submit.
- Ensure submit button disables while saving and shows external loading state when mutations are pending.

### Filtering and Data Table
- Use search, category, and premium filters; verify the topics list updates responsively.
- Confirm categories error banner appears when category fetch fails.

### State Consistency
- After category CRUD operations on Categories page, return to Grammar page and verify active categories refresh in the dropdown.
