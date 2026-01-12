"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import { getCurrentProfile } from "@/app/lib/getCurrentProfile";

export default function FinancialPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [clinicId, setClinicId] = useState<string | null>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0, receivable: 0 });

    // UI State
    const [tab, setTab] = useState<'overview' | 'add'>('overview');
    const [form, setForm] = useState({
        desc: "", amount: "", type: "income", category: "", status: "paid", due_date: ""
    });
    const [msg, setMsg] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            const { session, profile: p } = await getCurrentProfile();
            if (!session || !p) { router.push('/login'); return; }
            if (!['clinic_admin', 'financial', 'master'].includes(p.role || '')) {
                router.push('/dashboard'); return;
            }

            setClinicId(p.clinic_id);
            if (p.clinic_id) fetchFinancials(p.clinic_id);
            setLoading(false);
        }
        init();
    }, [router]);

    const fetchFinancials = async (cid: string) => {
        const { data } = await supabase.from('financial_transactions')
            .select('*')
            .eq('clinic_id', cid)
            .order('due_date', { ascending: false });

        if (data) {
            setTransactions(data);
            calculateSummary(data);
        }
    }

    const calculateSummary = (data: any[]) => {
        let inc = 0, exp = 0, rec = 0;
        data.forEach(t => {
            const val = Number(t.amount);
            if (t.type === 'income' && t.status === 'paid') inc += val;
            if (t.type === 'expense' && t.status === 'paid') exp += val;
            if (t.type === 'income' && (t.status === 'pending' || t.status === 'overdue')) rec += val;
        });
        setSummary({ income: inc, expense: exp, balance: inc - exp, receivable: rec });
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg(null);
        if (!clinicId) return;

        const { error } = await supabase.from('financial_transactions').insert({
            clinic_id: clinicId,
            description: form.desc,
            amount: parseFloat(form.amount),
            type: form.type,
            category: form.category,
            status: form.status,
            due_date: form.due_date || new Date().toISOString()
        });

        if (error) {
            setMsg("Erro: " + error.message);
        } else {
            setMsg("Transação salva!");
            setForm({ desc: "", amount: "", type: "income", category: "", status: "paid", due_date: "" });
            fetchFinancials(clinicId);
            setTimeout(() => setTab('overview'), 1000);
        }
    }

    if (loading) return <div className="p-8 text-white min-h-screen bg-[#060B16] flex items-center justify-center">Carregando...</div>;

    return (
        <div className="min-h-screen bg-[#060B16] text-[#D7DEE8] p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8 border-b border-[#18A8FF]/20 pb-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push('/dashboard')} className="text-[#18A8FF] hover:text-white transition-colors">&larr; Voltar</button>
                        <h1 className="text-2xl font-bold text-white">Gestão Financeira</h1>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setTab('overview')} className={`px-4 py-2 rounded text-sm ${tab === 'overview' ? 'bg-[#18A8FF] text-white' : 'border border-[#18A8FF]/30 text-[#18A8FF]'}`}>Visão Geral</button>
                        <button onClick={() => setTab('add')} className={`px-4 py-2 rounded text-sm ${tab === 'add' ? 'bg-[#18A8FF] text-white' : 'border border-[#18A8FF]/30 text-[#18A8FF]'}`}>+ Nova Transação</button>
                    </div>
                </header>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="glass-panel p-6 rounded-xl border border-green-500/20">
                        <p className="text-gray-400 text-xs uppercase mb-2">Entradas (Recebido)</p>
                        <h3 className="text-2xl font-bold text-green-400">R$ {summary.income.toFixed(2)}</h3>
                    </div>
                    <div className="glass-panel p-6 rounded-xl border border-red-500/20">
                        <p className="text-gray-400 text-xs uppercase mb-2">Saídas (Pago)</p>
                        <h3 className="text-2xl font-bold text-red-400">R$ {summary.expense.toFixed(2)}</h3>
                    </div>
                    <div className="glass-panel p-6 rounded-xl border border-[#18A8FF]/20">
                        <p className="text-gray-400 text-xs uppercase mb-2">Saldo Atual</p>
                        <h3 className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-[#18A8FF]' : 'text-red-500'}`}>R$ {summary.balance.toFixed(2)}</h3>
                    </div>
                    <div className="glass-panel p-6 rounded-xl border border-yellow-500/20">
                        <p className="text-gray-400 text-xs uppercase mb-2">A Receber</p>
                        <h3 className="text-2xl font-bold text-yellow-400">R$ {summary.receivable.toFixed(2)}</h3>
                    </div>
                </div>

                {tab === 'add' && (
                    <div className="glass-panel p-8 rounded-xl border border-[#18A8FF]/20 max-w-2xl mx-auto mb-8">
                        <h3 className="text-lg font-bold text-white mb-6">Lançar Transação</h3>
                        {msg && <div className={`p-3 mb-4 rounded ${msg.includes('Erro') ? 'bg-red-900/30 text-red-300' : 'bg-green-900/30 text-green-300'}`}>{msg}</div>}

                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase">Tipo</label>
                                    <select className="w-full bg-[#0B0F1A] border border-[#18A8FF]/20 p-2 rounded text-white outline-none"
                                        value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                        <option value="income">Entrada</option>
                                        <option value="expense">Saída</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase">Status</label>
                                    <select className="w-full bg-[#0B0F1A] border border-[#18A8FF]/20 p-2 rounded text-white outline-none"
                                        value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                                        <option value="paid">Pago / Recebido</option>
                                        <option value="pending">Pendente</option>
                                        <option value="overdue">Atrasado</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 uppercase">Descrição</label>
                                <input required className="w-full bg-[#0B0F1A] border border-[#18A8FF]/20 p-2 rounded text-white outline-none"
                                    value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase">Valor (R$)</label>
                                    <input type="number" step="0.01" required className="w-full bg-[#0B0F1A] border border-[#18A8FF]/20 p-2 rounded text-white outline-none"
                                        value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase">Data Vencimento</label>
                                    <input type="date" required className="w-full bg-[#0B0F1A] border border-[#18A8FF]/20 p-2 rounded text-white outline-none"
                                        value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 uppercase">Categoria</label>
                                <input list="cats" className="w-full bg-[#0B0F1A] border border-[#18A8FF]/20 p-2 rounded text-white outline-none"
                                    value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                                <datalist id="cats">
                                    <option value="Consulta Particular" />
                                    <option value="Procedimento" />
                                    <option value="Aluguel" />
                                    <option value="Laboratório" />
                                    <option value="Material" />
                                </datalist>
                            </div>

                            <button className="w-full btn-primary py-3 rounded font-bold mt-4">Salvar Lançamento</button>
                        </form>
                    </div>
                )}

                {/* Transaction List */}
                <div className="glass-panel rounded-xl border border-[#18A8FF]/10 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#0B0F1A] text-gray-400 border-b border-[#18A8FF]/10">
                            <tr>
                                <th className="p-4 font-normal uppercase text-xs tracking-wider">Descrição</th>
                                <th className="p-4 font-normal uppercase text-xs tracking-wider">Categoria</th>
                                <th className="p-4 font-normal uppercase text-xs tracking-wider">Vencimento</th>
                                <th className="p-4 font-normal uppercase text-xs tracking-wider">Status</th>
                                <th className="p-4 font-normal uppercase text-xs tracking-wider text-right">Valor</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#18A8FF]/5">
                            {transactions.map((t) => (
                                <tr key={t.id} className="hover:bg-[#18A8FF]/5 transition-colors">
                                    <td className="p-4 font-medium text-white">{t.description}</td>
                                    <td className="p-4 text-gray-400">{t.category}</td>
                                    <td className="p-4 text-gray-400">{new Date(t.due_date).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs uppercase ${t.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                                                t.status === 'overdue' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-yellow-500/20 text-yellow-400'
                                            }`}>{t.status === 'paid' ? (t.type === 'income' ? 'Recebido' : 'Pago') : t.status}</span>
                                    </td>
                                    <td className={`p-4 text-right font-bold ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                                        {t.type === 'expense' ? '-' : '+'} R$ {Number(t.amount).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr><td colSpan={5} className="p-6 text-center text-gray-500">Nenhuma transação encontrada.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
