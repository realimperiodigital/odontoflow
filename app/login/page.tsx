"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/app/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowser(), []);
  const [email, setEmail] = useState("realimperiodigital@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setMsg("Erro no login: " + error.message);
      setLoading(false);
      return;
    }

    // força cookie/sessão a estabilizar e o server enxergar
    await supabase.auth.getSession();

    setMsg("Logado! Redirecionando...");

    router.push("/dashboard");
    router.refresh();
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#05060a] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-semibold">Login</h1>
        <p className="text-sm text-white/60 mt-1">Entre com seu usuário MASTER.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <div className="space-y-1">
            <label className="text-sm text-white/70">Email</label>
            <input
              className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-white/70">Senha</label>
            <input
              className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-white text-black font-semibold py-2 disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {msg && (
          <pre className="mt-4 text-xs whitespace-pre-wrap rounded-xl bg-black/40 border border-white/10 p-3">
            {msg}
          </pre>
        )}

        <div className="mt-4 text-xs text-white/50">
          Dica: se aparecer “Invalid login credentials”, a senha não bate com o usuário do Supabase Auth.
        </div>
      </div>
    </main>
  );
}
