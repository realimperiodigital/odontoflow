"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "../../lib/supabase/browser";

export default function MasterGateClient() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // ✅ Regra do Master: SEMPRE pedir senha
  useEffect(() => {
    (async () => {
      await supabase.auth.signOut(); // força deslogar sempre que abrir /master
      setReady(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      setLoading(false);
      setMsg("Email ou senha inválidos.");
      return;
    }

    // ✅ Confere se é master de verdade
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profile?.role !== "master") {
      await supabase.auth.signOut();
      setLoading(false);
      setMsg("Acesso negado. Área exclusiva para funcionários OdontoFlow.");
      return;
    }

    setLoading(false);
    router.replace("/master/painel");
  }

  if (!ready) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#07080c", color: "white" }}>
        <p>Carregando...</p>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#07080c", color: "white" }}>
      <div
        style={{
          width: 420,
          padding: 28,
          borderRadius: 16,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.10)",
          color: "white",
        }}
      >
        <h1 style={{ fontSize: 26, marginBottom: 6 }}>Login Master</h1>
        <p style={{ opacity: 0.75, marginBottom: 18 }}>
          Área exclusiva para funcionários OdontoFlow.
        </p>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
          <div>
            <label style={{ fontSize: 13, opacity: 0.8 }}>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email master"
              type="email"
              required
              style={{
                width: "100%",
                marginTop: 6,
                padding: 12,
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(0,0,0,0.35)",
                color: "white",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 13, opacity: 0.8 }}>Senha</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              type="password"
              required
              style={{
                width: "100%",
                marginTop: 6,
                padding: 12,
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(0,0,0,0.35)",
                color: "white",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ marginTop: 8, padding: "12px 14px", borderRadius: 12, cursor: "pointer" }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {msg ? <p style={{ marginTop: 10 }}>{msg}</p> : null}
        </form>
      </div>
    </main>
  );
}
