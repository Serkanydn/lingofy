/**
 * User hooks
 * Following: docs/03-code-standards/01-design-patterns.md (Custom Hook Pattern)
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userService } from "../services";
import type { User, UpdateUserInput } from "../types";

/**
 * Hook to fetch all users
 */
export function useUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: userService.getAll,
  });
}

/**
 * Hook to fetch a single user by ID
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: ["admin-users", id],
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to update a user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserInput }) =>
      userService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user");
    },
  });
}
