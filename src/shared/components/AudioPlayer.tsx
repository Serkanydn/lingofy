"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioPlayerProps {
  audioUrl?: string;
  cdnUrl?: string;
  storageUrl?: string;
  className?: string;
}

export function AudioPlayer({ audioUrl, cdnUrl, storageUrl, className = "" }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [attemptCount, setAttemptCount] = useState(0);

  // Priority order: cdnUrl -> audioUrl -> storageUrl
  const urls = [cdnUrl, audioUrl, storageUrl].filter(Boolean);

  useEffect(() => {
    if (urls.length > 0 && attemptCount < urls.length) {
      const nextUrl = urls[attemptCount];
      if (nextUrl) {
        setCurrentUrl(nextUrl);
        setHasError(false);
      }
    }
  }, [attemptCount]);

  const handleError = () => {
    console.error(`Audio load error for URL: ${currentUrl}`);
    
    // Try next URL if available
    if (attemptCount < urls.length - 1) {
      setAttemptCount(prev => prev + 1);
      setIsLoading(true);
      setHasError(false);
    } else {
      setHasError(true);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const handleCanPlay = () => {
    setIsLoading(false);
    setHasError(false);
    console.log(`Audio loaded successfully from: ${currentUrl}`);
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Play error:", error);
          handleError();
        });
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  if (!currentUrl && urls.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={togglePlay}
        disabled={isLoading || hasError}
        className="rounded-xl"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : hasError ? (
          <VolumeX className="h-4 w-4 text-red-500" />
        ) : isPlaying ? (
          <Volume2 className="h-4 w-4 animate-pulse" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
      
      {hasError && (
        <span className="text-xs text-red-500">Audio unavailable</span>
      )}
      
      {currentUrl && (
        <audio
          ref={audioRef}
          src={currentUrl}
          onError={handleError}
          onCanPlay={handleCanPlay}
          onEnded={handleEnded}
          preload="metadata"
        />
      )}
    </div>
  );
}
