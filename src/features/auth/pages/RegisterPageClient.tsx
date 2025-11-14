'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { useSettingsStore } from '@/features/admin/features/settings'
import { AlertCircle, Home } from 'lucide-react'

/**
 * RegisterPageClient Component
 * 
 * Client-side registration page component with complete sign-up functionality
 * Includes Google OAuth and email/password registration
 */
export function RegisterPageClient() {
  const { handleEmailRegister, handleGoogleRegister } = useRegister()
  const isRegistrationEnabled = useSettingsStore((state) => state.getIsRegistrationEnabled())

  // Show disabled message if registration is turned off
  if (!isRegistrationEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-background dark:to-gray-900">
        <Card className="max-w-md w-full rounded-3xl border-2 border-orange-200 dark:border-orange-800">
          <CardHeader>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/10 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-2xl">Registration Disabled</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 rounded-2xl bg-orange-50/50 dark:bg-orange-900/10 border-2 border-orange-100 dark:border-orange-900/30">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                New user registrations are currently disabled. Please check back later or contact support if you have any questions.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full rounded-2xl">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </Link>
              <Link href="/login" className="flex-1">
                <Button className="w-full rounded-2xl">
                  Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

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
