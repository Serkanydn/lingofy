'use client';

import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Crown } from "lucide-react";

interface QuizLimitWarningProps {
  remaining: number;
  used: number;
  maxQuizzes: number;
}

/**
 * QuizLimitWarning Component
 * 
 * Displays warning when free user approaches daily quiz limit.
 * Shows upgrade CTA when limit is reached.
 * 
 * @component
 */
export function QuizLimitWarning({ remaining, used, maxQuizzes }: QuizLimitWarningProps) {
  // Don't show warning if user hasn't used any quizzes yet
  if (used === 0) return null;
  
  // Limit reached
  if (remaining === 0) {
    return (
      <Alert variant="destructive" className="border-orange-200 dark:border-orange-800">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-semibold mb-1">Daily Quiz Limit Reached</p>
            <p className="text-sm">
              You've completed {used} of {maxQuizzes} free quizzes today. Come back tomorrow or upgrade to premium for unlimited access!
            </p>
          </div>
          <Link href="/premium">
            <Button 
              variant="default" 
              className="bg-orange-500 hover:bg-orange-600 shrink-0"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade
            </Button>
          </Link>
        </AlertDescription>
      </Alert>
    );
  }
  
  // Warning when approaching limit (last quiz)
  if (remaining === 1) {
    return (
      <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/10">
        <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
        <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-semibold mb-1 text-orange-900 dark:text-orange-100">
              Last Free Quiz Today!
            </p>
            <p className="text-sm text-orange-800 dark:text-orange-200">
              You have {remaining} quiz remaining today ({used}/{maxQuizzes} used). Upgrade for unlimited access.
            </p>
          </div>
          <Link href="/premium">
            <Button 
              variant="outline" 
              className="border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 shrink-0"
            >
              <Crown className="h-4 w-4 mr-2" />
              Go Premium
            </Button>
          </Link>
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
}
