"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import { getActiveClinicId, setActiveClinicId } from "@/lib/activeClinic";

type Clinic = {
  id: string;
  name: string;
  created_at: string;
};

export default function ClinicsPage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowser(), []);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [activeClinicId, setActiveClinicIdState] = useState<string | null>(null);

  const [newClinicName, setNewClinicName] = useState("");

  const loadClinics = async () => {
    setLoading(true);
    setError(null);

    // Confere login
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      router.replace("/login");
      return;
    }

    // Busca clínicas via clinic_users (modelo profissional)
    // Primeiro pega os clinic_id que esse usuário participa
    const { data: memberships, error: mErr } = await supabase
      .from("clinic_users")
      .select("clinic_id")
      .eq("user_id", user.id);

    if (mErr) {
      setClinics([]);
      setError("Não consegui carregar suas clínicas (clinic_users).");
      setLoading(false);
      return;
    }

    const ids = (memberships || []).map((m: any) => m.clinic_id).filter(Boolean);

    if (!ids.length) {
      setClinics([]);
      setLoading(false);
      return;
    }

    const { data: clinicsData, error: cErr } = await supabase
      .from("clinics")
      .select("id, name, created_at")
      .in("id", ids)
      .order("created_at", { ascending: false });

    if (cErr) {
      setClinics([]);
      setError("Não consegui carregar suas clínicas (clinics).");
      setLoading(false);
      return;
    }

    setClinics((clinicsData as Clinic[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    setActiveClinicIdState(getActiveClinicId());
    loadClinics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selecionarClinica = (clinicId: string) => {
    setActiveClinicId(clinicId);
    setActiveClinicIdState(clinicId);
    router.push("/dashboard/patients");
  };

  const criarClinica = async () => {
    setError(null);

    const name = newClinicName.trim();
    if (!name) {
      setError("Digite o nome da clínica.");
      return;
    }

    setCreating(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      setCreating(false);
      router.replace("/login");
      return;
    }

    // 1) cria a clínica
    const { data: createdClinic, error: createErr } = await supabase
      .from("clinics")
      .insert({ name })
      .select("id, name, created_at")
      .single();

    if (createErr || !createdClinic?.id) {
      setCreating(false);
      setError("Não consegui criar a clínica. Verifique as regras no Supabase.");
      return;
    }

    // 2) cria membership do usuário como owner
    const { error: memberErr } = await supabase.from("clinic_users").insert({
      clinic_id: createdClinic.id,
      user_id: user.id,
      role: "owner",
    });

    if (memberErr) {
      setCreating(false);
      setError("Clínica criada, mas não consegui vincular seu usuário a ela.");
      return;
    }

    // 3) define como ativa e vai pra pacientes
    setNewClinicName("");
    setCreating(false);

    setActiveClinicId(createdClinic.id);
    setActiveClinicIdState(createdClinic.id);

    // recarrega lista (opcional)
    await loadClinics();

    router.push("/dashboard/patients");
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Clínicas</h1>
          <p className="mt-2 text-white/60">
            Selecione uma clínica ativa para usar Pacientes e Agenda.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-lg font-semibold">Criar nova clínica</h2>

        <div className="mt-3 flex flex-col gap-3 md:flex-row">
          <input
            value={newClinicName}
            onChange={(e) => setNewClinicName(e.target.value)}
            placeholder="Ex: OdontoFlow - Unidade Suzano"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/20"
          />

          <button
            onClick={criarClinica}
            disabled={creating}
            className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-60"
          >
            {creating ? "Criando..." : "Criar e selecionar"}
          </button>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Minhas clínicas</h2>

          <button
            onClick={loadClinics}
            className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
          >
            Recarregar
          </button>
        </div>

        {loading ? (
          <div className="mt-4 text-white/60">Carregando...</div>
        ) : clinics.length === 0 ? (
          <div className="mt-4 text-white/60">
            Você ainda não tem nenhuma clínica. Crie uma acima para começar.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {clinics.map((c) => {
              const isActive = activeClinicId === c.id;

              return (
                <div
                  key={c.id}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-white/10 bg-black/20 p-4 md:flex-row md:items-center"
                >
                  <div>
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-xs text-white/50">{c.id}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isActive ? (
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                        Ativa
                      </span>
                    ) : null}

                    <button
                      onClick={() => selecionarClinica(c.id)}
                      className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90"
                    >
                      Selecionar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
