import { useQuery } from "@tanstack/react-query";
import { authService } from "@/features/auth/services";
import { statisticsService } from "../services";

export interface UserStatistics {
  user_id: string;
  total_reading_completed: number;
  total_listening_completed: number;
  total_quizzes_completed: number;
  total_quiz_score: number;
  total_words_added: number;
  flashcard_practice_count: number;
  total_usage_days: number;
  last_activity_date: string | null;
  most_studied_level: string | null;
}

export function useStatistics() {
  return useQuery({
    queryKey: ["statistics"],
    queryFn: async () => {
      const user = await authService.getCurrentUser();
      if (!user) throw new Error("Not authenticated");

      return statisticsService.getUserStatistics(user.id);
    },
  });
}
