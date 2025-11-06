"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  RotateCw,
  Volume2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { UserWord, useUpdateFlashcardPractice } from "@/shared/hooks/useWords";

interface FlashcardPracticeProps {
  words: UserWord[];
  onExit: () => void;
}

export function FlashcardPractice({ words, onExit }: FlashcardPracticeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const updatePractice = useUpdateFlashcardPractice();

  const currentWord = words[currentIndex];
  const progress = ((currentIndex + 1) / words.length) * 100;

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      updatePractice.mutate();
      onExit();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(currentWord.word);
    utterance.lang = "en-US";
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={onExit}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Exit Practice
        </Button>
      </div>

      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Card {currentIndex + 1} of {words.length}
          </span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="mb-6 perspective-1000">
        <Card
          className={`min-h-[400px] cursor-pointer transition-all duration-500 transform-style-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <CardContent className="p-12 flex flex-col items-center justify-center min-h-[400px] relative">
            {!isFlipped ? (
              // Front - English
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-4">
                  <h2 className="text-5xl font-bold">{currentWord.word}</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak();
                    }}
                  >
                    <Volume2 className="h-6 w-6" />
                  </Button>
                </div>
                <p className="text-muted-foreground text-lg">
                  Click to see translation
                </p>
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <p className="text-blue-900 text-lg leading-relaxed">
                    {currentWord.example_sentence_en}
                  </p>
                </div>
              </div>
            ) : (
              // Back - Turkish
              <div className="text-center space-y-6 rotate-y-180">
                <h2 className="text-5xl font-bold text-primary">
                  {currentWord.translation}
                </h2>
                <p className="text-muted-foreground text-lg">
                  Click to flip back
                </p>
                <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
                  <p className="text-green-900 text-lg leading-relaxed">
                    {currentWord.example_sentence_tr}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Previous
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <RotateCw className="h-5 w-5" />
        </Button>

        <Button size="lg" onClick={handleNext}>
          {currentIndex === words.length - 1 ? "Finish" : "Next"}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
