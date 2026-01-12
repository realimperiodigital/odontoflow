"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import { getCurrentProfile, Profile } from "@/app/lib/getCurrentProfile";

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Stats
  const [stats, setStats] = useState({
    today: 0,
    missed: 0,
    confirmed: 0,
    next: null as string | null
  });

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

      setProfile(p);
      if (p?.clinic_id) fetchStats(p.clinic_id);

      setLoading(false);
    };

    checkUser();
  }, [router]);

  const fetchStats = async (clinicId: string) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const { count: todayCount } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('clinic_id', clinicId)
      .gte('start_time', todayStart.toISOString())
      .lte('start_time', todayEnd.toISOString());

    const { count: missedCount } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('clinic_id', clinicId)
      .eq('status', 'missed');

    const { count: confirmedCount } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('clinic_id', clinicId)
      .eq('status', 'confirmed')
      .gte('start_time', todayStart.toISOString());

    // Get next appointment
    const { data: nextApp } = await supabase
      .from('appointments')
      .select('start_time')
      .eq('clinic_id', clinicId)
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true })
      .limit(1)
      .single();

    setStats({
      today: todayCount || 0,
      missed: missedCount || 0,
      confirmed: confirmedCount || 0,
      next: nextApp ? new Date(nextApp.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) return <div className="p-8 text-white min-h-screen bg-[#060B16] flex items-center justify-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-[#060B16] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-10 border-b border-[#18A8FF]/20 pb-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#18A8FF] to-[#00D4FF]">
              Dashboard
            </h1>
            <p className="text-sm text-gray-400">Bem-vindo, {profile?.full_name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-[#18A8FF]/50 text-[#18A8FF] hover:bg-[#18A8FF]/10 rounded text-sm transition-colors"
          >
            Sair
          </button>
        </header>

        {/* STATS WIDGETS */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Atendimentos Hoje" value={stats.today} icon="📅" color="text-[#18A8FF]" />
          <StatCard title="Confirmados" value={stats.confirmed} icon="✅" color="text-green-400" />
          <StatCard title="Faltas" value={stats.missed} icon="❌" color="text-red-400" />
          <StatCard title="Próximo Agendam." value={stats.next || '--:--'} icon="⏰" color="text-yellow-400" sub="Horário" />
        </section>

        {/* MAIN NAVIGATION MODULES */}
        <h2 className="text-xl font-bold text-white mb-6 pl-2 border-l-4 border-[#18A8FF]">Módulos</h2>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Agenda */}
          {['clinic_admin', 'dentist', 'reception', 'staff'].includes(profile?.role || '') && (
            <NavCard
              title="Agenda"
              desc="Calendário por dentista e status."
              icon="🗓️"
              onClick={() => router.push('/dashboard/agenda')}
            />
          )}

          {/* Pacientes */}
          {['clinic_admin', 'dentist', 'reception', 'staff', 'financial'].includes(profile?.role || '') && (
            <NavCard
              title="Pacientes"
              desc="Cadastros completos e prontuários."
              icon="👥"
              onClick={() => router.push('/dashboard/patients')}
            />
          )}

          {/* Financeiro */}
          {['clinic_admin', 'financial'].includes(profile?.role || '') && (
            <NavCard
              title="Financeiro"
              desc="Fluxo de caixa e faturamento."
              icon="💰"
              onClick={() => console.log('Financeiro')}
              disabled={true} // Placeholder
            />
          )}

          {/* Equipe */}
          {['clinic_admin', 'master'].includes(profile?.role || '') && (
            <NavCard
              title="Equipe"
              desc="Gerenciar permissões e usuários."
              icon="👔"
              onClick={() => router.push('/dashboard/team')}
            />
          )}
        </section>

      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, sub }: any) {
  return (
    <div className="glass-panel p-6 rounded-xl border border-[#18A8FF]/20 flex items-center justify-between hover:border-[#18A8FF]/50 transition-all bg-[#0E121F]">
      <div>
        <p className="text-gray-400 text-sm mb-1">{title}</p>
        <h3 className={`text-3xl font-bold ${color}`}>{value}</h3>
        {sub && <p className="text-xs text-gray-500">{sub}</p>}
      </div>
      <div className="text-3xl opacity-80">{icon}</div>
    </div>
  )
}

function NavCard({ title, desc, icon, onClick, disabled }: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-6 bg-[#0E121F] border border-[#18A8FF]/10 rounded-xl text-left transition-all group w-full ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#18A8FF] hover:bg-[#18A8FF]/5'}`}
    >
      <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#18A8FF] transition-colors">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </button>
  )
}
