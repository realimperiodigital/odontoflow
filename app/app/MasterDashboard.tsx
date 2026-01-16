"use client";

import { useState } from "react";

type Props = { masterEmail: string };

export default function MasterDashboard({ masterEmail }: Props) {
  const [clinicName, setClinicName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPass, setAdminPass] = useState("odontoflow123");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function createClinic(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch("/api/master/create-clinic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicName,
          adminEmail,
          adminPassword: adminPass,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setMsg(`Erro: ${json?.error || "Falha ao criar clínica"}`);
        setLoading(false);
        return;
      }

      setMsg(`Clínica criada ✅ ID: ${json.clinicId}`);
      setClinicName("");
      setAdminEmail("");
      setLoading(false);
    } catch (err: any) {
      setMsg(`Erro: ${err?.message || "Falha ao criar clínica"}`);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#05060a] text-white p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold">Bem-vindo, Master!</h1>
        <p className="text-white/60 mt-2">Sessão ativa: {masterEmail}</p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">Cadastrar nova clínica</h2>

          <form onSubmit={createClinic} className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-white/70">Nome da clínica</label>
              <input
                className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                placeholder="OdontoFlow 01"
                required
              />
            </div>

            <div>
              <label className="text-sm text-white/70">Email do admin</label>
              <input
                className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="clinica01@gmail.com"
                required
              />
            </div>

            <div>
              <label className="text-sm text-white/70">Senha provisória</label>
              <input
                className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                required
              />
            </div>

            <button
              disabled={loading}
              className="h-12 w-full rounded-xl bg-white text-black font-semibold disabled:opacity-60"
              type="submit"
            >
              {loading ? "Criando..." : "Criar clínica agora"}
            </button>

            {msg ? (
              <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-white/80">
                {msg}
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </main>
  );
}
