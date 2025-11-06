import { NextRequest, NextResponse } from "next/server";
import { addPremiumToUser } from "@/features/premium/services/addPremiumService";
import { createHmac } from "crypto";
import { LemonSqueezyResponse } from "@/shared/types/lemonSqueezy";

const WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

function isValidSignature(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) return false;

  const hmac = createHmac("sha256", WEBHOOK_SECRET);
  const digest = hmac.update(payload).digest("hex");
  return signature === digest;
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const signature = req.headers.get("x-signature");

    // Verify webhook signature
    if (!signature || !isValidSignature(payload, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(payload) as LemonSqueezyResponse;

    // Handle different webhook events
    switch (event.meta.event_name) {
      case "subscription_created":
      case "subscription_updated":
        if (event.data.attributes.status === "active") {
          // Extract custom data that includes user ID
          const customData = event.data.attributes.custom_data;
          if (!customData?.userId) {
            throw new Error("No userId found in custom data");
          }

          // Add premium status to user
          await addPremiumToUser(customData.userId);
        }
        break;

      // Handle other events as needed
      case "subscription_cancelled":
        // Handle subscription cancellation
        break;

      default:
        // Ignore other events
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
