// lib/supabase/admin.ts
import { createClient } from "@supabase/supabase-js";
import { ENV } from "@/lib/env";

let _admin: ReturnType<typeof createClient> | null = null;

export function getSupabaseAdmin() {
  if (_admin) return _admin;

  _admin = createClient(ENV.SUPABASE_URL(), ENV.SUPABASE_SERVICE(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return _admin;
}

export const supabaseAdmin = getSupabaseAdmin();
