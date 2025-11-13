'use client';

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
}

/**
 * FeatureCard Component
 * 
 * Displays a premium feature card with:
 * - Check icon with primary background
 * - Feature title
 * - Feature description
 * 
 * @component
 */
export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-2">
          <Check className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
