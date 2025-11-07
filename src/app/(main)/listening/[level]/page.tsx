'use client'

import { Level } from '@/shared/types/common.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Clock, Lock } from 'lucide-react'
import Link from 'next/link'
import { useListeningByLevel } from '@/features/listening/hooks/useListening'

export default function ListeningLevelPage({ 
  params 
}: { 
  params: { level: Level } 
}) {
  const { data: listeningContent, isLoading } = useListeningByLevel(params.level)

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (!listeningContent) {
    return <div className="container mx-auto px-4 py-8">No content found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/listening">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Listening Practice
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-2">{params.level} Listening</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Practice your listening skills with {params.level} level audio content.
        </p>

        <div className="grid gap-6">
          {listeningContent.map((content) => (
            <Link key={content.id} href={`/listening/${params.level}/${content.id}`}>
              <Card className="transition-all hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge>{content.level}</Badge>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm text-muted-foreground">
                        {Math.floor(content.duration_seconds / 60)}:{String(content.duration_seconds % 60).padStart(2, '0')} min
                      </span>
                    </div>
                  </div>
                  <CardTitle className="text-2xl group-hover:text-primary">
                    {content.title}
                    {content.is_premium && (
                      <Lock className="inline-block ml-2 h-5 w-5 text-muted-foreground" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{content.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}