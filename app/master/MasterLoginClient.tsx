"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "../../lib/supabase/browser";

export default function MasterLoginClient() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMsg("Email ou senha inválidos.");
      return;
    }

    // Entrou: recarrega o /master pra ele validar o role e mostrar a área
    router.refresh();
  }

  return (
    <main style={{ padding: 40, maxWidth: 520 }}>
      <h1>Login Master</h1>
      <p style={{ marginTop: 8, opacity: 0.8 }}>
        Área exclusiva para funcionários OdontoFlow.
      </p>

      <form onSubmit={onSubmit} style={{ marginTop: 18, display: "grid", gap: 10 }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email master"
          type="email"
          required
          style={{ padding: 12, border: "1px solid #ccc", borderRadius: 8 }}
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          type="password"
          required
          style={{ padding: 12, border: "1px solid #ccc", borderRadius: 8 }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 14px",
            borderRadius: 10,
            cursor: "pointer",
          }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {msg ? <p style={{ marginTop: 6 }}>{msg}</p> : null}
      </form>
    </main>
  );
}
