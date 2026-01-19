"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError("Email ou senha inválidos.");
      setLoading(false);
      return;
    }

    if (!data.session) {
      setError("Falha ao criar sessão.");
      setLoading(false);
      return;
    }

    router.replace("/app");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        <h1 className="text-xl font-semibold mb-1">Login</h1>
        <p className="text-sm text-white/60 mb-6">
          Entre com seu usuário MASTER.
        </p>

        <label className="text-sm">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seuemail@email.com"
          autoComplete="off"
          className="w-full mt-2 mb-4 px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none"
          required
        />

        <label className="text-sm">Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Sua senha"
          autoComplete="off"
          className="w-full mt-2 mb-4 px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none"
          required
        />

        {error && (
          <div className="text-red-400 text-sm mb-4">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black font-semibold py-3 rounded-xl"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
