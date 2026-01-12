"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import { getCurrentProfile, Profile } from "@/app/lib/getCurrentProfile";

export default function TeamPage() {
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const [teamList, setTeamList] = useState<Profile[]>([]);
    const [teamLoading, setTeamLoading] = useState(false);

    // Create User State
    const [showCreate, setShowCreate] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [createdPassword, setCreatedPassword] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: "", email: "", role: "staff", dept: "", job: "", phone: "", birth: ""
    });

    useEffect(() => {
        const init = async () => {
            const { session, profile: p } = await getCurrentProfile();
            if (!session) { router.push('/login'); return; }
            if (!p) { router.push('/login'); return; }

            // Security check: Only Admin/Master
            if (p.role !== 'clinic_admin' && p.role !== 'master') {
                router.push('/dashboard');
                return;
            }

            setProfile(p);
            if (p.clinic_id) fetchTeam(p.clinic_id);
            setLoading(false);
        }
        init();
    }, [router]);

    const fetchTeam = async (clinicId: string) => {
        setTeamLoading(true);
        const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("clinic_id", clinicId)
            .neq("role", "master")
            .order('created_at', { ascending: false });

        if (data) setTeamList(data as Profile[]);
        setTeamLoading(false);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateLoading(true);
        setErrorMsg(null);
        setCreatedPassword(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("No session");

            const res = await fetch("/api/create-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    role: form.role,
                    department: form.dept,
                    job_title: form.job,
                    phone: form.phone,
                    birth_date: form.birth || null,
                }),
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Erro ao criar usuário.");

            setCreatedPassword(json.temp_password);
            setForm({ name: "", email: "", role: "staff", dept: "", job: "", phone: "", birth: "" });
            if (profile?.clinic_id) fetchTeam(profile.clinic_id);

        } catch (err: any) {
            setErrorMsg(err.message);
        } finally {
            setCreateLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-white min-h-screen bg-[#060B16] flex items-center justify-center">Carregando...</div>;

    return (
        <div className="min-h-screen bg-[#060B16] text-[#D7DEE8] p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8 border-b border-[#18A8FF]/20 pb-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push('/dashboard')} className="text-[#18A8FF] hover:text-white transition-colors">&larr; Voltar</button>
                        <h1 className="text-2xl font-bold text-white">Gestão da Equipe</h1>
                    </div>
                    <button
                        onClick={() => setShowCreate(!showCreate)}
                        className="btn-primary px-4 py-2 rounded-lg text-sm"
                    >
                        {showCreate ? 'Fechar Formulário' : '+ Novo Membro'}
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Create Column */}
                    {showCreate && (
                        <div className="lg:col-span-1 glass-panel p-6 rounded-xl border border-[#18A8FF]/20 h-fit">
                            <h3 className="text-lg font-bold text-[#18A8FF] mb-4">Novo Cadastro</h3>

                            {createdPassword && (
                                <div className="mb-4 p-4 bg-green-900/30 border border-green-500/50 rounded-lg">
                                    <p className="text-green-400 font-bold text-sm">Usuário Criado!</p>
                                    <p className="text-xs text-gray-400 mt-1">Senha Provisória:</p>
                                    <div className="bg-black/40 p-2 rounded mt-1 font-mono text-center text-lg">{createdPassword}</div>
                                </div>
                            )}

                            {errorMsg && <div className="p-3 bg-red-900/30 border border-red-500/30 rounded text-red-200 text-sm mb-4">{errorMsg}</div>}

                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase">Nome Completo</label>
                                    <input className="w-full bg-[#0B0F1A] border border-[#18A8FF]/20 p-2 rounded text-white focus:border-[#18A8FF] outline-none"
                                        required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase">Email de Login</label>
                                    <input className="w-full bg-[#0B0F1A] border border-[#18A8FF]/20 p-2 rounded text-white focus:border-[#18A8FF] outline-none"
                                        type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase">Telefone</label>
                                        <input className="w-full bg-[#0B0F1A] border border-[#18A8FF]/20 p-2 rounded text-white outline-none"
                                            value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase">Nascimento</label>
                                        <input className="w-full bg-[#0B0F1A] border border-[#18A8FF]/20 p-2 rounded text-white outline-none"
                                            type="date" value={form.birth} onChange={e => setForm({ ...form, birth: e.target.value })} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase">Departamento</label>
                                        <select className="w-full bg-[#0B0F1A] border border-[#18A8FF]/20 p-2 rounded text-white outline-none"
                                            value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })}>
                                            <option value="">Selecione</option>
                                            <option value="Recepção">Recepção</option>
                                            <option value="Financeiro">Financeiro</option>
                                            <option value="Clínico">Clínico</option>
                                            <option value="Administrativo">Administrativo</option>
                                            <option value="Comercial">Comercial</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase">Role / Permissão</label>
                                        <select className="w-full bg-[#0B0F1A] border border-[#18A8FF]/20 p-2 rounded text-white outline-none"
                                            value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                                            <option value="reception">Recepção</option>
                                            <option value="financial">Financeiro</option>
                                            <option value="dentist">Dentista</option>
                                            <option value="staff">Staff</option>
                                            <option value="clinic_admin">Admin</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase">Função (ex: Recepcionista)</label>
                                    <input className="w-full bg-[#0B0F1A] border border-[#18A8FF]/20 p-2 rounded text-white outline-none"
                                        value={form.job} onChange={e => setForm({ ...form, job: e.target.value })} />
                                </div>

                                <button disabled={createLoading} className="w-full btn-primary py-3 rounded font-bold mt-4 disabled:opacity-50">
                                    {createLoading ? 'Criando...' : 'Cadastrar Membro'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* List Column */}
                    <div className={`${showCreate ? 'lg:col-span-2' : 'lg:col-span-3'} glass-panel rounded-xl border border-[#18A8FF]/10 overflow-hidden`}>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#0B0F1A] text-gray-400 border-b border-[#18A8FF]/10">
                                <tr>
                                    <th className="p-4 font-normal uppercase text-xs tracking-wider">Nome / Email</th>
                                    <th className="p-4 font-normal uppercase text-xs tracking-wider">Permissão</th>
                                    <th className="p-4 font-normal uppercase text-xs tracking-wider">Depto / Função</th>
                                    <th className="p-4 font-normal uppercase text-xs tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#18A8FF]/5">
                                {teamList.map((m) => (
                                    <tr key={m.id} className="hover:bg-[#18A8FF]/5 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-white">{m.full_name}</div>
                                            {/* Email isn't directly in profile usually, but if we have it or fetch it. API create user sets it. 
                                                Note: 'profiles' table usually doesn't store email unless added. 
                                                We'll assume name is enough or update profile to store email too. 
                                                For now showing name.
                                            */}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${m.role === 'clinic_admin' ? 'bg-purple-500/20 text-purple-400' :
                                                    m.role === 'dentist' ? 'bg-blue-500/20 text-blue-400' :
                                                        m.role === 'financial' ? 'bg-green-500/20 text-green-400' :
                                                            'bg-gray-700/50 text-gray-400'
                                                }`}>{m.role}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-white">{m.department}</div>
                                            <div className="text-xs text-gray-500">{m.job_title}</div>
                                        </td>
                                        <td className="p-4">
                                            <button className="text-[#18A8FF] hover:underline text-xs">Editar</button>
                                        </td>
                                    </tr>
                                ))}
                                {teamList.length === 0 && !teamLoading && (
                                    <tr><td colSpan={4} className="p-6 text-center text-gray-500">Nenhum membro encontrado.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
