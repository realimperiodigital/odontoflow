// lib/supabase/admin.ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database/types";

function getEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Faltando variável de ambiente: ${name}`);
  return v;
}

const SUPABASE_URL = getEnv("NEXT_PUBLIC_SUPABASE_URL");
const SERVICE_ROLE_KEY = getEnv("SUPABASE_SERVICE_ROLE_KEY");

let _admin: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseAdmin() {
  if (_admin) return _admin;

  _admin = createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return _admin;
}

// Mantém compatível com seus imports atuais
export const supabaseAdmin = getSupabaseAdmin();
