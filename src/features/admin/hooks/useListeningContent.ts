import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ListeningService } from "@/features/listening/services/listeningService";
import { ListeningExercise } from "@/features/listening/types/service.types";

type CreateListeningData = Omit<ListeningExercise, "id" | "created_at">;

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
      return await listeningService.create(insertData);
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
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateListeningData> }) => {
      return await listeningService.update(id, data);
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
