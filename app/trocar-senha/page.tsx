"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TrocarSenhaPage() {
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (senha.length < 8) return setMsg("A senha precisa ter pelo menos 8 caracteres.");
    if (senha !== confirmar) return setMsg("As senhas não conferem.");

    setLoading(true);

    try {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;

      if (!user) {
        setMsg("Você precisa estar logado.");
        return;
      }

      const { error: passErr } = await supabase.auth.updateUser({ password: senha });
      if (passErr) {
        setMsg(passErr.message);
        return;
      }

      const { error: profErr } = await supabase
        .from("profiles")
        .update({ must_change_password: false })
        .eq("user_id", user.id);

      if (profErr) {
        setMsg("Senha trocada, mas falhou atualizar seu perfil. Me avise.");
        return;
      }

      window.location.href = "/dashboard";
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#05060a] text-white px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-semibold">Trocar senha</h1>
        <p className="text-sm text-white/70 mt-2">
          Por segurança, você precisa criar uma nova senha antes de usar o sistema.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none"
            placeholder="Nova senha (mín. 8 caracteres)"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <input
            className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none"
            placeholder="Confirmar nova senha"
            type="password"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
          />

          {msg && <div className="text-sm text-red-300">{msg}</div>}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-white text-black font-semibold py-3 disabled:opacity-60"
          >
            {loading ? "Salvando..." : "Salvar nova senha"}
          </button>
        </form>
      </div>
    </main>
  );
}
