'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/features/auth/types/validation'
import { toast } from 'sonner'
import { authService } from '@/features/auth/services/authService'
import { AuthBrandingPanel, AuthMobileLogo, AuthFooter } from '@/features/auth/components'

export default function ForgotPasswordPage() {
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: ForgotPasswordInput) => {
    await authService.resetPassword(data.email)
    toast.success('Password reset link sent!', {
      description: 'Check your email for the reset link',
    })
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
              <CardTitle className="text-3xl font-bold">Forgot Password</CardTitle>
              <CardDescription>Enter your email to receive a reset link</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-11 font-medium rounded-2xl" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Sending link...' : 'Send reset link'}
                  </Button>
                </form>
            </Form>
              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground">
                  Remember your password? <Link href="/login" className="font-medium text-primary">Sign in</Link>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Don't have an account? <Link href="/register" className="font-medium text-primary">Register</Link>
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