// lib/supabase/server.ts
import { createClient } from "@supabase/supabase-js";
import { ENV } from "@/lib/env";

export function createSupabaseServer() {
  return createClient(ENV.SUPABASE_URL(), ENV.SUPABASE_ANON(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
