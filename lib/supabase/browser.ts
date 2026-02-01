// lib/supabase/browser.ts
import { createClient } from "@supabase/supabase-js";
import { ENV } from "@/lib/env";

export function createSupabaseBrowser() {
  return createClient(ENV.SUPABASE_URL(), ENV.SUPABASE_ANON(), {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}
