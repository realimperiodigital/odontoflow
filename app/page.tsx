"use client";

import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col pt-20 bg-[#060B16] text-[#B0B7C3]">
      <Header />

      <main className="flex-grow">

        {/* HERO SECTION */}
        <section className="relative py-24 lg:py-40 overflow-hidden">
          {/* Background Glows */}
          <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] bg-[#18A8FF]/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-none mb-8 tracking-tight">
              Pacientes na cadeira. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#18A8FF] to-[#00D4FF]">
                Agenda cheia.
              </span>
            </h1>
            <p className="text-xl text-[#B0B7C3] mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              A plataforma completa que transforma clínicas odontológicas em máquinas de crescimento. Gestão, marketing e fidelização em um só lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="/login" className="px-8 py-4 bg-[#18A8FF] hover:bg-[#1490db] text-white rounded-full font-bold text-lg transition-all shadow-[0_0_30px_rgba(24,168,255,0.3)] hover:shadow-[0_0_50px_rgba(24,168,255,0.5)] transform hover:-translate-y-1">
                Acessar Sistema
              </a>
              <a href="https://wa.me/5511939479749" target="_blank" className="px-8 py-4 border border-[#18A8FF]/30 hover:border-[#18A8FF] text-white rounded-full font-bold text-lg transition-all flex items-center gap-2 hover:bg-[#18A8FF]/5">
                <span>💬</span> Falar no WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* SERVICES CAROUSEL SECTION */}
        <section className="py-20 border-b border-white/5 bg-[#0E121F]/30 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">Especialidades Atendidas</h2>
            <p className="text-sm text-gray-400">O sistema se adapta a todos os tipos de tratamento.</p>
          </div>

          {/* Carousel Container */}
          <div className="flex overflow-x-auto pb-8 gap-6 px-6 max-w-7xl mx-auto snap-x snap-mandatory scrollbar-hide">
            <ServiceCard icon="🦷" title="Implantes" desc="Controle de fases cirúrgicas e protéticas." />
            <ServiceCard icon="😁" title="Ortodontia" desc="Gestão de manutenções e documentação." />
            <ServiceCard icon="✨" title="Estética" desc="Antes e depois, orçamentos e facetas." />
            <ServiceCard icon="🔬" title="Endodontia" desc="Controle de sessões e medicação." />
            <ServiceCard icon="🚑" title="Urgência" desc="Encaixes rápidos e prontuário ágil." />
            <ServiceCard icon="📋" title="Avaliação" desc="Conversão de orçamentos e follow-up." />
          </div>
        </section>

        {/* "TUDO QUE VOCÊ PRECISA" SECTION */}
        <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">Tudo que sua clínica precisa</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Centralize sua operação. Elimine planilhas, papéis e sistemas lentos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="📅"
              title="Agenda Inteligente"
              desc="Confirmação automática via WhatsApp, lista de espera e encaixes inteligentes para reduzir buracos na agenda."
            />
            <FeatureCard
              icon="💰"
              title="Financeiro Blindado"
              desc="Fluxo de caixa, DRE, split de pagamentos para dentistas e controle rigoroso de inadimplência."
            />
            <FeatureCard
              icon="📈"
              title="Marketing & CRM"
              desc="Ferramentas de reativação de pacientes sumidos e campanhas automáticas de aniversário e retorno."
            />
            <FeatureCard
              icon="📂"
              title="Prontuário Digital"
              desc="Anamnese personalizada, odontograma visual, receitas e atestados digitais com assinatura eletrônica."
            />
            <FeatureCard
              icon="📊"
              title="Dashboards de Gestão"
              desc="Indicadores em tempo real: meta de vendas, taxa de conversão e produtividade da equipe."
            />
            <FeatureCard
              icon="🔐"
              title="Segurança Total"
              desc="Seus dados protegidos com criptografia de ponta a ponta e backups diários automáticos na nuvem."
            />
          </div>
        </section>

        {/* "PARA QUEM É" SECTION */}
        <section className="py-24 bg-gradient-to-b from-[#0E121F] to-[#060B16] border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-white">Para quem é o OdontoFlow?</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <AudienceCard
                title="Consultório Individual"
                desc="Para o dentista que quer focar no atendimento e automatizar a gestão e confirmações."
                features={['Baixo custo', 'Fácil de usar', 'Agenda simples']}
              />
              <AudienceCard
                title="Clínica Média"
                desc="Para quem tem equipe e precisa controlar comissões, financeiro e múltiplos profissionais."
                features={['Controle financeiro', 'Metas de equipe', 'Multiprofissional']}
                highlight={true}
              />
              <AudienceCard
                title="Redes e Franquias"
                desc="Gestão centralizada de múltiplas unidades com padronização e relatórios consolidados."
                features={['Painel Multi-loja', 'Padronização', 'DRE Consolidado']}
              />
            </div>
          </div>
        </section>

        {/* "COMO FUNCIONA" SECTION */}
        <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Como funciona?</h2>
            <p className="text-gray-400">Começar a usar é mais simples do que você imagina.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-[#18A8FF]/20 -z-10" />

            <StepCard
              num="1"
              title="Cadastro Rápido"
              desc="Crie sua conta em 2 minutos. Sem burocracia e sem precisar de cartão de crédito para testar."
            />
            <StepCard
              num="2"
              title="Configuração"
              desc="Cadastre seus dentistas, serviços e horários. Nossa equipe ajuda na migração de dados."
            />
            <StepCard
              num="3"
              title="Crescimento"
              desc="Comece a agendar, atender e ver os números da sua clínica crescerem no painel."
            />
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#18A8FF] opacity-10 blur-[100px]" />
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
              Leve sua clínica para o <br />
              <span className="text-[#18A8FF]">próximo nível.</span>
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="https://wa.me/5511939479749" target="_blank" className="px-10 py-5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full font-bold text-xl shadow-lg hover:shadow-green-500/30 transition-all transform hover:scale-105">
                Falar com Consultor
              </a>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              Junte-se a mais de 1.000 dentistas que confiam no OdontoFlow.
            </p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

// COMPONENTS

function ServiceCard({ icon, title, desc }: any) {
  return (
    <div className="min-w-[280px] snap-center bg-[#0E121F] border border-white/5 p-6 rounded-2xl hover:border-[#18A8FF]/50 transition-all hover:-translate-y-1 group cursor-default">
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="group p-8 rounded-2xl bg-[#0E121F] border border-white/5 hover:bg-[#131929] hover:border-[#18A8FF]/30 transition-all duration-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#18A8FF]/5 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-[#18A8FF]/10" />
      <div className="text-4xl mb-6 text-[#18A8FF] drop-shadow-[0_0_10px_rgba(24,168,255,0.3)]">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#18A8FF] transition-colors">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
    </div>
  )
}

function AudienceCard({ title, desc, features, highlight }: any) {
  return (
    <div className={`p-8 rounded-2xl border flex flex-col ${highlight ? 'bg-[#0E121F] border-[#18A8FF] shadow-[0_0_30px_rgba(24,168,255,0.1)] relative transform md:-translate-y-4' : 'bg-[#060B16] border-white/10 hover:border-white/20'}`}>
      {highlight && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#18A8FF] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Mais Popular</div>}
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-gray-400 text-sm mb-8 flex-grow">{desc}</p>
      <ul className="space-y-3 mb-8">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
            <span className="text-[#18A8FF]">✓</span> {f}
          </li>
        ))}
      </ul>
      <a href="/login?create=true" className={`w-full py-3 rounded-lg text-center font-bold transition-colors ${highlight ? 'bg-[#18A8FF] hover:bg-[#1490db] text-white' : 'border border-white/20 hover:bg-white/5 text-white'}`}>
        Começar Agora
      </a>
    </div>
  )
}

function StepCard({ num, title, desc }: any) {
  return (
    <div className="bg-[#0E121F] p-8 rounded-2xl border border-white/5 relative z-10 text-center hover:border-[#18A8FF]/30 transition-all">
      <div className="w-12 h-12 bg-[#18A8FF]/10 text-[#18A8FF] font-bold text-xl rounded-full flex items-center justify-center mx-auto mb-6 border border-[#18A8FF]/20">
        {num}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  )
}
