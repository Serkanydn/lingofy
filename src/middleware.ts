import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Auth protection
  if (!session) {
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') ||
                      req.nextUrl.pathname.startsWith('/register')

    // If trying to access protected routes
    if (!isAuthPage && isProtectedRoute(req.nextUrl.pathname)) {
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Redirect logged-in users away from auth pages
  if (session) {
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') ||
                      req.nextUrl.pathname.startsWith('/register')

    if (isAuthPage) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  console.log("aaa");

  // Premium content protection
  if (session && isPremiumRoute(req.nextUrl.pathname)) {
    // Get user profile from database to check premium status
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_premium, premium_expires_at')
      .eq('id', session.user.id)
      .single()


      console.log('profile',profile);
    const isPremium = profile?.is_premium && 
      profile.premium_expires_at && 
      new Date(profile.premium_expires_at) > new Date()

    if (!isPremium && req.nextUrl.pathname !== '/premium/upgrade') {
      return NextResponse.redirect(new URL('/premium/upgrade', req.url))
    }
  }

  return res
}

function isProtectedRoute(pathname: string): boolean {
  const protectedPaths = [
    '/profile',
    '/premium',
    '/my-words',
    '/statistics',
    '/grammar',
    '/listening',
    '/reading'
  ]
  return protectedPaths.some(path => pathname.startsWith(path))
}

function isPremiumRoute(pathname: string): boolean {
  const premiumPaths = [
    '/premium/content',
    '/premium/features'
  ]
  return premiumPaths.some(path => pathname.startsWith(path))
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/profile',
    '/premium/:path*',
    '/my-words/:path*',
    '/statistics/:path*',
    '/grammar/:path*',
    '/listening/:path*',
    '/reading/:path*'
  ]
}