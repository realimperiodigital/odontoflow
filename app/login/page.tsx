"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      // Aqui você liga seu Supabase depois.
      // Por enquanto, só valida e manda pro dashboard:
      if (!email || !senha) {
        setErro("Preencha email e senha.");
        return;
      }

      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      <div style={{ flex: 1, background: "#05060a" }} />
      <div
        style={{
          width: 520,
          maxWidth: "100%",
          padding: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0f17",
          color: "#fff",
        }}
      >
        <form onSubmit={entrar} style={{ width: "100%" }}>
          <h1 style={{ fontSize: 28, marginBottom: 8 }}>Entrar</h1>
          <p style={{ opacity: 0.75, marginBottom: 18 }}>
            Acesse a área restrita da OdontoFlow.
          </p>

          <label style={{ fontSize: 13, opacity: 0.8 }}>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seuemail@clinica.com"
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,.12)",
              background: "rgba(255,255,255,.04)",
              color: "#fff",
              marginTop: 6,
              marginBottom: 12,
            }}
          />

          <label style={{ fontSize: 13, opacity: 0.8 }}>Senha</label>
          <input
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            type="password"
            placeholder="********"
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,.12)",
              background: "rgba(255,255,255,.04)",
              color: "#fff",
              marginTop: 6,
              marginBottom: 12,
            }}
          />

          {erro && (
            <div
              style={{
                background: "rgba(255,0,0,.08)",
                border: "1px solid rgba(255,0,0,.25)",
                padding: 10,
                borderRadius: 12,
                marginBottom: 12,
              }}
            >
              {erro}
            </div>
          )}

          <button
            disabled={loading}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 14,
              border: 0,
              cursor: "pointer",
              fontWeight: 700,
              background: "#2f6bff",
              color: "#fff",
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 14,
              marginTop: 10,
              border: "1px solid rgba(255,255,255,.12)",
              cursor: "pointer",
              fontWeight: 700,
              background: "transparent",
              color: "#fff",
            }}
          >
            Voltar para o site
          </button>
        </form>
      </div>
    </div>
  );
}
