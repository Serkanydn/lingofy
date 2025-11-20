'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/shared/hooks/useAuth';
import { PlanType } from '../../../shared/types/model/premium.types';

/**
 * usePremiumSubscription Hook
 * 
 * Manages premium subscription business logic:
 * - Handles plan selection (monthly/yearly)
 * - Creates checkout session
 * - Handles loading and error states
 * - Validates user authentication
 * 
 * @returns Subscription state and handlers
 */
export function usePremiumSubscription() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(PlanType.YEARLY);
  const [loading, setLoading] = useState(false);

  /**
   * Handles subscription checkout process
   */
  const handleSubscribe = async () => {
    if (!user) {
      toast.error('Authentication Required', {
        description: 'Please login to subscribe',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/premium/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: selectedPlan,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to create checkout session',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    selectedPlan,
    setSelectedPlan,
    loading,
    handleSubscribe,
  };
}
