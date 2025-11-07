"use client";

import { Header } from "@/components/ui/header";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useAuth();
  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1  lg:ml-64">{children}</main>
      </div>
    </div>
  );
}
