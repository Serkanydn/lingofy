export interface PremiumFeature {
  title: string;
  description: string;
}

export type PlanType = 'monthly' | 'yearly';

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
