import Header from "../components/Header";
import Footer from "../components/Footer";

export default function SolucaoPage() {
    return (
        <div className="min-h-screen bg-[#060B16] text-gray-300">
            <Header />
            <main className="pt-24 pb-20">
                <div className="max-w-4xl mx-auto px-6">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">A Solução Completa</h1>
                    <p className="text-xl text-[#B0B7C3] mb-12">
                        O OdontoFlow não é apenas um software. É o sistema operacional do seu crescimento.
                    </p>

                    <div className="space-y-12">
                        <section className="glass-panel p-8 rounded-2xl border border-[#18A8FF]/20">
                            <h2 className="text-2xl font-bold text-[#18A8FF] mb-4">Gestão Clínica de Verdade</h2>
                            <p className="mb-4">Esqueça prontuários de papel e planilhas confusas. Tenha o histórico completo do paciente, odontograma digital, anamnese e planos de tratamento em um só lugar.</p>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-400">
                                <li>Odontograma visual interativo</li>
                                <li>Alertas de alergias e medicamentos</li>
                                <li>Evolução clínica detalhada</li>
                            </ul>
                        </section>

                        <section className="glass-panel p-8 rounded-2xl border border-[#18A8FF]/20">
                            <h2 className="text-2xl font-bold text-[#18A8FF] mb-4">Inteligência Financeira</h2>
                            <p className="mb-4">Saiba exatamente quanto sua clínica fatura, gasta e lucra. Controle comissões de dentistas automaticamente e reduza a inadimplência com lembretes de cobrança.</p>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-400">
                                <li>Fluxo de caixa em tempo real</li>
                                <li>Split de pagamentos automático (para franquias)</li>
                                <li>Emissão de boletos e notas fiscais (integrado)</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
