"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import { getCurrentProfile } from "@/app/lib/getCurrentProfile";

export default function PatientsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [clinicId, setClinicId] = useState<string | null>(null);
  const [patients, setPatients] = useState<any[]>([]);

  // Modes: 'list', 'create', 'edit'
  const [view, setView] = useState('list');

  // Form
  const [form, setForm] = useState({
    name: "", cpf: "", phone: "", birth_date: "",
    zip_code: "", street: "", number: "", neighborhood: "", city: "", state: ""
  });

  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { session, profile: p } = await getCurrentProfile();
      if (!session || !p) { router.push('/login'); return; }
      setClinicId(p.clinic_id);
      if (p.clinic_id) fetchPatients(p.clinic_id);
      setLoading(false);
    }
    init();
  }, [router]);

  const fetchPatients = async (cid: string) => {
    const { data } = await supabase.from('patients').select('*').eq('clinic_id', cid).order('created_at', { ascending: false });
    if (data) setPatients(data);
  }

  const handleCep = async (cep: string) => {
    setForm(f => ({ ...f, zip_code: cep }));
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setForm(f => ({
            ...f,
            zip_code: cep,
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf
          }));
        }
      } catch (e) {
        console.error("CEP Error", e);
      }
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (!clinicId) return;

    const { error } = await supabase.from('patients').insert({
      clinic_id: clinicId,
      name: form.name,
      cpf: form.cpf,
      phone: form.phone,
      birth_date: form.birth_date || null,
      zip_code: form.zip_code,
      street: form.street,
      number: form.number,
      neighborhood: form.neighborhood,
      city: form.city,
      state: form.state
    });

    if (error) {
      setMsg("Erro: " + error.message);
    } else {
      setMsg("Paciente salvo com sucesso!");
      setForm({ name: "", cpf: "", phone: "", birth_date: "", zip_code: "", street: "", number: "", neighborhood: "", city: "", state: "" });
      fetchPatients(clinicId);
      setTimeout(() => setView('list'), 1500);
    }
  }

  if (loading) return <div className="p-8 text-white min-h-screen bg-[#060B16] flex items-center justify-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-[#060B16] text-[#D7DEE8] p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-[#18A8FF]/20 pb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/dashboard')} className="text-[#18A8FF] hover:text-white transition-colors">&larr; Voltar</button>
            <h1 className="text-2xl font-bold text-white">Pacientes</h1>
          </div>
          {view === 'list' && (
            <button onClick={() => setView('create')} className="btn-primary px-4 py-2 rounded-lg text-sm">
              + Novo Paciente
            </button>
          )}
          {view === 'create' && (
            <button onClick={() => setView('list')} className="text-gray-400 hover:text-white text-sm">
              Cancelar
            </button>
          )}
        </header>

        {view === 'create' && (
          <div className="glass-panel p-8 rounded-xl border border-[#18A8FF]/20 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-[#18A8FF] mb-6">Ficha de Cadastro</h2>
            {msg && <div className={`p-4 mb-6 rounded ${msg.includes('Erro') ? 'bg-red-900/30 text-red-300' : 'bg-green-900/30 text-green-300'}`}>{msg}</div>}

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase border-b border-gray-700 pb-2">Dados Pessoais</h3>
                <div>
                  <label className="text-xs text-gray-500">Nome Completo</label>
                  <input required className="w-full bg-[#0B0F1A] border border-[#18A8FF]/20 p-2 rounded text-white focus:border-[#18A8FF] outline-none"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500">CPF</label>
                    <input className="w-full bg-[#0B0F1A] border border-[#18A8FF]/20 p-2 rounded text-white outline-none"
                      placeholder="000.000.000-00" value={form.cpf} onChange={e => setForm({ ...form, cpf: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Nascimento</label>
                    <input type="date" className="w-full bg-[#0B0F1A] border border-[#18A8FF]/20 p-2 rounded text-white outline-none"
                      value={form.birth_date} onChange={e => setForm({ ...form, birth_date: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Telefone / WhatsApp</label>
                  <input className="w-full bg-[#0B0F1A] border border-[#18A8FF]/20 p-2 rounded text-white outline-none"
                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>

              {/* Address Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase border-b border-gray-700 pb-2">Endereço</h3>
                <div>
                  <label className="text-xs text-gray-500">CEP (Busca Automática)</label>
                  <input className="w-24 bg-[#0B0F1A] border border-[#18A8FF]/20 p-2 rounded text-white outline-none focus:border-[#18A8FF]"
                    value={form.zip_code} onChange={e => handleCep(e.target.value)} maxLength={9} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="text-xs text-gray-500">Logradouro</label>
                    <input className="w-full bg-[#0B0F1A] border border-[#18A8FF]/20 p-2 rounded text-white outline-none"
                      value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Número</label>
                    <input className="w-full bg-[#0B0F1A] border border-[#18A8FF]/20 p-2 rounded text-white outline-none"
                      value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500">Bairro</label>
                    <input className="w-full bg-[#0B0F1A] border border-[#18A8FF]/20 p-2 rounded text-white outline-none"
                      value={form.neighborhood} onChange={e => setForm({ ...form, neighborhood: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Cidade/UF</label>
                    <div className="flex gap-1">
                      <input className="w-full bg-[#0B0F1A] border border-[#18A8FF]/20 p-2 rounded text-white outline-none"
                        value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                      <input className="w-12 bg-[#0B0F1A] border border-[#18A8FF]/20 p-2 rounded text-white outline-none"
                        value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 mt-4">
                <button className="w-full btn-primary py-3 rounded text-lg font-bold">Salvar Paciente</button>
              </div>
            </form>
          </div>
        )}

        {view === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.map(p => (
              <div key={p.id} className="glass-panel p-6 rounded-xl border border-[#18A8FF]/10 hover:border-[#18A8FF]/50 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#18A8FF] transition-colors">{p.name}</h3>
                  <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">Prontuário</span>
                </div>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>📱 {p.phone || 'Sem telefone'}</p>
                  <p>🔢 CPF: {p.cpf || '-'}</p>
                  <p>📍 {p.city ? `${p.city}/${p.state}` : '-'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
