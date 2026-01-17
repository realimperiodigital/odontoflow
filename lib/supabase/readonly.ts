// lib/supabase/readonly.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// export com O maiúsculo do jeito que você está importando:
export async function createSupabaseReadOnly() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // readonly: não grava cookies
      },
    },
  });
}

// (opcional) alias pra não dar dor de cabeça se algum lugar estiver diferente
export const createSupabaseReadonly = createSupabaseReadOnly;
