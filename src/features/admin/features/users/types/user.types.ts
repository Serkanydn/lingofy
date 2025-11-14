/**
 * User domain types
 * Following: docs/03-code-standards/03-naming-conventions.md
 */

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  is_premium: boolean;
  premium_expires_at: string | null;
  created_at: string;
  lemon_squeezy_customer_id: string | null;
  lemon_squeezy_subscription_id: string | null;
}

export interface UpdateUserInput {
  full_name?: string;
  is_premium?: boolean;
  premium_expires_at?: string | null;
}