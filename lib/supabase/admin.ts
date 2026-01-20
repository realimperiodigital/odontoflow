// lib/supabase/admin.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Faltou SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL no .env");
}

if (!serviceRoleKey) {
  throw new Error("Faltou SUPABASE_SERVICE_ROLE_KEY no .env");
}

// Client Admin (bypassa RLS) -> só use no servidor (API routes / server actions)
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});
