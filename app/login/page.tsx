"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "../../lib/supabase/browser";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("realimperiodigital@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const supabase = createSupabaseBrowser();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMsg(`Erro: ${error.message}`);
      setLoading(false);
      return;
    }

    router.replace("/app");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#05060a] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="text-white/60 mt-1">Entre com seu usuário MASTER.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-white/70">Email</label>
            <input
              className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Senha</label>
            <input
              className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Sua senha"
              autoComplete="current-password"
            />
          </div>

          <button
            disabled={loading}
            className="w-full h-12 rounded-xl bg-white text-black font-semibold disabled:opacity-60"
            type="submit"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {msg ? (
            <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-white/80">
              {msg}
            </div>
          ) : null}
        </form>
      </div>
    </main>
  );
}
