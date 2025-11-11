import { useMutation, useQueryClient } from '@tanstack/react-query';
import { trackFlashcardPractice, updateMostStudiedLevel, manualTrackActivity } from '../utils/trackActivity';
import { toast } from 'sonner';

/**
 * Hook to track flashcard practice sessions
 */
export function useTrackFlashcardPractice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: trackFlashcardPractice,
    onSuccess: () => {
      // Invalidate statistics query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
    },
    onError: (error: Error) => {
      console.error('Failed to track flashcard practice:', error);
      toast.error('Failed to update statistics');
    }
  });
}

/**
 * Hook to update most studied level
 */
export function useUpdateMostStudiedLevel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMostStudiedLevel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
    },
    onError: (error: Error) => {
      console.error('Failed to update most studied level:', error);
    }
  });
}

/**
 * Hook for manual statistics tracking
 * Use this as a fallback when triggers might not fire
 */
export function useManualTrackActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: manualTrackActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
    },
    onError: (error: Error) => {
      console.error('Failed to track activity:', error);
      toast.error('Failed to update statistics');
    }
  });
}

/**
 * Convenience hook for tracking all activity types
 * Provides simple methods for each activity type
 */
export function useActivityTracking() {
  const trackFlashcard = useTrackFlashcardPractice();
  const updateLevel = useUpdateMostStudiedLevel();
  const manualTrack = useManualTrackActivity();

  return {
    // Track flashcard practice session
    trackFlashcardSession: () => trackFlashcard.mutate(),
    
    // Update most studied level
    updateMostStudiedLevel: () => updateLevel.mutate(),
    
    // Manual tracking methods
    trackReading: (userId: string) => 
      manualTrack.mutate({ 
        userId, 
        incrementField: 'total_reading_completed' 
      }),
    
    trackListening: (userId: string) => 
      manualTrack.mutate({ 
        userId, 
        incrementField: 'total_listening_completed' 
      }),
    
    trackQuiz: (userId: string, score: number) => 
      manualTrack.mutate({ 
        userId, 
        incrementField: 'total_quizzes_completed',
        additionalData: { quiz_score: score }
      }),
    
    trackWordAdded: (userId: string) => 
      manualTrack.mutate({ 
        userId, 
        incrementField: 'total_words_added' 
      }),
    
    // Loading states
    isTracking: trackFlashcard.isPending || updateLevel.isPending || manualTrack.isPending
  };
}
