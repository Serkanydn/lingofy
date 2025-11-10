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
    <div className="min-h-screen bg-background-light">
      <Header />
      <main>{children}</main>
      {/* <div className="flex">
        <Sidebar />
      </div> */}
    </div>
  );
}
