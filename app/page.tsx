"use client";

import Link from "next/link";

export default function Home() {
  const whatsapp = "https://wa.me/5511939479749";

  return (
    <main className="min-h-screen bg-[#05070D] text-white">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 font-bold">
              O
            </div>
            <div className="leading-tight">
              <p className="font-semibold">OdontoFlow</p>
              <p className="text-xs text-white/60">
                Sistema para clínicas odontológicas
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <a
              href="#recursos"
              className="hidden md:inline text-sm text-white/70 hover:text-white"
            >
              Recursos
            </a>
            <a
              href="#videos"
              className="hidden md:inline text-sm text-white/70 hover:text-white"
            >
              Vídeos
            </a>
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 px-4 py-2 text-sm hover:border-white/30"
            >
              WhatsApp
            </a>
            <Link
              href="/login"
              className="rounded-full bg-[#2F6BFF] px-5 py-2 text-sm font-semibold hover:brightness-110"
            >
              Entrar
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative pt-24">
        <div className="absolute inset-0 -z-10">
          <video
            className="h-full w-full object-cover opacity-35"
            src="/media/Modern_Brazilian_dental_clinic_bright_and_clean_receptionist_at_fr_.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-[#05070D]" />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.05]">
              Pacientes na cadeira.
              <br />
              Agenda cheia.
            </h1>

            <p className="mt-5 text-lg text-white/75">
              Plataforma completa para clínicas odontológicas: agenda, pacientes,
              equipe, financeiro, relatórios e automatizações — tudo no mesmo
              lugar.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="rounded-full bg-[#2F6BFF] px-7 py-3 font-semibold hover:brightness-110"
              >
                Acessar sistema
              </Link>
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/15 px-7 py-3 font-semibold hover:border-white/30"
              >
                Falar no WhatsApp
              </a>
              <a
                href="#videos"
                className="rounded-full border border-white/15 px-7 py-3 font-semibold hover:border-white/30"
              >
                Ver demonstração
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-2 text-xs text-white/55">
              <span className="rounded-full border border-white/10 px-3 py-1">
                ✅ Multi-clínica
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1">
                ✅ Redução de faltas
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1">
                ✅ Permissões por equipe
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1">
                ✅ Relatórios e financeiro
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="recursos"
        className="scroll-mt-24 mx-auto max-w-6xl px-4 py-14"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
          Tudo que sua clínica precisa
        </h2>
        <p className="mt-3 text-white/70">
          Visual premium, direto ao ponto, e feito pra vender: o site mostra
          valor em segundos.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <FeatureCard
            title="Agenda inteligente"
            desc="Confirmação automática e redução de faltas."
            img="/media/agenda_1768298608814.png"
          />
          <FeatureCard
            title="Pacientes"
            desc="Cadastro, histórico, documentos e organização."
            img="/media/clinical_1768298622892.png"
          />
          <FeatureCard
            title="Financeiro"
            desc="Receitas, despesas e visão clara do caixa."
            img="/media/financial_1768298650926.png"
          />
          <FeatureCard
            title="Equipe"
            desc="Usuários, cargos e permissões por função."
            img="/media/team_1768298636870.png"
          />
        </div>

        <div className="mt-4">
          <FeatureCard
            title="Experiência premium"
            desc="A primeira impressão importa. Um site forte vende o sistema antes da reunião."
            img="/media/hero_clinic_1768298594031.png"
            wide
          />
        </div>
      </section>

      <section
        id="videos"
        className="scroll-mt-24 mx-auto max-w-6xl px-4 pb-16"
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
              Demonstrações em vídeo
            </h2>
            <p className="mt-3 text-white/70">
              Use isso pra vender: manda o link pro dentista e ele já entende o
              valor.
            </p>
          </div>

          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline rounded-full bg-white/10 px-5 py-2 text-sm font-semibold hover:bg-white/15"
          >
            Suporte no WhatsApp
          </a>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <VideoCard
            title="Recepção e fluxo de atendimento"
            desc="Experiência moderna e organizada."
            src="/media/Modern_Brazilian_dental_clinic_bright_and_clean_receptionist_at_fr_.mp4"
          />
          <VideoCard
            title="Gestão e equipe em ação"
            desc="Rotina real de clínica com agilidade."
            src="/media/Dental_clinic_manager_using_laptop_and_tablet_cu_op_and_tablet_c_.mp4"
          />
          <VideoCard
            title="Atendimento ao paciente"
            desc="Clareza, confiança e cuidado."
            src="/media/Dentist_treating_a_patient_in_a_modern_dental_chair_assistant_hel_.mp4"
          />
          <VideoCard
            title="Uso do sistema no dia a dia"
            desc="Visão de agenda e organização."
            src="/media/Dentist_using_a_modern_computer_in_a_dental_office_viewing_a_.mp4"
          />
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-10">
          <h3 className="text-2xl font-extrabold">
            Quer começar a vender amanhã?
          </h3>
          <p className="mt-3 max-w-2xl text-white/70">
            Eu deixei o site com cara de produto premium. Agora é só você mandar
            o link, oferecer o teste e marcar uma reunião rápida.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-full bg-[#2F6BFF] px-7 py-3 font-semibold hover:brightness-110"
            >
              Entrar no sistema
            </Link>
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 px-7 py-3 font-semibold hover:border-white/30"
            >
              Falar com suporte
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black/30">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-8 md:flex-row md:items-center">
          <div className="text-sm text-white/60">
            © {new Date().getFullYear()} OdontoFlow. Todos os direitos reservados.
          </div>
          <div className="text-sm text-white/60">
            Suporte:{" "}
            <a
              className="text-white hover:underline"
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
            >
              (11) 93947-9749
            </a>
          </div>
        </div>
      </footer>

      <a
        href={whatsapp}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-50 rounded-full bg-[#25D366] px-5 py-3 font-semibold text-black shadow-lg hover:brightness-110"
      >
        WhatsApp
      </a>
    </main>
  );
}

function FeatureCard({
  title,
  desc,
  img,
  wide,
}: {
  title: string;
  desc: string;
  img: string;
  wide?: boolean;
}) {
  return (
    <div
      className={[
        "group overflow-hidden rounded-3xl border border-white/10 bg-white/5",
        wide ? "md:flex md:items-stretch" : "",
      ].join(" ")}
    >
      <div className={wide ? "md:w-1/2 p-6 md:p-8" : "p-6 md:p-8"}>
        <h3 className="text-xl font-extrabold">{title}</h3>
        <p className="mt-2 text-white/70">{desc}</p>
      </div>

      <div className={wide ? "md:w-1/2" : ""}>
        <div className="relative h-56 w-full overflow-hidden md:h-64">
          <img
            src={img}
            alt={title}
            className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      </div>
    </div>
  );
}

function VideoCard({
  title,
  desc,
  src,
}: {
  title: string;
  desc: string;
  src: string;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="relative">
        <video
          className="h-64 w-full object-cover"
          src={src}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-extrabold">{title}</h3>
        <p className="mt-1 text-white/70">{desc}</p>
      </div>
    </div>
  );
}
