'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Headphones, 
  Trophy, 
  BookMarked, 
  Target,
  Calendar,
  TrendingUp,
  Lock 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
 import { useStatistics } from '@/shared/hooks/useStatistics'
 import { StatsCard } from '@/features/statistics/components/StatsCard'
import { SkeletonStats } from '@/features/statistics/components/SkeletonStats'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useQuizHistory } from '@/features/quiz/hooks/useQuiz'

export default function StatisticsPage() {
  const router = useRouter()
   const { user, profile, isPremium } = useAuth();
 
  const { data: stats, isLoading } = useStatistics()
  const { data: quizHistory } = useQuizHistory(user?.id || '')

  if (!isPremium) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-muted p-4 rounded-full">
                <Lock className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl">Statistics is a Premium Feature</CardTitle>
            <CardDescription className="text-base">
              Upgrade to Premium to track your progress and see detailed statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              size="lg"
              onClick={() => router.push('/premium')}
              className="bg-linear-to-r from-yellow-400 to-orange-500"
            >
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return <SkeletonStats />
  }

  if (!stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">No statistics available</div>
      </div>
    )
  }

  const quizSuccessRate = stats.total_quizzes_completed > 0
    ? Math.round((stats.total_quiz_score / (stats.total_quizzes_completed * 5)) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Your Statistics</h1>
        <p className="text-muted-foreground">
          Track your learning progress and achievements
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Reading Completed"
          value={stats.total_reading_completed}
          icon={BookOpen}
          description="Total texts read"
        />
        <StatsCard
          title="Listening Completed"
          value={stats.total_listening_completed}
          icon={Headphones}
          description="Total audios listened"
        />
        <StatsCard
          title="Quizzes Completed"
          value={stats.total_quizzes_completed}
          icon={Trophy}
          description="Total quizzes taken"
        />
        <StatsCard
          title="Words Learned"
          value={stats.total_words_added}
          icon={BookMarked}
          description="In your collection"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Quiz Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Quiz Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Success Rate</span>
                <span className="text-2xl font-bold">{quizSuccessRate}%</span>
              </div>
              <Progress value={quizSuccessRate} className="h-3" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Total Score</p>
                <p className="text-2xl font-bold">{stats.total_quiz_score}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold">
                  {stats.total_quizzes_completed > 0
                    ? (stats.total_quiz_score / stats.total_quizzes_completed).toFixed(1)
                    : '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Activity Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Total Usage Days</span>
              <span className="text-xl font-bold">{stats.total_usage_days}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Flashcard Practices</span>
              <span className="text-xl font-bold">{stats.flashcard_practice_count}</span>
            </div>
            {stats.most_studied_level && (
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                <span className="text-sm font-medium">Most Studied Level</span>
                <Badge variant="secondary">{stats.most_studied_level}</Badge>
              </div>
            )}
            {stats.last_activity_date && (
              <div className="text-sm text-muted-foreground text-center pt-2 border-t">
                Last active: {formatDistanceToNow(new Date(stats.last_activity_date), { addSuffix: true })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Quiz History */}
      {quizHistory && quizHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Quiz Results
            </CardTitle>
            <CardDescription>Your last 20 quiz attempts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quizHistory.slice(0, 10).map((quiz: any) => {
                const percentage = Math.round((quiz.score / quiz.total_questions) * 100)
                const isGood = percentage >= 70

                return (
                  <div
                    key={quiz.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={isGood ? 'default' : 'secondary'}>
                          {quiz.content_type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(quiz.completed_at), { addSuffix: true })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={percentage} className="h-2 flex-1" />
                        <span className="text-sm font-medium w-12 text-right">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-lg font-bold">
                        {quiz.score}/{quiz.total_questions}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}