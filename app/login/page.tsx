"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function entrar() {
    setErro(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    setLoading(false);

    if (error) {
      setErro(error.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div style={{ maxWidth: 380, margin: "80px auto", padding: 16 }}>
      <h2 style={{ marginBottom: 16 }}>Login OdontoFlow</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <button
        onClick={entrar}
        disabled={loading}
        style={{ width: "100%", padding: 10, cursor: "pointer" }}
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>

      {erro && <p style={{ color: "red", marginTop: 10 }}>{erro}</p>}

      <p style={{ marginTop: 14, fontSize: 12, opacity: 0.8 }}>
        Acesse em: <b>http://localhost:3000/login</b>
      </p>
    </div>
  );
}
