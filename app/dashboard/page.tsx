"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import { getCurrentProfile, Profile } from "@/app/lib/getCurrentProfile";

export default function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Team Management State
  const [teamList, setTeamList] = useState<Profile[]>([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createdPassword, setCreatedPassword] = useState<string | null>(null);

  // Form State
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("staff");
  const [newDept, setNewDept] = useState("");
  const [newJob, setNewJob] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newBirth, setNewBirth] = useState("");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { session, profile: p } = await getCurrentProfile();

      if (!session) {
        router.push("/login");
        return;
      }

      if (p?.must_change_password) {
        router.push("/first-access");
        return;
      }

      setUserEmail(session.user.email ?? "");
      setProfile(p);

      if (p?.role === 'clinic_admin' && p.clinic_id) {
        fetchTeam(p.clinic_id);
      }

      setLoading(false);
    };

    checkUser();
  }, [router]);

  const fetchTeam = async (clinicId: string) => {
    setTeamLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("clinic_id", clinicId)
      .neq("role", "master") // Don't show master? Usually master isn't linked to clinic_id this way, but good to filter.
      .order('created_at', { ascending: false });

    if (data) setTeamList(data as Profile[]);
    setTeamLoading(false);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setCreatedPassword(null);
    setCreateLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Sem sessão.");

      const res = await fetch("/api/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          role: newRole, // reception, financial, etc.
          department: newDept,
          job_title: newJob,
          phone: newPhone,
          birth_date: newBirth || null,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao criar usuário.");

      setCreatedPassword(json.temp_password);

      // Clear form
      setNewName("");
      setNewEmail("");
      setNewPhone("");
      setNewDept("");
      setNewJob("");
      setNewBirth("");
      setNewRole("staff");

      // Refresh list
      if (profile?.clinic_id) fetchTeam(profile.clinic_id);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) return <div className="p-8 text-white">Carregando...</div>;

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10 border-b border-[#0A2A5E] pb-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00B4FF] to-[#2ED8FF]">
            OdontoFlow Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[#0A2A5E] hover:bg-[#1a3b75] rounded text-sm transition-colors"
          >
            Sair
          </button>
        </header>

        {/* Info Card */}
        <section className="bg-[#0e121f] p-6 rounded-lg border border-[#0A2A5E] mb-8">
          <h2 className="text-xl font-semibold mb-4 text-[#E6ECF2]">Suas Informações</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div><span className="text-gray-400">Usuário:</span> {userEmail}</div>
            <div><span className="text-gray-400">Nome:</span> {profile?.full_name}</div>
            <div><span className="text-gray-400">Função:</span> <span className="uppercase font-mono text-xs bg-[#0A2A5E] px-1 py-0.5 rounded">{profile?.role}</span></div>
            <div><span className="text-gray-400">Clínica ID:</span> {profile?.clinic_id || 'N/A'}</div>
          </div>
        </section>

        {/* Navigation to Patients (Common to all clinic staff usually, or just admins? User didn't restrict, so keeping it accessible) */}
        <section className="mb-8">
          <button
            onClick={() => router.push('/dashboard/patients')}
            className="w-full md:w-auto px-6 py-4 bg-[#00B4FF]/10 border border-[#00B4FF]/30 hover:bg-[#00B4FF]/20 rounded-lg text-left transition-all group flex items-center justify-between"
          >
            <div>
              <h3 className="text-lg font-bold text-[#00B4FF] group-hover:text-[#2ED8FF]">Gerenciar Pacientes</h3>
              <p className="text-sm text-gray-400">Acessar lista de pacientes da clínica.</p>
            </div>
            <span className="text-2xl text-[#00B4FF]">&rarr;</span>
          </button>
        </section>

        {/* Team Management Module - ONLY for clinic_admin (and master technically, but master view is different) */}
        {profile?.role === 'clinic_admin' && (
          <section className="bg-[#0e121f] rounded-lg border border-[#0A2A5E] overflow-hidden">
            <div className="p-6 border-b border-[#0A2A5E] bg-[#0A2A5E]/20">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                👥 Equipe da Clínica
              </h2>
              <p className="text-sm text-gray-400 mt-1">Gerencie os membros e acessos da sua equipe.</p>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Column */}
              <div className="lg:col-span-1 border-r border-[#0A2A5E]/50 pr-6">
                <h3 className="text-lg font-semibold text-[#00B4FF] mb-4">Adicionar Membro</h3>

                {createdPassword && (
                  <div className="mb-6 p-4 bg-green-900/40 border border-green-800 rounded-lg">
                    <p className="text-green-200 font-bold mb-1">Usuário Criado!</p>
                    <p className="text-sm text-green-100">Senha provisória:</p>
                    <p className="text-xl font-mono bg-black/30 p-2 rounded mt-1 select-all text-center">{createdPassword}</p>
                    <p className="text-xs text-green-300 mt-2">Copie e envie para o usuário. Ele deverá trocar no primeiro acesso.</p>
                  </div>
                )}

                {errorMsg && (
                  <div className="mb-4 p-3 bg-red-900/40 border border-red-800 rounded text-red-200 text-sm">{errorMsg}</div>
                )}

                <form onSubmit={handleCreateUser} className="space-y-3">
                  <input className="w-full bg-[#0B0F1A] border border-[#0A2A5E] p-2 rounded text-sm text-white focus:border-[#00B4FF]"
                    placeholder="Nome Completo" required value={newName} onChange={e => setNewName(e.target.value)} />

                  <input className="w-full bg-[#0B0F1A] border border-[#0A2A5E] p-2 rounded text-sm text-white focus:border-[#00B4FF]"
                    type="email" placeholder="Email" required value={newEmail} onChange={e => setNewEmail(e.target.value)} />

                  <div className="grid grid-cols-2 gap-2">
                    <input className="bg-[#0B0F1A] border border-[#0A2A5E] p-2 rounded text-sm text-white focus:border-[#00B4FF]"
                      placeholder="Telefone" value={newPhone} onChange={e => setNewPhone(e.target.value)} />
                    <input className="bg-[#0B0F1A] border border-[#0A2A5E] p-2 rounded text-sm text-white focus:border-[#00B4FF]"
                      type="date" title="Data de Nascimento" value={newBirth} onChange={e => setNewBirth(e.target.value)} />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input className="bg-[#0B0F1A] border border-[#0A2A5E] p-2 rounded text-sm text-white focus:border-[#00B4FF]"
                      placeholder="Departamento" value={newDept} onChange={e => setNewDept(e.target.value)} />
                    <input className="bg-[#0B0F1A] border border-[#0A2A5E] p-2 rounded text-sm text-white focus:border-[#00B4FF]"
                      placeholder="Função (ex: Recepcionista)" value={newJob} onChange={e => setNewJob(e.target.value)} />
                  </div>

                  <select className="w-full bg-[#0B0F1A] border border-[#0A2A5E] p-2 rounded text-sm text-white focus:border-[#00B4FF]"
                    value={newRole} onChange={e => setNewRole(e.target.value)}>
                    <option value="reception">Recepção</option>
                    <option value="financial">Financeiro</option>
                    <option value="dentist">Dentista</option>
                    <option value="staff">Staff / Auxiliar</option>
                    <option value="clinic_admin">Admin da Clínica</option>
                  </select>

                  <button disabled={createLoading} className="w-full py-2 bg-[#00B4FF] hover:bg-[#009acb] text-white font-bold rounded transition-colors disabled:opacity-50">
                    {createLoading ? "Criando..." : "Criar Usuário"}
                  </button>
                </form>
              </div>

              {/* List Column */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-[#E6ECF2]">Membros da Equipe</h3>
                  <button onClick={() => profile.clinic_id && fetchTeam(profile.clinic_id)} className="text-xs text-[#00B4FF] hover:underline">Atualizar Lista</button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#0A2A5E]/40 text-gray-300">
                      <tr>
                        <th className="p-3">Nome</th>
                        <th className="p-3">Cargo/Role</th>
                        <th className="p-3">Depto/Função</th>
                        <th className="p-3">Contato</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#0A2A5E]/50">
                      {teamLoading ? (
                        <tr><td colSpan={4} className="p-4 text-center text-gray-500">Carregando...</td></tr>
                      ) : teamList.length > 0 ? (
                        teamList.map(member => (
                          <tr key={member.id} className="hover:bg-[#0A2A5E]/10">
                            <td className="p-3">
                              <div className="font-medium text-white">{member.full_name}</div>
                              {member.birth_date && <div className="text-xs text-gray-500">Nasc: {member.birth_date}</div>}
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-xs font-mono uppercase ${member.role === 'clinic_admin' ? 'bg-purple-900/50 text-purple-200' :
                                member.role === 'dentist' ? 'bg-blue-900/50 text-blue-200' : 'bg-gray-800 text-gray-300'
                                }`}>
                                {member.role}
                              </span>
                            </td>
                            <td className="p-3 text-gray-300">
                              <div>{member.job_title || '-'}</div>
                              <div className="text-xs text-gray-500">{member.department}</div>
                            </td>
                            <td className="p-3 text-gray-400">{member.phone || '-'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={4} className="p-6 text-center text-gray-600">Nenhum membro encontrado.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

