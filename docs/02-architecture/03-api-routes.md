# API Routes Architecture

## Overview

API routes in Next.js 16 App Router follow RESTful conventions and are organized by feature. All routes use the new route handler format with `route.ts` files.

## Directory Structure

```
app/api/
├── auth/                    # Authentication endpoints
│   └── callback/
│       └── route.ts
├── grammar/                 # Grammar endpoints
│   ├── route.ts            # GET /api/grammar
│   └── [id]/
│       └── route.ts        # GET /api/grammar/[id]
├── listening/              # Listening endpoints
│   ├── route.ts
│   └── [level]/
│       └── route.ts
├── reading/                # Reading endpoints
│   ├── route.ts
│   └── [level]/
│       └── route.ts
├── quiz/                   # Quiz endpoints
│   ├── route.ts
│   └── submit/
│       └── route.ts
├── words/                  # Vocabulary endpoints
│   ├── route.ts
│   └── [id]/
│       └── route.ts
├── premium/                # Premium features
│   └── add-premium/
│       └── route.ts
├── create-checkout/        # Payment
│   └── route.ts
├── webhook/                # Webhooks
│   ├── lemon/
│   │   └── route.ts
│   └── lemon-squeezy/
│       └── route.ts
└── audio/                  # Media upload
    ├── upload/
    │   └── route.ts
    └── delete/
        └── route.ts
```

## Route Handler Template

### Basic GET Route

```typescript
// app/api/[resource]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/shared/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Query database
    const { data, error } = await supabase
      .from('table_name')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### POST Route with Validation

```typescript
// app/api/[resource]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/shared/lib/supabase/server';

// Define validation schema
const createSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(10),
  category_id: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const validatedData = createSchema.parse(body);

    // Insert to database
    const { data, error } = await supabase
      .from('table_name')
      .insert({
        ...validatedData,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Dynamic Route with Parameters

```typescript
// app/api/[resource]/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/shared/lib/supabase/server';

interface RouteParams {
  params: Promise;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('table_name')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Resource not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { data, error } = await supabase
      .from('table_name')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { error } = await supabase
      .from('table_name')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 204 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Authentication Patterns

### 1. User Authentication

```typescript
async function checkAuth(supabase: SupabaseClient) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('Unauthorized');
  }

  return user;
}

// Usage
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const user = await checkAuth(supabase);
    
    // Continue with authenticated user
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}
```

### 2. Admin Role Check

```typescript
async function checkAdmin(supabase: SupabaseClient) {
  const user = await checkAuth(supabase);

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    throw new Error('Forbidden');
  }

  return user;
}

// Usage in admin routes
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    await checkAdmin(supabase);
    
    // Admin-only operation
  } catch (error) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    );
  }
}
```

### 3. Premium User Check

```typescript
async function checkPremium(supabase: SupabaseClient) {
  const user = await checkAuth(supabase);

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_premium, premium_expires_at')
    .eq('id', user.id)
    .single();

  if (!profile?.is_premium || new Date(profile.premium_expires_at) < new Date()) {
    throw new Error('Premium required');
  }

  return user;
}
```

## File Upload Handling

```typescript
// app/api/audio/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/shared/lib/supabase/server';
import { cloudflareService } from '@/shared/services/cloudflareService';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    await checkAdmin(supabase);

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large' },
        { status: 400 }
      );
    }

    // Upload to storage
    const { url, key } = await cloudflareService.uploadFile(file, 'audio');

    // Save to database
    const { data, error } = await supabase
      .from('audio_assets')
      .insert({
        url,
        key,
        filename: file.name,
        size: file.size,
        mime_type: file.type,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
```

## Webhook Handling

```typescript
// app/api/webhook/lemon-squeezy/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/shared/lib/supabase/server';

function verifySignature(payload: string, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return hash === signature;
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('x-signature') || '';

    if (!verifySignature(payload, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(payload);
    const supabase = await createClient();

    switch (event.meta.event_name) {
      case 'order_created':
        await handleOrderCreated(event, supabase);
        break;
      case 'subscription_created':
        await handleSubscriptionCreated(event, supabase);
        break;
      case 'subscription_cancelled':
        await handleSubscriptionCancelled(event, supabase);
        break;
      default:
        console.log('Unhandled event:', event.meta.event_name);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleOrderCreated(event: any, supabase: SupabaseClient) {
  // Implementation
}
```

## Error Response Standards

### Standard Error Format

```typescript
interface ErrorResponse {
  error: string;
  details?: unknown;
  code?: string;
}

// Usage
return NextResponse.json(
  {
    error: 'Resource not found',
    code: 'RESOURCE_NOT_FOUND',
  },
  { status: 404 }
);
```

### HTTP Status Codes

```typescript
const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;
```

## CORS Configuration

```typescript
// app/api/[route]/route.ts
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
```

## Rate Limiting

```typescript
// shared/lib/rate-limit.ts
import { NextRequest } from 'next/server';

const rateLimit = new Map();

export function checkRateLimit(
  request: NextRequest,
  limit: number = 10,
  window: number = 60000 // 1 minute
): boolean {
  const ip = request.ip || 'unknown';
  const now = Date.now();
  const requests = rateLimit.get(ip) || [];

  // Remove old requests
  const validRequests = requests.filter((time) => now - time < window);

  if (validRequests.length >= limit) {
    return false;
  }

  validRequests.push(now);
  rateLimit.set(ip, validRequests);

  return true;
}

// Usage
export async function POST(request: NextRequest) {
  if (!checkRateLimit(request)) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }
  
  // Continue...
}
```

## Best Practices

### DO ✅

- Always validate input with Zod
- Use proper HTTP status codes
- Check authentication on protected routes
- Handle errors gracefully
- Log errors properly
- Use TypeScript strictly
- Return consistent response formats
- Verify webhook signatures
- Implement rate limiting

### DON'T ❌

- Expose internal error details to clients
- Skip input validation
- Use generic error messages
- Ignore authentication checks
- Return sensitive data
- Use `any` types
- Throw unhandled errors
- Log sensitive information

---

## Related Documentation

- [Error Patterns](../05-error-handling/01-error-patterns.md)
- [Security](../05-error-handling/02-security.md)
- [TypeScript Practices](../04-typescript/01-typescript-practices.md)