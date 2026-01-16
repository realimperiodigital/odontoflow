// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("realimperiodigital@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const msg = searchParams.get("msg");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabaseBrowser.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        router.replace(`/login?msg=${encodeURIComponent(error.message)}`);
        return;
      }

      // Garantia extra: força o Next a revalidar a sessão
      router.replace("/app");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#05060a] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="mt-1 text-sm text-white/60">Entre com seu usuário MASTER.</p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-white/70">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-white outline-none"
              placeholder="seu@email.com"
              type="email"
              required
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Senha</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-white outline-none"
              placeholder="Sua senha"
              type="password"
              required
            />
          </div>

          {msg ? (
            <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-white/80">
              {msg}
            </div>
          ) : null}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-white text-black py-3 font-semibold disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
