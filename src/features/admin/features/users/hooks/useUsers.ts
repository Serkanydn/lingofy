import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/shared/lib/supabase/client";

interface User {
  id: string;
  email: string;
  full_name: string | null;
  is_premium: boolean;
  premium_expires_at: string | null;
  created_at: string;
  lemon_squeezy_customer_id: string | null;
  lemon_squeezy_subscription_id: string | null;
}

export function useUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async (): Promise<User[]> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
}
