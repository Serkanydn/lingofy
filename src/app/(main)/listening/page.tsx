'use client'

import { Level } from '@/shared/types/common.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

const LEVELS: { level: Level; description: string }[] = [
  {
    level: 'A1',
    description: 'Basic listening exercises with simple vocabulary and slow, clear speech.',
  },
  {
    level: 'A2',
    description: 'Elementary listening practice with everyday topics and clear pronunciation.',
  },
  {
    level: 'B1',
    description: 'Intermediate listening exercises with natural speech and varied topics.',
  },
  {
    level: 'B2',
    description: 'Upper intermediate content with complex topics and natural conversation.',
  },
  {
    level: 'C1',
    description: 'Advanced listening practice with challenging content and authentic materials.',
  },
]

export default function ListeningPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Listening Practice</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Improve your listening skills with our curated collection of audio content
          across different levels.
        </p>

        <div className="grid gap-6">
          {LEVELS.map(({ level, description }) => (
            <Link key={level} href={`/listening/${level}`}>
              <Card className="transition-all hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">{level} Level</CardTitle>
                    <Badge variant="secondary">{level}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}