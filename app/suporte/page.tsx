"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";

const FAQs = [
    {
        q: "Como recupero minha senha?",
        a: "Na tela de login, clique em 'Esqueci minha senha'. Você receberá um e-mail com instruções para redefinição. Se for seu primeiro acesso, use a senha temporária enviada pelo administrador."
    },
    {
        q: "Posso adicionar mais dentistas?",
        a: "Sim! Se você é administrador da clínica, vá até o menu 'Equipe' no painel e clique em 'Novo Membro'. O número de usuários depende do seu plano contratado."
    },
    {
        q: "O sistema funciona no celular?",
        a: "Perfeitamente. O OdontoFlow é 100% responsivo e pode ser acessado de qualquer smartphone, tablet ou computador."
    },
    {
        q: "Como funciona o backup dos dados?",
        a: "Realizamos backups automáticos e diários de todos os dados da sua clínica. Tudo é armazenado com criptografia de ponta a ponta para garantir segurança total."
    },
    {
        q: "Preciso instalar algum programa?",
        a: "Não. O OdontoFlow é 100% online (SaaS). Você só precisa de um navegador e acesso à internet."
    }
];

export default function SupportPage() {
    return (
        <div className="bg-[#060B16] min-h-screen flex flex-col font-inter text-[#B0B7C3]">
            <Header />

            <main className="flex-grow pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto space-y-16">

                    {/* Hero Section */}
                    <div className="text-center space-y-6">
                        <h1 className="text-5xl font-bold font-poppins text-white">
                            Central de <span className="text-[#18A8FF]">Ajuda</span>
                        </h1>
                        <p className="text-xl max-w-2xl mx-auto">
                            Estamos aqui para ajudar sua clínica a não parar nunca. Tire suas dúvidas ou fale diretamente com nosso time.
                        </p>

                        <a
                            href="https://wa.me/5511939479749"
                            target="_blank"
                            className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#1da851] transition-transform hover:scale-105 shadow-[0_0_20px_rgba(37,211,102,0.4)]"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-8.68-2.031-.967-.272-.297-.471-.446-.917-.446-.445 0-.965-.003-1.488.568-.158.174-2.008 1.956-2.008 4.771s2.055 5.538 2.28 5.836c.224.297 3.992 6.095 9.771 8.526 3.957 1.665 4.767 1.334 5.61 1.251.842-.083 2.709-1.107 3.08-2.175.372-1.069.372-1.983.272-2.175z" /></svg>
                            Falar com Suporte (11 93947-9749)
                        </a>
                    </div>

                    {/* FAQ Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-white mb-8 text-center">Perguntas Frequentes</h2>
                        <div className="grid gap-6">
                            {FAQs.map((faq, i) => (
                                <div key={i} className="glass-panel p-6 rounded-xl border border-[#18A8FF]/10 hover:border-[#18A8FF]/30 transition-all">
                                    <h3 className="text-xl font-bold text-white mb-2">{faq.q}</h3>
                                    <p className="text-[#B0B7C3] leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
