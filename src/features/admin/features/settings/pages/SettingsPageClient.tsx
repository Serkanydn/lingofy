/**
 * SettingsPageClient component
 * Following:
 * - docs/02-architecture/01-feature-based-structure.md (Feature Structure)
 * - docs/03-code-standards/02-component-architecture.md (Component Architecture)
 */

'use client';

import { PageHeader, ContentCard } from '@/features/admin/shared/components';
import { SettingsForm } from '../components/SettingsForm';
import { useSettings, useUpdateSettings } from '../hooks/useSettings';
import type { UpdateSettingsFormData } from '../types/validation';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export function SettingsPageClient() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();

  const handleFormSubmit = async (data: UpdateSettingsFormData) => {
    await updateSettings.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <PageHeader
            icon={<span className="text-4xl">⚙️</span>}
            iconBgClass="bg-linear-to-br from-purple-400 to-purple-600 shadow-[0_4px_14px_rgba(168,85,247,0.4)]"
            title="Application Settings"
            description="Configure your application settings"
          />
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <PageHeader
          icon={<span className="text-4xl">⚙️</span>}
          iconBgClass="bg-linear-to-br from-purple-400 to-purple-600 shadow-[0_4px_14px_rgba(168,85,247,0.4)]"
          title="Application Settings"
          description="Configure your application settings"
        />

        {!settings && (
          <Card className="mb-6 rounded-3xl border-2 border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
                    No Settings Found
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Application settings have not been configured yet. Default values will be used when you save.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <ContentCard
          title="Configuration"
          description="Manage your application settings and preferences"
        >
          <SettingsForm
            onSubmit={handleFormSubmit}
            initialData={settings}
            isLoading={updateSettings.isPending}
          />
        </ContentCard>

        {/* Info Box */}
        <Card className="mt-6 rounded-3xl border-2 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <span>ℹ️</span> Important Information
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2 pl-6 list-disc">
                <li>Settings changes take effect immediately across the entire application</li>
                <li>Maintenance mode will prevent regular users from accessing the site</li>
                <li>Disabling new registrations will hide the registration page</li>
                <li>Free quiz limits apply to non-premium users only</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
