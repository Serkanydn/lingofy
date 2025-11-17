import { useQuery } from "@tanstack/react-query";
import { Level } from "@/shared/types/common.types";
import { AudioAsset } from "@/shared/types/audio.types";
import { listeningService } from "../services";

export interface ListeningContent {
  id: string;
  title: string;
  level: Level;
  description: string;
  audio_asset_id?: string;
  audio_asset?: AudioAsset;
  duration_seconds: number;
  transcript: string;
  is_premium: boolean;
  order_index: number;
  category?: string;
  thumbnail?: string;
  created_at?: string;
  updated_at?: string;
}

export function useListeningDetailByLevel(level: Level) {
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

export function useListeningCountByLevel(level: Level) {
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
