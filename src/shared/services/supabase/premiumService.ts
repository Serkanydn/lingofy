import { BaseService } from "@/shared/services/supabase/baseService";

interface Subscription {
  id: number;
  user_id: string;
  plan_id: string;
  status: "active" | "cancelled" | "expired";
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

class PremiumService extends BaseService<Subscription> {
  constructor() {
    super("subscriptions");
  }

  async getUserSubscription(userId: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    if (error) throw error;
    return data as Subscription;
  }

  async checkPremiumAccess(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId);
      return !!subscription && new Date(subscription.end_date) > new Date();
    } catch {
      return false;
    }
  }

  async cancelSubscription(subscriptionId: number) {
    return this.update(subscriptionId, { status: "cancelled" });
  }

  async getSubscriptionHistory(userId: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Subscription[];
  }
}

export const premiumService = new PremiumService();
