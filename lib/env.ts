// lib/env.ts
export function requireEnv(name: string) {
  const v = process.env[name];
  if (!v || !v.trim()) {
    throw new Error(
      `Env faltando: ${name}. Confira na Vercel (Project > Settings > Environment Variables).`
    );
  }
  return v;
}

export const ENV = {
  SUPABASE_URL: () => requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
  SUPABASE_ANON: () => requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  SUPABASE_SERVICE: () => requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
};
