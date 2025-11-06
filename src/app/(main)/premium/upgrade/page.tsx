"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Loader2 } from "lucide-react";
 
import { Alert, AlertDescription } from "@/components/ui/alert";
import { addPremiumToUser } from "@/features/premium/services/addPremiumService";
import { useAuth } from "@/features/auth/hooks/useAuth";

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

export default function PremiumUpgradePage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();
   const { user, profile, isPremium } = useAuth();
 

  const handleUpgrade = async (plan: PricingPlan) => {
    handleUpgradev2();
    return;
    // if (!user) {
    //   router.push("/login?redirect=/premium/upgrade");
    //   return;
    // }

    // setIsLoading(plan.id);
    // setError("");

    // try {
    //   const checkoutUrl = await createCheckoutSession({
    //     variantId: plan.id,
    //     customerEmail: user.email!,
    //     userId: user.id,
    //   });

    //   if (checkoutUrl) {
    //     window.location.href = checkoutUrl;
    //   } else {
    //     throw new Error("Failed to create checkout session");
    //   }
    // } catch (err: any) {
    //   setError(err.message || "Failed to start checkout process");
    // } finally {
    //   setIsLoading(null);
    // }
  };

  const handleUpgradev2 = async () => {
    await addPremiumToUser(user?.id.toString());
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
          //   <Card key={plan.id * index * 5} className="relative">
          <Card key={index * 5} className="relative">
            {plan.interval === "year" && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge
                  variant="secondary"
                  className="bg-primary text-primary-foreground"
                >
                  Best Value
                </Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                {plan.title}
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/{plan.interval}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleUpgrade(plan)}
                disabled={!!isLoading}
              >
                {isLoading === plan.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Upgrade Now"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
