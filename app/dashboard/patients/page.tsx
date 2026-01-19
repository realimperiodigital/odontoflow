"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

// IMPORT CERTO (do lugar que você criou)
import ClinicGuard from "@/app/components/ClinicGuard";

import { createSupabaseBrowser } from "@/lib/supabase/browser";
import { getActiveClinicId } from "@/lib/activeClinic";

type Patient = {
  id: string;
  clinic_id: string;
  name: string | null;
  phone: string | null;
  created_at: string;
};

export default function PatientsPage() {
  const supabase = useMemo(() => createSupabaseBrowser(), []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const carregar = async () => {
      setLoading(true);
      setError(null);

      const clinicId = getActiveClinicId();

      // Se não tiver clínica, o Guard cuida do redirecionamento
      if (!clinicId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("patients")
        .select("id, clinic_id, name, phone, created_at")
        .eq("clinic_id", clinicId)
        .order("created_at", { ascending: false });

      if (error) {
        setError("Erro ao carregar pacientes");
        setPatients([]);
        setLoading(false);
        return;
      }

      setPatients(data || []);
      setLoading(false);
    };

    carregar();
  }, [supabase]);

  return (
    <>
      {/* PROTEÇÃO: sem clínica ativa não entra */}
      <ClinicGuard />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pacientes</h1>
          <p className="mt-1 text-white/60">
            Aqui ficam os pacientes da sua clínica ativa.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/dashboard"
            className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
          >
            Voltar
          </Link>

          <button className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90">
            + Novo paciente
          </button>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
        {loading && <p className="text-white/60">Carregando...</p>}

        {!loading && error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && patients.length === 0 && (
          <p className="text-white/60">Nenhum paciente cadastrado ainda.</p>
        )}

        {!loading && !error && patients.length > 0 && (
          <div className="space-y-3">
            {patients.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-white/10 bg-black/20 p-4"
              >
                <div className="font-semibold">
                  {p.name || "Sem nome"}
                </div>
                <div className="text-sm text-white/60">
                  {p.phone || "Sem telefone"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
