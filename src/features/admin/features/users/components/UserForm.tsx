/**
 * UserForm component
 * Following:
 * - docs/02-architecture/01-feature-based-structure.md (Feature Structure)
 * - docs/03-code-standards/02-component-architecture.md (Component Architecture)
 * - docs/03-code-standards/01-design-patterns.md (Form Pattern)
 * - docs/04-typescript/validation.md (Zod Validation)
 */

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { updateUserSchema, type UpdateUserFormData } from "../types/validation";

interface UserFormProps {
  isOpen: boolean;
  onToggle: () => void;
  onSubmit: (data: UpdateUserFormData) => Promise<void>;
  initialData?: Partial<UpdateUserFormData>;
  isLoading?: boolean;
  mode: "edit";
  userEmail?: string;
}

export function UserForm({
  isOpen,
  onToggle,
  onSubmit,
  initialData,
  isLoading = false,
  mode = "edit",
  userEmail = "",
}: UserFormProps) {
  const [isPremium, setIsPremium] = useState(initialData?.is_premium || false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: initialData,
  });

  // Watch is_premium field
  const watchIsPremium = watch("is_premium");

  useEffect(() => {
    setIsPremium(watchIsPremium || false);
    
    // Clear expiration date when unchecking premium
    if (!watchIsPremium) {
      setValue("premium_expires_at", null);
    }
  }, [watchIsPremium, setValue]);

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      setIsPremium(initialData.is_premium || false);
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: UpdateUserFormData) => {
    await onSubmit(data);
  };

  const handleReset = () => {
    if (initialData) {
      reset(initialData);
      setIsPremium(initialData.is_premium || false);
    }
    onToggle();
  };

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  return (
    <Card className="mb-6 rounded-3xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300">
      {/* Header - Always Visible */}
      <div
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/10 flex items-center justify-center shadow-[0_4px_14px_rgba(59,130,246,0.4)]">
            <span className="text-2xl">✏️</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {mode === "edit" ? "Edit User" : "Create User"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {userEmail || "Update user information"}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-xl">
          {isOpen ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Form Content - Collapsible */}
      {isOpen && (
        <CardContent className="pt-0 pb-6 border-t border-gray-200 dark:border-gray-800">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 mt-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-semibold">
                Full Name
              </Label>
              <Input
                id="fullName"
                {...register("full_name")}
                placeholder="Enter full name"
                className="rounded-2xl border-2 h-12"
              />
              {errors.full_name && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            {/* Premium Status */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-900/10 border-2 border-amber-100 dark:border-amber-900/30">
                <input
                  type="checkbox"
                  id="isPremium"
                  {...register("is_premium")}
                  className="h-5 w-5 rounded-lg border-2 border-amber-300 text-amber-500 focus:ring-amber-500"
                />
                <Label
                  htmlFor="isPremium"
                  className="text-sm font-semibold text-amber-700 dark:text-amber-400 cursor-pointer"
                >
                  ⭐ Premium User
                </Label>
              </div>
              {errors.is_premium && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {errors.is_premium.message}
                </p>
              )}

              {/* Premium Expiration Date - Only show if premium is checked */}
              {isPremium && (
                <div className="space-y-2 pl-4 border-l-4 border-amber-200 dark:border-amber-800">
                  <Label htmlFor="premiumExpires" className="text-sm font-semibold">
                    Premium Expiration Date
                  </Label>
                  <Input
                    id="premiumExpires"
                    type="date"
                    {...register("premium_expires_at", {
                      setValueAs: (value) => {
                        if (!value) return null;
                        try {
                          return new Date(value).toISOString();
                        } catch {
                          return null;
                        }
                      },
                    })}
                    defaultValue={formatDateForInput(initialData?.premium_expires_at || null)}
                    className="rounded-2xl border-2 h-12"
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {errors.premium_expires_at && (
                    <p className="text-sm text-red-500 dark:text-red-400">
                      {errors.premium_expires_at.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Set when the premium subscription expires
                  </p>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border-2 border-blue-100 dark:border-blue-900/30">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                <strong>Note:</strong> Changing premium status will affect the user's access to premium features immediately.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isLoading}
                className="flex-1 rounded-2xl border-2 h-12"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 rounded-2xl h-12 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-[0_4px_14px_rgba(59,130,246,0.4)]"
              >
                {isLoading ? "Saving..." : "Update User"}
              </Button>
            </div>
          </form>
        </CardContent>
      )}
    </Card>
  );
}
