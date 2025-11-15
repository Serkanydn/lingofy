import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { PlanType } from '@/features/premium/types/premium.types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { 
      userId, 
      plan = PlanType.MONTHLY,
      lemonSqueezyCustomerId,
      lemonSqueezySubscriptionId 
    } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const validPlans = Object.values(PlanType);
    if (!validPlans.includes(plan)) {
      return NextResponse.json({ error: `Invalid plan. Must be one of: ${validPlans.join(', ')}` }, { status: 400 })
    }

    // Calculate expiration date based on plan
    const expirationDate = plan === PlanType.YEARLY
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)  // 30 days

    // Update user metadata with premium status
    const { data: userData, error: userError } = await supabase.auth.admin.updateUserById(
      userId,
      {
        user_metadata: {
          premium: true,
          premium_expires_at: expirationDate.toISOString(),
          premium_plan: plan,
          lemon_squeezy_customer_id: lemonSqueezyCustomerId,
          lemon_squeezy_subscription_id: lemonSqueezySubscriptionId,
        },
      }
    )

    if (userError) {
      console.error('Error updating user metadata:', userError)
      return NextResponse.json({ error: userError.message }, { status: 500 })
    }

    // Prepare profile update data
    const profileUpdate: any = {
      is_premium: true,
      premium_expires_at: expirationDate.toISOString(),
    }

    // Add LemonSqueezy IDs if provided
    if (lemonSqueezyCustomerId) {
      profileUpdate.lemon_squeezy_customer_id = lemonSqueezyCustomerId
    }
    if (lemonSqueezySubscriptionId) {
      profileUpdate.lemon_squeezy_subscription_id = lemonSqueezySubscriptionId
    }

    // Update user profile in the profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update(profileUpdate)
      .eq('id', userId)

    if (profileError) {
      console.error('Error updating user profile:', profileError)
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      user: userData.user,
      plan,
      expires_at: expirationDate.toISOString(),
      lemon_squeezy_customer_id: lemonSqueezyCustomerId,
      lemon_squeezy_subscription_id: lemonSqueezySubscriptionId,
      message: `Premium ${plan} subscription added successfully` 
    })

  } catch (error) {
    console.error('Error in add-premium route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}