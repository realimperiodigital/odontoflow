import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!url) throw new Error("SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL não configurado.");
if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurado.");

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
