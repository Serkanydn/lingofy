/**
 * Premium subscriptions hooks - Admin
 * Following: docs/02-architecture/01-feature-based-structure.md
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { premiumAdminService } from '../services';
import type { UpdatePremiumInput } from '../types';

/**
 * Get all premium subscriptions
 */
export function usePremiumSubscriptions() {
  return useQuery({
    queryKey: ['admin', 'premium', 'subscriptions'],
    queryFn: () => premiumAdminService.getAllSubscriptions(),
  });
}

/**
 * Get subscription by user ID
 */
export function usePremiumSubscription(userId: string | null) {
  return useQuery({
    queryKey: ['admin', 'premium', 'subscription', userId],
    queryFn: () => premiumAdminService.getSubscriptionById(userId!),
    enabled: !!userId,
  });
}

/**
 * Get premium statistics
 */
export function usePremiumStats() {
  return useQuery({
    queryKey: ['admin', 'premium', 'stats'],
    queryFn: () => premiumAdminService.getStats(),
  });
}

/**
 * Update subscription
 */
export function useUpdateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: UpdatePremiumInput;
    }) => premiumAdminService.updateSubscription(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'premium'] });
      toast.success('Subscription updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update subscription');
    },
  });
}

/**
 * Cancel subscription
 */
export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => premiumAdminService.cancelSubscription(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'premium'] });
      toast.success('Subscription cancelled successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to cancel subscription');
    },
  });
}

/**
 * Extend subscription
 */
export function useExtendSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      expirationDate,
    }: {
      userId: string;
      expirationDate: string;
    }) => premiumAdminService.extendSubscription(userId, expirationDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'premium'] });
      toast.success('Subscription extended successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to extend subscription');
    },
  });
}
