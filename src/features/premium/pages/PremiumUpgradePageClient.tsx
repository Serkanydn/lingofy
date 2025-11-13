'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { addPremiumToUser } from "../services/addPremiumService";
import { UpgradePlanCard } from "../components/UpgradePlanCard";

const MONTHLY_PRICE = 9.99;
const ANNUAL_PRICE = 99.99;

interface PricingPlan {
  id: string;
  title: string;
  price: number;
  description: string;
  features: string[];
  interval: "month" | "year";
}

const plans: PricingPlan[] = [
  {
    id: process.env.NEXT_PUBLIC_LEMONSQUEEZY_MONTHLY_VARIANT_ID!,
    title: "Monthly Plan",
    price: MONTHLY_PRICE,
    interval: "month",
    description: "Perfect for short-term learning goals",
    features: [
      "Access to all premium content",
      "Ad-free experience",
      "Unlimited quizzes",
      "Progress tracking",
      "Cancel anytime",
    ],
  },
  {
    id: process.env.NEXT_PUBLIC_LEMONSQUEEZY_ANNUAL_VARIANT_ID!,
    title: "Annual Plan",
    price: ANNUAL_PRICE,
    interval: "year",
    description: "Best value for committed learners",
    features: [
      "All Monthly Plan features",
      "Save 17% compared to monthly",
      "Priority support",
      "Early access to new content",
      "Annual learning statistics",
    ],
  },
];

/**
 * PremiumUpgradePageClient Component
 * 
 * Premium upgrade page with plan selection.
 * 
 * Features:
 * - Header with title and description
 * - Error alert display
 * - Two plan cards (monthly & yearly)
 * - Upgrade handling
 * - Auto-redirect for premium users
 * 
 * @component
 */
export function PremiumUpgradePageClient() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user, profile } = useAuth();

  const handleUpgrade = async (plan: PricingPlan) => {
    // Development mode: directly add premium
    await handleUpgradev2();
    return;
  };

  const handleUpgradev2 = async () => {
    if (user?.id) {
      await addPremiumToUser(user.id.toString());
    }
  };

  // Redirect premium users to dashboard
  useEffect(() => {
    if (profile?.is_premium) {
      router.push("/");
    }
  }, [profile?.is_premium, router]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Upgrade to Premium</h1>
        <p className="text-xl text-muted-foreground">
          Take your English learning to the next level with our premium features
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="max-w-md mx-auto mb-8">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan, index) => (
          <UpgradePlanCard
            key={index * 5}
            title={plan.title}
            description={plan.description}
            price={plan.price}
            interval={plan.interval}
            features={plan.features}
            isYearly={plan.interval === "year"}
            isLoading={isLoading === plan.id}
            onUpgrade={() => handleUpgrade(plan)}
          />
        ))}
      </div>
    </div>
  );
}
