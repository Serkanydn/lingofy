'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap } from "lucide-react";

export interface PremiumFeature {
  title: string;
  description: string;
}

interface PricingCardProps {
  plan: 'monthly' | 'yearly';
  title: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  discount?: string;
  monthlyEquivalent?: string;
  features: PremiumFeature[];
  isSelected: boolean;
  onSelect: () => void;
}

/**
 * PricingCard Component
 * 
 * Displays a pricing plan card with:
 * - Plan title and description
 * - Price with interval
 * - Monthly equivalent (for yearly)
 * - Feature list with checkmarks
 * - Selection state with ring border
 * - Discount badge (for yearly)
 * 
 * @component
 */
export function PricingCard({
  plan,
  title,
  description,
  price,
  currency,
  interval,
  discount,
  monthlyEquivalent,
  features,
  isSelected,
  onSelect,
}: PricingCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all relative ${
        isSelected 
          ? 'border-primary ring-2 ring-primary' 
          : 'hover:border-primary/50'
      }`}
      onClick={onSelect}
    >
      {discount && (
        <Badge className="absolute -top-3 right-4 bg-linear-to-r from-yellow-400 to-orange-500">
          Save {discount}
        </Badge>
      )}
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {isSelected && <Zap className="h-5 w-5 text-primary" />}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <span className="text-4xl font-bold">
            {currency}{price}
          </span>
          <span className="text-muted-foreground">/{interval}</span>
          {monthlyEquivalent && (
            <div className="text-sm text-green-600 font-medium mt-1">
              {monthlyEquivalent}
            </div>
          )}
        </div>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
              <span>{feature.title}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
