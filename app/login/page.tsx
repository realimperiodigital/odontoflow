"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "../../lib/supabase/browser";

export default function LoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowser(), []);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // GARANTIA ABSOLUTA: quando a tela abrir, o email fica vazio SEMPRE
  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setError("Email ou senha inválidos.");
        setLoading(false);
        return;
      }

      // Troque o destino se você quiser outra rota
      router.replace("/master");
    } catch (err) {
      setError("Falha ao entrar. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#05060a] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="mt-1 text-sm text-white/60">Entre com email de sua clinica.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-2">Email</label>

            {/* Input CONTROLADO (React manda no valor) + nome único pra bloquear autofill */}
            <input
              key="odontoflow-email"
              type="email"
              inputMode="email"
              name="odontoflow_email_unique"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-2">Senha</label>

            {/* Mesmo truque pra senha */}
            <input
              key="odontoflow-pass"
              type="password"
              name="odontoflow_password_unique"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white outline-none focus:border-white/30"
            />
          </div>

          {error ? (
            <div className="text-sm text-red-400">{error}</div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-semibold py-3 rounded-xl disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
