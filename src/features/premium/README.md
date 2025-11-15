# Premium Feature

## Overview

The premium feature manages the subscription system, allowing users to upgrade to premium membership. It provides 4 distinct pages: main pricing page, upgrade page with plans, features overview for premium members, and premium content showcase.

## Architecture

This feature follows a feature-based architecture with the following structure:

```
premium/
├── components/          # UI components
├── constants/          # Static data and configuration
├── hooks/              # Business logic hooks
├── pages/              # Page-level orchestrators
├── services/           # API and business services
├── store/              # Zustand state management
└── types/              # TypeScript type definitions
```

## Components

### Core Components

#### `PremiumHeader`
Reusable premium page header with crown icon.
- **Props**: `title`, `description`
- **Features**: Gradient background crown icon, customizable title and description

#### `PricingCard`
Pricing plan card with selection state for monthly/yearly plans.
- **Props**: `plan`, `title`, `description`, `price`, `currency`, `interval`, `discount`, `monthlyEquivalent`, `features`, `isSelected`, `onSelect`
- **Features**: Monthly/yearly toggle, price display, discount badge, feature list with checkmarks, selection ring styling

#### `FeatureCard`
Simple feature card for features grid display.
- **Props**: `title`, `description`
- **Features**: Check icon with primary background, clean card layout

#### `PremiumMemberCard`
Card shown to existing premium members on pricing page.
- **Props**: `onContinue`
- **Features**: Crown icon with gradient, confirmation message, continue button

#### `SubscribeButton`
Large subscribe CTA button with loading state.
- **Props**: `loading`, `onClick`
- **Features**: Gradient background, crown icon, loading spinner

#### `FeaturesGrid`
Grid wrapper for displaying feature cards in responsive layout.
- **Props**: `features` array
- **Features**: Title, 3-column responsive grid (1 col mobile, 2 cols tablet, 3 cols desktop)

#### `UpgradePlanCard`
Upgrade plan card with detailed features and "Best Value" badge.
- **Props**: `title`, `description`, `price`, `interval`, `features`, `isYearly`, `isLoading`, `onUpgrade`
- **Features**: Conditional badge for yearly plan, crown icon, price display, feature list, upgrade button with loading state

#### `PremiumFeatureDetailCard`
Detailed feature card with benefits list for features page.
- **Props**: `title`, `description`, `icon`, `benefits`
- **Features**: Icon with star badge, title and description, benefits list with checkmarks, primary border styling

#### `ContentCard`
Premium content card with progress indicator and metadata.
- **Props**: `title`, `description`, `category`, `icon`, `progress`, `difficulty`, `rating`
- **Features**: Lock icon, category label with icon, progress bar, difficulty badge, star rating

## Hooks

### `usePremiumSubscription`

Manages premium subscription business logic including plan selection and checkout session creation.

**Returns:**
```typescript
{
  selectedPlan: 'monthly' | 'yearly';
  setSelectedPlan: (plan: 'monthly' | 'yearly') => void;
  loading: boolean;
  handleSubscribe: () => Promise<void>;
}
```

**Features:**
- Plan selection state management (monthly/yearly)
- Checkout session creation via API
- Loading state management
- Error handling with toast notifications
- Authentication validation

**Usage:**
```typescript
const { selectedPlan, setSelectedPlan, loading, handleSubscribe } = usePremiumSubscription();
```

## Page Clients

### `PremiumPageClient`
Main premium pricing page orchestrator.
- **Features**: 
  - Premium member card for existing subscribers
  - Header with crown icon
  - Monthly/yearly pricing cards
  - Subscribe button with loading state
  - Features grid with 6 premium features
  - Automatic premium member redirect

### `PremiumUpgradePageClient`
Upgrade page orchestrator with plan selection.
- **Features**:
  - Page header "Upgrade to Premium"
  - Error alert display
  - Two upgrade plan cards (monthly and yearly)
  - "Best Value" badge on yearly plan
  - Premium member redirect
  - Upgrade handling with loading states

### `PremiumFeaturesPageClient`
Features overview page for premium members.
- **Features**:
  - Premium member badge
  - Page header "Your Premium Benefits"
  - 6 feature cards in 3-column grid
  - Each feature has icon, benefits list, and details
  - Active membership message
  - Features: Grammar Access, Analytics, Listening, Priority Features, Word Bank, Learning Acceleration

### `PremiumContentPageClient`
Premium content showcase page with locked content.
- **Features**:
  - Page header "Premium Content"
  - Upgrade button with crown icon
  - 4 content cards in 2-column grid
  - Progress indicators for each content item
  - Difficulty and rating display
  - Lock icons on content cards
  - Content: Business Communication, IELTS Prep, Academic Writing, Vocabulary Builder

## Routes

All premium pages are located under `src/app/(main)/premium/`:

1. **Main Pricing Page** (`page.tsx`)
   - Route: `/premium`
   - Renders: `<PremiumPageClient />`

2. **Upgrade Page** (`upgrade/page.tsx`)
   - Route: `/premium/upgrade`
   - Renders: `<PremiumUpgradePageClient />`

3. **Features Page** (`features/page.tsx`)
   - Route: `/premium/features`
   - Renders: `<PremiumFeaturesPageClient />`

4. **Content Page** (`content/page.tsx`)
   - Route: `/premium/content`
   - Renders: `<PremiumContentPageClient />`

## Types

### `PremiumFeature`
```typescript
interface PremiumFeature {
  title: string;
  description: string;
}
```

### `PlanType`
```typescript
type PlanType = 'monthly' | 'yearly';
```

### `PricingPlan`
```typescript
interface PricingPlan {
  title: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  discount?: string;
  monthlyEquivalent?: string;
  features: string[];
}
```

## Constants

### `PREMIUM_FEATURES`
Array of 6 premium features displayed on pricing page:
1. 500+ Premium Content - Access all reading and listening content
2. Advanced Statistics - Track progress with detailed analytics
3. Ad-Free Experience - Focus without distractions
4. Early Access - Get new content 3 days before free users
5. Priority Support - Get faster help
6. Unlimited Practice - No limits on any feature

## Services

### Payment Integration
- **LemonSqueezy**: Payment processing for subscriptions
- **Checkout API**: `/api/premium/create-checkout` creates checkout sessions
- **Webhook**: `/api/webhook` handles subscription events
- **Premium Service**: `addPremiumService` adds premium status to users

## State Management

### Zustand Store (`store/contentStore.ts`)
- Manages content state across premium pages
- Handles premium content display logic

## API Integration

### Checkout Flow
1. User selects plan (monthly/yearly)
2. Clicks subscribe button
3. Frontend calls `/api/premium/create-checkout` with plan type
4. Backend creates LemonSqueezy checkout session
5. User redirected to LemonSqueezy checkout page
6. On successful payment, webhook updates user's premium status
7. User redirected back to app with premium access

### Premium Status Check
- Uses `useAuth` hook to check `isPremium` status
- Automatically redirects premium users away from pricing pages
- Shows premium member card on main pricing page

## Usage Examples

### Using Premium Components
```typescript
import { PremiumHeader, PricingCard, SubscribeButton } from '@/features/premium/components';

function MyPremiumPage() {
  return (
    <>
      <PremiumHeader 
        title="Upgrade to Premium"
        description="Unlock your full learning potential"
      />
      <PricingCard 
        plan="monthly"
        title="Monthly Plan"
        price={9.99}
        // ... other props
      />
      <SubscribeButton 
        loading={false}
        onClick={handleSubscribe}
      />
    </>
  );
}
```

### Using Premium Hook
```typescript
import { usePremiumSubscription } from '@/features/premium/hooks';

function MyComponent() {
  const { 
    selectedPlan, 
    setSelectedPlan, 
    loading, 
    handleSubscribe 
  } = usePremiumSubscription();

  return (
    <div>
      <button onClick={() => setSelectedPlan('monthly')}>
        Monthly
      </button>
      <button onClick={() => setSelectedPlan('yearly')}>
        Yearly
      </button>
      <button onClick={handleSubscribe} disabled={loading}>
        Subscribe to {selectedPlan} plan
      </button>
    </div>
  );
}
```

## Benefits of This Architecture

### Code Organization
- **Before**: 717 lines across 4 monolithic page files
- **After**: ~20 lines in route files + modular feature components
- **Reduction**: 97% reduction in route file complexity

### Reusability
- Components can be reused across different premium pages
- Hooks encapsulate business logic for easy testing
- Page clients provide consistent page structure

### Maintainability
- Clear separation of concerns (UI, logic, data)
- Easy to locate and modify specific functionality
- Consistent patterns across all premium pages

### Scalability
- Easy to add new premium features or pages
- Components can be extended or composed
- Business logic isolated in hooks

## Testing

### Component Testing
Each component can be tested independently:
```typescript
import { PricingCard } from '@/features/premium/components';
import { render, fireEvent } from '@testing-library/react';

test('PricingCard selection', () => {
  const handleSelect = jest.fn();
  const { getByText } = render(
    <PricingCard 
      plan="monthly"
      isSelected={false}
      onSelect={handleSelect}
      // ... other props
    />
  );
  
  fireEvent.click(getByText('Monthly Plan'));
  expect(handleSelect).toHaveBeenCalled();
});
```

### Hook Testing
Business logic can be tested in isolation:
```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { usePremiumSubscription } from '@/features/premium/hooks';

test('usePremiumSubscription plan selection', () => {
  const { result } = renderHook(() => usePremiumSubscription());
  
  act(() => {
    result.current.setSelectedPlan('monthly');
  });
  
  expect(result.current.selectedPlan).toBe('monthly');
});
```

## Future Enhancements

1. **Gift Subscriptions**: Add gift subscription feature
2. **Team Plans**: Support for team/family subscriptions
3. **Pricing Experiments**: A/B testing for pricing strategies
4. **Referral System**: Premium referral program
5. **Trial Period**: Free trial for premium features
6. **Usage Analytics**: Track premium feature usage
7. **Downgrade Flow**: Handle subscription cancellations
8. **Regional Pricing**: Support for different currencies/regions

## Dependencies

- **UI Components**: Shadcn/ui (Card, Button, Badge, Progress, Alert)
- **Icons**: Lucide React (Crown, Check, Lock, Star, etc.)
- **State Management**: React hooks, Zustand
- **Authentication**: useAuth hook from auth feature
- **Styling**: Tailwind CSS with oklch colors
- **Payments**: LemonSqueezy API
- **Notifications**: sonner (toast)

## Related Features

- **Auth Feature**: User authentication and profile management
- **Layout Feature**: Sidebar navigation and layout
- **Statistics Feature**: Premium-only advanced statistics
- **Grammar/Listening/Reading Features**: Premium content access
