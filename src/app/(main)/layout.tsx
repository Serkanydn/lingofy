"use client";

import { Header } from "@/components/ui/header";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useAuth();
  const pathname = usePathname();
  const isMyWordsPage = pathname === "/my-words";
  
  if (isLoading) {
    return null;
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
