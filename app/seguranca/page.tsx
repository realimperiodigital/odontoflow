import Header from "../components/Header";
import Footer from "../components/Footer";

export default function SegurancaPage() {
    return (
        <div className="min-h-screen bg-[#060B16] text-gray-300">
            <Header />
            <main className="pt-24 pb-20">
                <div className="max-w-4xl mx-auto px-6">
                    <h1 className="text-4xl font-bold text-white mb-8 text-center">Segurança e LGPD</h1>

                    <div className="space-y-8 glass-panel p-10 rounded-2xl border border-white/5">
                        <section>
                            <h2 className="text-2xl font-bold text-[#18A8FF] mb-4">Criptografia de Ponta a Ponta</h2>
                            <p>Todos os dados trafegados entre seu consultório e nossos servidores são protegidos com criptografia SSL/TLS de 256 bits, o mesmo padrão usado por bancos globais.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[#18A8FF] mb-4">Conformidade com a LGPD</h2>
                            <p>O OdontoFlow foi desenhado desde o início ("Privacy by Design") para respeitar a Lei Geral de Proteção de Dados.</p>
                            <ul className="list-disc pl-5 mt-4 space-y-2 text-sm">
                                <li>Consentimento granular para uso de dados.</li>
                                <li>Logs de auditoria de acesso (saiba quem viu cada prontuário).</li>
                                <li>Direito ao esquecimento e exportação de dados facilitada.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[#18A8FF] mb-4">Backups Diários</h2>
                            <p>Nunca perca um dado. Realizamos backups automáticos diários em servidores redundantes (AWS/Google Cloud) para garantir a continuidade do seu negócio mesmo em caso de catástrofes.</p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
