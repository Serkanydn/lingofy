import { getSupabaseClient } from "@/shared/lib/supabase/client";

 
/**
 * QuizLimitService
 *
 * Handles daily quiz limit checks for free users.
 * Premium users have unlimited access.
 *
 * Features:
 * - Check remaining daily quizzes
 * - Track quiz attempts by date
 * - Respect maxFreeQuizzes setting
 *
 * @service
 */
class QuizLimitService {
  /**
   * Check how many quizzes a user has completed today
   * @param userId - User ID to check
   * @returns Number of quizzes completed today
   */
  async getTodayQuizCount(userId: string): Promise<number> {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await getSupabaseClient()
      .from("user_question_attempts")
      .select("id", { count: "exact" })
      .eq("user_id", userId)
      .gte("completed_at", `${today}T00:00:00`)
      .lt("completed_at", `${today}T23:59:59`);

    if (error) {
      console.error("Error fetching today quiz count:", error);
      return 0;
    }

    return data?.length || 0;
  }

  /**
   * Check if user can take a quiz based on daily limit
   * @param userId - User ID to check
   * @param isPremium - Whether user has premium access
   * @param maxFreeQuizzes - Max quizzes per day for free users
   * @returns Object with canTake (boolean) and remaining (number)
   */
  async canTakeQuiz(
    userId: string,
    isPremium: boolean,
    maxFreeQuizzes: number
  ): Promise<{ canTake: boolean; remaining: number; used: number }> {
    // Premium users have unlimited access
    if (isPremium) {
      return { canTake: true, remaining: -1, used: 0 }; // -1 means unlimited
    }

    const todayCount = await this.getTodayQuizCount(userId);
    const remaining = Math.max(0, maxFreeQuizzes - todayCount);
    const canTake = todayCount < maxFreeQuizzes;

    return { canTake, remaining, used: todayCount };
  }
}

export const quizLimitService = new QuizLimitService();
