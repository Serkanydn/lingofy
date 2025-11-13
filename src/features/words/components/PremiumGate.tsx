'use client';

import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * PremiumGate Component
 * 
 * Paywall display for non-premium users:
 * - Crown icon with orange gradient
 * - Feature description
 * - Upgrade to Premium button
 * 
 * @component
 */
export function PremiumGate() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-12 text-center">
            <div className="w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mx-auto mb-6">
              <Crown className="h-12 w-12 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              My Words is a Premium Feature
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Upgrade to Premium to save and organize your vocabulary
            </p>
            <Button
              onClick={() => router.push("/premium")}
              className="rounded-3xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300 px-8 py-6 text-base"
            >
              <Crown className="mr-2 h-5 w-5" />
              Upgrade to Premium
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
