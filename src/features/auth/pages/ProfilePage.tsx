'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { authService } from '@/shared/services/supabase/authService'  
import { Crown, LogOut, Settings, BookOpen, Headphones, GraduationCap, Book, Calendar, Activity, BarChart3 } from 'lucide-react'
import { useAuth } from '../../../shared/hooks/useAuth'
import { useStatistics } from '@/features/statistics/hooks/useStatistics'
import { useUserWords } from '@/features/words/hooks/useWords'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProfilePage() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { data: statsData, isLoading: statsLoading } = useStatistics()
  const { data: userWords } = useUserWords()

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await authService.signOut()
      router.push('/login')
      router.refresh()
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="rounded-[20px] clay-shadow">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 ring-2 ring-orange-100 dark:ring-orange-900/30 shadow-md">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-linear-to-br from-orange-400 to-orange-500 text-white">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {profile?.full_name || user.email}
                  </h2>
                  {profile?.is_premium ? (
                    <div className="flex items-center mt-1">
                      <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold bg-linear-to-r from-yellow-400 to-orange-500 text-white">
                        <Crown className="h-3.5 w-3.5 mr-1" /> Premium Member
                      </span>
                      {profile.premium_expires_at && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          Expires {new Date(profile.premium_expires_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="mt-2 rounded-2xl clay-shadow"
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
                  className="justify-start rounded-2xl clay-shadow"
                  onClick={() => router.push('/settings')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>

                <Button
                  variant="outline"
                  className="justify-start rounded-2xl clay-shadow"
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

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Overview</h3>
          {statsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="rounded-[20px] clay-shadow">
                  <CardHeader>
                    <Skeleton className="h-5 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-4 w-32 mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(() => {
                const stats = Array.isArray(statsData) ? statsData?.[0] : statsData
                const wordsCount = stats?.total_words_added ?? (userWords?.length ?? 0)
                const quizzesCompleted = stats?.total_quizzes_completed ?? 0
                const totalQuizScore = stats?.total_quiz_score ?? 0
                const avgScore = quizzesCompleted > 0 ? Math.round((totalQuizScore / quizzesCompleted) * 10) / 10 : 0
                return (
                  <>
                    <Card className="rounded-[20px] clay-shadow">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center gap-2"><Book /> Words Added</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{wordsCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Vocabulary you saved</p>
                      </CardContent>
                    </Card>
                    <Card className="rounded-[20px] clay-shadow">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center gap-2"><BookOpen /> Reading Completed</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats?.total_reading_completed ?? 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Reading sessions</p>
                      </CardContent>
                    </Card>
                    <Card className="rounded-[20px] clay-shadow">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center gap-2"><Headphones /> Listening Completed</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats?.total_listening_completed ?? 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Listening sessions</p>
                      </CardContent>
                    </Card>
                    <Card className="rounded-[20px] clay-shadow">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center gap-2"><BarChart3 /> Quizzes Completed</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{quizzesCompleted}</div>
                        <p className="text-xs text-muted-foreground mt-1">Avg score {avgScore}%</p>
                      </CardContent>
                    </Card>
                  </>
                )
              })()}
            </div>
          )}
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(() => {
              const stats = Array.isArray(statsData) ? statsData?.[0] : statsData
              return (
                <>
                  <Card className="rounded-[20px] clay-shadow">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium flex items-center gap-2"><Activity /> Flashcard Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats?.flashcard_practice_count ?? 0}</div>
                      <p className="text-xs text-muted-foreground mt-1">Practice runs</p>
                    </CardContent>
                  </Card>
                  <Card className="rounded-[20px] clay-shadow">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium flex items-center gap-2"><GraduationCap /> Most Studied Level</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats?.most_studied_level ?? '—'}</div>
                      <p className="text-xs text-muted-foreground mt-1">Dominant skill level</p>
                    </CardContent>
                  </Card>
                  <Card className="rounded-[20px] clay-shadow">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium flex items-center gap-2"><Calendar /> Usage Days</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats?.total_usage_days ?? 0}</div>
                      <p className="text-xs text-muted-foreground mt-1">Days active</p>
                    </CardContent>
                  </Card>
                  <Card className="rounded-[20px] clay-shadow">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium flex items-center gap-2"><Calendar /> Last Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats?.last_activity_date ? new Date(stats.last_activity_date).toLocaleDateString() : '—'}</div>
                      <p className="text-xs text-muted-foreground mt-1">Recent activity date</p>
                    </CardContent>
                  </Card>
                </>
              )
            })()}
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => router.push('/reading')} className="rounded-3xl bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)]">
              <BookOpen className="mr-2 h-4 w-4" /> Reading Hub
            </Button>
            <Button onClick={() => router.push('/listening')} className="rounded-3xl bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)]">
              <Headphones className="mr-2 h-4 w-4" /> Listening Hub
            </Button>
            <Button onClick={() => router.push('/grammar')} className="rounded-3xl bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)]">
              <GraduationCap className="mr-2 h-4 w-4" /> Grammar
            </Button>
            <Button onClick={() => router.push('/my-words')} className="rounded-3xl bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)]">
              <Book className="mr-2 h-4 w-4" /> My Words
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}