import { PremiumVerifyPageClient } from '@/features/premium/pages/PremiumVerifyPageClient';

/**
 * Premium Verification Page
 * 
 * Server component that renders the verification page.
 * This page is accessed after returning from LemonSqueezy checkout.
 * 
 * @returns Server Component
 */
export default function PremiumVerifyPage() {
  return <PremiumVerifyPageClient />;
}
