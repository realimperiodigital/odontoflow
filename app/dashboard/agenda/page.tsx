"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import { getActiveClinicId } from "@/lib/activeClinic";
import ClinicGuard from "@/app/components/ClinicGuard";

type Patient = {
  id: string;
  name: string | null;
  phone: string | null;
};

type Appointment = {
  id: string;
  starts_at: string | null;
  ends_at: string | null;
  status: string;
  notes: string | null;
  patient_id: string | null;
  patient_name: string | null;
  patient_phone: string | null;
};

function toIsoFromDatetimeLocal(value: string) {
  const d = new Date(value);
  return d.toISOString();
}

function formatBr(dateIso: string) {
  const d = new Date(dateIso);
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AgendaPage() {
  const supabase = useMemo(() => createSupabaseBrowser(), []);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Form
  const [patientId, setPatientId] = useState<string>("");
  const [startsAtLocal, setStartsAtLocal] = useState<string>("");
  const [endsAtLocal, setEndsAtLocal] = useState<string>("");
  const [status, setStatus] = useState<string>("scheduled");
  const [notes, setNotes] = useState<string>("");

  const loadAll = async () => {
    setLoading(true);
    setError(null);

    const clinicId = getActiveClinicId();
    if (!clinicId) {
      setLoading(false);
      return;
    }

    const { data: patientsData, error: pErr } = await supabase
      .from("patients")
      .select("id, name, phone")
      .eq("clinic_id", clinicId)
      .order("created_at", { ascending: false });

    if (pErr) {
      setPatients([]);
      setAppointments([]);
      setError("Não consegui carregar os pacientes da clínica.");
      setLoading(false);
      return;
    }

    setPatients((patientsData as Patient[]) || []);

    const { data: apptData, error: aErr } = await supabase
      .from("appointments")
      .select(
        `
        id,
        starts_at,
        ends_at,
        status,
        notes,
        patient_id,
        patients:patient_id (
          id,
          name,
          phone
        )
      `
      )
      .eq("clinic_id", clinicId)
      .order("starts_at", { ascending: true });

    if (aErr) {
      setAppointments([]);
      setError("Não consegui carregar os agendamentos.");
      setLoading(false);
      return;
    }

    const normalized: Appointment[] = (apptData || []).map((row: any) => ({
      id: row.id,
      starts_at: row.starts_at ?? null,
      ends_at: row.ends_at ?? null,
      status: row.status,
      notes: row.notes ?? null,
      patient_id: row.patient_id ?? null,
      patient_name: row.patients?.name ?? null,
      patient_phone: row.patients?.phone ?? null,
    }));

    setAppointments(normalized);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createAppointment = async () => {
    setError(null);

    const clinicId = getActiveClinicId();
    if (!clinicId) return;

    if (!patientId) {
      setError("Selecione um paciente.");
      return;
    }

    if (!startsAtLocal) {
      setError("Escolha a data e horário de início.");
      return;
    }

    setSaving(true);

    const payload: any = {
      clinic_id: clinicId,
      patient_id: patientId,
      starts_at: toIsoFromDatetimeLocal(startsAtLocal),
      status,
      notes: notes.trim() ? notes.trim() : null,
    };

    if (endsAtLocal.trim()) {
      payload.ends_at = toIsoFromDatetimeLocal(endsAtLocal);
    }

    const { error: insErr } = await supabase.from("appointments").insert(payload);

    if (insErr) {
      setSaving(false);
      setError("Não consegui criar o agendamento. Verifique as regras no Supabase.");
      return;
    }

    setPatientId("");
    setStartsAtLocal("");
    setEndsAtLocal("");
    setStatus("scheduled");
    setNotes("");

    setSaving(false);
    await loadAll();
  };

  const updateStatus = async (id: string, newStatus: string) => {
    setError(null);
    const { error: upErr } = await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", id);

    if (upErr) {
      setError("Não consegui atualizar o status.");
      return;
    }

    await loadAll();
  };

  const removeAppointment = async (id: string) => {
    setError(null);

    const ok = window.confirm("Tem certeza que deseja apagar este agendamento?");
    if (!ok) return;

    const { error: delErr } = await supabase.from("appointments").delete().eq("id", id);

    if (delErr) {
      setError("Não consegui apagar o agendamento.");
      return;
    }

    await loadAll();
  };

  const statusLabel = (s: string) => {
    if (s === "scheduled") return "Agendado";
    if (s === "confirmed") return "Confirmado";
    if (s === "done") return "Concluído";
    if (s === "canceled") return "Cancelado";
    return s;
  };

  return (
    <>
      <ClinicGuard />

      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Agenda</h1>
          <p className="mt-1 text-white/60">Agendamentos da sua clínica ativa.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
            Voltar
          </Link>

          <button
            onClick={loadAll}
            className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
            Recarregar
          </button>
        </div>
      </div>

      {error ? (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* FORM */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-lg font-semibold">Novo agendamento</h2>
          <p className="mt-1 text-sm text-white/60">
            Selecione o paciente e escolha data/hora.
          </p>

          <div className="mt-4 space-y-3">
            <div>
              <label className="text-sm text-white/70">Paciente</label>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/20"
              >
                <option value="">Selecione...</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {(p.name || "Sem nome") + (p.phone ? ` - ${p.phone}` : "")}
                  </option>
                ))}
              </select>

              {patients.length === 0 ? (
                <div className="mt-2 text-sm text-white/60">
                  Você ainda não tem pacientes. Cadastre em{" "}
                  <Link className="underline" href="/dashboard/patients">
                    Pacientes
                  </Link>
                  .
                </div>
              ) : null}
            </div>

            <div>
              <label className="text-sm text-white/70">Início</label>
              <input
                type="datetime-local"
                value={startsAtLocal}
                onChange={(e) => setStartsAtLocal(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/20"
              />
            </div>

            <div>
              <label className="text-sm text-white/70">Fim (opcional)</label>
              <input
                type="datetime-local"
                value={endsAtLocal}
                onChange={(e) => setEndsAtLocal(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/20"
              />
            </div>

            <div>
              <label className="text-sm text-white/70">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/20"
              >
                <option value="scheduled">Agendado</option>
                <option value="confirmed">Confirmado</option>
                <option value="done">Concluído</option>
                <option value="canceled">Cancelado</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-white/70">Observações (opcional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/20"
                placeholder="Ex: Retorno, trazer exames, etc..."
              />
            </div>

            <button
              onClick={createAppointment}
              disabled={saving}
              className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Criar agendamento"}
            </button>
          </div>
        </div>

        {/* LISTA */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-lg font-semibold">Agendamentos</h2>

          <div className="mt-4">
            {loading ? (
              <div className="text-white/60">Carregando...</div>
            ) : appointments.length === 0 ? (
              <div className="text-white/60">Nenhum agendamento ainda.</div>
            ) : (
              <div className="space-y-3">
                {appointments.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div className="font-semibold">
                        {a.patient_name || "Paciente"}
                        {a.patient_phone ? (
                          <span className="text-white/60"> • {a.patient_phone}</span>
                        ) : null}
                      </div>
                      <div className="text-sm text-white/60">{statusLabel(a.status)}</div>
                    </div>

                    <div className="mt-2 text-sm text-white/70">
                      {a.starts_at ? `Início: ${formatBr(a.starts_at)}` : "Sem início"}
                      {a.ends_at ? ` • Fim: ${formatBr(a.ends_at)}` : ""}
                    </div>

                    {a.notes ? (
                      <div className="mt-2 text-sm text-white/60">{a.notes}</div>
                    ) : null}

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => updateStatus(a.id, "confirmed")}
                        className="rounded-xl bg-white/10 px-3 py-2 text-xs hover:bg-white/15"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => updateStatus(a.id, "done")}
                        className="rounded-xl bg-white/10 px-3 py-2 text-xs hover:bg-white/15"
                      >
                        Concluir
                      </button>
                      <button
                        onClick={() => updateStatus(a.id, "canceled")}
                        className="rounded-xl bg-white/10 px-3 py-2 text-xs hover:bg-white/15"
                      >
                        Cancelar
                      </button>

                      <button
                        onClick={() => removeAppointment(a.id)}
                        className="rounded-xl bg-red-500/20 px-3 py-2 text-xs text-red-200 hover:bg-red-500/30"
                      >
                        Apagar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
