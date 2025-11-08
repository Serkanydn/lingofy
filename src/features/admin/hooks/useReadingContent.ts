import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ReadingText } from "@/features/reading/types/service.types";
import { readingService } from "@/features/reading/services";

type CreateReadingData = Omit<ReadingText, "id" | "created_at">;

export function useReadingContent() {
  return useQuery({
    queryKey: ["admin-reading-content"],
    queryFn: async () => {
      return await readingService.getAll();
    },
  });
}

export function useCreateReading() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (insertData: CreateReadingData) => {
      return await readingService.create(insertData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reading-content"] });
      toast.success("Reading content created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create reading content");
    },
  });
}

export function useUpdateReading() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateReadingData>;
    }) => {
      return await readingService.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reading-content"] });
      toast.success("Reading content updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update reading content");
    },
  });
}

export function useDeleteReading() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await readingService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reading-content"] });
      toast.success("Reading content deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete reading content");
    },
  });
}
