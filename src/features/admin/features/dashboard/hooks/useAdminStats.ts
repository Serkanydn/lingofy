import { getSupabaseClient } from "@/shared/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface AdminStats {
  totalUsers: number;
  premiumUsers: number;
  readingContent: number;
  listeningContent: number;
  grammarTopics: number;
  totalQuizzes: number;
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async (): Promise<AdminStats> => {
      // Get total users
      const { count: totalUsers } = await getSupabaseClient()
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Get premium users
      const { count: premiumUsers } = await getSupabaseClient()
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("is_premium", true);

      // Get reading content count
      const { count: readingContent } = await getSupabaseClient()
        .from("reading_content")
        .select("*", { count: "exact", head: true });

      // Get listening content count
      const { count: listeningContent } = await getSupabaseClient()
        .from("listening_content")
        .select("*", { count: "exact", head: true });

      // Get grammar topics count
      const { count: grammarTopics } = await getSupabaseClient()
        .from("grammar_topics")
        .select("*", { count: "exact", head: true });

      // Get total quizzes taken
      const { count: totalQuizzes } = await getSupabaseClient()
        .from("user_question_attempts")
        .select("*", { count: "exact", head: true });

      return {
        totalUsers: totalUsers || 0,
        premiumUsers: premiumUsers || 0,
        readingContent: readingContent || 0,
        listeningContent: listeningContent || 0,
        grammarTopics: grammarTopics || 0,
        totalQuizzes: totalQuizzes || 0,
      };
    },
  });
}
