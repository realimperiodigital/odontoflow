"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Garantia extra: se algum lugar tentar setar email, a gente zera ao carregar
  useEffect(() => {
    setEmail("");
    setSenha("");
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: senha,
      });

      if (signInError) {
        setError("Email ou senha inválidos.");
        setLoading(false);
        return;
      }

      // força atualizar sessão/cookies e manda pro app
      router.replace("/app");
      router.refresh();
    } catch (err) {
      setError("Erro ao entrar. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#05060a] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="text-white/70 mt-1">Entre com seu usuário MASTER.</p>

        <form
          onSubmit={onSubmit}
          className="mt-6 space-y-4"
          autoComplete="off"
        >
          <div className="space-y-2">
            <label className="text-sm text-white/80">Email</label>
            <input
              type="email"
              inputMode="email"
              name="login_email_odonto"   // nome “diferente” para evitar preenchimento automático
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:border-white/30"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/80">Senha</label>
            <input
              type="password"
              name="login_password_odonto"
              autoComplete="new-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:border-white/30"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}

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
