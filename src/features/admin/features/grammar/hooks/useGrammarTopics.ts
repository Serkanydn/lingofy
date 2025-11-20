import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { GrammarTopic } from "@/shared/types/model/grammarTopic.types";
import { grammarService } from "@/shared/services/supabase/grammarService";

type CreateGrammarTopicData = Omit<
  GrammarTopic,
  "id" | "created_at" | "updated_at"
>;

export function useGrammarTopics() {
  return useQuery({
    queryKey: ["admin-grammar-topics"],
    queryFn: async () => {
      return await grammarService.getAll();
    },
  });
}

export function useCreateGrammarTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (insertData: CreateGrammarTopicData) => {
      return await grammarService.create(insertData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-grammar-topics"] });
      toast.success("Grammar topic created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create grammar topic");
    },
  });
}

export function useUpdateGrammarTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateGrammarTopicData>;
    }) => {
      return await grammarService.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-grammar-topics"] });
      toast.success("Grammar topic updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update grammar topic");
    },
  });
}

export function useDeleteGrammarTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await grammarService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-grammar-topics"] });
      toast.success("Grammar topic deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete grammar topic");
    },
  });
}
