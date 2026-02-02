"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMsg(error.message);
      return;
    }

    // middleware vai redirecionar pra /app automaticamente
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <h1 className="text-xl font-semibold">Entrar na Clínica</h1>
        <p className="text-sm text-zinc-600 mt-1">
          Acesso para equipe da clínica
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-3">
          <input
            className="w-full border rounded-xl px-3 py-2"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            className="w-full border rounded-xl px-3 py-2"
            placeholder="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {msg ? (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              {msg}
            </div>
          ) : null}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-black text-white py-2 font-medium disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-4 text-sm text-zinc-600">
          Funcionários OdontoFlow?{" "}
          <a className="underline" href="/master">
            Entrar como master
          </a>
        </div>
      </div>
    </div>
  );
}
