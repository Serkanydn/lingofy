export async function createCheckout(
  variantId: string,
  userEmail: string,
  userId: string
) {
  const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
    method: 'POST',
    headers: {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      'Authorization': `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            email: userEmail,
            custom: {
              user_id: userId,
            },
          },
        },
        relationships: {
          store: {
            data: {
              type: 'stores',
              id: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID,
            },
          },
          variant: {
            data: {
              type: 'variants',
              id: variantId,
            },
          },
        },
      },
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to create checkout')
  }

  const data = await response.json()
  return data.data.attributes.url
}