# Security Best Practices

## Overview

Security is a critical aspect of application development. This document outlines security practices and patterns to protect user data and prevent vulnerabilities.

## Authentication & Authorization

### 1. Protected API Routes

```typescript
// shared/lib/auth/apiAuth.ts
import { createClient } from '@/shared/lib/supabase/server';
import { AuthenticationError, AuthorizationError } from '@/shared/types/error.types';

export async function requireAuth() {
  const supabase = await createClient();
  
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AuthenticationError('Authentication required');
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    throw new AuthorizationError('Admin access required');
  }

  return user;
}

export async function requirePremium() {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_premium, premium_expires_at')
    .eq('id', user.id)
    .single();

  if (!profile?.is_premium) {
    throw new AuthorizationError('Premium subscription required');
  }

  const expiresAt = new Date(profile.premium_expires_at);
  if (expiresAt < new Date()) {
    throw new AuthorizationError('Premium subscription expired');
  }

  return user;
}

// Usage in API route
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    // Proceed with authenticated user
  } catch (error) {
    return handleApiError(error);
  }
}
```

### 2. Row Level Security (RLS) Policies

```sql
-- Enable RLS on tables
ALTER TABLE grammar_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Allow users to read all grammar topics
CREATE POLICY "Users can read grammar topics"
  ON grammar_topics FOR SELECT
  USING (true);

-- Allow admins to manage grammar topics
CREATE POLICY "Admins can manage grammar topics"
  ON grammar_topics FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Allow users to read only their own progress
CREATE POLICY "Users can read own progress"
  ON user_progress FOR SELECT
  USING (user_id = auth.uid());

-- Allow users to insert/update only their own progress
CREATE POLICY "Users can manage own progress"
  ON user_progress FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

### 3. Client-Side Route Protection

```typescript
// app/(main)/layout.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/shared/lib/supabase/server';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <>{children}</>;
}
```

## Input Validation & Sanitization

### 1. Always Validate Input

```typescript
import { z } from 'zod';

// Define strict schemas
const createGrammarSchema = z.object({
  title: z.string().min(3).max(200).trim(),
  description: z.string().min(10).max(500).trim(),
  content: z.string().min(50),
  category_id: z.string().uuid(),
});

// Validate in API routes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate and sanitize
    const validatedData = createGrammarSchema.parse(body);
    
    // Use validated data
    const result = await createGrammar(validatedData);
    
    return NextResponse.json({ data: result });
  } catch (error) {
    return handleApiError(error);
  }
}
```

### 2. SQL Injection Prevention

```typescript
// ✅ SAFE: Using Supabase client (parameterized queries)
const { data } = await supabase
  .from('grammar_topics')
  .select('*')
  .eq('category_id', categoryId) // Safe
  .ilike('title', `%${searchTerm}%`); // Safe

// ❌ DANGEROUS: Raw SQL without parameterization
const { data } = await supabase
  .rpc('search_grammar', { 
    query: `SELECT * FROM grammar_topics WHERE title = '${searchTerm}'` 
  }); // Vulnerable to SQL injection!

// ✅ SAFE: Using parameterized RPC
const { data } = await supabase
  .rpc('search_grammar', { 
    search_term: searchTerm 
  });
```

### 3. XSS Prevention

```typescript
// ✅ React automatically escapes JSX
export function Component({ title }: { title: string }) {
  return {title}; // Safe - React escapes by default
}

// ❌ DANGEROUS: Using dangerouslySetInnerHTML
export function Component({ html }: { html: string }) {
  return ; // Dangerous!
}

// ✅ SAFE: Sanitize HTML if you must use it
import DOMPurify from 'isomorphic-dompurify';

export function Component({ html }: { html: string }) {
  const sanitized = DOMPurify.sanitize(html);
  return ;
}
```

## Sensitive Data Protection

### 1. Environment Variables

```bash
# .env.local (NEVER commit to git)

# Public variables (accessible in browser)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# Private variables (server-only)
SUPABASE_SERVICE_ROLE_KEY=xxx
LEMONSQUEEZY_API_KEY=xxx
LEMONSQUEEZY_WEBHOOK_SECRET=xxx
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
```

```typescript
// ✅ SAFE: Using environment variables correctly
// Server-side only
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Client and server
const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// ❌ DANGEROUS: Exposing secrets in client code
'use client';
const apiKey = process.env.LEMONSQUEEZY_API_KEY; // Will be undefined or exposed!
```

### 2. Never Expose Sensitive Data

```typescript
// ❌ WRONG: Exposing sensitive user data
export async function GET(request: NextRequest) {
  const users = await supabase.from('profiles').select('*');
  
  return NextResponse.json({ users }); // Exposes password hash, etc!
}

// ✅ CORRECT: Select only needed fields
export async function GET(request: NextRequest) {
  const users = await supabase
    .from('profiles')
    .select('id, name, email, avatar_url');
  
  return NextResponse.json({ users });
}
```

### 3. Secure Password Handling

```typescript
// ✅ Let Supabase handle password hashing
const { data, error } = await supabase.auth.signUp({
  email: email,
  password: password, // Supabase hashes automatically
});

// ❌ NEVER store plain text passwords
// ❌ NEVER log passwords
console.log('User password:', password); // NEVER DO THIS!

// ✅ Enforce strong passwords with validation
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain uppercase letter')
  .regex(/[a-z]/, 'Password must contain lowercase letter')
  .regex(/[0-9]/, 'Password must contain number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain special character');
```

## File Upload Security

### 1. Validate File Types

```typescript
// app/api/audio/upload/route.ts
const ALLOWED_TYPES = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      throw new ValidationError('No file provided');
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new ValidationError(
        `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(', ')}`
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new ValidationError(
        `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`
      );
    }

    // Generate safe filename
    const safeFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Upload to storage
    const result = await uploadToStorage(file, safeFilename);

    return NextResponse.json({ data: result });
  } catch (error) {
    return handleApiError(error);
  }
}
```

### 2. Secure File Storage

```typescript
// shared/services/cloudflareService.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';

class CloudflareService {
  private s3Client: S3Client;

  async uploadFile(file: File, folder: string) {
    // Generate unique key with hash
    const hash = crypto.randomBytes(16).toString('hex');
    const ext = file.name.split('.').pop();
    const key = `${folder}/${hash}.${ext}`;

    const buffer = await file.arrayBuffer();

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        Body: Buffer.from(buffer),
        ContentType: file.type,
        // Set appropriate permissions
        ACL: 'public-read', // Only if files should be public
      })
    );

    return { key, url: `${process.env.AWS_PUBLIC_URL}/${key}` };
  }
}
```

## API Security

### 1. Rate Limiting

```typescript
// shared/lib/rate-limit.ts
import { NextRequest } from 'next/server';

const rateLimit = new Map();

export function checkRateLimit(
  request: NextRequest,
  limit: number = 100,
  window: number = 60000 // 1 minute
): boolean {
  const ip = request.ip || 'unknown';
  const now = Date.now();

  const record = rateLimit.get(ip);

  if (!record || now > record.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + window });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

// Usage
export async function POST(request: NextRequest) {
  if (!checkRateLimit(request, 10, 60000)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  // Continue...
}
```

### 2. CORS Configuration

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Only allow specific origins in production
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'https://yourdomain.com',
  ];

  const origin = request.headers.get('origin');

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  return response;
}
```

### 3. CSRF Protection

```typescript
// Supabase handles CSRF for auth endpoints
// For custom endpoints, validate origin header

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL;

  if (origin !== allowedOrigin) {
    return NextResponse.json(
      { error: 'Invalid origin' },
      { status: 403 }
    );
  }

  // Continue...
}
```

## Webhook Security

### 1. Verify Webhook Signatures

```typescript
// app/api/webhook/lemon-squeezy/route.ts
import crypto from 'crypto';

function verifySignature(payload: string, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
  
  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(hash)
  );
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('x-signature') || '';

    // Verify signature
    if (!verifySignature(payload, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Process webhook
    const event = JSON.parse(payload);
    await processWebhook(event);

    return NextResponse.json({ received: true });
  } catch (error) {
    return handleApiError(error);
  }
}
```

## Data Privacy

### 1. GDPR Compliance

```typescript
// Implement data export
export async function exportUserData(userId: string) {
  const supabase = createClient();

  const [profile, progress, words] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('user_progress').select('*').eq('user_id', userId),
    supabase.from('user_words').select('*').eq('user_id', userId),
  ]);

  return {
    profile: profile.data,
    progress: progress.data,
    words: words.data,
  };
}

// Implement data deletion
export async function deleteUserData(userId: string) {
  const supabase = createClient();

  await Promise.all([
    supabase.from('user_progress').delete().eq('user_id', userId),
    supabase.from('user_words').delete().eq('user_id', userId),
    supabase.from('profiles').delete().eq('id', userId),
  ]);
}
```

## Security Checklist

### ✅ Authentication & Authorization
- [ ] All API routes check authentication
- [ ] Admin routes verify admin role
- [ ] Premium routes verify subscription
- [ ] RLS policies enabled on all tables
- [ ] Protected routes redirect unauthenticated users

### ✅ Input Validation
- [ ] All inputs validated with Zod
- [ ] SQL injection prevented (use Supabase client)
- [ ] XSS prevented (React escapes by default)
- [ ] File uploads validated (type, size)
- [ ] User input sanitized

### ✅ Data Protection
- [ ] Sensitive env variables never exposed to client
- [ ] Passwords never logged or stored in plain text
- [ ] API responses don't expose sensitive data
- [ ] User data properly scoped (RLS)

### ✅ API Security
- [ ] Rate limiting implemented
- [ ] CORS configured correctly
- [ ] Webhook signatures verified
- [ ] Error messages don't expose internals

### ✅ File Security
- [ ] File types validated
- [ ] File sizes limited
- [ ] Filenames sanitized
- [ ] Storage permissions set correctly

---

## Related Documentation

- [Error Patterns](./01-error-patterns.md)
- [Validation](../04-typescript/02-validation.md)
- [API Routes](../02-architecture/03-api-routes.md)