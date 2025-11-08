"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Home, LogOut } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function AdminHeader() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b h-16">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{user?.email}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Site
          </Button>
          <Button
            variant="outline"
            size="sm"
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
