'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Headphones, 
  BookMarked, 
  Target,
  Calendar,
  TrendingUp,
  Lock,
  BookType
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
 import { StatsCard } from '@/features/statistics/components/StatsCard'
import { SkeletonStats } from '@/features/statistics/components/SkeletonStats'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useQuizHistory } from '@/features/quiz/hooks/useQuiz'
import { useStatistics } from '@/features/statistics/hooks/useStatistics'

export default function StatisticsPage() {
  const router = useRouter()
   const { user, profile, isPremium } = useAuth();
 
  const { data: stats, isLoading } = useStatistics()
  const { data: quizHistory } = useQuizHistory(user?.id || '')

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-12 text-center">
              <div className="w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mx-auto mb-6">
                <Lock className="h-12 w-12 text-orange-600 dark:text-orange-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Statistics is a Premium Feature
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Upgrade to Premium to track your progress and see detailed statistics
              </p>
              <Button
                onClick={() => router.push('/premium')}
                className="rounded-3xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300 px-8 py-6 text-base"
              >
                Upgrade to Premium
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <SkeletonStats />
  }

  if (!stats || (Array.isArray(stats) && stats.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-12">
              <p className="text-gray-600 dark:text-gray-300">No statistics available</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const statsData = Array.isArray(stats) ? stats[0] : stats
  
  const quizSuccessRate = statsData?.total_quizzes_completed > 0
    ? Math.round((statsData.total_quiz_score / (statsData.total_quizzes_completed * 5)) * 100)
    : 0

  // Calculate total activities (reading + listening + grammar, not quizzes)
  const totalActivities = (statsData?.total_reading_completed || 0) + 
                         (statsData?.total_listening_completed || 0) + 
                         (statsData?.total_grammar_completed || 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Your Statistics</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your learning progress and achievements
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-6 transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{statsData?.total_reading_completed || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Reading Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-6 transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-800/10 flex items-center justify-center">
                <Headphones className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{statsData?.total_listening_completed || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Listening Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-6 transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-800/10 flex items-center justify-center">
                <BookType className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{statsData?.total_grammar_completed || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Grammar Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-6 transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-800/10 flex items-center justify-center">
                <BookMarked className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{statsData?.total_words_added || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Words Learned</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-6 transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-100 to-amber-50 dark:from-amber-900/20 dark:to-amber-800/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalActivities}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Activities</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-6 transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-pink-100 to-pink-50 dark:from-pink-900/20 dark:to-pink-800/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{statsData?.total_usage_days || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Active Days</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-6 transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/20 dark:to-indigo-800/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{quizSuccessRate}%</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Success Rate</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Quiz Performance */}
          <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-6">
            <div className="flex items-center gap-2 mb-6">
              <Target className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quiz Performance</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Success Rate</span>
                  <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{quizSuccessRate}%</span>
                </div>
                <Progress value={quizSuccessRate} className="h-3" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{statsData?.total_quiz_score || 0}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {statsData?.total_quizzes_completed > 0
                      ? (statsData.total_quiz_score / statsData.total_quizzes_completed).toFixed(1)
                      : '0'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Stats */}
          <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Activity Overview</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Usage Days</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">{statsData?.total_usage_days || 0}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Flashcard Practices</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">{statsData?.flashcard_practice_count || 0}</span>
              </div>
              {statsData?.most_studied_level && (
                <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Most Studied Level</span>
                  <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-full">{statsData.most_studied_level}</Badge>
                </div>
              )}
              {statsData?.last_activity_date && (
                <div className="text-sm text-gray-600 dark:text-gray-300 text-center pt-3 border-t border-gray-200 dark:border-gray-800">
                  Last active: {formatDistanceToNow(new Date(statsData.last_activity_date), { addSuffix: true })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Quiz History */}
        {quizHistory && quizHistory.length > 0 && (
          <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Quiz Results</h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Your last 10 quiz attempts</p>
            </div>
            <div className="space-y-3">
              {quizHistory.slice(0, 10).map((quiz: any) => {
                const percentage = quiz.percentage || 0
                const isGood = percentage >= 70

                return (
                  <div
                    key={quiz.id}
                    className="flex items-center justify-between p-4 rounded-2xl border-2 border-gray-200 dark:border-gray-800 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-300"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`rounded-full ${isGood ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
                          Quiz
                        </Badge>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {formatDistanceToNow(new Date(quiz.completed_at), { addSuffix: true })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={percentage} className="h-2 flex-1" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 w-12 text-right">
                          {Math.round(percentage)}%
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {quiz.score}/{quiz.max_score}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}