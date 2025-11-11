import { useQuery } from "@tanstack/react-query";
import { Level } from "@/shared/types/common.types";
import { listeningService } from "../services";

export interface ListeningContent {
  id: string;
  title: string;
  level: Level;
  description: string;
  audio_url: string;
  duration_seconds: number;
  transcript: string;
  is_premium: boolean;
  order_index: number;
}

export function useListeningByLevel(level: Level) {
  return useQuery({
    queryKey: ["listening", level],
    queryFn: async () => {
      return listeningService.getExercisesByLevel(level);
    },
  });
}

export function useListeningDetail(id: string) {
  return useQuery({
    queryKey: ["listening", id],
    queryFn: async () => {
      return listeningService.getById(id);
    },
  });
}

export function useListeningQuiz(contentId: string) {
  return useQuery({
    queryKey: ["quiz", "listening", contentId],
    queryFn: async () => {
      const { questions } = await listeningService.getExerciseWithQuestions(
        contentId
      );
      return questions;
    },
  });
}

export function useListeningByLevelCount(level: Level) {
  return useQuery({
    queryKey: ["listening", "count", level],
    queryFn: async () => {
      const exercises = await listeningService.getExercisesByLevel(level);
      return exercises.length;
    },
  });
}
