"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Headphones,
  BookText,
  Crown,
  Settings,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Grammar Topics",
    href: "/admin/grammar",
    icon: BookText,
  },
  {
    name: "Reading Content",
    href: "/admin/reading",
    icon: BookOpen,
  },
  {
    name: "Listening Content",
    href: "/admin/listening",
    icon: Headphones,
  },
  {
    name: "Premium Settings",
    href: "/admin/premium",
    icon: Crown,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-card border-r pt-16">
      <nav className="flex flex-col h-full px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
