import { Database } from "@/shared/types/database.types";
import { createBrowserClient } from "@supabase/ssr";

// Create a singleton instance for browser client
let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookieOptions: {
      name: 'lingofy-auth-token',
    },
  }
);

export const getSupabaseClient = () => {
  if (!browserClient) {
    browserClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookieOptions: {
          name: 'lingofy-auth-token',
        },
      }
    );
  }
  return browserClient;
};

export const getSupabaseServerClient = () => {
  return getSupabaseClient();
};
