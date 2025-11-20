"use client";

import { AdminSidebar, AdminHeader } from "@/features/admin/shared/components";
import { useAuth } from "@/shared/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Only redirect once after loading is complete
    if (!isLoading && !hasRedirected.current) {
      if (!isAuthenticated) {
        hasRedirected.current = true;
        router.push("/login");
      } else if (!isAdmin) {
        hasRedirected.current = true;
        router.push("/");
      }
    }
  }, [isAdmin, isLoading, isAuthenticated, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  // Don't render admin content if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-background">
        <div className="text-lg text-gray-600 dark:text-gray-400">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-background dark:to-gray-900">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 pt-16 md:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}
