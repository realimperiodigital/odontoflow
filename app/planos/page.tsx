import Header from "../components/Header";
import Footer from "../components/Footer";
import WhatsAppCTA from "../components/WhatsAppCTA";

export default function PlanosPage() {
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
          <source src="/media/system.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/65" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#05060a]/30 via-[#05060a]/70 to-[#05060a]" />

        <div className="relative mx-auto w-full max-w-6xl px-6 pt-16 pb-20">
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
            Planos do <span className="text-white/80">OdontoFlow</span>
          </h1>

          <p className="mt-4 max-w-2xl text-white/80">
            Escolha o plano ideal para sua clínica. Se preferir, me chama no WhatsApp
            que eu te indico o melhor e ativo o teste grátis agora.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <WhatsAppCTA label="✅ Teste grátis por 7 dias" />
            <WhatsAppCTA label="Quero ajuda para escolher" variant="ghost" />
          </div>
        </div>
      </section>

      {/* CARDS DE PLANOS */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-semibold">Escolha seu plano</h2>
        <p className="mt-2 text-white/70">
          Comece no teste grátis. Depois você decide se continua.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {/* START */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-white/60">Plano</div>
            <div className="mt-1 text-xl font-semibold">Start</div>
            <div className="mt-3 text-sm text-white/70">Para clínica pequena começando a organizar a rotina.</div>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li>✅ Agenda</li>
              <li>✅ Pacientes</li>
              <li>✅ Confirmação no WhatsApp</li>
              <li>✅ Suporte</li>
            </ul>
            <div className="mt-6">
              <WhatsAppCTA label="Ativar teste grátis" />
            </div>
          </div>

          {/* PRO (DESTAQUE) */}
          <div className="rounded-2xl border border-white/20 bg-white/10 p-6">
            <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 border border-white/10">
              Mais escolhido
            </div>
            <div className="mt-2 text-sm text-white/60">Plano</div>
            <div className="mt-1 text-xl font-semibold">Pro</div>
            <div className="mt-3 text-sm text-white/80">
              Para clínicas que querem acelerar resultado e reduzir faltas de verdade.
            </div>
            <ul className="mt-4 space-y-2 text-sm text-white/90">
              <li>✅ Tudo do Start</li>
              <li>✅ Relatórios</li>
              <li>✅ Usuários e permissões</li>
              <li>✅ Rotina da recepção</li>
            </ul>
            <div className="mt-6">
              <WhatsAppCTA label="Ativar teste grátis" />
            </div>
          </div>

          {/* PREMIUM */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-white/60">Plano</div>
            <div className="mt-1 text-xl font-semibold">Premium</div>
            <div className="mt-3 text-sm text-white/70">
              Para clínicas maiores e redes que precisam de controle e escala.
            </div>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li>✅ Tudo do Pro</li>
              <li>✅ Ajustes por operação</li>
              <li>✅ Acompanhamento mais próximo</li>
              <li>✅ Planejamento de escala</li>
            </ul>
            <div className="mt-6">
              <WhatsAppCTA label="Falar com especialista" />
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <WhatsAppCTA label="Quero o teste grátis e você me orienta" />
        </div>
      </section>

      <Footer />
    </main>
  );
}
