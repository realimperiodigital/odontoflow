"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import { getCurrentProfile } from "@/app/lib/getCurrentProfile";

export default function ReportsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const init = async () => {
            const { session, profile: p } = await getCurrentProfile();
            if (!session || !p) { router.push('/login'); return; }
            // Access control
            if (!['clinic_admin', 'master'].includes(p.role || '')) {
                router.push('/dashboard'); return;
            }

            if (p.clinic_id) await fetchReports(p.clinic_id);
            setLoading(false);
        }
        init();
    }, [router]);

    const fetchReports = async (cid: string) => {
        // Mocking aggregation logic for MVP (Supabase doesn't do complex aggregation easily via JS client without RPCs, assuming raw data fetch for small scale)

        // 1. Attendance & Absences
        const { data: apps } = await supabase.from('appointments').select('status').eq('clinic_id', cid);
        const totalApps = apps?.length || 0;
        const confirmed = apps?.filter(a => a.status === 'confirmed').length || 0;
        const missed = apps?.filter(a => a.status === 'missed').length || 0;
        const attendanceRate = totalApps ? ((confirmed / totalApps) * 100).toFixed(1) : 0;

        // 2. New Patients (Last 30 days)
        const day30 = new Date();
        day30.setDate(day30.getDate() - 30);
        const { count: newPatients } = await supabase.from('patients').select('*', { count: 'exact', head: true })
            .eq('clinic_id', cid)
            .gte('created_at', day30.toISOString());

        // 3. Production per Dentist (Sum of income transactions linked to dentist)
        // This requires link in financial_transactions.
        // We'll fetch income transactions that have a dentist_id
        const { data: income } = await supabase.from('financial_transactions')
            .select('amount, dentist_id')
            .eq('clinic_id', cid)
            .eq('type', 'income')
            .not('dentist_id', 'is', null);

        // Group by dentist (Wait, we need dentist names... fetching profiles)
        const productionMap: Record<string, number> = {};
        income?.forEach((t: any) => {
            productionMap[t.dentist_id] = (productionMap[t.dentist_id] || 0) + Number(t.amount);
        });

        // Fetch dentist names
        const dentistIds = Object.keys(productionMap);
        let dentistNames: Record<string, string> = {};
        if (dentistIds.length > 0) {
            const { data: profiles } = await supabase.from('profiles').select('user_id, full_name').in('user_id', dentistIds);
            profiles?.forEach(p => dentistNames[p.user_id] = p.full_name || 'Desconhecido');
        }

        const productionList = dentistIds.map(id => ({
            name: dentistNames[id],
            value: productionMap[id]
        })).sort((a, b) => b.value - a.value);


        setStats({
            attendance: { rate: attendanceRate, confirmed, missed },
            newPatients,
            production: productionList
        });
    }

    if (loading) return <div className="p-8 text-white min-h-screen bg-[#060B16] flex items-center justify-center">Carregando...</div>;

    return (
        <div className="min-h-screen bg-[#060B16] text-[#D7DEE8] p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8 border-b border-[#18A8FF]/20 pb-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push('/dashboard')} className="text-[#18A8FF] hover:text-white transition-colors">&larr; Voltar</button>
                        <h1 className="text-2xl font-bold text-white">Relatórios & Métricas</h1>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Attendance Card */}
                    <div className="glass-panel p-6 rounded-xl border border-[#18A8FF]/20">
                        <h3 className="text-lg font-bold text-white mb-4">Comparecimento</h3>
                        <div className="flex items-center justify-center h-40">
                            <div className="text-center">
                                <div className="text-5xl font-bold text-[#18A8FF] mb-2">{stats?.attendance?.rate}%</div>
                                <p className="text-sm text-gray-400">Taxa de Comparecimento</p>
                            </div>
                        </div>
                        <div className="flex justify-between mt-4 text-sm border-t border-white/5 pt-4">
                            <span className="text-green-400">✅ Confirmados: {stats?.attendance?.confirmed}</span>
                            <span className="text-red-400">❌ Faltas: {stats?.attendance?.missed}</span>
                        </div>
                    </div>

                    {/* New Patients */}
                    <div className="glass-panel p-6 rounded-xl border border-[#18A8FF]/20">
                        <h3 className="text-lg font-bold text-white mb-4">Novos Pacientes</h3>
                        <div className="flex items-center justify-between h-40 px-4">
                            <div>
                                <div className="text-5xl font-bold text-green-400 mb-2">+{stats?.newPatients}</div>
                                <p className="text-sm text-gray-400">Últimos 30 dias</p>
                            </div>
                            <div className="text-5xl opacity-20">👥</div>
                        </div>
                    </div>

                    {/* Growth Placeholder */}
                    <div className="glass-panel p-6 rounded-xl border border-[#18A8FF]/20">
                        <h3 className="text-lg font-bold text-white mb-4">Crescimento da Clínica</h3>
                        <div className="h-40 flex items-end justify-between px-2 gap-2">
                            {/* Fake bars for MVP visual */}
                            <div className="w-8 bg-[#18A8FF]/20 h-[40%] rounded-t" />
                            <div className="w-8 bg-[#18A8FF]/30 h-[50%] rounded-t" />
                            <div className="w-8 bg-[#18A8FF]/40 h-[45%] rounded-t" />
                            <div className="w-8 bg-[#18A8FF]/60 h-[70%] rounded-t" />
                            <div className="w-8 bg-[#18A8FF] h-[90%] rounded-t" />
                        </div>
                        <p className="text-center text-xs text-gray-400 mt-4">Histórico de pacientes (Simulação)</p>
                    </div>

                    {/* Production by Dentist */}
                    <div className="glass-panel p-6 rounded-xl border border-[#18A8FF]/20 md:col-span-2 lg:col-span-3">
                        <h3 className="text-lg font-bold text-white mb-6">Produção por Dentista</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="text-gray-500 border-b border-white/5">
                                    <tr>
                                        <th className="pb-3">Dentista</th>
                                        <th className="pb-3 text-right">Produção Total (Recebida/Pendente)</th>
                                        <th className="pb-3 w-1/3">Performance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {stats?.production?.map((d: any, idx: number) => (
                                        <tr key={idx}>
                                            <td className="py-4 font-bold text-white">{d.name}</td>
                                            <td className="py-4 text-right text-green-400 font-mono">R$ {d.value.toFixed(2)}</td>
                                            <td className="py-4 pl-6">
                                                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#18A8FF]" style={{ width: `${(d.value / (stats?.production[0]?.value || 1)) * 100}%` }} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!stats?.production || stats.production.length === 0) && (
                                        <tr><td colSpan={3} className="py-6 text-center text-gray-500">Sem dados financeiros vinculados a dentistas.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
