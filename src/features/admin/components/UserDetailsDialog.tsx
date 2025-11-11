"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Crown, Mail, Calendar, CreditCard, User } from "lucide-react";

interface UserDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  user: {
    id: string;
    email: string;
    full_name: string | null;
    is_premium: boolean;
    premium_expires_at: string | null;
    created_at: string;
    lemon_squeezy_customer_id: string | null;
    lemon_squeezy_subscription_id: string | null;
  } | null;
}

export function UserDetailsDialog({ open, onClose, user }: UserDetailsDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4 pb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-linear-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/10 flex items-center justify-center shadow-[0_4px_14px_rgba(59,130,246,0.4)]">
            <span className="text-4xl">👤</span>
          </div>
          <DialogTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">User Details</DialogTitle>
          <DialogDescription className="text-center text-gray-600 dark:text-gray-400">
            Complete information about this user
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4 p-5 rounded-2xl bg-gray-50/50 dark:bg-gray-900/20">
            <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900 dark:text-white">
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/10 flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{user.email}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Full Name</Label>
                <span className="font-medium">{user.full_name || "Not provided"}</span>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">User ID</Label>
                <span className="font-mono text-xs text-muted-foreground">{user.id}</span>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Joined</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-linear-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

          {/* Premium Status */}
          <div className="space-y-4 p-5 rounded-2xl bg-orange-50/50 dark:bg-orange-900/10">
            <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900 dark:text-white">
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/10 flex items-center justify-center">
                <Crown className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              Premium Status
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Status</Label>
                {user.is_premium ? (
                  <Badge className="rounded-full bg-linear-to-br from-orange-400 to-orange-600 text-white border-0 shadow-[0_4px_14px_rgba(249,115,22,0.3)]">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                ) : (
                  <Badge className="rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-0">Free</Badge>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Expires At</Label>
                <span className="font-medium">
                  {user.premium_expires_at
                    ? new Date(user.premium_expires_at).toLocaleDateString()
                    : "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="h-px bg-linear-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

          {/* Payment Info */}
          <div className="space-y-4 p-5 rounded-2xl bg-green-50/50 dark:bg-green-900/10">
            <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900 dark:text-white">
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/10 flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              Payment Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Customer ID</Label>
                <span className="font-mono text-xs text-muted-foreground">
                  {user.lemon_squeezy_customer_id || "Not available"}
                </span>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Subscription ID</Label>
                <span className="font-mono text-xs text-muted-foreground">
                  {user.lemon_squeezy_subscription_id || "Not available"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
