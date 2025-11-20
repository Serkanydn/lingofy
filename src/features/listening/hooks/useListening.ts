import { useQuery } from "@tanstack/react-query";
import { AudioAsset } from "@/shared/types/model/audio.types";
import { listeningService } from "@/shared/services/supabase/listeningService";
import { CEFRLevel } from "@/shared/types/enums/cefrLevel.enum";

export interface ListeningContent {
  id: string;
  title: string;
  level: CEFRLevel;
  description: string;
  audio_asset_id?: string;
  audio_asset?: AudioAsset;
  duration_seconds: number;
  transcript: string;
  is_premium: boolean;
  order: number;
  category?: string;
  thumbnail?: string;
  created_at?: string;
  updated_at?: string;
}

export function useListeningDetailByLevel(level: CEFRLevel) {
  return useQuery({
    queryKey: ["listening", level],
    queryFn: async () => {
      return listeningService.getListeningByLevel(level);
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

export function useListeningCountByLevel(level: CEFRLevel) {
  return useQuery({
    queryKey: ["listening", "count", level],
    queryFn: async () => {
      return listeningService.getCountByLevel(level);
    },
  });
}

export function useListeningQuestions(
  contentId: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ["listening-questions", contentId],
    queryFn: async () => {
      return await listeningService.getQuestionsForContent(contentId);
    },
    enabled,
  });
}
