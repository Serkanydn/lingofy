# Premium Management Feature - Admin

## Overview

This feature provides comprehensive premium subscription management for the admin panel. It allows administrators to view, manage, and update user premium subscriptions.

## Structure

Following the feature-based architecture as defined in `docs/02-architecture/01-feature-based-structure.md`.

```
premium/
├── components/           # UI components
│   ├── SubscriptionDetailsDialog.tsx
│   ├── UpdateSubscriptionDialog.tsx
│   └── index.ts
├── hooks/               # React hooks
│   ├── usePremium.ts
│   └── index.ts
├── pages/               # Page components
│   ├── PremiumPageClient.tsx
│   └── index.ts
├── services/            # API services
│   ├── premiumAdminService.ts
│   └── index.ts
├── types/               # TypeScript types
│   ├── premium.types.ts
│   └── index.ts
└── index.ts            # Public exports
```

## Features

### Subscription Management
- View all user subscriptions
- Filter by status (active, expired, none)
- Search by email or name
- View detailed subscription information
- Update subscription status
- Cancel subscriptions
- Extend subscription expiration dates

### Statistics Dashboard
- Total subscribers count
- Active subscribers
- Expired subscribers
- Conversion rate

### Components

#### `PremiumPageClient`
Main page component that displays the subscription management interface.

**Features:**
- Data table with subscription information
- Filter and search functionality
- Statistics cards
- Action buttons (view, edit, cancel)

#### `SubscriptionDetailsDialog`
Modal dialog showing detailed information about a subscription.

**Information displayed:**
- User details (name, email)
- Subscription status
- Expiration date
- LemonSqueezy customer ID
- LemonSqueezy subscription ID
- Account creation date

#### `UpdateSubscriptionDialog`
Modal dialog for updating subscription details.

**Capabilities:**
- Toggle premium status
- Set expiration date
- View current subscription info

## Hooks

### `usePremiumSubscriptions()`
Fetches all premium subscriptions.

```typescript
const { data: subscriptions, isLoading } = usePremiumSubscriptions();
```

### `usePremiumStats()`
Fetches premium statistics.

```typescript
const { data: stats } = usePremiumStats();
```

### `useUpdateSubscription()`
Updates a subscription.

```typescript
const updateSubscription = useUpdateSubscription();
await updateSubscription.mutateAsync({ userId, data });
```

### `useCancelSubscription()`
Cancels a subscription.

```typescript
const cancelSubscription = useCancelSubscription();
await cancelSubscription.mutateAsync(userId);
```

### `useExtendSubscription()`
Extends a subscription expiration date.

```typescript
const extendSubscription = useExtendSubscription();
await extendSubscription.mutateAsync({ userId, expirationDate });
```

## Services

### `premiumAdminService`

#### Methods:
- `getAllSubscriptions()` - Get all subscriptions
- `getSubscriptionById(userId)` - Get specific subscription
- `updateSubscription(userId, data)` - Update subscription
- `cancelSubscription(userId)` - Cancel subscription
- `extendSubscription(userId, expirationDate)` - Extend subscription
- `getStats()` - Get premium statistics

## Types

### `PremiumSubscription`
```typescript
interface PremiumSubscription {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  is_premium: boolean;
  premium_expires_at: string | null;
  lemon_squeezy_customer_id: string | null;
  lemon_squeezy_subscription_id: string | null;
  subscription_status: 'active' | 'expired' | 'cancelled' | 'none';
  created_at: string;
}
```

### `PremiumStats`
```typescript
interface PremiumStats {
  totalSubscribers: number;
  activeSubscribers: number;
  expiredSubscribers: number;
  monthlyRevenue: number;
  totalRevenue: number;
}
```

### `UpdatePremiumInput`
```typescript
interface UpdatePremiumInput {
  is_premium?: boolean;
  premium_expires_at?: string | null;
}
```

## Usage

### In Route Page
```typescript
// app/(admin)/admin/premium/page.tsx
import { PremiumPageClient } from "@/features/admin/features/premium";

export default function AdminPremiumPage() {
  return <PremiumPageClient />;
}
```

## Database Schema

Uses the `profiles` table with the following relevant fields:
- `id` - User ID
- `email` - User email
- `full_name` - User name
- `is_premium` - Premium status
- `premium_expires_at` - Expiration date
- `lemon_squeezy_customer_id` - LemonSqueezy customer ID
- `lemon_squeezy_subscription_id` - LemonSqueezy subscription ID

## Security

- Server-side authentication required (admin role)
- RLS policies enforce admin-only access
- Input validation on all forms
- Proper error handling

## Future Enhancements

- Integration with LemonSqueezy API for revenue data
- Subscription analytics and charts
- Export subscription data
- Bulk subscription operations
- Email notifications for subscription changes
- Subscription history/audit log

---

Last Updated: November 2025
