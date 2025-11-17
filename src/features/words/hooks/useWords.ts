import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wordsService } from "../services";
import { useAuth } from "@/features/auth/hooks/useAuth";

export interface UserWord {
  id: string;
  word: string;
  description: string;
  example_sentences: string[];
  source_type?: "reading" | "listening";
  source_id?: string;
  category_id?: string | null;
  created_at: string;
}

export interface WordCategory {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon?: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export function useUserWords(categoryId?: string | null) {
  return useQuery({
    queryKey: ["user-words", categoryId],
    queryFn: async () => {
      const words = await wordsService.getAll();

      // Filter by category if specified
      if (categoryId === undefined || categoryId === null) {
        return words;
      }

      if (categoryId === "uncategorized") {
        return words.filter((w: any) => !w.category_id);
      }

      return words.filter((w: any) => w.category_id === categoryId);
    },
  });
}

export function useAddWord() {
  const queryClient = useQueryClient();
  const user = useAuth().user!;

  return useMutation({
    mutationFn: async (word: Omit<UserWord, "id" | "created_at">) => {
      return wordsService.create({
        ...word,
        user_id: user.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-words"] });
      queryClient.invalidateQueries({ queryKey: ["statistics"] });
    },
  });
}

export function useDeleteWord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (wordId: string) => {
      await wordsService.delete(wordId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-words"] });
      queryClient.invalidateQueries({ queryKey: ["word-categories"] });
    },
  });
}

export function useUpdateWord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Omit<UserWord, "id" | "created_at" | "user_id">>;
    }) => {
      return wordsService.update(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-words"] });
      queryClient.invalidateQueries({ queryKey: ["statistics"] });
    },
  });
}

// Category hooks
export function useWordCategories() {
  const user = useAuth().user!;

  return useQuery({
    queryKey: ["word-categories"],
    queryFn: async () => {
      const { categoryService } = await import("../services/categoryService");
      return categoryService.getCategories(user.id);
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const user = useAuth().user!;

  return useMutation({
    mutationFn: async ({
      name,
      color,
      icon,
    }: {
      name: string;
      color: string;
      icon?: string;
    }) => {
      const { categoryService } = await import("../services/categoryService");
      return categoryService.createCategory(user.id, name, color, icon);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["word-categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const user = useAuth().user!;

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Pick<WordCategory, "name" | "color" | "icon">>;
    }) => {
      const { categoryService } = await import("../services/categoryService");
      return categoryService.updateCategory(id, user.id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["word-categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const user = useAuth().user!;

  return useMutation({
    mutationFn: async (categoryId: string) => {
      const { categoryService } = await import("../services/categoryService");
      return categoryService.deleteCategory(categoryId, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["word-categories"] });
      queryClient.invalidateQueries({ queryKey: ["user-words"] });
    },
  });
}

export function useDeleteCategoryCascade() {
  const queryClient = useQueryClient();
  const user = useAuth().user!;

  return useMutation({
    mutationFn: async (categoryId: string) => {
      const { categoryService } = await import("../services/categoryService");
      return categoryService.deleteCategoryCascade(categoryId, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["word-categories"] });
      queryClient.invalidateQueries({ queryKey: ["user-words"] });
    },
  });
}

export function useAssignWordToCategory() {
  const queryClient = useQueryClient();
  const user = useAuth().user!;

  return useMutation({
    mutationFn: async ({
      wordId,
      categoryId,
    }: {
      wordId: string;
      categoryId: string | null;
    }) => {
      const { categoryService } = await import("../services/categoryService");
      return categoryService.assignWordToCategory(user.id, wordId, categoryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-words"] });
      queryClient.invalidateQueries({ queryKey: ["word-categories"] });
    },
  });
}
