"use client";

import { useState } from "react";

export default function BootstrapMasterPage() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function run() {
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/bootstrap-master", { method: "POST" });
      const text = await res.text();

      if (!text.trim().startsWith("{")) {
        setMsg("Retorno não é JSON:\n\n" + text.slice(0, 600));
        setLoading(false);
        return;
      }

      const json = JSON.parse(text);
      setMsg(JSON.stringify(json, null, 2));
    } catch (e: any) {
      setMsg(e?.message || "Erro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 720, border: "1px solid #ddd", borderRadius: 16, padding: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Bootstrap MASTER</h1>
        <p style={{ color: "#444", marginBottom: 16 }}>
          Clique para criar/garantir o MASTER e o profile master no Supabase.
        </p>

        <button
          onClick={run}
          disabled={loading}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #111",
            background: loading ? "#ccc" : "#111",
            color: "#fff",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Executando..." : "Executar bootstrap"}
        </button>

        {msg && (
          <pre
            style={{
              marginTop: 16,
              whiteSpace: "pre-wrap",
              background: "#f6f6f6",
              padding: 12,
              borderRadius: 10,
              border: "1px solid #eee",
              fontSize: 12,
              maxHeight: 360,
              overflow: "auto",
            }}
          >
            {msg}
          </pre>
        )}
      </div>
    </div>
  );
}
