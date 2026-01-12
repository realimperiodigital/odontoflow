"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import { getCurrentProfile } from "@/app/lib/getCurrentProfile";

const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8h to 18h

export default function AgendaPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [clinicId, setClinicId] = useState<string | null>(null);
    const [dentists, setDentists] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [appointments, setAppointments] = useState<any[]>([]);

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ dentistId: string, hour: number } | null>(null);

    useEffect(() => {
        const init = async () => {
            const { session, profile: p } = await getCurrentProfile();
            if (!session || !p) { router.push('/login'); return; }

            setClinicId(p.clinic_id);
            if (p.clinic_id) {
                // Fetch Dentists
                const { data: dData } = await supabase.from('profiles').select('*').eq('clinic_id', p.clinic_id).in('role', ['dentist', 'clinic_admin']);
                setDentists(dData || []);

                fetchAppointments(p.clinic_id, selectedDate);
            }
            setLoading(false);
        }
        init();
    }, [router]);

    // Re-fetch when date changes
    useEffect(() => {
        if (clinicId) fetchAppointments(clinicId, selectedDate);
    }, [selectedDate]);

    const fetchAppointments = async (cid: string, date: string) => {
        const start = `${date}T00:00:00`;
        const end = `${date}T23:59:59`;

        const { data } = await supabase.from('appointments')
            .select(`
                *,
                patient:patients(name)
            `)
            .eq('clinic_id', cid)
            .gte('start_time', start)
            .lte('start_time', end);

        setAppointments(data || []);
    }

    const getAppointmentForSlot = (dentistId: string, hour: number) => {
        return appointments.find(app => {
            const appDate = new Date(app.start_time);
            return app.dentist_id === dentistId && appDate.getHours() === hour;
        });
    }

    const handleSlotClick = (dentistId: string, hour: number) => {
        const app = getAppointmentForSlot(dentistId, hour);
        if (app) {
            alert(`Paciente: ${app.patient?.name}\nStatus: ${app.status}\nObs: ${app.notes}`);
        } else {
            // Open booking modal
            setSelectedSlot({ dentistId, hour });
            setShowModal(true);
        }
    }

    if (loading) return <div className="p-8 text-white min-h-screen bg-[#060B16] flex items-center justify-center">Carregando...</div>;

    return (
        <div className="min-h-screen bg-[#060B16] text-[#D7DEE8] p-8">
            <div className="max-w-full mx-auto">
                <header className="flex justify-between items-center mb-8 border-b border-[#18A8FF]/20 pb-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push('/dashboard')} className="text-[#18A8FF] hover:text-white transition-colors">&larr; Voltar</button>
                        <h1 className="text-2xl font-bold text-white">Agenda Clínica</h1>
                    </div>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        className="bg-[#0B0F1A] border border-[#18A8FF]/50 p-2 rounded text-white"
                    />
                </header>

                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full">
                        {/* Header Row: Dentists */}
                        <div className="flex border-b border-[#18A8FF]/20">
                            <div className="w-20 p-4 border-r border-[#18A8FF]/20 bg-[#0E121F] sticky left-0 z-10">Horário</div>
                            {dentists.map((d) => (
                                <div key={d.id} className="min-w-[200px] flex-1 p-4 border-r border-[#18A8FF]/20 bg-[#0E121F] text-center font-bold text-[#18A8FF]">
                                    {d.full_name}
                                </div>
                            ))}
                        </div>

                        {/* Grid */}
                        <div className="bg-[#0B0F1A]">
                            {HOURS.map(hour => (
                                <div key={hour} className="flex border-b border-[#18A8FF]/10 h-24">
                                    <div className="w-20 p-2 border-r border-[#18A8FF]/20 flex items-center justify-center text-sm text-gray-500 bg-[#0E121F] sticky left-0 font-mono">
                                        {hour}:00
                                    </div>
                                    {dentists.map(d => {
                                        const app = getAppointmentForSlot(d.user_id, hour);
                                        const statusColors = {
                                            confirmed: 'bg-green-500/20 border-green-500 text-green-300',
                                            pending: 'bg-yellow-500/20 border-yellow-500 text-yellow-300',
                                            missed: 'bg-red-500/20 border-red-500 text-red-300',
                                            rescheduled: 'bg-blue-500/20 border-blue-500 text-blue-300'
                                        };

                                        return (
                                            <div
                                                key={d.id}
                                                className={`min-w-[200px] flex-1 border-r border-[#18A8FF]/10 p-1 relative group cursor-pointer hover:bg-[#18A8FF]/5 transition-colors`}
                                                onClick={() => handleSlotClick(d.user_id, hour)}
                                            >
                                                {app ? (
                                                    <div className={`w-full h-full rounded border-l-4 p-2 text-xs flex flex-col justify-between ${statusColors[app.status as keyof typeof statusColors] || 'bg-gray-700'}`}>
                                                        <span className="font-bold truncate">{app.patient?.name}</span>
                                                        <span className="opacity-70">{app.status}</span>
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 text-[#18A8FF] text-2xl font-bold">
                                                        +
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal Placeholder */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="glass-panel p-8 rounded-xl w-96">
                        <h2 className="text-xl font-bold text-white mb-4">Novo Agendamento</h2>
                        <p className="text-gray-400 mb-6">
                            Para: {dentists.find(d => d.user_id === selectedSlot?.dentistId)?.full_name} <br />
                            Data: {selectedDate} às {selectedSlot?.hour}:00
                        </p>
                        <p className="text-yellow-500 text-sm mb-6">⚠ Funcionalidade de agendamento completo em desenvolvimento.</p>
                        <div className="flex gap-2">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-2 border border-[#18A8FF] rounded text-[#18A8FF]">Cancelar</button>
                            <button className="flex-1 py-2 btn-primary rounded">Agendar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
