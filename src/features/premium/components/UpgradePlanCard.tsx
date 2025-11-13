'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Crown, Loader2 } from "lucide-react";

interface UpgradePlanCardProps {
  title: string;
  description: string;
  price: number;
  interval: string;
  features: string[];
  isYearly?: boolean;
  isLoading: boolean;
  onUpgrade: () => void;
}

/**
 * UpgradePlanCard Component
 * 
 * Displays upgrade plan card with:
 * - "Best Value" badge for yearly plan
 * - Crown icon with title
 * - Price and interval
 * - Features list with checkmarks
 * - Upgrade button with loading state
 * 
 * @component
 */
export function UpgradePlanCard({
  title,
  description,
  price,
  interval,
  features,
  isYearly = false,
  isLoading,
  onUpgrade,
}: UpgradePlanCardProps) {
  return (
    <Card className="relative">
      {isYearly && (
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
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">${price}</span>
          <span className="text-muted-foreground">/{interval}</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {features.map((feature) => (
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
          onClick={onUpgrade}
          disabled={isLoading}
        >
          {isLoading ? (
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
  );
}
