/**
 * Maintenance Page Component
 * Following: docs/03-code-standards/02-component-architecture.md
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

interface MaintenancePageProps {
  message?: string;
}

export function MaintenancePage({ message }: MaintenancePageProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-background dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full rounded-3xl border-2 border-orange-200 dark:border-orange-800">
        <CardHeader>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/10 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <CardTitle className="text-3xl">We'll Be Right Back!</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 rounded-2xl bg-orange-50/50 dark:bg-orange-900/10 border-2 border-orange-100 dark:border-orange-900/30">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {message || "We're currently performing scheduled maintenance to improve your experience. We'll be back online shortly. Thank you for your patience!"}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <div className="w-3 h-3 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              If you're an administrator, you can still access the admin panel
            </p>
            <Link href="/admin">
              <Button variant="outline" className="rounded-2xl">
                Go to Admin Panel
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
