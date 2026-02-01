// lib/env.ts
// Este arquivo é usado tanto no server quanto no client.
// No CLIENT o Next só injeta env se o acesso for "fixo" (ex: process.env.NEXT_PUBLIC_...).
// Se você usar process.env[name] com name dinâmico, no browser vira undefined.

type EnvName =
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  | "SUPABASE_SERVICE_ROLE_KEY";

const isBrowser = typeof window !== "undefined";

// ✅ Acesso FIXO (o Next consegue injetar no bundle do browser)
const PUBLIC_ENV: Record<"NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY", string | undefined> = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

// ✅ Server-only
const SERVER_ENV: Record<"SUPABASE_SERVICE_ROLE_KEY", string | undefined> = {
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
};

export function requireEnv(name: EnvName): string {
  let v: string | undefined;

  if (name in PUBLIC_ENV) {
    v = PUBLIC_ENV[name as keyof typeof PUBLIC_ENV];
  } else {
    // SERVER ONLY
    v = SERVER_ENV[name as keyof typeof SERVER_ENV];
  }

  // No browser, NUNCA pode derrubar o site inteiro
  if (!v || !v.trim()) {
    if (isBrowser) {
      console.error(
        `Env faltando no client: ${name}. Verifique na Vercel (Project > Settings > Environment Variables) e faça um redeploy.`
      );
      return "";
    }

    // No server, pode falhar forte (é melhor mesmo)
    throw new Error(
      `Env faltando: ${name}. Confira na Vercel (Project > Settings > Environment Variables).`
    );
  }

  // Segurança: jamais deixar vazar service role no client
  if (isBrowser && name === "SUPABASE_SERVICE_ROLE_KEY") {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não pode ser acessada no client.");
  }

  return v.trim();
}

export const ENV = {
  // Public
  SUPABASE_URL: () => requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
  SUPABASE_ANON: () => requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),

  // Server only
  SUPABASE_SERVICE: () => requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
};
