export interface PremiumFeature {
  title: string;
  description: string;
}

export const PlanType = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
} as const;

export type PlanType = typeof PlanType[keyof typeof PlanType];

export interface PricingPlan {
  plan: PlanType;
  title: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  discount?: string;
  monthlyEquivalent?: string;
}
