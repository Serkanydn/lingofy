import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { LEMON_SQUEEZY_CONFIG } from '@/shared/lib/lemonsqueezy/config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function verifySignature(payload: string, signature: string): boolean {
  const hmac = crypto.createHmac('sha256', LEMON_SQUEEZY_CONFIG.webhookSecret)
  const digest = hmac.update(payload).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-signature')

    if (!signature || !verifySignature(body, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const event = JSON.parse(body)
    const eventName = event.meta.event_name
    const customData = event.meta.custom_data
    const userId = customData?.user_id

    if (!userId) {
      return NextResponse.json(
        { error: 'No user ID in custom data' },
        { status: 400 }
      )
    }

    switch (eventName) {
      case 'subscription_created':
      case 'subscription_updated':
        const expiresAt = new Date(event.data.attributes.renews_at)
        
        await supabase
          .from('profiles')
          .update({
            is_premium: true,
            premium_expires_at: expiresAt.toISOString(),
            lemon_squeezy_customer_id: event.data.attributes.customer_id,
            lemon_squeezy_subscription_id: event.data.id,
          })
          .eq('id', userId)

        break

      case 'subscription_cancelled':
      case 'subscription_expired':
        await supabase
          .from('profiles')
          .update({
            is_premium: false,
            premium_expires_at: null,
          })
          .eq('id', userId)

        break

      case 'subscription_payment_success':
        // Update expiration date on successful payment
        const newExpiresAt = new Date(event.data.attributes.renews_at)
        
        await supabase
          .from('profiles')
          .update({
            is_premium: true,
            premium_expires_at: newExpiresAt.toISOString(),
          })
          .eq('id', userId)

        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}