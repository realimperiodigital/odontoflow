"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/app/lib/supabase/client";

export default function LoginPage() {
  const supabase = createSupabaseBrowser();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha
    });

    if (error) {
      setMsg("Email ou senha inválidos");
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  async function handleReset() {
    if (!email) {
      alert("Digite seu email");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/trocar-senha`
    });

    if (error) {
      alert("Erro ao enviar email de redefinição");
      return;
    }

    alert("Email de redefinição enviado. Verifique sua caixa de entrada.");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#05060a] text-white">
      <form onSubmit={handleLogin} className="bg-white/5 p-8 rounded-xl w-full max-w-md space-y-4">
        <h1 className="text-xl font-semibold">Entrar no OdontoFlow</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded bg-black/40 border border-white/10"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full p-3 rounded bg-black/40 border border-white/10"
          value={senha}
          onChange={e => setSenha(e.target.value)}
        />

        {msg && <p className="text-red-400 text-sm">{msg}</p>}

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-semibold"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="text-sm text-white/60 hover:text-white underline w-full text-center"
        >
          Esqueci minha senha
        </button>
      </form>
    </main>
  );
}
