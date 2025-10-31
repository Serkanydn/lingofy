import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createCheckout } from '@/lib/lemonsqueezy/client'
import { LEMON_SQUEEZY_CONFIG } from '@/lib/lemonsqueezy/config'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { plan } = await request.json()

    const variantId =
      plan === 'yearly'
        ? LEMON_SQUEEZY_CONFIG.yearlyVariantId
        : LEMON_SQUEEZY_CONFIG.monthlyVariantId

    const checkoutUrl = await createCheckout(
      variantId,
      user.email!,
      user.id
    )

    return NextResponse.json({ url: checkoutUrl })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout' },
      { status: 500 }
    )
  }
}