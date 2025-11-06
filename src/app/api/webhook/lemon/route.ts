import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import * as crypto from 'crypto'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface WebhookPayload {
  meta: {
    event_name: string
    custom_data?: {
      user_id?: string
    }
  }
  data: {
    attributes: {
      customer_id: string
      first_order_item: {
        variant_id: string
      }
      user_id?: string
    }
  }
}

// Verify webhook signature
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret)
  const digest = hmac.update(payload).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
}

export async function POST(req: Request) {
  try {
    const headersList = headers()
    const signature = (await headersList).get('x-signature')?.toString()

    if (!signature) {
      return NextResponse.json({ error: 'No signature provided' }, { status: 401 })
    }

    // Get the raw body and verify signature
    const rawBody = await req.text()
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!
    
    if (!verifyWebhookSignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const payload: WebhookPayload = JSON.parse(rawBody)
    const event = payload.meta.event_name

    switch (event) {
      case 'order_created':
        const { data: order } = payload
        const customerId = order.attributes.customer_id
        const variantId = order.attributes.first_order_item.variant_id
        const userId = order.attributes.user_id || payload.meta.custom_data?.user_id
        
        if (!userId) {
          throw new Error('User ID not found in webhook payload')
        }
        
        // Get subscription duration based on variant
        const duration = variantId === process.env.NEXT_PUBLIC_LEMONSQUEEZY_MONTHLY_VARIANT_ID
          ? 30
          : 365

        // Update user profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            is_premium: true,
            premium_expires_at: new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString(),
            customer_id: customerId,
          })
          .eq('id', userId)

        if (updateError) {
          console.error('Error updating user profile:', updateError)
          return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 })
        }
        break

      // Handle other webhook events as needed
      default:
        console.log(`Unhandled webhook event: ${event}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook processing failed' },
      { status: 500 }
    )
  }
}