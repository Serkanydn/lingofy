export async function createCheckout(
  variantId: string,
  userEmail: string,
  userId: string
) {
  const API_KEY = process.env.LEMON_SQUEEZY_API_KEY;
  const IS_TEST_MODE =
    process.env.LEMON_SQUEEZY_TEST_MODE === "true";

  if (!API_KEY) {
    throw new Error("LEMON_SQUEEZY_API_KEY is not configured");
  }

  const payload = {
    data: {
      type: "checkouts",
      attributes: {
        checkout_data: {
          email: userEmail,
          custom: {
            user_id: userId,
          },
        },
        checkout_options: {
          button_color: "#10b981",
        },
   
        // product_options: {
        //   enabled_variants: [variantId],
        // },
        test_mode: IS_TEST_MODE,
      },
      relationships: {
        store: {
          data: {
            type: "stores",
            id: process.env.LEMON_SQUEEZY_STORE_ID,
          },
        },
        variant: {
          data: {
            type: "variants",
            id: variantId,
          },
        },
      },
    },
  };

  console.log("Creating checkout:", {
    testMode: IS_TEST_MODE,
    variantId,
    storeId: process.env.LEMON_SQUEEZY_STORE_ID,
  });

  const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("LemonSqueezy checkout error:", errorText);
    throw new Error(`Failed to create checkout: ${errorText}`);
  }

  const data = await response.json();
  return data.data.attributes.url;
}
