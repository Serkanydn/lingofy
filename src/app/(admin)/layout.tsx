"use client";

import { AdminSidebar, AdminHeader } from "@/features/admin/shared/components";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, isLoading, isAuthenticated, profile, user } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    console.log("Admin Layout - Auth State:", {
      isLoading,
      isAuthenticated,
      isAdmin,
      hasUser: !!user,
      hasProfile: !!profile,
      profileIsAdmin: profile?.is_admin,
      hasRedirected: hasRedirected.current
    }); 
    console.log('isAdmin',isAdmin);

    // Only redirect once after loading is complete
    if (!isLoading && !hasRedirected.current) {
      if (!isAuthenticated) {
        console.log("Not authenticated, redirecting to login");
        hasRedirected.current = true;
        router.push("/login");
      } else if (!isAdmin) {
        console.log("Not admin, redirecting to home. Profile:", profile);
        hasRedirected.current = true;
        router.push("/");
      } else {
        console.log("Admin authenticated, staying on admin panel");
      }
    }
  }, [isAdmin, isLoading, isAuthenticated, profile, user, router]);

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
        <main className="flex-1 ml-64 pt-16">
          {children}
        </main>
      </div>
    </div>
  );
}
