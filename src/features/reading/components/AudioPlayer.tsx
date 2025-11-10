"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Headphones } from "lucide-react";
import { Howl } from "howler";

interface AudioPlayerProps {
  audioUrl: string;
  title?: string;
  thumbnail?: string;
}

export function AudioPlayer({ audioUrl, title, thumbnail }: AudioPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const soundRef = useRef<Howl | null>(null);
  const progressInterval = useRef<any>(null);

  useEffect(() => {
    loadAudio(currentIndex);
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentIndex]);

  const loadAudio = (index: number) => {
    if (soundRef.current) {
      soundRef.current.unload();
    }

    soundRef.current = new Howl({
      src: audioUrl,
      html5: true,
      onload: () => {
        setDuration(soundRef.current?.duration() || 0);
      },
      onplay: () => {
        startProgressUpdate();
      },
      onend: () => {
        setIsPlaying(false);
        setProgress(0);
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
        }
      },
    });
  };

  const startProgressUpdate = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    progressInterval.current = setInterval(() => {
      if (soundRef.current) {
        setProgress(soundRef.current.seek() as number);
      }
    }, 100);
  };

  const togglePlay = () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      soundRef.current.pause();
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    } else {
      soundRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    if (soundRef.current) {
      soundRef.current.seek(0);
      setProgress(0);
    }
  };

  const handleSeek = (value: number[]) => {
    if (soundRef.current) {
      soundRef.current.seek(value[0]);
      setProgress(value[0]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className=" w-full items-center gap-4 p-6 border border-orange-200 rounded-3xl bg-orange-50">
      <div className="flex justify-space-between items-center gap-4 mb-4">
        {/* Thumbnail */}
        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-linear-to-br from-amber-200 to-amber-300">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              <Headphones />
            </div>
          )}
        </div>

        {/* Title and Narrator */}
        <div className="shrink-0 min-w-[200px]">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
            {title || "The Art of Storytelling"}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Narrated by Jane Doe
          </p>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center shadow-lg transition-all duration-300 shrink-0 ml-auto"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white fill-white" />
          ) : (
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          )}
        </button>
      </div>

      {/* Progress Bar Container */}
      <div className="flex-1 min-w-0 px-3">
        <div className="relative">
          {/* Progress Bar */}
          <div
            className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer relative"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percentage = x / rect.width;
              const newTime = percentage * duration;
              handleSeek([newTime]);
            }}
          >
            <div
              className="h-full bg-orange-500 rounded-full relative transition-all duration-100"
              style={{
                width: `${duration > 0 ? (progress / duration) * 100 : 0}%`,
              }}
            >
              {/* Progress Indicator Dot */}
              <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-orange-500   rounded-full shadow border-2 border-white" />
            </div>
          </div>

          {/* Time Labels */}
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1.5">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
