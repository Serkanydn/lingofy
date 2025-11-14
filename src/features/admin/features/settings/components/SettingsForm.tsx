/**
 * SettingsForm component
 * Following:
 * - docs/02-architecture/01-feature-based-structure.md (Feature Structure)
 * - docs/03-code-standards/02-component-architecture.md (Component Architecture)
 * - docs/03-code-standards/01-design-patterns.md (Form Pattern)
 * - docs/04-typescript/validation.md (Zod Validation)
 */

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updateSettingsSchema, type UpdateSettingsFormData } from "../types/validation";
import type { AppSettings } from "../types/settings.types";

interface SettingsFormProps {
  onSubmit: (data: UpdateSettingsFormData) => Promise<void>;
  initialData?: AppSettings | null;
  isLoading?: boolean;
}

export function SettingsForm({
  onSubmit,
  initialData,
  isLoading = false,
}: SettingsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<UpdateSettingsFormData>({
    resolver: zodResolver(updateSettingsSchema),
    defaultValues: initialData || {
      site_name: "Learn Quiz English",
      site_description: "Master English through interactive quizzes",
      contact_email: "contact@learnquiz.com",
      support_email: "support@learnquiz.com",
      max_free_quizzes_per_day: 5,
      enable_new_registrations: true,
      maintenance_mode: false,
      maintenance_message: null,
    },
  });

  const watchMaintenanceMode = watch("maintenance_mode");

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: UpdateSettingsFormData) => {
    await onSubmit(data);
  };

  const handleReset = () => {
    if (initialData) {
      reset(initialData);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* General Settings */}
      <Card className="rounded-3xl border-2 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/10 flex items-center justify-center">
              <span className="text-2xl">⚙️</span>
            </div>
            <div>
              <CardTitle className="text-xl">General Settings</CardTitle>
              <CardDescription>Configure basic site information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Site Name */}
          <div className="space-y-2">
            <Label htmlFor="siteName" className="text-sm font-semibold">
              Site Name
            </Label>
            <Input
              id="siteName"
              {...register("site_name")}
              placeholder="Learn Quiz English"
              className="rounded-2xl border-2 h-12"
            />
            {errors.site_name && (
              <p className="text-sm text-red-500 dark:text-red-400">
                {errors.site_name.message}
              </p>
            )}
          </div>

          {/* Site Description */}
          <div className="space-y-2">
            <Label htmlFor="siteDescription" className="text-sm font-semibold">
              Site Description
            </Label>
            <Textarea
              id="siteDescription"
              {...register("site_description")}
              placeholder="Master English through interactive quizzes"
              className="rounded-2xl border-2 min-h-[100px]"
            />
            {errors.site_description && (
              <p className="text-sm text-red-500 dark:text-red-400">
                {errors.site_description.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Settings */}
      <Card className="rounded-3xl border-2 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/10 flex items-center justify-center">
              <span className="text-2xl">📧</span>
            </div>
            <div>
              <CardTitle className="text-xl">Contact Settings</CardTitle>
              <CardDescription>Manage email addresses for contact</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Contact Email */}
          <div className="space-y-2">
            <Label htmlFor="contactEmail" className="text-sm font-semibold">
              Contact Email
            </Label>
            <Input
              id="contactEmail"
              type="email"
              {...register("contact_email")}
              placeholder="contact@learnquiz.com"
              className="rounded-2xl border-2 h-12"
            />
            {errors.contact_email && (
              <p className="text-sm text-red-500 dark:text-red-400">
                {errors.contact_email.message}
              </p>
            )}
          </div>

          {/* Support Email */}
          <div className="space-y-2">
            <Label htmlFor="supportEmail" className="text-sm font-semibold">
              Support Email
            </Label>
            <Input
              id="supportEmail"
              type="email"
              {...register("support_email")}
              placeholder="support@learnquiz.com"
              className="rounded-2xl border-2 h-12"
            />
            {errors.support_email && (
              <p className="text-sm text-red-500 dark:text-red-400">
                {errors.support_email.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Feature Settings */}
      <Card className="rounded-3xl border-2 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/10 flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <div>
              <CardTitle className="text-xl">Feature Settings</CardTitle>
              <CardDescription>Control application features and limits</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Max Free Quizzes */}
          <div className="space-y-2">
            <Label htmlFor="maxFreeQuizzes" className="text-sm font-semibold">
              Max Free Quizzes Per Day
            </Label>
            <Input
              id="maxFreeQuizzes"
              type="number"
              {...register("max_free_quizzes_per_day", { valueAsNumber: true })}
              placeholder="5"
              min="0"
              max="100"
              className="rounded-2xl border-2 h-12"
            />
            {errors.max_free_quizzes_per_day && (
              <p className="text-sm text-red-500 dark:text-red-400">
                {errors.max_free_quizzes_per_day.message}
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Number of quizzes free users can take per day
            </p>
          </div>

          {/* Enable Registrations */}
          <div className="flex items-center space-x-3 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border-2 border-blue-100 dark:border-blue-900/30">
            <input
              type="checkbox"
              id="enableRegistrations"
              {...register("enable_new_registrations")}
              className="h-5 w-5 rounded-lg border-2 border-blue-300 text-blue-500 focus:ring-blue-500"
            />
            <Label
              htmlFor="enableRegistrations"
              className="text-sm font-semibold text-blue-700 dark:text-blue-400 cursor-pointer"
            >
              ✅ Enable New Registrations
            </Label>
          </div>
          {errors.enable_new_registrations && (
            <p className="text-sm text-red-500 dark:text-red-400">
              {errors.enable_new_registrations.message}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Maintenance Mode */}
      <Card className="rounded-3xl border-2 border-orange-200 dark:border-orange-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/10 flex items-center justify-center">
              <span className="text-2xl">🔧</span>
            </div>
            <div>
              <CardTitle className="text-xl">Maintenance Mode</CardTitle>
              <CardDescription>Control site accessibility during maintenance</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Maintenance Toggle */}
          <div className="flex items-center space-x-3 p-4 rounded-2xl bg-orange-50/50 dark:bg-orange-900/10 border-2 border-orange-200 dark:border-orange-900/30">
            <input
              type="checkbox"
              id="maintenanceMode"
              {...register("maintenance_mode")}
              className="h-5 w-5 rounded-lg border-2 border-orange-300 text-orange-500 focus:ring-orange-500"
            />
            <Label
              htmlFor="maintenanceMode"
              className="text-sm font-semibold text-orange-700 dark:text-orange-400 cursor-pointer"
            >
              🚨 Enable Maintenance Mode
            </Label>
          </div>
          {errors.maintenance_mode && (
            <p className="text-sm text-red-500 dark:text-red-400">
              {errors.maintenance_mode.message}
            </p>
          )}

          {/* Maintenance Message */}
          {watchMaintenanceMode && (
            <div className="space-y-2 pl-4 border-l-4 border-orange-200 dark:border-orange-800">
              <Label htmlFor="maintenanceMessage" className="text-sm font-semibold">
                Maintenance Message
              </Label>
              <Textarea
                id="maintenanceMessage"
                {...register("maintenance_message")}
                placeholder="We're currently performing scheduled maintenance. We'll be back soon!"
                className="rounded-2xl border-2 min-h-[100px]"
              />
              {errors.maintenance_message && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {errors.maintenance_message.message}
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This message will be displayed to users during maintenance
              </p>
            </div>
          )}

          {/* Warning Message */}
          {watchMaintenanceMode && (
            <div className="p-4 rounded-2xl bg-red-50/50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-900/30">
              <p className="text-sm text-red-700 dark:text-red-400">
                <strong>Warning:</strong> Enabling maintenance mode will make the site inaccessible to regular users. Only admins will be able to access the site.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={isLoading || !isDirty}
          className="flex-1 rounded-2xl border-2 h-12"
        >
          Reset Changes
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !isDirty}
          className="flex-1 rounded-2xl h-12 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-[0_4px_14px_rgba(59,130,246,0.4)]"
        >
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}
