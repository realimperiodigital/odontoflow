"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "../../lib/supabase/browser";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const [email, setEmail] = useState("realimperiodigital@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setLoading(false);
      setMsg(`Erro: ${error.message}`);
      return;
    }

    // Se logou mesmo, data.session vem preenchido
    if (!data.session) {
      setLoading(false);
      setMsg("Erro: sessão não foi criada. Verifique as chaves do Supabase na Vercel.");
      return;
    }

    setMsg("Logado! Indo para o painel...");
    router.replace("/app");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#05060a] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="mt-1 text-sm text-white/70">Entre com seu usuário MASTER.</p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-white/70">Email</label>
            <input
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Senha</label>
            <input
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-white text-black py-3 font-semibold disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {msg && (
            <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm">
              {msg}
            </div>
          )}

          <p className="text-xs text-white/50">
            Se der &quot;Invalid login credentials&quot;, a senha ou o email não batem no Supabase Auth.
          </p>
        </form>
      </div>
    </main>
  );
}
