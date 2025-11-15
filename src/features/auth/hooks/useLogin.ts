'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { AuthService } from '../services/authService'
import type { LoginInput } from '../types/validation'

/**
 * useLogin Hook
 * 
 * Handles login logic including email/password and OAuth sign-in
 * Manages navigation and error handling
 */
export function useLogin() {
  const router = useRouter()
  const authService = new AuthService()

  const handleEmailLogin = async (data: LoginInput) => {
    try {
      await authService.signInWithEmail(data.email, data.password)
      
      // Get redirectTo parameter from URL
      const urlParams = new URLSearchParams(window.location.search)
      const redirectTo = urlParams.get('redirectTo') || '/'
      
      router.push(redirectTo)
      router.refresh()
      toast.success('Successfully signed in!')
    } catch (error: any) {
      toast.error('Error signing in', {
        description: error.message,
      })
      throw error
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await authService.signInWithOAuth('google', `${window.location.origin}/auth/callback`)
    } catch (error: any) {
      toast.error('Error signing in with Google', {
        description: error.message,
      })
      throw error
    }
  }

  return {
    handleEmailLogin,
    handleGoogleLogin,
  }
}
