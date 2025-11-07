'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react'
import { Howl } from 'howler'

interface ListeningPlayerProps {
  audioUrls: string[]
  duration?: number
}

export function ListeningPlayer({ audioUrls, duration }: ListeningPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [audioDuration, setAudioDuration] = useState(duration || 0)
  const [playbackRate, setPlaybackRate] = useState(1)
  const soundRef = useRef<Howl | null>(null)
  const progressInterval = useRef<any>(null)

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

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.rate(playbackRate)
    }
  }, [playbackRate])

  const loadAudio = (index: number) => {
    if (soundRef.current) {
      soundRef.current.unload()
    }

    soundRef.current = new Howl({
      src: [audioUrls[index]],
      html5: true,
      rate: playbackRate,
      onload: () => {
        setAudioDuration(soundRef.current?.duration() || 0)
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
    <div className="bg-linear-to-br from-primary/5 to-primary/10 border rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-3 rounded-full">
            <Volume2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold">Listening Practice</p>
            <p className="text-sm text-muted-foreground">
              Audio {currentIndex + 1} of {audioUrls.length}
            </p>
          </div>
        </div>
        <Select value={playbackRate.toString()} onValueChange={(v) => setPlaybackRate(parseFloat(v))}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0.75">0.75x</SelectItem>
            <SelectItem value="1">1x</SelectItem>
            <SelectItem value="1.25">1.25x</SelectItem>
            <SelectItem value="1.5">1.5x</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {audioUrls.length > 1 && (
        <div className="flex justify-center gap-2">
          {audioUrls.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index)
                setIsPlaying(false)
              }}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-primary w-8' 
                  : 'bg-muted hover:bg-muted-foreground/30 w-2'
              }`}
            />
          ))}
        </div>
      )}

      <div className="space-y-3">
        <Slider
          value={[progress]}
          max={audioDuration}
          step={0.1}
          onValueChange={handleSeek}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(audioDuration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" size="icon" onClick={handleRestart}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button size="lg" className="px-8" onClick={togglePlay}>
          {isPlaying ? (
            <>
              <Pause className="h-5 w-5 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-5 w-5 mr-2" />
              Play
            </>
          )}
        </Button>
      </div>
    </div>
  )
}