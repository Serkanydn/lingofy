'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../shared/hooks/useAuth'
import { authService } from '@/shared/services/supabase/authService'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Crown, Save, KeyRound } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTheme } from '@/shared/hooks/useTheme'
import { toast } from 'sonner'
import { userService } from '@/features/admin/features/users/services'

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(80).optional().or(z.literal('')),
  avatar_url: z.string().url('Enter a valid URL').optional().or(z.literal('')),
})

type ProfileFormData = z.infer<typeof profileSchema>

const passwordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
})

type PasswordFormData = z.infer<typeof passwordSchema>

export default function UserSettingsPageClient() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const { mode, setTheme } = useTheme()

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
    },
  })

  useEffect(() => {
    profileForm.reset({
      full_name: profile?.full_name || '',
    })
  }, [profileForm, profile?.full_name])

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', confirm: '' },
  })

  const handleSaveProfile = async (data: ProfileFormData) => {
    if (!user) return
    setSavingProfile(true)
    try {
      const updates: any = {}
      if (data.full_name !== undefined) updates.full_name = data.full_name || null
      if (data.avatar_url !== undefined) updates.avatar_url = data.avatar_url || null

      const _data = await userService.getById(user.id)

      toast.success('Profile updated')
    } catch (err: any) {
      toast.error('Failed to update profile', { description: err.message })
    } finally {
      setSavingProfile(false)
    }
  }

  const handleUpdatePassword = async (data: PasswordFormData) => {
    setSavingPassword(true)
    try {
      const res = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: data.password }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to update password')
      toast.success('Password updated')
      passwordForm.reset({ password: '', confirm: '' })
    } catch (err: any) {
      toast.error('Failed to update password', { description: err.message })
    } finally {
      setSavingPassword(false)
    }
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <Card className="rounded-[20px] clay-shadow">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 ring-2 ring-orange-100 dark:ring-orange-900/30 shadow-md">
                  {/* <AvatarImage src={profile?.avatar_url || user.user_metadata?.avatar_url} /> */}
                  <AvatarFallback className="bg-linear-to-br from-orange-400 to-orange-500 text-white">
                    {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">{profile?.full_name || user.email}</span>
                    {profile?.is_premium && (
                      <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold bg-linear-to-r from-yellow-400 to-orange-500 text-white">
                        <Crown className="h-3.5 w-3.5 mr-1" /> Premium
                      </span>
                    )}
                  </div>
                  {profile?.premium_expires_at && (
                    <p className="text-xs text-muted-foreground">Expires {new Date(profile.premium_expires_at).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[20px] clay-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Appearance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">Theme</Label>
                  <Select value={mode} onValueChange={(v) => setTheme(v as 'system' | 'light' | 'dark')}>
                    <SelectTrigger className="rounded-2xl h-10 w-full">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[20px] clay-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form className="space-y-4" onSubmit={profileForm.handleSubmit(handleSaveProfile)}>
                  <FormField
                    control={profileForm.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Your name" className="rounded-2xl clay-shadow-inset" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="avatar_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avatar URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://..." className="rounded-2xl clay-shadow-inset" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" className="rounded-3xl bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)]" disabled={savingProfile}>
                      <Save className="mr-2 h-4 w-4" />
                      {savingProfile ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="rounded-[20px] clay-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Security</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form className="space-y-4" onSubmit={passwordForm.handleSubmit(handleUpdatePassword)}>
                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" placeholder="Enter new password" className="rounded-2xl clay-shadow-inset" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" placeholder="Confirm new password" className="rounded-2xl clay-shadow-inset" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" className="rounded-3xl bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)]" disabled={savingPassword}>
                      <KeyRound className="mr-2 h-4 w-4" />
                      {savingPassword ? 'Updating...' : 'Update Password'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}