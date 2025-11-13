'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { AuthService } from '../services/authService'
import type { RegisterInput } from '../types/validation'

/**
 * useRegister Hook
 * 
 * Handles registration logic including email/password sign-up and OAuth
 * Manages navigation and error handling
 */
export function useRegister() {
  const router = useRouter()
  const authService = new AuthService()

  const handleEmailRegister = async (data: RegisterInput) => {
    try {
      await authService.signUp(data.email, data.password, {
        full_name: data.name,
      })
      
      toast.success('Account created successfully!', {
        description: 'Please check your email for the confirmation link',
      })
      
      router.push('/login')
    } catch (error: any) {
      toast.error('Error creating account', {
        description: error.message,
      })
      throw error
    }
  }

  const handleGoogleRegister = async () => {
    try {
      await authService.signInWithOAuth('google', `${window.location.origin}/auth/callback`)
    } catch (error: any) {
      toast.error('Error signing up with Google', {
        description: error.message,
      })
      throw error
    }
  }

  return {
    handleEmailRegister,
    handleGoogleRegister,
  }
}
