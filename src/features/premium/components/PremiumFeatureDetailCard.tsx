'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star as StarIcon, CheckCircle, LucideIcon } from "lucide-react";

interface PremiumFeatureDetailCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  benefits: string[];
}

/**
 * PremiumFeatureDetailCard Component
 * 
 * Displays detailed premium feature card with:
 * - Feature icon with star
 * - Title and description
 * - Benefits list with checkmarks
 * - Primary border
 * 
 * @component
 */
export function PremiumFeatureDetailCard({
  title,
  description,
  icon: Icon,
  benefits,
}: PremiumFeatureDetailCardProps) {
  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3 mb-3">
          <Icon className="h-6 w-6 text-primary" />
          <StarIcon className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <span className="text-sm">{benefit}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
