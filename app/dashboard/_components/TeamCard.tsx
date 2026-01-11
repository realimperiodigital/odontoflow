"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type TeamUser = {
  user_id: string;
  full_name: string | null;
  role: string;
  department: string | null;
  job_title: string | null;
  phone: string | null;
  birth_date: string | null;
  created_at?: string;
};

function roleLabel(role: string) {
  switch (role) {
    case "clinic_admin": return "Admin";
    case "reception": return "Recepção";
    case "financial": return "Financeiro";
    case "dentist": return "Dentista";
    case "staff": return "Staff";
    default: return role;
  }
}

export default function TeamCard() {
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [loading, setLoading] = useState(false);

  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [birth_date, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [job_title, setJobTitle] = useState("");
  const [role, setRole] = useState<"reception" | "financial" | "dentist" | "staff">("reception");

  const [tempPass, setTempPass] = useState<string | null>(null);

  async function loadUsers() {
    setLoading(true);
    setTempPass(null);

    const { data: me, error: meErr } = await supabase
      .from("profiles")
      .select("clinic_id")
      .single();

    if (meErr || !me?.clinic_id) {
      console.error(meErr);
      setUsers([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("user_id, full_name, role, department, job_title, phone, birth_date, created_at")
      .eq("clinic_id", me.clinic_id)
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    setUsers((data as any) || []);
    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function createUser() {
    setTempPass(null);

    const em = email.trim().toLowerCase();
    if (!em.includes("@")) return alert("Email inválido");
    if (full_name.trim().length < 2) return alert("Informe o nome");

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
        full_name: full_name.trim(),
        birth_date: birth_date || null,
        phone: phone.trim() || null,
        department: department.trim() || null,
        job_title: job_title.trim() || null,
      }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data?.error || "Erro ao criar usuário");

    setTempPass(data.temp_password || null);

    setFullName("");
    setEmail("");
    setBirthDate("");
    setPhone("");
    setDepartment("");
    setJobTitle("");
    setRole("reception");

    loadUsers();
  }

  return (
    <div style={{ border: "1px solid rgba(255,255,255,.12)", borderRadius: 14, padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Equipe da clínica</h3>
        <button onClick={loadUsers} style={{ padding: "10px 12px", borderRadius: 10, cursor: "pointer" }}>
          Atualizar
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <div style={{ fontWeight: 800, marginBottom: 10 }}>Cadastrar membro</div>

          <input placeholder="Nome completo" value={full_name} onChange={(e) => setFullName(e.target.value)}
            style={{ width: "100%", marginBottom: 10, padding: 10, borderRadius: 10 }} />

          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", marginBottom: 10, padding: 10, borderRadius: 10 }} />

          <input type="date" value={birth_date} onChange={(e) => setBirthDate(e.target.value)}
            style={{ width: "100%", marginBottom: 10, padding: 10, borderRadius: 10 }} />

          <input placeholder="Telefone" value={phone} onChange={(e) => setPhone(e.target.value)}
            style={{ width: "100%", marginBottom: 10, padding: 10, borderRadius: 10 }} />

          <input placeholder="Departamento (ex: Atendimento)" value={department} onChange={(e) => setDepartment(e.target.value)}
            style={{ width: "100%", marginBottom: 10, padding: 10, borderRadius: 10 }} />

          <input placeholder="Função (ex: Recepcionista)" value={job_title} onChange={(e) => setJobTitle(e.target.value)}
            style={{ width: "100%", marginBottom: 10, padding: 10, borderRadius: 10 }} />

          <select value={role} onChange={(e) => setRole(e.target.value as any)}
            style={{ width: "100%", marginBottom: 10, padding: 10, borderRadius: 10 }}>
            <option value="reception">Recepção</option>
            <option value="financial">Financeiro</option>
            <option value="dentist">Dentista</option>
            <option value="staff">Staff</option>
          </select>

          <button onClick={createUser} style={{ width: "100%", padding: 12, borderRadius: 10, cursor: "pointer" }}>
            Criar usuário
          </button>

          {tempPass && (
            <div style={{ marginTop: 12, padding: 12, borderRadius: 10, border: "1px solid rgba(255,255,255,.18)" }}>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>Senha provisória</div>
              <div style={{ fontSize: 18 }}><b>{tempPass}</b></div>
              <div style={{ opacity: 0.8, marginTop: 6 }}>
                Envie para o usuário. Ele será obrigado a trocar no primeiro login.
              </div>
            </div>
          )}
        </div>

        <div>
          <div style={{ fontWeight: 800, marginBottom: 10 }}>Membros cadastrados</div>
          {loading ? (
            <p>Carregando...</p>
          ) : users.length === 0 ? (
            <p>Nenhum usuário encontrado.</p>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {users.map((u) => (
                <div key={u.user_id} style={{ padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,.10)" }}>
                  <div style={{ fontWeight: 900 }}>{u.full_name || "Sem nome"}</div>
                  <div style={{ opacity: 0.85 }}>
                    {roleLabel(u.role)} • {u.department || "Sem depto"} • {u.job_title || "Sem função"}
                  </div>
                  <div style={{ opacity: 0.75, marginTop: 4 }}>
                    Nasc: {u.birth_date || "-"} • Tel: {u.phone || "-"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
