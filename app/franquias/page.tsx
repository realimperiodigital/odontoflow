import Header from "../components/Header";
import Footer from "../components/Footer";

export default function FranquiasPage() {
    return (
        <div className="min-h-screen bg-[#060B16] text-gray-300">
            <Header />
            <main className="pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                            Controle Total para <span className="text-[#18A8FF]">Redes e Franquias</span>
                        </h1>
                        <p className="text-xl text-[#B0B7C3] mb-8">
                            Padronize a gestão de dezenas ou centenas de unidades. Tenha visão consolidada de faturamento, performance e qualidade.
                        </p>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded bg-[#18A8FF]/10 flex items-center justify-center text-[#18A8FF] text-2xl flex-shrink-0">📊</div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Dashboard do Franqueador</h3>
                                    <p className="text-sm">Compare o desempenho de unidades em tempo real. Identifique gargalos e top performers.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded bg-[#18A8FF]/10 flex items-center justify-center text-[#18A8FF] text-2xl flex-shrink-0">🎨</div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Padronização</h3>
                                    <p className="text-sm">Defina tabelas de preço, modelos de contrato e protocolos de atendimento unificados.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded bg-[#18A8FF]/10 flex items-center justify-center text-[#18A8FF] text-2xl flex-shrink-0">💸</div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Royalty Split</h3>
                                    <p className="text-sm">Cálculo e cobrança de royalties automatizada direto no fluxo financeiro.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10">
                            <a href="https://wa.me/5511939479749" className="btn-primary px-8 py-4 rounded-lg inline-block">Agendar Reunião Corporativa</a>
                        </div>
                    </div>

                    <div className="glass-panel p-8 rounded-2xl border border-[#18A8FF]/20 min-h-[400px] flex items-center justify-center bg-gradient-to-br from-[#0A2A5E]/40 to-transparent">
                        <div className="text-center">
                            <div className="text-6xl mb-4">🏢</div>
                            <h3 className="text-2xl font-bold text-white">Área Restrita</h3>
                            <p className="text-sm text-gray-400 mt-2">Portal exclusivo para franqueados e master franqueadores.</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
