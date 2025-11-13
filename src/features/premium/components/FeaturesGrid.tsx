'use client';

import { FeatureCard } from "./FeatureCard";

export interface PremiumFeature {
  title: string;
  description: string;
}

interface FeaturesGridProps {
  features: PremiumFeature[];
}

/**
 * FeaturesGrid Component
 * 
 * Displays grid of premium features.
 * Shows title and 3-column responsive grid of feature cards.
 * 
 * @component
 */
export function FeaturesGrid({ features }: FeaturesGridProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">
        Everything You Get with Premium
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard 
            key={index} 
            title={feature.title} 
            description={feature.description} 
          />
        ))}
      </div>
    </div>
  );
}
