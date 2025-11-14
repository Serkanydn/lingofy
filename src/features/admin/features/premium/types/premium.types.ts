/**
 * Premium subscription domain types for admin
 * Following: docs/03-code-standards/03-naming-conventions.md
 */

export interface PremiumSubscription {
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

export interface PremiumStats {
  totalSubscribers: number;
  activeSubscribers: number;
  expiredSubscribers: number;
  monthlyRevenue: number;
  totalRevenue: number;
}

export interface UpdatePremiumInput {
  is_premium?: boolean;
  premium_expires_at?: string | null;
}
