export interface PremiumFeature {
  title: string;
  description: string;
}

export enum PlanTypes {
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

export interface PricingPlan {
  plan: PlanTypes;
  title: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  discount?: string;
  monthlyEquivalent?: string;
}
