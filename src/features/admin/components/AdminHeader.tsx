"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Home, LogOut } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function AdminHeader() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-card/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 h-16">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-[0_4px_14px_rgba(249,115,22,0.4)]">
            <span className="text-xl">🎓</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</span>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            onClick={() => router.push("/")}
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Site
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-300"
            onClick={() => logout()}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
