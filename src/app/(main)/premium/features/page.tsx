"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  Lightbulb,
  Rocket,
  Target,
  BookOpen,
  BarChart3,
  Crown,
  Headphones,
  MessagesSquare,
  Zap,
  Star as StarIcon,
  CheckCircle,
} from "lucide-react";

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

export default function PremiumFeaturesPage() {
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
          <Card key={feature.title} className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <feature.icon className="h-6 w-6 text-primary" />
                <StarIcon className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feature.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
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