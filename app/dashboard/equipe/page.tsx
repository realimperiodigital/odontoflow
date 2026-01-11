"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type TeamUser = {
  user_id: string;
  full_name: string | null;
  role: string;
  created_at?: string;
};

function roleLabel(role: string) {
  switch (role) {
    case "clinic_admin":
      return "Admin da clínica";
    case "reception":
      return "Recepção";
    case "financial":
      return "Financeiro";
    case "dentist":
      return "Dentista";
    case "staff":
      return "Staff";
    default:
      return role;
  }
}

export default function EquipePage() {
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"reception" | "financial" | "dentist" | "staff">("reception");

  const [tempPass, setTempPass] = useState<string | null>(null);

  const canCreate = useMemo(() => true, []);

  async function loadUsers() {
    setLoading(true);
    setTempPass(null);

    // pega o clinic_id do usuário logado
    const { data: me, error: meErr } = await supabase
      .from("profiles")
      .select("clinic_id")
      .single();

    if (meErr || !me?.clinic_id) {
      console.error(meErr);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("user_id, full_name, role, created_at")
      .eq("clinic_id", me.clinic_id)
      .order("created_at", { ascending: false });

    if (error) console.error(error);

    setUsers(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function createUser() {
    setTempPass(null);

    const em = email.trim().toLowerCase();
    if (!em.includes("@")) return alert("Email inválido");
    if (fullName.trim().length < 2) return alert("Informe o nome");

    const { data: s } = await supabase.auth.getSession();
    const token = s?.session?.access_token;
    if (!token) return alert("Sessão inválida. Faça login novamente.");

    const res = await fetch("/api/clinic/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: em,
        role,
        full_name: fullName.trim(),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data?.error || "Erro ao criar usuário");
      return;
    }

    setTempPass(data.temp_password || null);
    setEmail("");
    setFullName("");
    setRole("reception");
    loadUsers();
  }

  return (
    <div style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <h1 style={{ fontSize: 26, marginBottom: 8 }}>Equipe</h1>
      <p style={{ opacity: 0.8, marginBottom: 18 }}>
        Crie usuários de recepção, financeiro e dentistas. Eles serão obrigados a trocar a senha no primeiro login.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 22 }}>
        <div style={{ padding: 16, border: "1px solid rgba(255,255,255,.12)", borderRadius: 12 }}>
          <h3 style={{ marginTop: 0 }}>Novo membro</h3>

          <label>Nome completo</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{ width: "100%", margin: "6px 0 12px", padding: 10, borderRadius: 10 }}
            placeholder="Ex: Maria Souza"
          />

          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", margin: "6px 0 12px", padding: 10, borderRadius: 10 }}
            placeholder="ex: maria@clinica.com"
          />

          <label>Cargo</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            style={{ width: "100%", margin: "6px 0 12px", padding: 10, borderRadius: 10 }}
          >
            <option value="reception">Recepção</option>
            <option value="financial">Financeiro</option>
            <option value="dentist">Dentista</option>
            <option value="staff">Staff</option>
          </select>

          <button
            onClick={createUser}
            disabled={!canCreate}
            style={{ width: "100%", padding: 12, borderRadius: 10, cursor: "pointer" }}
          >
            Criar usuário
          </button>

          {tempPass && (
            <div style={{ marginTop: 14, padding: 12, borderRadius: 10, border: "1px solid rgba(255,255,255,.18)" }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Senha temporária</div>
              <div style={{ fontSize: 18 }}>
                <b>{tempPass}</b>
              </div>
              <div style={{ opacity: 0.8, marginTop: 6 }}>
                Copie e envie para o usuário. Ele vai trocar no primeiro login.
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: 16, border: "1px solid rgba(255,255,255,.12)", borderRadius: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ marginTop: 0 }}>Membros da clínica</h3>
            <button onClick={loadUsers} style={{ padding: "10px 12px", borderRadius: 10, cursor: "pointer" }}>
              Atualizar
            </button>
          </div>

          {loading ? (
            <p>Carregando...</p>
          ) : users.length === 0 ? (
            <p>Nenhum usuário encontrado.</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {users.map((u) => (
                <li key={u.user_id} style={{ marginBottom: 10 }}>
                  <b>{u.full_name || "Sem nome"}</b> — {roleLabel(u.role)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
