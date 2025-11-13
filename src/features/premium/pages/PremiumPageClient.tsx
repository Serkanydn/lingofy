'use client';

import { useAuth } from "@/features/auth/hooks/useAuth";
import { PRICING } from "@/shared/lib/lemonsqueezy/config";
import { usePremiumSubscription } from "../hooks/usePremiumSubscription";
import { PREMIUM_FEATURES } from "../constants/features";
import { PremiumHeader } from "../components/PremiumHeader";
import { PremiumMemberCard } from "../components/PremiumMemberCard";
import { PricingCard } from "../components/PricingCard";
import { SubscribeButton } from "../components/SubscribeButton";
import { FeaturesGrid } from "../components/FeaturesGrid";

/**
 * PremiumPageClient Component
 * 
 * Main premium subscription page.
 * 
 * Features:
 * - Premium member card for existing subscribers
 * - Premium header with crown icon
 * - Pricing cards (monthly & yearly)
 * - Subscribe button
 * - Features grid showing all benefits
 * 
 * @component
 */
export function PremiumPageClient() {
  const { isPremium } = useAuth();
  const { selectedPlan, setSelectedPlan, loading, handleSubscribe } = usePremiumSubscription();

  // Show premium member card if already subscribed
  if (isPremium) {
    return (
      <PremiumMemberCard 
        onContinue={() => window.location.href = '/'} 
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <PremiumHeader 
        title="Upgrade to Premium"
        description="Unlock your full English learning potential"
      />

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
        <PricingCard
          plan="monthly"
          title="Monthly"
          description="Flexible month-to-month billing"
          price={PRICING.monthly.price}
          currency={PRICING.monthly.currency}
          interval={PRICING.monthly.interval}
          features={PREMIUM_FEATURES.slice(0, 3)}
          isSelected={selectedPlan === 'monthly'}
          onSelect={() => setSelectedPlan('monthly')}
        />

        <PricingCard
          plan="yearly"
          title="Yearly"
          description="Best value - save big!"
          price={PRICING.yearly.price}
          currency={PRICING.yearly.currency}
          interval={PRICING.yearly.interval}
          discount={PRICING.yearly.discount}
          monthlyEquivalent="Only ₺33.33/month"
          features={PREMIUM_FEATURES.slice(0, 3)}
          isSelected={selectedPlan === 'yearly'}
          onSelect={() => setSelectedPlan('yearly')}
        />
      </div>

      {/* Subscribe Button */}
      <SubscribeButton 
        loading={loading}
        onClick={handleSubscribe}
      />

      {/* Features Grid */}
      <FeaturesGrid features={PREMIUM_FEATURES} />
    </div>
  );
}
