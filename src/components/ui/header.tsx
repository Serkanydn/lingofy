"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./button";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { supabase } from "@/shared/lib/supabase/client";
import {
  Crown,
  LogOut,
  User,
  BookOpen,
  Headphones,
  GraduationCap,
  Book,
  BarChart3,
  Settings,
  Shield,
} from "lucide-react";
import { Badge } from "./badge";
import { cn } from "@/shared/lib/utils";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function Header() {
  const router = useRouter();
  const { user, profile, isPremium, isAdmin } = useAuth();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const mainMenuItems = [
    { href: "/reading", name: "Reading", icon: BookOpen },
    { href: "/listening", name: "Listening", icon: Headphones },
    { href: "/grammar", name: "Grammar", icon: GraduationCap },
    { href: "/my-words", name: "My Words", icon: Book, requiresAuth: true },

    {
      name: "Statistics",
      href: "/statistics",
      icon: BarChart3,
      requiresPremium: true,
    },
    {
      name: "Premium",
      href: "/premium",
      icon: Crown,
      hideWhenPremium: true,
    },
  ];
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-lg font-bold text-xl">
              L&Q
            </div>
            <span className="hidden sm:inline-block font-semibold text-lg">
              Learn&Quiz English
            </span>
          </Link>

          {/* <nav className="hidden md:flex items-center gap-6">
            {mainMenuItems.map((item) => {
              // Hide if requires auth and user not logged in
              if (item.requiresAuth && !user) return null;

              // Hide if requires premium and user not premium
              if (item.requiresPremium && !isPremium) return null;

              // Hide premium link if user is already premium
              if (item.hideWhenPremium && isPremium) return null;

              const isActive =
                pathname === item.href || pathname?.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </nav> */}
        </div>

        <div className="flex items-center gap-4">
          {!isPremium && (
            <Link href="/premium/upgrade">
              <Button
                variant="default"
                className="bg-linear-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
              >
                <Crown className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Upgrade to Premium</span>
                <span className="sm:hidden">Premium</span>
              </Button>
            </Link>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar>
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      {profile?.full_name?.charAt(0).toUpperCase() ||
                        user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile?.full_name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    {isPremium && (
                      <div className="pt-1">
                        <Badge
                          variant="secondary"
                          className="bg-linear-to-r from-yellow-400 to-orange-500 text-white"
                        >
                          <Crown className="mr-1 h-3 w-3" />
                          Premium
                        </Badge>
                      </div>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Navigation Items */}
                {isAdmin && (
                  <>
                    <DropdownMenuItem onClick={() => router.push("/admin")}>
                      <Shield className="mr-2 h-4 w-4 text-blue-500" />
                      Admin Panel
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/my-words")}>
                  <Book className="mr-2 h-4 w-4" />
                  My Words
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/statistics")}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Statistics
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Premium Status */}
                {!isPremium && (
                  <>
                    <DropdownMenuItem
                      onClick={() => router.push("/premium/upgrade")}
                    >
                      <Crown className="mr-2 h-4 w-4 text-yellow-500" />
                      Upgrade to Premium
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}

                {/* Logout */}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
