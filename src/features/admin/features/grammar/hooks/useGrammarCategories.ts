import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { grammarCategoryService } from "@/features/grammar/services/grammarCategoryService";
import { CreateGrammarCategoryData, UpdateGrammarCategoryData } from "@/features/grammar/types/category.types";

export function useGrammarCategories() {
  return useQuery({
    queryKey: ["grammar-categories"],
    queryFn: async () => {
      return await grammarCategoryService.getAll();
    },
  });
}

export function useActiveGrammarCategories() {
  return useQuery({
    queryKey: ["grammar-categories", "active"],
    queryFn: async () => {
      return await grammarCategoryService.getAllActive();
    },
  });
}

export function useGrammarCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: ["grammar-category", slug],
    queryFn: async () => {
      return await grammarCategoryService.getBySlug(slug);
    },
    enabled: !!slug,
  });
}

export function useCreateGrammarCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateGrammarCategoryData) => {
      return await grammarCategoryService.createCategory(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grammar-categories"] });
      toast.success("Category created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create category");
    },
  });
}

export function useUpdateGrammarCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateGrammarCategoryData }) => {
      return await grammarCategoryService.updateCategory(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grammar-categories"] });
      toast.success("Category updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update category");
    },
  });
}

export function useDeleteGrammarCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await grammarCategoryService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grammar-categories"] });
      toast.success("Category deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete category");
    },
  });
}

export function useToggleGrammarCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return await grammarCategoryService.toggleActive(id, isActive);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grammar-categories"] });
      toast.success("Category status updated");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update category status");
    },
  });
}

export function useReorderGrammarCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categories: Array<{ id: string; order_index: number }>) => {
      return await grammarCategoryService.reorder(categories);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grammar-categories"] });
      toast.success("Categories reordered successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reorder categories");
    },
  });
}
