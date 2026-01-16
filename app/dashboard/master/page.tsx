"use client";

import { useState } from "react";

export default function MasterDashboardPage() {
  const [clinicName, setClinicName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/master/create-clinic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicName, adminEmail, adminPassword })
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        setMsg({ type: "err", text: data?.error || "Erro ao criar clínica" });
        setLoading(false);
        return;
      }

      setMsg({ type: "ok", text: `Clínica criada! Admin: ${data.adminEmail}` });
      setClinicName("");
      setAdminEmail("");
      setAdminPassword("");
    } catch (err: any) {
      setMsg({ type: "err", text: err?.message || "Erro inesperado" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#05060a] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white/5 border border-white/10 rounded-2xl p-6">
        <h1 className="text-xl font-semibold">Painel Master</h1>
        <p className="text-white/60 text-sm mt-1">Crie clínicas e gere o login do admin.</p>

        <form onSubmit={handleCreate} className="mt-6 space-y-3">
          <input
            className="w-full p-3 rounded bg-black/40 border border-white/10"
            placeholder="Nome da clínica"
            value={clinicName}
            onChange={(e) => setClinicName(e.target.value)}
          />

          <input
            className="w-full p-3 rounded bg-black/40 border border-white/10"
            placeholder="Email do admin da clínica"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
          />

          <input
            className="w-full p-3 rounded bg-black/40 border border-white/10"
            placeholder="Senha provisória (mínimo 6)"
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
          />

          {msg && (
            <div className={`text-sm p-3 rounded ${msg.type === "ok" ? "bg-green-500/10 text-green-300" : "bg-red-500/10 text-red-300"}`}>
              {msg.text}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full p-3 rounded font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Criando..." : "Criar clínica + Admin"}
          </button>
        </form>
      </div>
    </main>
  );
}
