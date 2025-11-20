'use client';

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/shared/hooks/useAuth";
import { useSettingsStore } from "@/features/admin/features/settings/store/settingsStore";
import { quizLimitService } from "@/shared/services/supabase/quizLimitService";

/**
 * useQuizLimit Hook
 * 
 * Check if user can take quizzes based on daily limit.
 * Premium users have unlimited access.
 * 
 * @returns Quiz limit status with canTake, remaining, used, isLoading
 */
export function useQuizLimit() {
  const { user, profile } = useAuth();
  const maxFreeQuizzes = useSettingsStore((state) => state.getMaxFreeQuizzes());
  
  const { data, isLoading } = useQuery({
    queryKey: ['quiz-limit', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return { canTake: false, remaining: 0, used: 0 };
      }
      
      return quizLimitService.canTakeQuiz(
        user.id,
        profile?.is_premium || false,
        maxFreeQuizzes
      );
    },
    enabled: !!user?.id,
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  return {
    canTake: data?.canTake ?? true,
    remaining: data?.remaining ?? maxFreeQuizzes,
    used: data?.used ?? 0,
    isLoading,
    isPremium: profile?.is_premium || false,
    maxQuizzes: maxFreeQuizzes,
  };
}
