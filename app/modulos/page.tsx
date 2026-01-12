import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ModulosPage() {
    const modules = [
        { title: "Agenda Inteligente", desc: "Confirmação via WhatsApp, lista de espera automática e encaixes inteligentes.", icon: "📅" },
        { title: "Prontuário Eletrônico", desc: "100% digital, seguro e acessível de qualquer dispositivo.", icon: "📝" },
        { title: "Financeiro Completo", desc: "Contas a pagar/receber, DRE gerencial e controle de estoque.", icon: "💰" },
        { title: "Marketing & CRM", desc: "Campanhas de retorno, felicitações automáticas e reativação de pacientes.", icon: "📢" },
        { title: "Telemedicina", desc: "Videochamadas integradas para triagem e acompanhamento.", icon: "🎥" },
        { title: "App do Paciente", desc: "Seu paciente agenda, vê tratamentos e paga pelo próprio celular.", icon: "📱" },
    ];

    return (
        <div className="min-h-screen bg-[#060B16] text-gray-300">
            <Header />
            <main className="pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Módulos do Sistema</h1>
                        <p className="text-xl text-[#B0B7C3] max-w-2xl mx-auto">
                            Tudo o que você precisa, integrado em uma única plataforma.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {modules.map((mod, idx) => (
                            <div key={idx} className="glass-panel p-6 rounded-xl border border-white/5 hover:border-[#18A8FF] transition-all group">
                                <div className="text-4xl mb-4 bg-[#18A8FF]/10 w-16 h-16 flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform">
                                    {mod.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{mod.title}</h3>
                                <p className="text-sm leading-relaxed text-gray-400">{mod.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
