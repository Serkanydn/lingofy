import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { readingService } from "@/shared/services/supabase/readingService";
import { ReadingFormData } from "../types/validation";

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
    mutationFn: async (insertData: ReadingFormData) => {
      const { questions, ...readingData } = insertData;
      const reading = await readingService.create(readingData);

      console.log("questions :>> ", questions);

      if (questions && questions.length > 0 && reading?.id) {
        await readingService.createQuestions(reading.id, questions);
      }

      return reading;
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
      updateData,
    }: {
      id: string;
      updateData: Partial<ReadingFormData>;
    }) => {
      const { questions, ...readingData } = updateData;

      const result = await readingService.update(id, readingData);

      if (questions !== undefined) {
        await readingService.updateQuestions(id, questions);
      }

      return result;
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
