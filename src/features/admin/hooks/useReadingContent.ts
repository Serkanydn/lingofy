import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ReadingText, ReadingQuestionInput } from "@/features/reading/types/service.types";
import { readingService } from "@/features/reading/services";

type CreateReadingData = Omit<ReadingText, "id" | "created_at"> & {
  questions?: ReadingQuestionInput[];
};

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
      const { questions, ...readingData } = insertData;
      const reading = await readingService.create(readingData);
      
      // If questions are provided, create them
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
      data,
      questions,
    }: {
      id: string;
      data: Partial<CreateReadingData>;
      questions?: ReadingQuestionInput[];
    }) => {
      const result = await readingService.update(id, data);
      
      // Update or create questions using reading_content id directly
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
