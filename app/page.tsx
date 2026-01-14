import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppCTA from "./components/WhatsAppCTA";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#05060a] text-white">
      <Header />

      {/* HERO */}
      <section className="mx-auto w-full max-w-6xl px-6 pt-14 pb-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
              ⚡ Ativação rápida no WhatsApp • Teste grátis sem cartão
            </div>

            <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-5xl">
              Agenda cheia e menos faltas em <span className="text-white/80">7 dias</span>.
            </h1>

            <p className="mt-4 text-white/70">
              Confirmação automática no WhatsApp, organização da agenda e gestão completa da clínica.
              Você fala comigo e eu ativo seu teste na hora.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <WhatsAppCTA label="✅ Teste grátis por 7 dias" />
              <WhatsAppCTA label="Ver demonstração no WhatsApp" variant="ghost" />
            </div>

            <div className="mt-4 text-xs text-white/50">
              Sem cartão • Sem contrato • Suporte humano
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold">O que você vai sentir na prática:</div>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>✅ Menos faltas de pacientes</li>
              <li>✅ Agenda sempre organizada</li>
              <li>✅ Confirmação automática no WhatsApp</li>
              <li>✅ Recepção mais produtiva</li>
              <li>✅ Mais faturamento com a mesma equipe</li>
            </ul>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="mx-auto w-full max-w-6xl px-6 py-14">
        <h2 className="text-2xl font-semibold">Como funciona o teste gratuito</h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            "Você clica em Teste grátis",
            "Fala comigo no WhatsApp",
            "Eu crio sua clínica no sistema",
            "Você usa por 7 dias completos",
          ].map((text, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-base font-semibold">{i + 1}. {text}</div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <WhatsAppCTA label="Quero meu teste grátis agora" />
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="mx-auto w-full max-w-6xl px-6 py-14 text-center">
        <h2 className="text-3xl font-semibold">Pronto para ver sua agenda cheia?</h2>
        <p className="mt-3 text-white/70">
          Fale comigo no WhatsApp e ative seu teste grátis agora mesmo.
        </p>

        <div className="mt-6 flex justify-center">
          <WhatsAppCTA label="Ativar teste grátis 7 dias" />
        </div>
      </section>

      <Footer />
    </main>
  );
}
