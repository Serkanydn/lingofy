/**
 * Statistics Tracking Utilities
 *
 * These functions handle automatic statistics updates when users complete activities.
 * Most statistics are tracked automatically via database triggers, but these utilities
 * provide manual tracking for flashcard practice and most studied level updates.
 */

import { getSupabaseClient } from "@/shared/lib/supabase/client";

interface ActivityTrackingResult {
  success: boolean;
  error?: string;
}

interface UserStatistics {
  user_id: string;
  total_reading_completed: number;
  total_listening_completed: number;
  total_grammar_completed: number;
  total_quizzes_completed: number;
  total_quiz_score: number;
  total_words_added: number;
  flashcard_practice_count: number;
  total_usage_days: number;
  last_activity_date: string | null;
  most_studied_level: string | null;
  updated_at: string;
}

/**
 * Track flashcard practice session
 * Increments flashcard_practice_count and updates last_activity_date
 */
export async function trackFlashcardPractice(): Promise<ActivityTrackingResult> {
  try {
    const { error } = await getSupabaseClient().rpc(
      "increment_flashcard_practice"
    );

    if (error) {
      console.error("Error tracking flashcard practice:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Exception tracking flashcard practice:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Update most studied level based on user progress history
 * Calculates the level with the most completions and updates user_statistics
 */
export async function updateMostStudiedLevel(): Promise<ActivityTrackingResult> {
  try {
    const { error } = await getSupabaseClient().rpc(
      "update_most_studied_level"
    );

    if (error) {
      console.error("Error updating most studied level:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Exception updating most studied level:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Manual tracking functions for activities not covered by triggers
 * Use these when you need to track statistics outside of the normal database operations
 */

interface ManualTrackingParams {
  userId: string;
  incrementField:
    | "total_reading_completed"
    | "total_listening_completed"
    | "total_grammar_completed"
    | "total_quizzes_completed"
    | "total_words_added"
    | "flashcard_practice_count";
  additionalData?: {
    quiz_score?: number;
  };
}

/**
 * Manually increment a statistics field
 * This is a fallback for cases where triggers might not fire
 */
export async function manualTrackActivity({
  userId,
  incrementField,
  additionalData,
}: ManualTrackingParams): Promise<ActivityTrackingResult> {
  try {
    // Get current statistics
    const { data: currentStats, error: fetchError } = await getSupabaseClient()
      .from("user_statistics")
      .select(incrementField)
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching current statistics:", fetchError);
      return { success: false, error: fetchError.message };
    }

    // Calculate new value
    const currentValue = (currentStats as any)?.[incrementField] || 0;
    const newValue = currentValue + 1;

    // Prepare update data
    const updateData: Partial<UserStatistics> = {
      [incrementField]: newValue,
      last_activity_date: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString(),
    };

    // Add quiz score if provided
    if (additionalData?.quiz_score !== undefined) {
      const { data: scoreData } = await getSupabaseClient()
        .from("user_statistics")
        .select("total_quiz_score")
        .eq("user_id", userId)
        .single();

      const currentScore = (scoreData as any)?.total_quiz_score || 0;
      updateData.total_quiz_score = currentScore + additionalData.quiz_score;
    }

    // Update statistics
    const { error: updateError } = await getSupabaseClient()
      .from("user_statistics")
      .upsert(
        {
          user_id: userId,
          ...updateData,
        } as any,
        {
          onConflict: "user_id",
        }
      );

    if (updateError) {
      console.error("Error updating statistics:", updateError);
      return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Exception in manual tracking:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Get user statistics summary
 * Useful for displaying current stats after tracking updates
 */
export async function getStatisticsSummary(userId: string) {
  try {
    const { data, error } = await getSupabaseClient()
      .from("user_statistics")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching statistics summary:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Exception fetching statistics summary:", error);
    return null;
  }
}
