/**
 * Premium Feature - Admin
 * Public API exports
 * Following: docs/02-architecture/01-feature-based-structure.md
 */

// Pages
export { PremiumPageClient } from './pages';

// Components
export { SubscriptionDetailsDialog, UpdateSubscriptionForm, CreateSubscriptionForm } from './components';

// Hooks
export {
  usePremiumSubscriptions,
  usePremiumSubscription,
  usePremiumStats,
  useUpdateSubscription,
  useCancelSubscription,
  useExtendSubscription,
} from './hooks';

// Types
export type { PremiumSubscription, PremiumStats, UpdatePremiumInput } from './types';
