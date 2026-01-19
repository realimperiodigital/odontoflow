"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email ou senha inválidos");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#05060a] text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white/5 p-8 rounded-xl border border-white/10"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Entrar no OdontoFlow
        </h1>

        {error && (
          <div className="mb-4 text-sm text-red-400 text-center">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-3 px-4 py-3 rounded-lg bg-black/40 border border-white/10 outline-none"
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-4 px-4 py-3 rounded-lg bg-black/40 border border-white/10 outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-white text-black px-4 py-3 font-semibold hover:bg-white/90 transition"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/")}
          className="w-full mt-3 rounded-xl border border-white/20 px-4 py-3 text-sm hover:bg-white/5"
        >
          Voltar
        </button>
      </form>
    </main>
  );
}
