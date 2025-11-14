import { PlanType } from '../types/premium.types';

interface AddPremiumParams {
  userId: string;
  plan?: PlanType;
  lemonSqueezyCustomerId?: string;
  lemonSqueezySubscriptionId?: string;
}

export async function addPremiumToUser({
  userId,
  plan = PlanType.MONTHLY,
  lemonSqueezyCustomerId,
  lemonSqueezySubscriptionId,
}: AddPremiumParams) {
  const response = await fetch('/api/premium/add-premium', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      userId, 
      plan,
      lemonSqueezyCustomerId,
      lemonSqueezySubscriptionId,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to add premium status')
  }

  return response.json()
}