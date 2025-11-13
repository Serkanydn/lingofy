'use client';

import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";
import {
  Rocket,
  Target,
  BookOpen,
  BarChart3,
  Headphones,
} from "lucide-react";
import { PremiumFeatureDetailCard } from "../components/PremiumFeatureDetailCard";

interface Feature {
  title: string;
  description: string;
  icon: any;
  benefits: string[];
}

const features: Feature[] = [
  {
    title: "Exclusive Grammar Access",
    description: "You have access to all advanced grammar lessons and exercises",
    icon: BookOpen,
    benefits: [
      "In-depth explanations with native examples",
      "Practice with real-world scenarios",
      "Advanced grammar structures",
    ],
  },
  {
    title: "Enhanced Analytics",
    description: "Track your progress with detailed performance metrics",
    icon: BarChart3,
    benefits: [
      "Weekly progress reports",
      "Personalized learning insights",
      "Performance comparisons",
    ],
  },
  {
    title: "Premium Listening Content",
    description: "Access to native speaker conversations and exercises",
    icon: Headphones,
    benefits: [
      "Business English dialogues",
      "Real-world conversations",
      "Accent training materials",
    ],
  },
  {
    title: "Priority Features",
    description: "Enjoy premium member exclusive features",
    icon: Crown,
    benefits: [
      "Priority support response",
      "Early access to new content",
      "Offline download access",
    ],
  },
  {
    title: "Advanced Word Bank",
    description: "Enhanced vocabulary learning tools",
    icon: Target,
    benefits: [
      "Personalized word lists",
      "Context-based learning",
      "Etymology insights",
    ],
  },
  {
    title: "Learning Acceleration",
    description: "Fast-track your English learning journey",
    icon: Rocket,
    benefits: [
      "Accelerated learning paths",
      "Intensive practice sessions",
      "Focused skill improvement",
    ],
  },
];

/**
 * PremiumFeaturesPageClient Component
 * 
 * Premium features overview page for members.
 * 
 * Features:
 * - Premium member badge
 * - Features grid (3 columns)
 * - Detailed feature cards
 * - Active membership message
 * 
 * @component
 */
export function PremiumFeaturesPageClient() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <Badge className="mb-4 bg-linear-to-r from-yellow-400 to-orange-500">
          <Crown className="mr-2 h-4 w-4" />
          Premium Member
        </Badge>
        <h1 className="text-4xl font-bold mb-4">Your Premium Benefits</h1>
        <p className="text-xl text-muted-foreground">
          Welcome to your enhanced learning experience. Here are all the premium features you have access to.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature) => (
          <PremiumFeatureDetailCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            benefits={feature.benefits}
          />
        ))}
      </div>

      <div className="mt-16 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Your Premium Membership is Active
        </h2>
        <p className="text-muted-foreground">
          Make the most of your premium features to accelerate your English learning journey.
          If you need any assistance, our priority support team is here to help.
        </p>
      </div>
    </div>
  );
}
