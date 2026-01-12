import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PlanosPage() {
    return (
        <div className="min-h-screen bg-[#060B16] text-gray-300">
            <Header />
            <main className="pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Planos que cabem no seu bolso</h1>
                    <p className="text-xl text-[#B0B7C3] mb-16">
                        Comece grátis. Cresça sem limites.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Basic */}
                        <div className="glass-panel p-8 rounded-2xl border border-white/5 flex flex-col items-center">
                            <h3 className="text-xl font-bold text-white mb-2">Individual</h3>
                            <div className="text-4xl font-bold text-[#18A8FF] mb-4">R$ 97<span className="text-sm text-gray-400">/mês</span></div>
                            <p className="text-sm text-gray-500 mb-8">Para consultórios iniciantes.</p>
                            <ul className="space-y-4 text-left w-full text-sm mb-8 flex-grow">
                                <li className="flex gap-2"><span>✓</span> 1 Dentista</li>
                                <li className="flex gap-2"><span>✓</span> Agenda e Prontuário</li>
                                <li className="flex gap-2"><span>✓</span> 500 SMS/mês</li>
                            </ul>
                            <button className="w-full py-3 rounded border border-[#18A8FF] text-[#18A8FF] hover:bg-[#18A8FF]/10 transition-colors font-bold">Assinar Agora</button>
                        </div>

                        {/* Pro */}
                        <div className="glass-panel p-8 rounded-2xl border border-[#18A8FF] relative transform scale-105 shadow-[0_0_30px_rgba(24,168,255,0.2)]">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#18A8FF] text-white px-4 py-1 rounded-full text-xs font-bold uppercase">Mais Popular</div>
                            <h3 className="text-xl font-bold text-white mb-2">Clínica</h3>
                            <div className="text-4xl font-bold text-[#18A8FF] mb-4">R$ 197<span className="text-sm text-gray-400">/mês</span></div>
                            <p className="text-sm text-gray-500 mb-8">Para clínicas em crescimento.</p>
                            <ul className="space-y-4 text-left w-full text-sm mb-8 flex-grow text-gray-200">
                                <li className="flex gap-2 text-[#18A8FF]"><span>✓</span> Até 5 Dentistas</li>
                                <li className="flex gap-2 text-[#18A8FF]"><span>✓</span> Financeiro Completo</li>
                                <li className="flex gap-2 text-[#18A8FF]"><span>✓</span> Confirmação WhatsApp</li>
                                <li className="flex gap-2 text-[#18A8FF]"><span>✓</span> CRM de Vendas</li>
                            </ul>
                            <button className="w-full py-3 rounded bg-[#18A8FF] text-white hover:bg-[#0093E9] transition-colors font-bold shadow-lg">Assinar Agora</button>
                        </div>

                        {/* Enterprise */}
                        <div className="glass-panel p-8 rounded-2xl border border-white/5 flex flex-col items-center">
                            <h3 className="text-xl font-bold text-white mb-2">Rede / Franquia</h3>
                            <div className="text-4xl font-bold text-white mb-4">Sob Consulta</div>
                            <p className="text-sm text-gray-500 mb-8">Para grandes operações.</p>
                            <ul className="space-y-4 text-left w-full text-sm mb-8 flex-grow">
                                <li className="flex gap-2"><span>✓</span> Dentistas Ilimitados</li>
                                <li className="flex gap-2"><span>✓</span> Gestão Multi-unidade</li>
                                <li className="flex gap-2"><span>✓</span> API Dedicada</li>
                                <li className="flex gap-2"><span>✓</span> Gerente de Contas</li>
                            </ul>
                            <button className="w-full py-3 rounded border border-white/20 text-white hover:bg-white/5 transition-colors font-bold">Falar com Consultor</button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
