import { createCheckout } from "@/shared/lib/lemonsqueezy/client";
import { LEMON_SQUEEZY_CONFIG } from "@/shared/lib/lemonsqueezy/config";
import { createServerSupabaseClient } from "@/shared/lib/supabase/server";
import { PlanType } from "@/shared/types/model/premium.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await request.json();

    // Validate plan type
    const validPlans = Object.values(PlanType);
    if (!validPlans.includes(plan)) {
      return NextResponse.json(
        { error: `Invalid plan. Must be one of: ${validPlans.join(', ')}` },
        { status: 400 }
      );
    }

    const variantId =
      plan === PlanType.YEARLY
        ? LEMON_SQUEEZY_CONFIG.yearlyVariantId
        : LEMON_SQUEEZY_CONFIG.monthlyVariantId;

    // Validate variant ID
    if (!variantId) {
      console.error("Missing variant ID for plan:", plan);
      return NextResponse.json(
        { error: "Product configuration error. Please contact support." },
        { status: 500 }
      );
    }

    console.log("Creating checkout with:", { variantId, plan, userId: user.id });

    const checkoutUrl = await createCheckout(variantId, user.email!, user.id);

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    );
  }
}
