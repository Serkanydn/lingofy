"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useRouter } from "next/navigation";
import { Menu, Crown, LogOut, User, BarChart3 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/shared/lib/supabase/client";
import { PremiumBadge } from "@/features/premium/components/PremiumBadge";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function Navbar() {
  const router = useRouter();
  const { user, profile, isPremium } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-lg font-bold text-xl">
              L&Q
            </div>
            <span className="hidden sm:block font-semibold text-lg">
              Learn&Quiz English
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {!isPremium && (
            <Link href="/premium">
              <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600">
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
                        <PremiumBadge />
                      </div>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isPremium && (
                  <DropdownMenuItem onClick={() => router.push("/statistics")}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Statistics
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => router.push("/my-words")}>
                  <User className="mr-2 h-4 w-4" />
                  My Words
                </DropdownMenuItem>
                <DropdownMenuSeparator />
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
    </nav>
  );
}
