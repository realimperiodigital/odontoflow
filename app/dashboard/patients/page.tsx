"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import { getCurrentProfile } from "@/app/lib/getCurrentProfile";

type Patient = {
  id: string;
  name: string;
  phone: string | null;
  clinic_id: string;
  created_at: string;
};

export default function PatientsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [clinicId, setClinicId] = useState<string | null>(null);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadPatients = async () => {
    setError(null);

    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      return;
    }

    setPatients((data ?? []) as Patient[]);
  };

  useEffect(() => {
    const init = async () => {
      const { session, profile } = await getCurrentProfile();

      if (!session) {
        router.push("/login");
        return;
      }

      if (!profile?.clinic_id) {
        setError("Seu perfil ainda não tem clínica vinculada.");
        setLoading(false);
        return;
      }

      setClinicId(profile.clinic_id);
      await loadPatients();
      setLoading(false);
    };

    init();
  }, [router]);

  const criarPaciente = async () => {
    setError(null);

    if (!name.trim()) {
      setError("Digite o nome.");
      return;
    }

    if (!clinicId) {
      setError("Clinic ID não encontrado.");
      return;
    }

    // clinic_id é exigido, mas a RLS garante que só entra se for o seu clinic_id
    const { error } = await supabase.from("patients").insert({
      clinic_id: clinicId,
      name: name.trim(),
      phone: phone.trim() || null,
    });

    if (error) {
      setError(error.message);
      return;
    }

    setName("");
    setPhone("");
    await loadPatients();
  };

  if (loading) return <div style={{ color: "#fff", padding: 40 }}>Carregando...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#050b14", color: "#fff", padding: 40 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ color: "#0ea5ff" }}>Pacientes</h1>
        <button
          onClick={() => router.push("/dashboard")}
          style={{ background: "#0b223a", padding: "8px 16px", borderRadius: 8, border: "none", color: "#fff", cursor: "pointer" }}
        >
          Voltar
        </button>
      </div>

      <div style={{ marginTop: 20, padding: 20, borderRadius: 12, background: "#020b16", border: "1px solid #0ea5ff33" }}>
        <h2>Cadastrar paciente</h2>

        <input
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 10, marginBottom: 10 }}
        />

        <input
          placeholder="Telefone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <button
          onClick={criarPaciente}
          style={{ width: "100%", padding: 12, background: "#0ea5ff", border: "none", borderRadius: 10, cursor: "pointer" }}
        >
          Salvar
        </button>

        {error && <p style={{ color: "#ff6b6b", marginTop: 10 }}>{error}</p>}
      </div>

      <div style={{ marginTop: 30 }}>
        <h2>Lista</h2>

        {patients.length === 0 ? (
          <p style={{ opacity: 0.7 }}>Nenhum paciente ainda.</p>
        ) : (
          <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
            {patients.map((p) => (
              <div key={p.id} style={{ padding: 14, borderRadius: 12, background: "#081421", border: "1px solid #0ea5ff22" }}>
                <strong>{p.name}</strong>
                <div style={{ opacity: 0.8 }}>{p.phone ?? "Sem telefone"}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
