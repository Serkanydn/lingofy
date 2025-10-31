'use client'

import { useReadingByLevel } from '@/lib/hooks/useReading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Lock, BookOpen } from 'lucide-react'
import { useAuthStore } from '@/lib/store/authStore'
import { useState } from 'react'
import PaywallModal from '@/components/premium/PaywallModal'
import { Level, ReadingContent } from '@/types/content.types'
import { Skeleton } from '@/components/ui/skeleton'

interface ReadingCardProps {
  reading: ReadingContent
  level: Level
  index: number
  isPremium: boolean
  onPremiumClick: () => void
}

function ReadingCard({ reading, level, index, isPremium, onPremiumClick }: ReadingCardProps) {
  const isLocked = reading.is_premium && !isPremium

  if (isLocked) {
    return (
      <Card className="hover:shadow-lg transition-shadow h-full opacity-75">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                Text {index + 1}
              </span>
            </div>
            <Lock className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardTitle className="mt-2 line-clamp-2">
            {reading.title}
          </CardTitle>
          <CardDescription className="line-clamp-3">
            {reading.content.substring(0, 100)}...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            className="w-full" 
            variant="outline"
            onClick={onPremiumClick}
          >
            <Lock className="mr-2 h-4 w-4" />
            Premium Only
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Link href={`/reading/${level}/${reading.id}`}>
      <Card className="hover:shadow-lg transition-shadow h-full cursor-pointer">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                Text {index + 1}
              </span>
            </div>
          </div>
          <CardTitle className="mt-2 line-clamp-2">
            {reading.title}
          </CardTitle>
          <CardDescription className="line-clamp-3">
            {reading.content.substring(0, 100)}...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">Read Now</Button>
        </CardContent>
      </Card>
    </Link>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-6 w-full mt-2" />
            <Skeleton className="h-20 w-full mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function ReadingLevelPage({ params }: { params: { level: string } }) {
  const level = params.level.toUpperCase() as Level
  const { data: readings, isLoading } = useReadingByLevel(level)
  const isPremium = useAuthStore((state) => state.isPremium())
  const [showPaywall, setShowPaywall] = useState(false)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/reading">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Levels
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Badge className="text-lg px-3 py-1">{level}</Badge>
            <h1 className="text-4xl font-bold">{level} Reading Texts</h1>
          </div>
          <p className="text-muted-foreground mt-2">Loading texts...</p>
        </div>
        <LoadingSkeleton />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/reading">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Levels
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <Badge className="text-lg px-3 py-1">{level}</Badge>
          <h1 className="text-4xl font-bold">{level} Reading Texts</h1>
        </div>
        <p className="text-muted-foreground mt-2">
          {readings?.length || 0} texts available
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {readings?.map((reading, index) => (
          <ReadingCard
            key={reading.id}
            reading={reading}
            level={level}
            index={index}
            isPremium={isPremium}
            onPremiumClick={() => setShowPaywall(true)}
          />
        ))}
      </div>

      <PaywallModal open={showPaywall} onClose={() => setShowPaywall(false)} />
    </div>
  )
}