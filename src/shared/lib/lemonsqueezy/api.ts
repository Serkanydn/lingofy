interface CreateCheckoutSessionParams {
  variantId: string
  customerEmail: string
  userId: string
}

export async function createCheckoutSession({
  variantId,
  customerEmail,
  userId,
}: CreateCheckoutSessionParams): Promise<string> {
  try {
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        variantId,
        customerEmail,
        userId,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create checkout session')
    }

    const data = await response.json()
    return data.url
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}