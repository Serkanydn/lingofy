
---

# 📘 Form Development Best Practices (Zod + React Hook Form + Next.js + TS)

Bu doküman, Learn Quiz English projesi için **form geliştirme standartlarını**, **Zod doğrulama kurallarını**, **React Hook Form entegrasyonunu**, **Server/Client Component ayrımını** ve **kağıt gibi temiz, scalable form mimarilerini** açıklar.

---

# 1. Genel Kurallar

Bu projede **tüm form işlemleri şu teknolojilerle yapılmalıdır**:

* **React Hook Form (RHF)** — Form state + performans
* **Zod** — Runtime validation + TypeScript inference
* **@hookform/resolvers/zod** — RHF + Zod entegrasyonu
* **Server Components + Client Components separation**
* **TanStack Mutation** — Form submit işlemleri
* **Supabase** — Database CRUD

---

# 2. Dosya Yapısı (Feature-Based)

Formlar **özellik bazlı** olarak aşağıdaki gibi yerleştirilmelidir:

```
src/
 └── features/
     └── grammar/
         ├── components/
         │   └── GrammarCreateForm.tsx
         ├── hooks/
         │   └── use-create-grammar.ts
         ├── utils/
         │   └── grammar-validator.ts
         ├── services/
         │   └── grammarService.ts
         └── types/
             └── grammar.types.ts
```

---

# 3. Zod Şema Best Practices

### ✔ Tüm doğrulama **Zod ile yapılacak**

### ✔ API ve form şeması **tek merkezden yönetilecek**

### ✔ TypeScript türleri **şemadan türetilecek**

```ts
// features/grammar/utils/grammar-validator.ts
import { z } from "zod";

export const createGrammarSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  category_id: z.string().uuid(),
});

export type CreateGrammarSchema = z.infer<typeof createGrammarSchema>;
```

---

# 4. React Hook Form Best Practices

### 1️⃣ **Form mutlaka Client Component olmalı**

```tsx
'use client';
```

### 2️⃣ `zodResolver` mutlaka kullanılmalı

```ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createGrammarSchema, CreateGrammarSchema } from "../utils/grammar-validator";

const form = useForm<CreateGrammarSchema>({
  resolver: zodResolver(createGrammarSchema),
  defaultValues: {
    title: "",
    description: "",
    level: "beginner",
    category_id: "",
  },
});
```

### 3️⃣ Input’lar mutlaka `register` ile bağlanmalı

```tsx
<input {...form.register("title")} />
```

### 4️⃣ Hata mesajları UI’da gösterilmeli

```tsx
{form.formState.errors.title && (
  <p className="text-red-500 text-sm">
    {form.formState.errors.title.message}
  </p>
)}
```

---

# 5. Complete Example — Feature-Based Form Component

```tsx
// features/grammar/components/GrammarCreateForm.tsx
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Textarea, Select } from "@/shared/components/ui";
import { useCreateGrammar } from "../hooks/use-create-grammar";
import {
  createGrammarSchema,
  type CreateGrammarSchema,
} from "../utils/grammar-validator";

export function GrammarCreateForm() {
  const { mutate, isPending } = useCreateGrammar();

  const form = useForm<CreateGrammarSchema>({
    resolver: zodResolver(createGrammarSchema),
    defaultValues: {
      title: "",
      description: "",
      level: "beginner",
      category_id: "",
    },
  });

  const onSubmit = (data: CreateGrammarSchema) => {
    mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Title</label>
        <Input {...form.register("title")} />
        <p className="text-red-500 text-sm">{form.formState.errors.title?.message}</p>
      </div>

      <div>
        <label>Description</label>
        <Textarea {...form.register("description")} />
      </div>

      <div>
        <label>Level</label>
        <Select {...form.register("level")}>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </Select>
      </div>

      <div>
        <label>Category</label>
        <Input {...form.register("category_id")} placeholder="UUID" />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Create"}
      </Button>
    </form>
  );
}
```

---

# 6. useCreate Hook (Mutation Pattern)

```ts
// features/grammar/hooks/use-create-grammar.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { grammarService } from "../services/grammarService";
import { CreateGrammarSchema } from "../utils/grammar-validator";
import { toast } from "sonner";

export function useCreateGrammar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGrammarSchema) =>
      grammarService.create(data),

    onSuccess: () => {
      toast.success("Grammar topic created");
      queryClient.invalidateQueries({ queryKey: ["grammar"] });
    },

    onError: (err) => {
      toast.error("Failed to create grammar topic");
      console.error(err);
    },
  });
}
```

---

# 7. API Route ile Bağlantı

```ts
// app/api/grammar/topics/route.ts
import { NextResponse } from "next/server";
import { createGrammarSchema } from "@/features/grammar/utils/grammar-validator";
import { grammarService } from "@/features/grammar/services/grammarService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = createGrammarSchema.parse(body);

    const topic = await grammarService.create(data);
    return NextResponse.json(topic);
  } catch (err) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
```
