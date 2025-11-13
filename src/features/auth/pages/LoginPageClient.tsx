'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { 
  AuthBrandingPanel,
  AuthMobileLogo,
  GoogleLoginButton,
  AuthDivider,
  LoginForm,
  AuthFooter 
} from '../components'
import { useLogin } from '../hooks/useLogin'

/**
 * LoginPageClient Component
 * 
 * Client-side login page component with complete login functionality
 * Includes Google OAuth and email/password authentication
 */
export function LoginPageClient() {
  const { handleEmailLogin, handleGoogleLogin } = useLogin()

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding & Features */}
      <AuthBrandingPanel />

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <AuthMobileLogo />

          <Card className="border-border/50 shadow-lg">
            <CardHeader className="space-y-1 text-center pb-6">
              <CardTitle className="text-3xl font-bold tracking-tight">Welcome back</CardTitle>
              <CardDescription className="text-base">
                Sign in to continue your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Google Login Button */}
              <GoogleLoginButton onGoogleLogin={handleGoogleLogin} />

              {/* Divider */}
              <AuthDivider />

              {/* Email/Password Form */}
              <LoginForm onSubmit={handleEmailLogin} />

              {/* Sign Up Link */}
              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link 
                    href="/register" 
                    className="font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Sign up for free
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <AuthFooter />
        </div>
      </div>
    </div>
  )
}
