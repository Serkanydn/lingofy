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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Complete information about this user
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
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

          <Separator />

          {/* Premium Status */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Premium Status
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Status</Label>
                {user.is_premium ? (
                  <Badge className="bg-yellow-500">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                ) : (
                  <Badge variant="secondary">Free</Badge>
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

          <Separator />

          {/* Payment Info */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
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
