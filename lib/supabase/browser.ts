import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase env vars missing on browser");
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
