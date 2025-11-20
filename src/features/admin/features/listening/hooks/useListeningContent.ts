import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { listeningService } from "@/shared/services/supabase/listeningService";
import { ListeningFormData } from "../types/validation";

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
    mutationFn: async (insertData: ListeningFormData) => {
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
      updateData,
    }: {
      id: string;
      updateData: Partial<ListeningFormData>;
    }) => {
      const { questions, ...listeningData } = updateData;

      const result = await listeningService.update(id, listeningData);

      if (questions !== undefined && questions.length > 0) {
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
