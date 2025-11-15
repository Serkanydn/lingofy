'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { resetPasswordSchema, type ResetPasswordInput } from '@/features/auth/types/validation'
import { toast } from 'sonner'
import { authService } from '@/features/auth/services/authService'
import { useRouter } from 'next/navigation'
import { AuthBrandingPanel, AuthMobileLogo, AuthFooter } from '@/features/auth/components'

export default function ResetPasswordPage() {
  const router = useRouter()

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      console.log('Starting password update...')

      const result = await authService.updatePassword(data.password)

      console.log('Update result:', result)

      if (result.error) {
        throw result.error
      }

      // Başarılı
      toast.success('Password reset successfully!', {
        description: 'Please sign in with your new password',
      })

      // Sign out ve login'e yönlendir
      await authService.signOut()

      setTimeout(() => {
        router.push('/login')
        router.refresh()
      }, 1500)

    } catch (error: any) {
      console.error('Password update error:', error)
      toast.error('Password reset failed!', {
        description: error.message || 'An error occurred',
      })
    }
  }

  return (
    <div className="min-h-screen flex">
      <AuthBrandingPanel />
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <AuthMobileLogo />
          <div className="mb-4 flex gap-2">
            <Link href="/">
              <Button variant="ghost" className="rounded-2xl">Home</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="rounded-2xl">Login</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="rounded-2xl">Register</Button>
            </Link>
          </div>
          <Card className="rounded-3xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold">Reset Password</CardTitle>
              <CardDescription>Enter your new password below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full h-11 font-medium rounded-2xl"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? 'Resetting password...' : 'Reset password'}
                  </Button>
                </form>
              </Form>
              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground">
                  Remember your password? <Link href="/login" className="font-medium text-primary">Sign in</Link>
                </p>
              </div>
            </CardContent>
          </Card>
          <AuthFooter />
        </div>
      </div>
    </div>
  )
}