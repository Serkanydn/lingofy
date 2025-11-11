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
  Moon,
  Sun,
  Home,
} from "lucide-react";
import { Badge } from "./badge";
import { cn } from "@/shared/lib/utils";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function Header() {
  const router = useRouter();
  const { user, profile, isPremium, isAdmin } = useAuth();
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const mainMenuItems = [
    { href: "/", name: "Home", icon: Home },
    { href: "/reading", name: "Reading Hub", icon: BookOpen },
    { href: "/listening", name: "Listening Hub", icon: Headphones },
    { href: "/grammar", name: "Grammar", icon: GraduationCap },
    { href: "/my-words", name: "Vocabulary", icon: Book },
    ...(!isPremium ? [{ href: "/premium", name: "Premium", icon: Crown }] : []),
  ];

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full py-4  bg-white dark:bg-background">
      <div className="container mx-auto px-4">
        <div
          className="flex h-14 items-center justify-between  rounded-[20px] px-6  clay-shadow
        "
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="bg-linear-to-br from-orange-400 to-orange-600 text-white p-2.5 rounded-2xl shadow-[0_4px_14px_rgba(249,115,22,0.4)] group-hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <span className="font-bold text-[17px] text-gray-900 dark:text-white">
              Learn&Quiz English
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {mainMenuItems.map((item) => {
              const isActive = isActiveLink(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center relative px-5 py-2 text-[15px] font-medium rounded-2xl transition-all duration-300",
                    isActive
                      ? "text-orange-600 dark:text-orange-500 bg-orange-50/80 dark:bg-orange-500/10 shadow-[inset_0_2px_8px_rgba(249,115,22,0.15)]"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="relative w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 clay-shadow-inset"
            >
              {isDarkMode ? (
                <Sun className="h-[18px] w-[18px] text-orange-500" />
              ) : (
                <Moon className="h-[18px] w-[18px] text-gray-600" />
              )}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 p-0 transition-all duration-300"
                  >
                    <Avatar className="h-9 w-9 ring-2 ring-orange-100 dark:ring-orange-900/30 shadow-md">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-linear-to-br from-orange-400 to-orange-500 text-white text-sm">
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
                            className="bg-linear-to-r from-yellow-400 to-orange-500 text-white border-0"
                          >
                            <Crown className="mr-1 h-3 w-3" />
                            Premium
                          </Badge>
                        </div>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

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

                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-3">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="rounded-2xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
