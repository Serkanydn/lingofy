import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { LEMON_SQUEEZY_CONFIG } from "@/shared/lib/lemonsqueezy/config";

// Initialize Supabase with service role for admin operations
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface LemonSqueezyWebhookPayload {
  meta: {
    event_name: string;
    custom_data?: {
      user_id: string;
    };
  };
  data: {
    id: string;
    type: string;
    attributes: {
      customer_id: number;
      user_email: string;
      status: string;
      renews_at: string | null;
      ends_at: string | null;
      created_at: string;
      updated_at: string;
      variant_id: number;
      product_id: number;
      subscription_id?: number;
    };
  };
}

// Verify webhook signature
function verifySignature(payload: string, signature: string): boolean {
  const secret = LEMON_SQUEEZY_CONFIG.webhookSecret;
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-signature");

    if (!signature) {
      console.error("Missing signature header");
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 401 }
      );
    }

    // Verify webhook signature
    if (!verifySignature(body, signature)) {
      console.error("Invalid webhook signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const payload: LemonSqueezyWebhookPayload = JSON.parse(body);
    const { meta, data } = payload;
    const eventName = meta.event_name;
    const userId = meta.custom_data?.user_id;

    console.log(`Received webhook: ${eventName} for user: ${userId}`);

    // Handle different webhook events
    switch (eventName) {
      case "order_created":
      case "subscription_created":
        await handleSubscriptionCreated(userId, data);
        break;

      case "subscription_updated":
        await handleSubscriptionUpdated(userId, data);
        break;

      case "subscription_cancelled":
      case "subscription_expired":
        await handleSubscriptionCancelled(userId, data);
        break;

      case "subscription_resumed":
        await handleSubscriptionResumed(userId, data);
        break;

      case "subscription_paused":
        await handleSubscriptionPaused(userId, data);
        break;

      case "subscription_unpaused":
        await handleSubscriptionUnpaused(userId, data);
        break;

      default:
        console.log(`Unhandled event: ${eventName}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleSubscriptionCreated(
  userId: string | undefined,
  data: LemonSqueezyWebhookPayload["data"]
) {
  if (!userId) {
    console.error("No user_id in webhook payload");
    return;
  }

  const { customer_id, renews_at, ends_at, subscription_id } = data.attributes;

  // Calculate expiration date
  const expiresAt = renews_at || ends_at;

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      is_premium: true,
      premium_expires_at: expiresAt,
      lemon_squeezy_customer_id: customer_id.toString(),
      lemon_squeezy_subscription_id: (subscription_id || data.id).toString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error("Error updating profile:", error);
    throw error;
  }

  console.log(`Subscription created for user ${userId}`);
}

async function handleSubscriptionUpdated(
  userId: string | undefined,
  data: LemonSqueezyWebhookPayload["data"]
) {
  if (!userId) {
    console.error("No user_id in webhook payload");
    return;
  }

  const { status, renews_at, ends_at } = data.attributes;
  const expiresAt = renews_at || ends_at;

  const isPremium = status === "active" || status === "on_trial";

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      is_premium: isPremium,
      premium_expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error("Error updating subscription:", error);
    throw error;
  }

  console.log(`Subscription updated for user ${userId}: ${status}`);
}

async function handleSubscriptionCancelled(
  userId: string | undefined,
  data: LemonSqueezyWebhookPayload["data"]
) {
  if (!userId) {
    console.error("No user_id in webhook payload");
    return;
  }

  const { ends_at } = data.attributes;

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      is_premium: false,
      premium_expires_at: ends_at,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error("Error cancelling subscription:", error);
    throw error;
  }

  console.log(`Subscription cancelled for user ${userId}`);
}

async function handleSubscriptionResumed(
  userId: string | undefined,
  data: LemonSqueezyWebhookPayload["data"]
) {
  if (!userId) {
    console.error("No user_id in webhook payload");
    return;
  }

  const { renews_at, ends_at } = data.attributes;
  const expiresAt = renews_at || ends_at;

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      is_premium: true,
      premium_expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error("Error resuming subscription:", error);
    throw error;
  }

  console.log(`Subscription resumed for user ${userId}`);
}

async function handleSubscriptionPaused(
  userId: string | undefined,
  data: LemonSqueezyWebhookPayload["data"]
) {
  if (!userId) {
    console.error("No user_id in webhook payload");
    return;
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      is_premium: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error("Error pausing subscription:", error);
    throw error;
  }

  console.log(`Subscription paused for user ${userId}`);
}

async function handleSubscriptionUnpaused(
  userId: string | undefined,
  data: LemonSqueezyWebhookPayload["data"]
) {
  if (!userId) {
    console.error("No user_id in webhook payload");
    return;
  }

  const { renews_at, ends_at } = data.attributes;
  const expiresAt = renews_at || ends_at;

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      is_premium: true,
      premium_expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error("Error unpausing subscription:", error);
    throw error;
  }

  console.log(`Subscription unpaused for user ${userId}`);
}
