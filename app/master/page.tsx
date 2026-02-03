"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

type Role = "master" | "clinic_admin" | "reception" | "dentist" | string;

export default function MasterPage() {
  const router = useRouter();

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    return createClient(url, anon);
  }, []);

  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  const [userEmail, setUserEmail] = useState<string>("");
  const [role, setRole] = useState<Role | null>(null);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [msg, setMsg] = useState<string>("");

  // Checa sessão e role
  async function refreshSession() {
    setLoading(true);
    setMsg("");

    const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
    if (sessionErr) {
      setLoading(false);
      setRole(null);
      setUserEmail("");
      setMsg("Erro ao verificar sessão.");
      return;
    }

    const session = sessionData.session;
    if (!session?.user) {
      setLoading(false);
      setRole(null);
      setUserEmail("");
      return;
    }

    setUserEmail(session.user.email ?? "");

    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .maybeSingle();

    if (profileErr) {
      setLoading(false);
      setRole(null);
      setMsg("Logado, mas não consegui ler seu perfil (role).");
      return;
    }

    setRole((profile?.role ?? null) as Role | null);
    setLoading(false);
  }

  useEffect(() => {
    refreshSession();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      // sempre que logar/deslogar, atualiza
      refreshSession();
    });

    return () => {
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setAuthLoading(true);

    const em = email.trim().toLowerCase();
    const pw = senha.trim();

    if (!em || !pw) {
      setAuthLoading(false);
      setMsg("Preencha email e senha.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: em,
      password: pw,
    });

    if (error) {
      setAuthLoading(false);
      setMsg(error.message || "Falha no login.");
      return;
    }

    setAuthLoading(false);

    // O middleware já vai manter master em /master.
    // Ainda assim, reforço:
    router.replace("/master");
  }

  async function onLogout() {
    setMsg("");
    await supabase.auth.signOut();
    router.replace("/login");
  }

  // Proteção visual: se logou mas não é master, avisa (o middleware deve barrar, mas aqui fica claro)
  const isMaster = role === "master";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 shadow-sm p-6">
        <h1 className="text-xl font-semibold">Área Master</h1>
        <p className="text-sm text-zinc-600 mt-1">Sempre pede login para acessar</p>

        {msg ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {msg}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-6 text-sm text-zinc-600">Carregando...</div>
        ) : role && userEmail ? (
          // ✅ MODO LOGADO
          <div className="mt-6">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="text-sm text-zinc-700">
                Logado como: <b>{userEmail}</b>
              </div>
              <div className="text-sm text-zinc-700 mt-1">
                Role: <b>{String(role)}</b>
              </div>
            </div>

            {!isMaster ? (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                Você está logado, mas seu perfil não é master. Vou te mandar pro login da clínica.
                <div className="mt-3">
                  <button
                    onClick={() => router.replace("/login")}
                    className="w-full rounded-xl bg-black text-white py-3 text-sm font-medium"
                  >
                    Ir para /login
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mt-4 grid gap-3">
                  <button
                    onClick={() => router.replace("/master")}
                    className="w-full rounded-xl bg-black text-white py-3 text-sm font-medium"
                  >
                    Já estou no Master ✅
                  </button>

                  <button
                    onClick={onLogout}
                    className="w-full rounded-xl border border-zinc-300 bg-white py-3 text-sm font-medium"
                  >
                    Sair
                  </button>
                </div>

                <div className="mt-6 rounded-xl border border-zinc-200 p-4">
                  <p className="text-sm font-semibold">Próximo passo</p>
                  <p className="text-sm text-zinc-600 mt-1">
                    Agora a gente liga o botão de <b>cadastrar clínica</b> usando a rota
                    <b> /api/master/clinics/create-with-admin</b>.
                  </p>
                </div>
              </>
            )}
          </div>
        ) : (
          // ✅ MODO DESLOGADO
          <form onSubmit={onLogin} className="mt-6 space-y-3">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail master"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
              autoComplete="email"
            />

            <input
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Senha"
              type="password"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
              autoComplete="current-password"
            />

            <button
              type="submit"
              disabled={authLoading}
              className="w-full rounded-xl bg-black text-white py-3 text-sm font-medium disabled:opacity-60"
            >
              {authLoading ? "Entrando..." : "Entrar como Master"}
            </button>

            <button
              type="button"
              onClick={() => router.replace("/login")}
              className="w-full rounded-xl border border-zinc-300 bg-white py-3 text-sm font-medium"
            >
              Voltar para login da clínica
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
