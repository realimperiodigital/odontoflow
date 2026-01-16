"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "../../lib/supabase/browser";

export default function TrocarSenhaPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!senha || senha.length < 8) {
      setMsg("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (senha !== confirmar) {
      setMsg("As senhas não conferem.");
      return;
    }

    setLoading(true);

    // 1) Troca a senha no Auth
    const { data: authData, error: authErr } = await supabase.auth.updateUser({
      password: senha,
    });

    if (authErr) {
      setLoading(false);
      setMsg(authErr.message || "Não consegui trocar a senha.");
      return;
    }

    const userId = authData.user?.id;
    if (!userId) {
      setLoading(false);
      setMsg("Sessão inválida. Faça login novamente.");
      return;
    }

    // 2) Destrava o usuário no profiles
    const { error: profErr } = await supabase
      .from("profiles")
      .update({
        must_change_password: false,
        password_changed_at: new Date().toISOString(),
      })
      .eq("id", userId);

    setLoading(false);

    if (profErr) {
      setMsg("Senha trocada, mas falhou ao liberar acesso. Me chame que eu ajusto.");
      return;
    }

    // 3) Vai pro painel
    router.replace("/app");
  }

  return (
    <main className="min-h-screen bg-[#05060a] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-semibold">Trocar senha</h1>
        <p className="mt-2 text-sm text-white/70">
          Por segurança, você precisa criar uma nova senha antes de usar o sistema.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-white/70">Nova senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="mt-1 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white outline-none"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Confirmar nova senha</label>
            <input
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              className="mt-1 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white outline-none"
              placeholder="Repita a senha"
            />
          </div>

          {msg && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {msg}
            </div>
          )}

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
