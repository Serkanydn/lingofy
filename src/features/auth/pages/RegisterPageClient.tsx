'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { 
  AuthBrandingPanel,
  AuthMobileLogo,
  GoogleLoginButton,
  AuthDivider,
  AuthFooter 
} from '../components'
import { RegisterForm } from '../components/RegisterForm'
import { useRegister } from '../hooks/useRegister'

/**
 * RegisterPageClient Component
 * 
 * Client-side registration page component with complete sign-up functionality
 * Includes Google OAuth and email/password registration
 */
export function RegisterPageClient() {
  const { handleEmailRegister, handleGoogleRegister } = useRegister()

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding & Features */}
      <AuthBrandingPanel />

      {/* Right Panel - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <AuthMobileLogo />

          <Card className="border-border/50 shadow-lg">
            <CardHeader className="space-y-1 text-center pb-6">
              <CardTitle className="text-3xl font-bold tracking-tight">Create Account</CardTitle>
              <CardDescription className="text-base">
                Start your English learning journey today
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Google Registration Button */}
              <GoogleLoginButton onGoogleLogin={handleGoogleRegister} />

              {/* Divider */}
              <AuthDivider />

              {/* Email/Password Form */}
              <RegisterForm onSubmit={handleEmailRegister} />

              {/* Sign In Link */}
              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link 
                    href="/login" 
                    className="font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Sign in
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
