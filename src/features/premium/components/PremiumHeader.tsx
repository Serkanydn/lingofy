'use client';

import { Crown } from "lucide-react";

interface PremiumHeaderProps {
  title: string;
  description: string;
}

/**
 * PremiumHeader Component
 * 
 * Displays premium page header with crown icon.
 * Features crown icon with gradient background and title/description.
 * 
 * @component
 */
export function PremiumHeader({ title, description }: PremiumHeaderProps) {
  return (
    <div className="text-center mb-12">
      <div className="flex justify-center mb-4">
        <div className="bg-linear-to-r from-yellow-400 to-orange-500 p-3 rounded-full">
          <Crown className="h-10 w-10 text-white" />
        </div>
      </div>
      <h1 className="text-4xl font-bold mb-2">{title}</h1>
      <p className="text-xl text-muted-foreground">{description}</p>
    </div>
  );
}
