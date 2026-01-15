import Header from "../components/Header";
import Footer from "../components/Footer";
import WhatsAppCTA from "../components/WhatsAppCTA";

export default function ModulosPage() {
  return (
    <main className="min-h-screen bg-[#05060a] text-white">
      <Header />

      {/* HERO COM VIDEO */}
      <section className="relative overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/media/finance.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/65" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#05060a]/30 via-[#05060a]/70 to-[#05060a]" />

        <div className="relative mx-auto w-full max-w-6xl px-6 pt-16 pb-20">
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
            Módulos do <span className="text-white/80">OdontoFlow</span>
          </h1>

          <p className="mt-4 max-w-2xl text-white/80">
            Tudo que sua clínica precisa para organizar atendimento, reduzir faltas e ganhar escala.
            Clique no teste grátis e eu ativo sua clínica no sistema.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <WhatsAppCTA label="Teste grátis por 7 dias" />
            <WhatsAppCTA label="Ver módulos no WhatsApp" variant="ghost" />
          </div>
        </div>
      </section>

      {/* LISTA DE MÓDULOS */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-semibold">Principais módulos</h2>
        <p className="mt-2 text-white/70">
          Estrutura simples, completa e feita para clínica pequena ou rede.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            ["Agenda inteligente", "Organize horários, encaixes e rotina da clínica sem bagunça."],
            ["Pacientes", "Cadastro rápido com histórico para facilitar o atendimento."],
            ["Confirmação no WhatsApp", "Reduza faltas com lembretes e confirmações automáticas."],
            ["Recepção e fluxo", "Atendimento mais rápido e controle do dia em 1 clique."],
            ["Relatórios", "Visão clara de atendimentos e produtividade."],
            ["Usuários e permissões", "Cada pessoa com seu acesso: recepção, dentista e gestão."],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-base font-semibold">{title}</div>
              <div className="mt-2 text-sm text-white/70">{desc}</div>
              <div className="mt-4">
                <WhatsAppCTA label="Quero testar isso" variant="ghost" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <WhatsAppCTA label="Quero meu teste grátis agora" />
        </div>
      </section>

      <Footer />
    </main>
  );
}
