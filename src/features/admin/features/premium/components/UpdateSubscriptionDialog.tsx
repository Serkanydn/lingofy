/**
 * Update Subscription Form - Admin Premium
 * Following: docs/03-code-standards/02-component-architecture.md
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { PremiumSubscription } from '../types';

interface UpdateSubscriptionFormProps {
  isOpen: boolean;
  onToggle: () => void;
  subscription: PremiumSubscription | null;
  onSubmit: (data: { is_premium: boolean; premium_expires_at: string | null }) => void;
  onCancel?: (userId: string) => void;
  isLoading?: boolean;
}

export function UpdateSubscriptionForm({
  isOpen,
  onToggle,
  subscription,
  onSubmit,
  onCancel,
  isLoading,
}: UpdateSubscriptionFormProps) {
  const [isPremium, setIsPremium] = useState(false);
  const [expiresAt, setExpiresAt] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    if (subscription) {
      setIsPremium(subscription.is_premium);
      setExpiresAt(
        subscription.premium_expires_at
          ? new Date(subscription.premium_expires_at).toISOString().split('T')[0]
          : ''
      );
    }
  }, [subscription]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      is_premium: isPremium,
      premium_expires_at: isPremium && expiresAt ? new Date(expiresAt).toISOString() : null,
    });
  };

  const handleReset = () => {
    if (subscription) {
      setIsPremium(subscription.is_premium);
      setExpiresAt(
        subscription.premium_expires_at
          ? new Date(subscription.premium_expires_at).toISOString().split('T')[0]
          : ''
      );
    }
    onToggle();
  };

  const handleCancelSubscription = () => {
    if (subscription && onCancel) {
      onCancel(subscription.user_id);
      setShowCancelDialog(false);
      onToggle();
    }
  };

  return (
    <>
      <Card className="mb-6 rounded-3xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300">
        {/* Header - Always Visible */}
        <div
          className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
          onClick={onToggle}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/10 flex items-center justify-center shadow-[0_4px_14px_rgba(249,115,22,0.4)]">
              <span className="text-2xl">👑</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Update Subscription
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isOpen 
                  ? 'Click to collapse' 
                  : subscription 
                    ? `Manage subscription for ${subscription.email}`
                    : 'Select a user from the table to update their subscription'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-xl">
            {isOpen ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Form Content - Collapsible */}
        {isOpen && (
          <CardContent className="pt-0 pb-6 border-t border-gray-200 dark:border-gray-800">
            {!subscription ? (
              <div className="py-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👤</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg font-medium mb-2">
                  No User Selected
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm">
                  Click the edit button on any user in the table below to manage their subscription
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                {/* User Info Card */}
                <div className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700 dark:text-blue-300 font-medium">User:</span>
                  <span className="font-bold text-blue-900 dark:text-blue-100">
                    {subscription.full_name || 'Anonymous'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Email:</span>
                  <span className="font-bold text-blue-900 dark:text-blue-100">
                    {subscription.email}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700 dark:text-blue-300 font-medium">
                    Current Status:
                  </span>
                  <span className="font-bold text-blue-900 dark:text-blue-100">
                    {subscription.is_premium ? '👑 Premium' : '🆓 Free'}
                  </span>
                </div>
                {subscription.premium_expires_at && (
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700 dark:text-blue-300 font-medium">
                      Expires:
                    </span>
                    <span className="font-bold text-blue-900 dark:text-blue-100">
                      {new Date(subscription.premium_expires_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* Premium Status Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-orange-50/50 dark:bg-orange-900/10 border-2 border-orange-100 dark:border-orange-900/30">
                <div className="space-y-0.5">
                  <Label htmlFor="premium-status" className="text-sm font-semibold">
                    Premium Status
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enable or disable premium access
                  </p>
                </div>
                <Switch
                  id="premium-status"
                  checked={isPremium}
                  onCheckedChange={setIsPremium}
                />
              </div>

              {/* Expiration Date */}
              {isPremium && (
                <div className="space-y-2">
                  <Label htmlFor="expires-at" className="text-sm font-semibold">
                    Expiration Date
                  </Label>
                  <Input
                    id="expires-at"
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="rounded-2xl border-2 h-12"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Leave empty for unlimited access
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1 rounded-2xl border-2 h-12"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                {subscription.is_premium && onCancel && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCancelDialog(true)}
                    className="flex-1 rounded-2xl border-2 h-12 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-900/30"
                    disabled={isLoading}
                  >
                    Cancel Subscription
                  </Button>
                )}
                <Button
                  type="submit"
                  className="flex-1 rounded-2xl h-12 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)]"
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Update Subscription'}
                </Button>
              </div>
              </form>
            )}
          </CardContent>
        )}
      </Card>

      {/* Cancel Subscription Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <AlertDialogTitle className="text-xl">Cancel Subscription</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base">
              Are you sure you want to cancel the premium subscription for{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                {subscription?.email}
              </span>
              ?
              <br />
              <br />
              This action will:
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Remove premium access immediately</li>
                <li>Clear the expiration date</li>
                <li>Revert user to free tier</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-2xl">No, Keep It</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelSubscription}
              className="rounded-2xl bg-red-600 hover:bg-red-700 text-white"
            >
              Yes, Cancel Subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
