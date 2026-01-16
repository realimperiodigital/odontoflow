import { createBrowserClient } from "@supabase/ssr";

// Nome 1 (comum)
export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Nome 2 (pra garantir compatibilidade com outras partes do projeto)
export function createSupabaseBrowser() {
  return supabaseBrowser();
}
