'use client';

import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";

interface SubscribeButtonProps {
  loading: boolean;
  onClick: () => void;
}

/**
 * SubscribeButton Component
 * 
 * Large subscribe button with gradient background.
 * Shows loading state when processing.
 * 
 * @component
 */
export function SubscribeButton({ loading, onClick }: SubscribeButtonProps) {
  return (
    <div className="text-center mb-12">
      <Button 
        size="lg" 
        className="bg-linear-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-lg px-12"
        onClick={onClick}
        disabled={loading}
      >
        <Crown className="mr-2 h-5 w-5" />
        {loading ? 'Processing...' : 'Subscribe Now'}
      </Button>
    </div>
  );
}
