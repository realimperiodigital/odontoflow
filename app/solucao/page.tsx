import Header from "../components/Header";
import Footer from "../components/Footer";
import WhatsAppCTA from "../components/WhatsAppCTA";

export default function SolucaoPage() {
  return (
    <main className="min-h-screen bg-[#05060a] text-white">
      <Header />

      {/* HERO COM VIDEO */}
      <section className="relative overflow-hidden">
        {/* Vídeo */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/media/clinic.mp4" type="video/mp4" />
        </video>

        {/* Camada escura */}
        <div className="absolute inset-0 bg-black/65" />

        {/* Gradiente */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#05060a]/30 via-[#05060a]/70 to-[#05060a]" />

        {/* Conteúdo */}
        <div className="relative mx-auto w-full max-w-6xl px-6 pt-16 pb-20">
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
            A solução para clínicas que querem{" "}
            <span className="text-white/80">agenda cheia</span>
          </h1>

          <p className="mt-4 max-w-xl text-white/80">
            O OdontoFlow automatiza confirmações, reduz faltas e organiza sua
            clínica para você atender mais pacientes todos os dias.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <WhatsAppCTA label="Teste grátis por 7 dias" />
            <WhatsAppCTA label="Falar com especialista" variant="ghost" />
          </div>
        </div>
      </section>

      {/* CONTEÚDO */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold">
              Menos faltas. Mais pacientes. Mais faturamento.
            </h2>
            <p className="mt-4 text-white/70">
              Com confirmações automáticas no WhatsApp, sua clínica evita
              horários vazios e mantém a agenda sempre cheia.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <ul className="space-y-3 text-white/80 text-sm">
              <li>✅ Confirmação automática de consultas</li>
              <li>✅ Reagendamento fácil</li>
              <li>✅ Agenda inteligente</li>
              <li>✅ Cadastro de pacientes</li>
              <li>✅ Histórico de atendimentos</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <WhatsAppCTA label="Quero testar o OdontoFlow agora" />
        </div>
      </section>

      <Footer />
    </main>
  );
}
