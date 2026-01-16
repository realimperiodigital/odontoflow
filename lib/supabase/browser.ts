// lib/supabase/browser.ts
import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!url || !anon) {
    throw new Error("Faltam NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local");
  }

  return createBrowserClient(url, anon);
}

// Compatibilidade com imports antigos
export const supabaseBrowser = createSupabaseBrowser();
