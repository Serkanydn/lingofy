'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'
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
import { AlertCircle, Home, CheckCircle, Mail } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

/**
 * RegisterPageClient Component
 * 
 * Client-side registration page component with complete sign-up functionality
 * Includes Google OAuth and email/password registration
 */
export function RegisterPageClient() {
  const { handleEmailRegister, handleGoogleRegister } = useRegister()
  const isRegistrationEnabled = useSettingsStore((state) => state.getIsRegistrationEnabled())
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  const handleRegister = async (data: any) => {
    setUserEmail(data.email)
    await handleEmailRegister(data)
    setShowSuccessAlert(true)
  }

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

          {/* Home Button */}
          <div className="mb-4">
            <Link href="/">
              <Button variant="ghost" className="rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          {showSuccessAlert ? (
            <Card className="border-green-200 dark:border-green-800 shadow-lg">
              <CardHeader className="space-y-1 text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold tracking-tight text-green-600 dark:text-green-400">
                  Registration Successful!
                </CardTitle>
                <CardDescription className="text-base">
                  Your account has been created
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                  <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertTitle className="text-blue-900 dark:text-blue-100">Check your email</AlertTitle>
                  <AlertDescription className="text-blue-700 dark:text-blue-300">
                    We've sent a confirmation link to{' '}
                    <span className="font-semibold">{userEmail}</span>. 
                    Please check your inbox and click the link to verify your account.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-linear-to-r from-orange-50 to-blue-50 dark:from-orange-900/20 dark:to-blue-900/20 border border-orange-200 dark:border-orange-800">
                    <h4 className="font-semibold text-sm mb-2 text-gray-900 dark:text-white">📧 What's Next?</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>1. Check your email inbox (and spam folder)</li>
                      <li>2. Click the confirmation link</li>
                      <li>3. Sign in and start learning!</li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                <Link href="/login" className="w-full">
                  <Button className="w-full rounded-2xl h-11 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                    Go to Sign In
                  </Button>
                </Link>
                <p className="text-center text-sm text-muted-foreground">
                  Forgot your password?{' '}
                  <Link href="/forgot-password" className="font-medium text-primary hover:text-primary/80 transition-colors">
                    Reset it
                  </Link>
                </p>
                  <Button
                    variant="outline"
                    onClick={() => setShowSuccessAlert(false)}
                    className="w-full rounded-2xl h-11"
                  >
                    Create Another Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
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
                <RegisterForm onSubmit={handleRegister} />

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
          )}

          {/* Footer */}
          <AuthFooter />
        </div>
      </div>
    </div>
  )
}
