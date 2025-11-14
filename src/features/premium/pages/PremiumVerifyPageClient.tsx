'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';

/**
 * Premium Verification Status Types
 */
type VerificationStatus = 'loading' | 'success' | 'error' | 'pending';

interface VerificationData {
  isPremium: boolean;
  expiresAt: string | null;
  subscriptionId: string | null;
}

/**
 * PremiumVerifyPageClient Component
 * 
 * Verifies user's premium subscription after successful payment.
 * Follows Claymorphism design principles with soft shadows and rounded corners.
 * 
 * Features:
 * - Automatic verification on mount
 * - Loading state with spinner
 * - Success state with confirmation
 * - Error state with retry option
 * - Pending state for webhook processing
 * - Auto-redirect after successful verification
 * 
 * @component
 */
export function PremiumVerifyPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [error, setError] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);

  /**
   * Verify subscription status
   */
  const verifySubscription = async () => {
    try {
      setStatus('loading');
      setError('');

      const response = await fetch('/api/premium/verify');
      
      if (!response.ok) {
        throw new Error('Failed to verify subscription');
      }

      const data: VerificationData = await response.json();
      setVerificationData(data);

      if (data.isPremium) {
        setStatus('success');
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push('/premium');
        }, 3000);
      } else {
        // If not premium yet, it might be processing
        if (retryCount < 3) {
          setStatus('pending');
          // Retry after 2 seconds
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            verifySubscription();
          }, 2000);
        } else {
          setStatus('error');
          setError('Your subscription is being processed. Please check back in a few moments.');
        }
      }
    } catch (err) {
      console.error('Verification error:', err);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'An error occurred while verifying your subscription');
    }
  };

  /**
   * Verify on component mount
   */
  useEffect(() => {
    verifySubscription();
  }, []);

  /**
   * Render loading state - Claymorphism style
   */
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Claymorphism Card */}
          <div className="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
            {/* Icon Container - Clay Badge */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20 flex items-center justify-center shadow-[0_4px_14px_rgba(249,115,22,0.2)]">
                <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
              Verifying Subscription
            </h2>

            {/* Description */}
            <p className="text-center text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Please wait while we verify your subscription...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render pending state - Claymorphism style
   */
  if (status === 'pending') {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Claymorphism Card */}
          <div className="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
            {/* Icon Container - Clay Badge */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-800/20 flex items-center justify-center shadow-[0_4px_14px_rgba(234,179,8,0.2)]">
                <AlertCircle className="h-10 w-10 text-yellow-500" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
              Processing Payment
            </h2>

            {/* Description */}
            <p className="text-center text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
              Your payment is being processed. This usually takes a few moments.
            </p>

            {/* Status Badge */}
            <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-sm font-medium">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Checking status... (Attempt {retryCount + 1}/3)</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render success state - Claymorphism style
   */
  if (status === 'success' && verificationData) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Claymorphism Card */}
          <div className="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
            {/* Icon Container - Clay Badge with Emoji */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 flex items-center justify-center shadow-[0_4px_14px_rgba(34,197,94,0.3)] text-4xl">
                🎉
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
              Subscription Activated!
            </h2>

            {/* Success Message */}
            <div className="text-center space-y-2 mb-6">
              <p className="text-base font-semibold text-green-600 dark:text-green-400">
                Welcome to Premium!
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Your subscription is now active and you have full access to all premium features.
              </p>
              {verificationData.expiresAt && (
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Valid until: {new Date(verificationData.expiresAt).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Action Buttons - Clay Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => router.push('/premium')}
                className="w-full rounded-2xl bg-linear-to-r from-orange-500 to-orange-600 px-6 py-3 text-white font-semibold shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300"
              >
                Go to Premium Dashboard
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full rounded-2xl bg-white dark:bg-gray-700 px-6 py-3 text-gray-700 dark:text-gray-200 font-semibold shadow-[0_4px_14px_rgb(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgb(0,0,0,0.1)] transition-all duration-300"
              >
                Back to Home
              </button>
            </div>

            {/* Auto-redirect Notice */}
            <p className="text-xs text-center text-gray-500 dark:text-gray-500 mt-4">
              Redirecting automatically in 3 seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render error state - Claymorphism style
   */
  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Claymorphism Card */}
        <div className="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
          {/* Icon Container - Clay Badge */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/20 flex items-center justify-center shadow-[0_4px_14px_rgba(239,68,68,0.2)]">
              <XCircle className="h-10 w-10 text-red-500" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Verification Error
          </h2>

          {/* Error Alert - Clay Style */}
          <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 border-2 border-red-100 dark:border-red-800/30 p-4 mb-4">
            <p className="text-sm text-red-700 dark:text-red-300 font-medium text-center">
              {error || 'Failed to verify subscription'}
            </p>
          </div>

          {/* Description */}
          <div className="text-center space-y-2 mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Don't worry! Your payment was likely successful, but verification is taking longer than expected.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Please try refreshing the page or check back in a few minutes.
            </p>
          </div>

          {/* Action Buttons - Clay Buttons */}
          <div className="space-y-3">
            <button
              onClick={verifySubscription}
              className="w-full rounded-2xl bg-linear-to-r from-orange-500 to-orange-600 px-6 py-3 text-white font-semibold shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/premium')}
              className="w-full rounded-2xl bg-white dark:bg-gray-700 px-6 py-3 text-gray-700 dark:text-gray-200 font-semibold shadow-[0_4px_14px_rgb(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgb(0,0,0,0.1)] transition-all duration-300"
            >
              Go to Premium Dashboard
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full rounded-2xl bg-gray-50 dark:bg-gray-800/50 px-6 py-3 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              Back to Home
            </button>
          </div>

          {/* Support Notice */}
          <p className="text-xs text-center text-gray-500 dark:text-gray-500 mt-4">
            Need help? Contact support with your order details.
          </p>
        </div>
      </div>
    </div>
  );
}
