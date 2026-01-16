"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/app/lib/supabase/client";

export default function TrocarSenhaPage() {
  const supabase = createSupabaseBrowser();

  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    if (senha.length < 6) {
      setMsg("Senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (senha !== confirmar) {
      setMsg("As senhas não coincidem");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: senha });

    if (error) {
      setMsg("Erro ao alterar senha. Tente novamente pelo link do email.");
      return;
    }

    setOk(true);
    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#05060a] text-white">
      <form onSubmit={handleSalvar} className="bg-white/5 p-8 rounded-xl w-full max-w-md space-y-4">
        <h1 className="text-xl font-semibold">Criar nova senha</h1>

        <input
          type="password"
          placeholder="Nova senha"
          className="w-full p-3 rounded bg-black/40 border border-white/10"
          value={senha}
          onChange={e => setSenha(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirmar senha"
          className="w-full p-3 rounded bg-black/40 border border-white/10"
          value={confirmar}
          onChange={e => setConfirmar(e.target.value)}
        />

        {msg && <p className="text-red-400 text-sm">{msg}</p>}
        {ok && <p className="text-green-400 text-sm">Senha alterada com sucesso</p>}

        <button className="w-full bg-green-600 hover:bg-green-700 p-3 rounded font-semibold">
          Salvar nova senha
        </button>
      </form>
    </main>
  );
}
