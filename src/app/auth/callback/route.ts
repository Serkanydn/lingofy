import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (!code) {
      throw new Error('No code provided')
    }

    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)

    // Redirect to the home page after successful authentication
    return NextResponse.redirect(new URL('/', requestUrl.origin))
  } catch (error) {
    // Redirect to login page with error in case of failure
    console.error('Auth callback error:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}