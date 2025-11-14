"use client";

import { Header } from "@/components/ui/header";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { usePathname } from "next/navigation";
import { useSettingsStore } from "@/features/admin/features/settings";
import { MaintenancePage } from "@/shared/components/MaintenancePage";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAdmin } = useAuth();
  const pathname = usePathname();
  const isMyWordsPage = pathname === "/my-words";
  const isMaintenanceMode = useSettingsStore((state) => state.getIsMaintenanceMode());
  const maintenanceMessage = useSettingsStore((state) => state.getMaintenanceMessage());
  const settingsLoading = useSettingsStore((state) => state.isLoading);
  
  if (isLoading || settingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  // Show maintenance page for non-admin users
  if (isMaintenanceMode && !isAdmin) {
    return <MaintenancePage message={maintenanceMessage || undefined} />;
  }

  return (
    <div className="min-h-screen bg-background-light">
      {!isMyWordsPage && <Header />}
      <main>{children}</main>
      {/* <div className="flex">
        <Sidebar />
      </div> */}
    </div>
  );
}
