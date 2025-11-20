'use client';

import { useAuth } from "@/shared/hooks/useAuth";
import { PRICING } from "@/shared/lib/lemonsqueezy/config";
import { usePremiumSubscription } from "../hooks/usePremiumSubscription";
import { PREMIUM_FEATURES } from "../constants/features";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Sparkles, Zap, Shield, TrendingUp, Star } from "lucide-react";
import Link from "next/link";

/**
 * PremiumPageClient Component
 * 
 * Claymorphism-styled premium subscription page
 * Following: docs/DESIGN_TYPE_README.MD
 * Following: docs/main-navigation.md
 * 
 * Features:
 * - Soft rounded cards with clay-like shadows
 * - Orange primary color scheme
 * - Playful emoji icons
 * - Smooth hover animations
 * - Clear pricing comparison
 * - Feature showcase grid
 * 
 * @component
 */
export function PremiumPageClient() {
  const { isPremium, user } = useAuth();
  const { selectedPlan, setSelectedPlan, loading, handleSubscribe } = usePremiumSubscription();

  // Show premium member card if already subscribed
  if (isPremium) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-background dark:to-gray-900 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Premium Member Card */}
          <div className="rounded-3xl bg-white dark:bg-card p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
            {/* Crown Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-[0_4px_14px_rgba(249,115,22,0.4)]">
                <Crown className="h-10 w-10 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
              You're a Premium Member! 👑
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
              Enjoy unlimited access to all premium features
            </p>

            {/* User Info */}
            <div className="bg-linear-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6 mb-6">
              <p className="text-sm text-orange-700 dark:text-orange-400 mb-1">Premium Account</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{user?.email}</p>
            </div>

            {/* Features List */}
            <div className="space-y-3 mb-8">
              {PREMIUM_FEATURES.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{feature.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <Link href="/reading">
              <Button className="w-full rounded-2xl h-12 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)]">
                Start Learning
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-background dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          {/* Crown Badge */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-[0_4px_14px_rgba(249,115,22,0.4)] animate-bounce">
              <span className="text-3xl">👑</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Upgrade to <span className="text-orange-500">Premium</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Unlock your full English learning potential with unlimited access to all features
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {/* Monthly Plan */}
          <div
            onClick={() => setSelectedPlan('monthly')}
            className={`rounded-3xl bg-white dark:bg-card p-6 cursor-pointer transition-all duration-300 ${
              selectedPlan === 'monthly'
                ? 'shadow-[0_12px_40px_rgb(0,0,0,0.12)] dark:shadow-[0_12px_40px_rgb(0,0,0,0.4)] ring-4 ring-orange-500/20'
                : 'shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)]'
            }`}
          >
            {/* Badge */}
            <div className="flex items-center justify-between mb-4">
              <Badge className="rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                Flexible
              </Badge>
              {selectedPlan === 'monthly' && (
                <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </div>

            {/* Icon */}
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/10 flex items-center justify-center mb-4 shadow-[0_4px_14px_rgba(59,130,246,0.3)]">
              <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Monthly</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Flexible month-to-month billing</p>

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">₺{PRICING.monthly.price}</span>
              <span className="text-gray-600 dark:text-gray-400">/month</span>
            </div>

            {/* Features */}
            <div className="space-y-3">
              {PREMIUM_FEATURES.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Yearly Plan */}
          <div
            onClick={() => setSelectedPlan('yearly')}
            className={`rounded-3xl bg-white dark:bg-card p-6 cursor-pointer transition-all duration-300 relative ${
              selectedPlan === 'yearly'
                ? 'shadow-[0_12px_40px_rgb(0,0,0,0.12)] dark:shadow-[0_12px_40px_rgb(0,0,0,0.4)] ring-4 ring-orange-500/20'
                : 'shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)]'
            }`}
          >
            {/* Discount Badge */}
            <div className="absolute -top-3 -right-3 bg-linear-to-r from-orange-500 to-orange-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-[0_4px_14px_rgba(249,115,22,0.4)]">
              Save {PRICING.yearly.discount}%
            </div>

            {/* Badge */}
            <div className="flex items-center justify-between mb-4">
              <Badge className="rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                Best Value
              </Badge>
              {selectedPlan === 'yearly' && (
                <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </div>

            {/* Icon */}
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/10 flex items-center justify-center mb-4 shadow-[0_4px_14px_rgba(249,115,22,0.4)]">
              <Star className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Yearly</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Best value - save big!</p>

            {/* Price */}
            <div className="mb-2">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">₺{PRICING.yearly.price}</span>
              <span className="text-gray-600 dark:text-gray-400">/year</span>
            </div>
            <p className="text-sm text-orange-600 dark:text-orange-400 font-semibold mb-6">
              Only ₺33.33/month
            </p>

            {/* Features */}
            <div className="space-y-3">
              {PREMIUM_FEATURES.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subscribe Button */}
        <div className="flex justify-center mb-16">
          <Button
            onClick={handleSubscribe}
            disabled={loading || !selectedPlan}
            className="rounded-2xl h-14 px-12 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg font-semibold shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300"
          >
            {loading ? 'Processing...' : `Get Premium ${selectedPlan === 'yearly' ? 'Yearly' : 'Monthly'}`}
          </Button>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Everything You Get with Premium
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PREMIUM_FEATURES.map((feature, index) => {
              const icons = [Crown, Sparkles, Shield, Zap, TrendingUp, Star];
              const Icon = icons[index % icons.length];
              const colors = [
                'from-orange-100 to-orange-50 text-orange-600',
                'from-purple-100 to-purple-50 text-purple-600',
                'from-blue-100 to-blue-50 text-blue-600',
                'from-green-100 to-green-50 text-green-600',
                'from-pink-100 to-pink-50 text-pink-600',
                'from-amber-100 to-amber-50 text-amber-600',
              ];
              const colorClass = colors[index % colors.length];

              return (
                <div
                  key={index}
                  className="rounded-3xl bg-white dark:bg-card p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-linear-to-br ${colorClass} dark:from-gray-800 dark:to-gray-700 flex items-center justify-center mb-4 shadow-[0_4px_14px_rgba(0,0,0,0.1)]`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ or Trust Badges */}
        <div className="rounded-3xl bg-white dark:bg-card p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            🔒 Secure payment • 💳 Cancel anytime • 📧 Email support included
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Join thousands of learners improving their English every day
          </p>
        </div>
      </div>
    </div>
  );
}
