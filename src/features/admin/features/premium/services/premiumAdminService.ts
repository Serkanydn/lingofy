/**
 * Premium Subscription Service - Admin
 * Following: docs/02-architecture/01-feature-based-structure.md
 */

import { BaseService } from "@/shared/services/supabase/baseService";
import type { PremiumSubscription, UpdatePremiumInput } from "../types";

class PremiumAdminService extends BaseService {
  constructor() {
    super("profiles");
  }
  /**
   * Get all premium subscriptions
   */
  async getAllSubscriptions(): Promise<PremiumSubscription[]> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((profile: any) => ({
      id: profile.id,
      user_id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      is_premium: profile.is_premium,
      premium_expires_at: profile.premium_expires_at,
      lemon_squeezy_customer_id: profile.lemon_squeezy_customer_id,
      lemon_squeezy_subscription_id: profile.lemon_squeezy_subscription_id,
      subscription_status: this.getSubscriptionStatus(
        profile.is_premium,
        profile.premium_expires_at
      ),
      created_at: profile.created_at,
    }));
  }

  /**
   * Get subscription by user ID
   */
  async getSubscriptionById(userId: string): Promise<PremiumSubscription> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;

    const profile = data as any;
    return {
      id: profile.id,
      user_id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      is_premium: profile.is_premium,
      premium_expires_at: profile.premium_expires_at,
      lemon_squeezy_customer_id: profile.lemon_squeezy_customer_id,
      lemon_squeezy_subscription_id: profile.lemon_squeezy_subscription_id,
      subscription_status: this.getSubscriptionStatus(
        profile.is_premium,
        profile.premium_expires_at
      ),
      created_at: profile.created_at,
    };
  }

  /**
   * Update subscription status
   */
  async updateSubscription(
    userId: string,
    input: UpdatePremiumInput
  ): Promise<PremiumSubscription> {
    const { data, error } = await this.supabase
      .from("profiles")
      // @ts-ignore - Supabase types issue with update
      .update({
        is_premium: input.is_premium,
        premium_expires_at: input.premium_expires_at,
        updated_at: new Date().toISOString(),
      } as any)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    const profile = data as any;
    return {
      id: profile.id,
      user_id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      is_premium: profile.is_premium,
      premium_expires_at: profile.premium_expires_at,
      lemon_squeezy_customer_id: profile.lemon_squeezy_customer_id,
      lemon_squeezy_subscription_id: profile.lemon_squeezy_subscription_id,
      subscription_status: this.getSubscriptionStatus(
        profile.is_premium,
        profile.premium_expires_at
      ),
      created_at: profile.created_at,
    };
  }

  /**
   * Cancel subscription (set premium to false)
   */
  async cancelSubscription(userId: string): Promise<PremiumSubscription> {
    return this.updateSubscription(userId, {
      is_premium: false,
      premium_expires_at: null,
    });
  }

  /**
   * Extend subscription
   */
  async extendSubscription(
    userId: string,
    expirationDate: string
  ): Promise<PremiumSubscription> {
    return this.updateSubscription(userId, {
      is_premium: true,
      premium_expires_at: expirationDate,
    });
  }

  /**
   * Get premium statistics
   */
  async getStats() {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("is_premium, premium_expires_at");

    if (error) throw error;

    const now = new Date();
    const activeSubscribers = data.filter(
      (profile: any) =>
        profile.is_premium &&
        (!profile.premium_expires_at ||
          new Date(profile.premium_expires_at) > now)
    ).length;

    const expiredSubscribers = data.filter(
      (profile: any) =>
        profile.is_premium &&
        profile.premium_expires_at &&
        new Date(profile.premium_expires_at) <= now
    ).length;

    return {
      totalSubscribers: data.filter((p: any) => p.is_premium).length,
      activeSubscribers,
      expiredSubscribers,
      monthlyRevenue: 0, // TODO: Integrate with LemonSqueezy API
      totalRevenue: 0, // TODO: Integrate with LemonSqueezy API
    };
  }

  /**
   * Determine subscription status
   */
  private getSubscriptionStatus(
    isPremium: boolean,
    expiresAt: string | null
  ): "active" | "expired" | "cancelled" | "none" {
    if (!isPremium) return "none";

    if (!expiresAt) return "active";

    const now = new Date();
    const expirationDate = new Date(expiresAt);

    if (expirationDate > now) return "active";
    if (expirationDate <= now) return "expired";

    return "cancelled";
  }
}

export const premiumAdminService = new PremiumAdminService();
