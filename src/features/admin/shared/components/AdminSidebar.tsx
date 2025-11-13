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
    emoji: "📊",
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    emoji: "👥",
  },
  {
    name: "Grammar Topics",
    href: "/admin/grammar",
    icon: BookText,
    emoji: "📚",
  },
  {
    name: "Reading Content",
    href: "/admin/reading",
    icon: BookOpen,
    emoji: "📖",
  },
  {
    name: "Listening Content",
    href: "/admin/listening",
    icon: Headphones,
    emoji: "🎧",
  },
  {
    name: "Premium Settings",
    href: "/admin/premium",
    icon: Crown,
    emoji: "👑",
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    emoji: "⚙️",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white/80 dark:bg-card/80 backdrop-blur-lg border-r border-gray-200/50 dark:border-gray-700/50 pt-16">
      <nav className="flex flex-col h-full px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-300",
                isActive
                  ? "bg-orange-50/80 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 shadow-[inset_0_2px_8px_rgba(249,115,22,0.15)]"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <span className="mr-3 text-xl">{item.emoji}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
