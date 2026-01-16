"use client";

import { useMemo, useState } from "react";

export default function MasterAppPage() {
  const [clinicName, setClinicName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [phone, setPhone] = useState("");

  const [planType, setPlanType] = useState<"trial" | "start" | "pro" | "premium">("trial");
  const [trialDays, setTrialDays] = useState(7);
  const [patientLimit, setPatientLimit] = useState(30);
  const [userLimit, setUserLimit] = useState(1);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const passwordProvisoria = useMemo(() => "odontoflow123", []);

  async function criarClinica() {
    setError("");
    setResult(null);

    if (!clinicName.trim()) return setError("Digite o nome da clínica.");
    if (!adminEmail.trim()) return setError("Digite o email do admin da clínica.");

    setLoading(true);
    try {
      const res = await fetch("/api/master/create-clinic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicName,
          adminEmail,
          adminPassword: passwordProvisoria,
          cnpj: cnpj || null,
          phone: phone || null,
          plan: {
            type: planType,
            trialDays,
            patientLimit,
            userLimit,
          },
        }),
      });

      const data = await res.json();

      if (!data?.ok) {
        setError(data?.error || "Erro ao criar clínica.");
      } else {
        setResult(data);
        // limpa formulário
        setClinicName("");
        setAdminEmail("");
        setCnpj("");
        setPhone("");
      }
    } catch (e: any) {
      setError(e?.message || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#05060a] text-white">
      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-semibold">Painel MASTER</h1>
        <p className="mt-2 text-white/60">
          Aqui você cadastra a clínica e já cria o usuário admin do teste grátis.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">Criar clínica (teste grátis)</h2>

          <div className="mt-4 grid gap-4">
            <div>
              <label className="text-sm text-white/70">Nome da clínica</label>
              <input
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                placeholder="Ex: Clínica Sorriso"
              />
            </div>

            <div>
              <label className="text-sm text-white/70">Email do admin da clínica</label>
              <input
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                placeholder="Ex: contato@clinica.com"
              />
              <p className="mt-2 text-xs text-white/50">
                A senha provisória será: <b>{passwordProvisoria}</b> (a clínica troca depois).
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-white/70">CNPJ (opcional)</label>
                <input
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                  placeholder="00.000.000/0000-00"
                />
              </div>

              <div>
                <label className="text-sm text-white/70">Telefone (opcional)</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-white/70">Plano</label>
                <select
                  value={planType}
                  onChange={(e) => setPlanType(e.target.value as any)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                >
                  <option value="trial">Teste (7 dias)</option>
                  <option value="start">Start</option>
                  <option value="pro">Pró</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-white/70">Dias de teste</label>
                <input
                  type="number"
                  value={trialDays}
                  onChange={(e) => setTrialDays(Number(e.target.value))}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-white/70">Limite de pacientes</label>
                <input
                  type="number"
                  value={patientLimit}
                  onChange={(e) => setPatientLimit(Number(e.target.value))}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-white/70">Limite de usuários</label>
                <input
                  type="number"
                  value={userLimit}
                  onChange={(e) => setUserLimit(Number(e.target.value))}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                />
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            ) : null}

            {result ? (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                <div className="font-semibold">Clínica criada ✅</div>
                <div className="mt-2 text-white/80">
                  <div><b>Clínica:</b> {result?.clinic?.name}</div>
                  <div><b>ID:</b> {result?.clinic?.id}</div>
                  <div><b>Admin:</b> {result?.adminUser?.email}</div>
                </div>
              </div>
            ) : null}

            <button
              onClick={criarClinica}
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-white px-4 py-3 font-semibold text-black disabled:opacity-60"
            >
              {loading ? "Criando..." : "Criar clínica agora"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
