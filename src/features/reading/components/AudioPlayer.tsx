"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Headphones, SkipBack, SkipForward } from "lucide-react";
import { Howl } from "howler";
import type { AudioAsset } from "@/shared/types/audio.types";

interface AudioPlayerProps {
  audioAsset: AudioAsset; // New preferred method
  title?: string;
  thumbnail?: string;
}

export function AudioPlayer({
  audioAsset,
  title,
  thumbnail,
}: AudioPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const soundRef = useRef<Howl | null>(null);
  const progressInterval = useRef<any>(null);

  // Prefer audio asset, fallback to direct URL
  const audioSource =
    audioAsset?.cdn_url || audioAsset?.storage_url;
  const audioDuration = audioAsset?.duration_seconds;

  console.log("audioSource", audioSource);

  useEffect(() => {
    if (audioSource) {
      loadAudio(currentIndex);
    }
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentIndex, audioSource]);

  const loadAudio = (index: number) => {
    if (soundRef.current) {
      soundRef.current.unload();
    }

    if (!audioSource) {
      console.error("No audio source available");
      return;
    }

    console.log("Loading audio from:", audioSource);

    soundRef.current = new Howl({
      src: [audioSource],
      html5: true,
      format: ["mp3", "wav", "ogg", "m4a"],
      onload: () => {
        console.log(
          "Audio loaded successfully, duration:",
          soundRef.current?.duration()
        );
        const loadedDuration =
          soundRef.current?.duration() || audioDuration || 0;
        setDuration(loadedDuration);
      },
      onloaderror: (id, error) => {
        console.error("Audio load error:", error);
      },
      onplayerror: (id, error) => {
        console.error("Audio play error:", error);
      },
      onplay: () => {
        console.log("Audio playing");
        startProgressUpdate();
      },
      onend: () => {
        console.log("Audio ended");
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

  const skipBackward = () => {
    if (soundRef.current) {
      const newTime = Math.max(0, progress - 5);
      soundRef.current.seek(newTime);
      setProgress(newTime);
    }
  };

  const skipForward = () => {
    if (soundRef.current) {
      const newTime = Math.min(duration, progress + 5);
      soundRef.current.seek(newTime);
      setProgress(newTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className=" w-full items-center gap-4 p-6 border border-orange-200 rounded-3xl bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800 ">
      <div className="flex justify-center items-center gap-4 mb-4">
        {/* Skip Backward Button */}
        <button
          onClick={skipBackward}
          className="w-10 h-10 rounded-full bg-orange-100 hover:bg-orange-200 dark:bg-orange-800/30 dark:hover:bg-orange-800/50 flex items-center justify-center transition-all duration-300"
          aria-label="Skip backward 5 seconds"
        >
          <SkipBack className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center shadow-lg transition-all duration-300"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white fill-white" />
          ) : (
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          )}
        </button>

        {/* Skip Forward Button */}
        <button
          onClick={skipForward}
          className="w-10 h-10 rounded-full bg-orange-100 hover:bg-orange-200 dark:bg-orange-800/30 dark:hover:bg-orange-800/50 flex items-center justify-center transition-all duration-300"
          aria-label="Skip forward 5 seconds"
        >
          <SkipForward className="w-5 h-5 text-orange-600 dark:text-orange-400" />
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
