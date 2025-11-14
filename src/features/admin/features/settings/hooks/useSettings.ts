/**
 * Settings hooks
 * Following: docs/03-code-standards/01-design-patterns.md (Custom Hook Pattern)
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { settingsService } from "../services/settingsService";
import type { UpdateSettingsInput } from "../types/settings.types";

/**
 * Hook to fetch application settings
 */
export function useSettings() {
  return useQuery({
    queryKey: ["app-settings"],
    queryFn: settingsService.get,
  });
}

/**
 * Hook to update application settings
 */
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSettingsInput) => settingsService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app-settings"] });
      toast.success("Settings updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update settings");
    },
  });
}
