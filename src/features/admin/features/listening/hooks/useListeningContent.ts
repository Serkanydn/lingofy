import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ListeningService } from "@/features/listening/services/listeningService";
import { ListeningExercise } from "@/features/listening/types/service.types";
import { ReadingQuestionInput } from "@/features/reading/types/service.types";

type CreateListeningData = Omit<ListeningExercise, "id" | "created_at"> & {
  questions?: ReadingQuestionInput[];
};

const listeningService = new ListeningService();

export function useListeningContent() {
  return useQuery({
    queryKey: ["admin-listening-content"],
    queryFn: async () => {
      return await listeningService.getAll();
    },
  });
}

export function useCreateListening() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (insertData: CreateListeningData) => {
      const { questions, ...listeningData } = insertData;
      const listening = await listeningService.create(listeningData);
      
      // If questions are provided, create them
      if (questions && questions.length > 0 && listening?.id) {
        await listeningService.createQuestions(listening.id, questions);
      }
      
      return listening;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-listening-content"] });
      toast.success("Listening content created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create listening content");
    },
  });
}

export function useUpdateListening() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
      questions,
    }: {
      id: string;
      data: Partial<CreateListeningData>;
      questions?: ReadingQuestionInput[];
    }) => {
      const result = await listeningService.update(id, data);
      
      // Update or create questions using listening_content id directly
      if (questions !== undefined) {
        await listeningService.updateQuestions(id, questions);
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-listening-content"] });
      toast.success("Listening content updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update listening content");
    },
  });
}

export function useDeleteListening() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await listeningService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-listening-content"] });
      toast.success("Listening content deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete listening content");
    },
  });
}
