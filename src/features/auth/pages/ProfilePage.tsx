'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { supabase } from '@/shared/lib/supabase/client'
import { Crown, LogOut, Settings } from 'lucide-react'
import { useAuthStore } from '@/shared/hooks/useAuth'

export default function ProfilePage() {
  const { user, profile } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Error logging out:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback>
                  {user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{user.email}</h2>
                {profile?.is_premium ? (
                  <div className="flex items-center text-yellow-600">
                    <Crown className="h-4 w-4 mr-1" />
                    <span>Premium Member</span>
                    {profile.premium_expires_at && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        (Expires: {new Date(profile.premium_expires_at).toLocaleDateString()})
                      </span>
                    )}
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => router.push('/premium')}
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                )}
              </div>
            </div>

            <div className="grid gap-4">
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => router.push('/settings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Button>

              <Button
                variant="outline"
                className="justify-start"
                onClick={handleLogout}
                disabled={isLoading}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isLoading ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}