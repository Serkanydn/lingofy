'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";

interface PremiumMemberCardProps {
  onContinue: () => void;
}

/**
 * PremiumMemberCard Component
 * 
 * Displays card for existing premium members.
 * Shows crown icon, confirmation message, and continue button.
 * 
 * @component
 */
export function PremiumMemberCard({ onContinue }: PremiumMemberCardProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-linear-to-r from-yellow-400 to-orange-500 p-4 rounded-full">
              <Crown className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl">You're a Premium Member!</CardTitle>
          <CardDescription className="text-lg">
            Enjoy all premium features and continue your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onContinue} size="lg">
            Continue Learning
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
