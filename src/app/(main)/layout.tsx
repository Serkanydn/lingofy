"use client";

import { Header } from "@/components/ui/header";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/shared/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useSettingsStore } from "@/features/admin/features/settings";
import { MaintenancePage } from "@/shared/components/MaintenancePage";
import { useEffect } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAdmin, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isMyWordsPage = pathname === "/my-words";
  const isMaintenanceMode = useSettingsStore((state) =>
    state.getIsMaintenanceMode()
  );
  const maintenanceMessage = useSettingsStore((state) =>
    state.getMaintenanceMessage()
  );
  const settingsLoading = useSettingsStore((state) => state.isLoading);

  // Redirect authenticated users from home page to reading page
  useEffect(() => {
    if (!isLoading && user && pathname === "/") {
      router.replace("/reading");
    }
  }, [isLoading, user, pathname, router]);

  if (isLoading || settingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg text-gray-600 dark:text-gray-400">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  // Show maintenance page for non-admin users
  if (isMaintenanceMode && !isAdmin) {
    return <MaintenancePage message={maintenanceMessage || undefined} />;
  }

  return (
    <div className="main-user-panel-layout bg-background-light">
      {!isMyWordsPage && <Header />}
      <main className="bg-white dark:bg-background"> {children}</main>
      {/* <div className="flex">
        <Sidebar />
      </div> */}
    </div>
  );
}
