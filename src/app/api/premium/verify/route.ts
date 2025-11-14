import { createServerSupabaseClient } from "@/shared/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * Profile type for premium verification
 */
interface ProfileData {
  is_premium: boolean;
  premium_expires_at: string | null;
  lemon_squeezy_subscription_id: string | null;
}

/**
 * Premium Subscription Verification Route
 * 
 * Verifies user's premium subscription status after successful payment
 * This endpoint is called after the user returns from LemonSqueezy checkout
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch user's profile to check premium status
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("is_premium, premium_expires_at, lemon_squeezy_subscription_id")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return NextResponse.json(
        { error: "Failed to verify subscription" },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const profileData = profile as ProfileData;

    // Check if user has active premium
    const isPremiumActive = 
      profileData.is_premium && 
      profileData.premium_expires_at &&
      new Date(profileData.premium_expires_at) > new Date();

    return NextResponse.json({
      isPremium: isPremiumActive,
      expiresAt: profileData.premium_expires_at,
      subscriptionId: profileData.lemon_squeezy_subscription_id,
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify subscription" },
      { status: 500 }
    );
  }
}
