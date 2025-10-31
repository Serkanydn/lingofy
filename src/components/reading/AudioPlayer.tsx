'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react'
import { Howl } from 'howler'

interface AudioPlayerProps {
  audioUrls: string[]
}

export function AudioPlayer({ audioUrls }: AudioPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const soundRef = useRef<Howl | null>(null)
  const progressInterval = useRef<NodeJS.Timeout>()

  useEffect(() => {
    loadAudio(currentIndex)
    return () => {
      if (soundRef.current) {
        soundRef.current.unload()
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [currentIndex])

  const loadAudio = (index: number) => {
    if (soundRef.current) {
      soundRef.current.unload()
    }

    soundRef.current = new Howl({
      src: [audioUrls[index]],
      html5: true,
      onload: () => {
        setDuration(soundRef.current?.duration() || 0)
      },
      onplay: () => {
        startProgressUpdate()
      },
      onend: () => {
        setIsPlaying(false)
        setProgress(0)
        if (progressInterval.current) {
          clearInterval(progressInterval.current)
        }
      },
    })
  }

  const startProgressUpdate = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
    }
    progressInterval.current = setInterval(() => {
      if (soundRef.current) {
        setProgress(soundRef.current.seek() as number)
      }
    }, 100)
  }

  const togglePlay = () => {
    if (!soundRef.current) return

    if (isPlaying) {
      soundRef.current.pause()
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    } else {
      soundRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleRestart = () => {
    if (soundRef.current) {
      soundRef.current.seek(0)
      setProgress(0)
    }
  }

  const handleSeek = (value: number[]) => {
    if (soundRef.current) {
      soundRef.current.seek(value[0])
      setProgress(value[0])
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-card border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-primary" />
          <span className="font-medium">Audio {currentIndex + 1} of {audioUrls.length}</span>
        </div>
        {audioUrls.length > 1 && (
          <div className="flex gap-2">
            {audioUrls.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Slider
          value={[progress]}
          max={duration}
          step={0.1}
          onValueChange={handleSeek}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" size="icon" onClick={handleRestart}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button size="lg" onClick={togglePlay}>
          {isPlaying ? (
            <Pause className="h-5 w-5 mr-2" />
          ) : (
            <Play className="h-5 w-5 mr-2" />
          )}
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
      </div>
    </div>
  )
}