# Code Templates

## Overview

This document provides ready-to-use templates for common patterns in the project. Copy and modify these templates when creating new features.

## Feature Structure Template

```
features/[feature-name]/
├── components/
│   ├── [Feature]Card.tsx
│   ├── [Feature]List.tsx
│   ├── [Feature]Detail.tsx
│   ├── [Feature]Form.tsx
│   └── [Feature]Dialog.tsx
├── hooks/
│   ├── use[Feature].ts
│   └── use[Feature]Detail.ts
├── services/
│   ├── index.ts
│   └── [feature]Service.ts
├── types/
│   ├── [feature].types.ts
│   ├── service.types.ts
│   └── validation.ts
├── pages/
│   └── [Feature]PageClient.tsx
└── constants/
    └── config.ts
```

## Type Definitions Template

```typescript
// features/[feature]/types/[feature].types.ts

/**
 * Main entity interface
 */
export interface Feature {
  id: string;
  title: string;
  description: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Input type for creating a new entity
 */
export type CreateFeatureInput = Omit<
  Feature,
  'id' | 'user_id' | 'created_at' | 'updated_at'
>;

/**
 * Input type for updating an entity
 */
export type UpdateFeatureInput = Partial;

/**
 * Extended type with relations
 */
export interface FeatureWithRelations extends Feature {
  user: User;
  category: Category;
}
```

```typescript
// features/[feature]/types/validation.ts

import { z } from 'zod';

export const featureSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10).max(500),
  user_id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const createFeatureSchema = featureSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
});

export const updateFeatureSchema = createFeatureSchema.partial();

export type Feature = z.infer;
export type CreateFeature = z.infer;
export type UpdateFeature = z.infer;
```

## Service Template

```typescript
// features/[feature]/services/[feature]Service.ts

import { createClient } from '@/shared/lib/supabase/client';
import { AppError, NotFoundError } from '@/shared/types/error.types';
import type {
  Feature,
  CreateFeatureInput,
  UpdateFeatureInput,
} from '../types/[feature].types';

class FeatureService {
  private supabase = createClient();

  /**
   * Fetch all features
   */
  async getAll(): Promise {
    try {
      const { data, error } = await this.supabase
        .from('features')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch features', 'FETCH_ERROR');
    }
  }

  /**
   * Fetch a single feature by ID
   */
  async getById(id: string): Promise {
    try {
      const { data, error } = await this.supabase
        .from('features')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError('Feature');
        }
        throw error;
      }

      return data;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch feature', 'FETCH_ERROR');
    }
  }

  /**
   * Create a new feature
   */
  async create(input: CreateFeatureInput): Promise {
    try {
      const { data, error } = await this.supabase
        .from('features')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError('Failed to create feature', 'CREATE_ERROR');
    }
  }

  /**
   * Update an existing feature
   */
  async update(id: string, input: UpdateFeatureInput): Promise {
    try {
      const { data, error } = await this.supabase
        .from('features')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError('Failed to update feature', 'UPDATE_ERROR');
    }
  }

  /**
   * Delete a feature
   */
  async delete(id: string): Promise {
    try {
      const { error } = await this.supabase
        .from('features')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      throw new AppError('Failed to delete feature', 'DELETE_ERROR');
    }
  }
}

export const featureService = new FeatureService();
```

```typescript
// features/[feature]/services/index.ts

export { featureService } from './featureService';
```

## Hook Template

```typescript
// features/[feature]/hooks/useFeature.ts

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { featureService } from '../services';
import type { CreateFeatureInput, UpdateFeatureInput } from '../types/[feature].types';

export function useFeature() {
  const queryClient = useQueryClient();

  // Fetch all features
  const {
    data: features,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['features'],
    queryFn: featureService.getAll,
  });

  // Create feature
  const createFeature = useMutation({
    mutationFn: (input: CreateFeatureInput) => featureService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      toast.success('Feature created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create feature');
      console.error(error);
    },
  });

  // Update feature
  const updateFeature = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFeatureInput }) =>
      featureService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      toast.success('Feature updated successfully');
    },
    onError: () => {
      toast.error('Failed to update feature');
    },
  });

  // Delete feature
  const deleteFeature = useMutation({
    mutationFn: (id: string) => featureService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      toast.success('Feature deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete feature');
    },
  });

  return {
    features,
    isLoading,
    error,
    createFeature: createFeature.mutate,
    updateFeature: updateFeature.mutate,
    deleteFeature: deleteFeature.mutate,
    isCreating: createFeature.isPending,
    isUpdating: updateFeature.isPending,
    isDeleting: deleteFeature.isPending,
  };
}
```

```typescript
// features/[feature]/hooks/useFeatureDetail.ts

'use client';

import { useQuery } from '@tanstack/react-query';
import { featureService } from '../services';

export function useFeatureDetail(id: string) {
  const {
    data: feature,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['features', id],
    queryFn: () => featureService.getById(id),
    enabled: !!id,
  });

  return {
    feature,
    isLoading,
    error,
  };
}
```

## Component Templates

### Card Component

```typescript
// features/[feature]/components/FeatureCard.tsx

'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import type { Feature } from '../types/[feature].types';

interface FeatureCardProps {
  feature: Feature;
  onClick?: (id: string) => void;
}

export function FeatureCard({ feature, onClick }: FeatureCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onClick?.(feature.id)}
    >
      
        {feature.title}
      
      
        
          {feature.description}
        
      
    
  );
}
```

### List Component

```typescript
// features/[feature]/components/FeatureList.tsx

import { FeatureCard } from './FeatureCard';
import type { Feature } from '../types/[feature].types';

interface FeatureListProps {
  features: Feature[];
  onFeatureClick?: (id: string) => void;
}

export function FeatureList({ features, onFeatureClick }: FeatureListProps) {
  if (features.length === 0) {
    return (
      
        No features found
      
    );
  }

  return (
    
      {features.map((feature) => (
        
      ))}
    
  );
}
```

### Form Component

```typescript
// features/[feature]/components/FeatureForm.tsx

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFeatureSchema, type CreateFeature } from '../types/validation';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';

interface FeatureFormProps {
  onSubmit: (data: CreateFeature) => void;
  defaultValues?: Partial;
  isLoading?: boolean;
}

export function FeatureForm({
  onSubmit,
  defaultValues,
  isLoading,
}: FeatureFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createFeatureSchema),
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

### Dialog Component

```typescript
// features/[feature]/components/CreateFeatureDialog.tsx

'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { FeatureForm } from './FeatureForm';
import { useFeature } from '../hooks/useFeature';
import type { CreateFeature } from '../types/validation';

export function CreateFeatureDialog() {
  const [open, setOpen] = useState(false);
  const { createFeature, isCreating } = useFeature();

  const handleSubmit = (data: CreateFeature) => {
    createFeature(data, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    
      
        Create Feature
      
      
        
          Create New Feature
        
        
      
    
  );
}
```

### Skeleton Component

```typescript
// features/[feature]/components/FeatureSkeleton.tsx

import { Skeleton } from '@/shared/components/ui/skeleton';
import { Card, CardHeader, CardContent } from '@/shared/components/ui/card';

export function FeatureSkeleton() {
  return (
    
      {Array.from({ length: 6 }).map((_, i) => (
        
          
            
          
          
            
            
          
        
      ))}
    
  );
}
```

## Page Templates

### Server Page

```typescript
// app/(main)/feature/page.tsx

import { createClient } from '@/shared/lib/supabase/server';
import { FeaturePageClient } from '@/features/[feature]/pages/FeaturePageClient';

export default async function FeaturePage() {
  const supabase = await createClient();

  const { data: features } = await supabase
    .from('features')
    .select('*')
    .order('created_at', { ascending: false });

  return ;
}
```

### Client Page

```typescript
// features/[feature]/pages/FeaturePageClient.tsx

'use client';

import { useRouter } from 'next/navigation';
import { FeatureList } from '../components/FeatureList';
import { FeatureSkeleton } from '../components/FeatureSkeleton';
import { CreateFeatureDialog } from '../components/CreateFeatureDialog';
import { useFeature } from '../hooks/useFeature';
import type { Feature } from '../types/[feature].types';

interface Props {
  initialFeatures: Feature[];
}

export function FeaturePageClient({ initialFeatures }: Props) {
  const router = useRouter();
  const { features = initialFeatures, isLoading } = useFeature();

  const handleFeatureClick = (id: string) => {
    router.push(`/feature/${id}`);
  };

  return (
    
      
        Features
        
      

      {isLoading ? (
        
      ) : (
        
      )}
    
  );
}
```

## API Route Templates

### GET Route

```typescript
// app/api/feature/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/shared/lib/supabase/server';
import { handleApiError } from '@/shared/lib/api/errorHandler';
import { requireAuth } from '@/shared/lib/auth/apiAuth';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('features')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    return handleApiError(error);
  }
}
```

### POST Route

```typescript
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();

    const body = await request.json();
    const validatedData = createFeatureSchema.parse(body);

    const { data, error } = await supabase
      .from('features')
      .insert({
        ...validatedData,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
```

### Dynamic Route

```typescript
// app/api/feature/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/shared/lib/supabase/server';
import { handleApiError } from '@/shared/lib/api/errorHandler';
import { requireAuth } from '@/shared/lib/auth/apiAuth';

interface RouteParams {
  params: Promise;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await requireAuth();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('features')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await requireAuth();
    const supabase = await createClient();

    const body = await request.json();
    const validatedData = updateFeatureSchema.parse(body);

    const { data, error } = await supabase
      .from('features')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await requireAuth();
    const supabase = await createClient();

    const { error } = await supabase
      .from('features')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
```

## Database Schema Template

```sql
-- scripts/create_feature_table.sql

-- Create table
CREATE TABLE features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description VARCHAR(500) NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_features_user ON features(user_id);
CREATE INDEX idx_features_created ON features(created_at DESC);

-- Enable RLS
ALTER TABLE features ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own features"
  ON features FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own features"
  ON features FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own features"
  ON features FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own features"
  ON features FOR DELETE
  USING (user_id = auth.uid());

-- Updated timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_features_updated_at
  BEFORE UPDATE ON features
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## Usage Instructions

1. **Copy the template** for the component/file you need
2. **Replace placeholders**:
   - `[feature]` → your feature name (lowercase)
   - `[Feature]` → your feature name (PascalCase)
   - `Feature` → your entity name (PascalCase)
3. **Modify as needed** for your specific requirements
4. **Follow naming conventions** from the documentation

---

## Related Documentation

- [Feature Creation](./01-feature-creation.md)
- [Design Patterns](../03-code-standards/01-design-patterns.md)
- [Component Architecture](../03-code-standards/02-component-architecture.md)