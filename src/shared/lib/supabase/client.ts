import { Database } from "@/shared/types/model/database.types";
import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

// CLIENT-SIDE CRUD için
export const getSupabaseClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// AUTH için (cookies + redirect + session)

export const getSupabaseBrowserClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // cookieOptions: {
      //   name: "lingofy-auth-token",
      // },
    }
  );
};
