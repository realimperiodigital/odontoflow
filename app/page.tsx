"use client";

import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col pt-20 bg-[#F5F7FA] text-[#2C3E50]">
      <Header />

      <main className="flex-grow">

        {/* HERO SECTION (VIDEO BACKGROUND) */}
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Video Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay for text readability */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              poster="/hero-video-poster.jpg"
            >
              <source src="/hero-clinic.mp4" type="video/mp4" />
              {/* Fallback if no video */}
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg font-poppins">
              Pacientes na cadeira. <br />
              <span className="text-[#00D4FF]">Agenda cheia.</span>
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 mb-10 font-light max-w-3xl mx-auto drop-shadow-md">
              A plataforma completa que transforma clínicas odontológicas em máquinas de crescimento. Gestão, marketing e fidelização com padrão hospitalar.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a href="/login" className="px-10 py-5 bg-[#18A8FF] hover:bg-[#1490db] text-white rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm bg-opacity-90">
                Acessar Sistema
              </a>
              <a href="https://wa.me/5511939479749" target="_blank" className="px-10 py-5 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/50 text-white rounded-full font-bold text-lg transition-all flex items-center gap-2 hover:scale-105">
                <span>💬</span> Falar no WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* SERVICES CAROUSEL SECTION */}
        <section className="py-20 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
            <h2 className="text-3xl font-bold text-[#2C3E50] mb-2 font-poppins">Especialidades Atendidas</h2>
            <p className="text-gray-500">O sistema se adapta a todos os tipos de tratamento com precisão clínica.</p>
          </div>

          {/* Carousel Container */}
          <div className="flex overflow-x-auto pb-8 gap-8 px-6 max-w-7xl mx-auto snap-x snap-mandatory scrollbar-hide">
            <ServiceCard icon="🦷" title="Implantes" desc="Controle de fases cirúrgicas e protéticas." />
            <ServiceCard icon="😁" title="Ortodontia" desc="Gestão de manutenções e documentação." />
            <ServiceCard icon="✨" title="Estética" desc="Antes e depois, orçamentos e facetas." />
            <ServiceCard icon="🔬" title="Endodontia" desc="Controle de sessões e medicação." />
            <ServiceCard icon="🚑" title="Urgência" desc="Encaixes rápidos e prontuário ágil." />
            <ServiceCard icon="📋" title="Avaliação" desc="Conversão de orçamentos e follow-up." />
          </div>
        </section>

        {/* IMAGE CARDS SECTION ("TUDO QUE VOCÊ PRECISA") */}
        <section className="py-24 max-w-7xl mx-auto px-6 bg-[#F5F7FA]">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#2C3E50] mb-6 font-poppins">Excelência em Gestão Clínica</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light">
              Soluções integradas para cada setor da sua clínica, com visualização clara e profissional.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <PhotoCard
              title="Agenda e Recepção"
              desc="Organização impecável para sua recepção. Confirmações automáticas, lista de espera e visão clara dos horários."
              imageSrc="https://storage.googleapis.com/antigravity-artifacts/agenda_reception_1768220850985.png"
            />
            <PhotoCard
              title="Atendimento Clínico"
              desc="Prontuário digital completo na cadeira. Histórico, odontograma visual e prescrições em um clique."
              imageSrc="https://storage.googleapis.com/antigravity-artifacts/dentist_patient_1768220864835.png"
            />
            <PhotoCard
              title="Gestão de Equipe"
              desc="Controle de comissões, perfis de acesso e produtividade individual de cada dentista."
              imageSrc="https://storage.googleapis.com/antigravity-artifacts/medical_team_1768220879539.png"
            />
            <PhotoCard
              title="Financeiro De Alta Performance"
              desc="Visão detalhada de fluxo de caixa, DRE e inadimplência. Decisões baseadas em dados reais."
              imageSrc="https://storage.googleapis.com/antigravity-artifacts/financial_tablet_1768220893470.png"
            />
          </div>
        </section>

        {/* "PARA QUEM É" SECTION */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#2C3E50] font-poppins">Modelos de Negócio</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <AudienceCard
                title="Consultório Private"
                desc="Para o dentista que prioriza a excelência no atendimento e busca simplicidade na gestão."
                features={['Agenda Premium', 'Prontuário Ágil', 'Foco no Paciente']}
              />
              <AudienceCard
                title="Clínica Multidisciplinar"
                desc="Gestão avançada para equipes com múltiplos especialistas e alto volume de atendimentos."
                features={['Split Financeiro', 'Metas de Equipe', 'Relatórios Avançados']}
                highlight={true}
              />
              <AudienceCard
                title="Redes e Holdings"
                desc="Controle centralizado de múltiplas unidades com padronização de processos e BI."
                features={['Painel Multi-loja', 'DRE Consolidado', 'Auditoria Total']}
              />
            </div>
          </div>
        </section>

        {/* "COMO FUNCIONA" SECTION */}
        <section className="py-24 bg-[#F5F7FA]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#2C3E50] mb-4 font-poppins">Implementação Simplificada</h2>
              <p className="text-gray-500">Tecnologia avançada, sem complexidade.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-gray-200 -z-10" />

              <StepCard
                num="01"
                title="Setup Inicial"
                desc="Configuração personalizada da sua instância em nuvem segura em menos de 2 minutos."
              />
              <StepCard
                num="02"
                title="Migração e Treino"
                desc="Importamos seus dados e treinamos sua equipe com materiais exclusivos em vídeo."
              />
              <StepCard
                num="03"
                title="Go Live"
                desc="Sua clínica operando com eficiência máxima, dados seguros e pacientes satisfeitos."
              />
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-24 relative overflow-hidden bg-[#060B16]">
          <div className="absolute inset-0 bg-[#18A8FF] opacity-20 blur-[100px]" />
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 font-poppins">
              Excelência clínica merece <br />
              <span className="text-[#18A8FF]">excelência em gestão.</span>
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a href="https://wa.me/5511939479749" target="_blank" className="px-12 py-6 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full font-bold text-xl shadow-lg hover:shadow-green-500/30 transition-all transform hover:scale-105 flex items-center justify-center gap-3">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-8.68-2.031-.967-.272-.297-.471-.446-.917-.446-.445 0-.965-.003-1.488.568-.158.174-2.008 1.956-2.008 4.771s2.055 5.538 2.28 5.836c.224.297 3.992 6.095 9.771 8.526 3.957 1.665 4.767 1.334 5.61 1.251.842-.083 2.709-1.107 3.08-2.175.372-1.069.372-1.983.272-2.175z" /></svg>
                Agendar Consultoria
              </a>
            </div>
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
    <div className="min-w-[240px] snap-center bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group cursor-default">
      <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all duration-300">{icon}</div>
      <h3 className="text-lg font-bold text-[#2C3E50] mb-2">{title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
    </div>
  )
}

function PhotoCard({ title, desc, imageSrc }: any) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500">
      <div className="h-64 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
        {/* We use a specialized Next.js Image or simple img if external */}
        {/* Since these are generated artifacts, using img tag is safer for now if not configuring domains */}
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
      </div>
      <div className="p-8 relative">
        <h3 className="text-2xl font-bold text-[#2C3E50] mb-3 group-hover:text-[#18A8FF] transition-colors">{title}</h3>
        <p className="text-gray-500 leading-relaxed">{desc}</p>
        <div className="mt-6 flex items-center text-[#18A8FF] font-bold text-sm uppercase tracking-wider opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
          Saiba Mais <span>→</span>
        </div>
      </div>
    </div>
  )
}

function AudienceCard({ title, desc, features, highlight }: any) {
  return (
    <div className={`p-8 rounded-2xl border flex flex-col transition-all ${highlight ? 'bg-[#2C3E50] text-white shadow-xl transform md:-translate-y-4' : 'bg-white border-gray-100 hover:border-gray-300 text-[#2C3E50]'}`}>
      {highlight && <div className="mb-4 inline-block bg-[#18A8FF] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider self-start">Recomendado</div>}
      <h3 className={`text-2xl font-bold mb-4 ${highlight ? 'text-white' : 'text-[#2C3E50]'}`}>{title}</h3>
      <p className={`text-sm mb-8 flex-grow ${highlight ? 'text-gray-300' : 'text-gray-500'}`}>{desc}</p>
      <ul className="space-y-3 mb-8">
        {features.map((f: string, i: number) => (
          <li key={i} className={`flex items-center gap-2 text-sm ${highlight ? 'text-gray-200' : 'text-gray-600'}`}>
            <span className="text-[#18A8FF]">✓</span> {f}
          </li>
        ))}
      </ul>
    </div>
  )
}

function StepCard({ num, title, desc }: any) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 relative z-10 text-center shadow-sm hover:shadow-md transition-all group">
      <div className="text-4xl font-bold text-[#E0E6ED] mb-4 font-poppins group-hover:text-[#18A8FF] transition-colors">
        {num}
      </div>
      <h3 className="text-xl font-bold text-[#2C3E50] mb-3">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  )
}
