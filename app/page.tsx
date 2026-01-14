"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";

type DemoVideo = { title: string; src: string };

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<DemoVideo | null>(null);

  const videos: DemoVideo[] = useMemo(
    () => [
      { title: "Visão geral do sistema", src: "/media/system.mp4" },
      { title: "Rotina da clínica", src: "/media/clinic.mp4" },
      { title: "Financeiro", src: "/media/finance.mp4" },
    ],
    []
  );

  function openVideo(v: DemoVideo) {
    setActive(v);
    setOpen(true);
  }

  function closeVideo() {
    setOpen(false);
    setActive(null);
  }

  return (
    <main className="min-h-screen bg-[#05060a] text-white">
      {/* TOP BAR */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05060a]/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
              <span className="text-sm font-semibold">O</span>
            </div>
            <div className="leading-tight">
              <div className="text-base font-semibold">OdontoFlow</div>
              <div className="text-xs text-white/60">Sistema para clínicas odontológicas</div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <a href="#recursos" className="text-sm text-white/70 hover:text-white">
              Recursos
            </a>
            <a href="#videos" className="text-sm text-white/70 hover:text-white">
              Vídeos
            </a>
            <Link href="/treinamento" className="text-sm text-white/70 hover:text-white">
              Treinamento
            </Link>
            <a
              href="https://wa.me/5511939479749"
              target="_blank"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
              rel="noreferrer"
            >
              WhatsApp
            </a>
            <Link
              href="/login"
              className="rounded-full bg-[#2f6bff] px-5 py-2 text-sm font-semibold hover:brightness-110"
            >
              Entrar
            </Link>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/login"
              className="rounded-full bg-[#2f6bff] px-4 py-2 text-sm font-semibold"
            >
              Entrar
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-60">
          <video
            className="h-full w-full object-cover"
            src="/media/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#05060a]/40 via-[#05060a]/85 to-[#05060a]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-14 md:pb-24 md:pt-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
              Pacientes na cadeira.
              <br />
              Agenda cheia.
            </h1>

            <p className="mt-5 text-base text-white/75 md:text-lg">
              Plataforma completa para clínicas odontológicas: agenda, pacientes, equipe, financeiro,
              relatórios e automatizações — tudo no mesmo lugar.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/dashboard/agenda"
                className="inline-flex items-center justify-center rounded-full bg-[#2f6bff] px-6 py-3 text-sm font-semibold hover:brightness-110"
              >
                Acessar sistema
              </a>

              <a
                href="https://wa.me/5511939479749"
                target="_blank"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold hover:bg-white/10"
                rel="noreferrer"
              >
                Falar no WhatsApp
              </a>

              <Link
                href="/treinamento"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold hover:bg-white/10"
              >
                Treinamento rápido (3 min)
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/70">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                ✅ Multiclínicas
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                ✅ Redução de faltas
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                ✅ Permissões por equipe
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                ✅ Relatórios & financeiro
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* RECURSOS + IMAGENS */}
      <section id="recursos" className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <h2 className="text-2xl font-bold md:text-3xl">Tudo que sua clínica precisa</h2>
        <p className="mt-2 max-w-2xl text-sm text-white/70 md:text-base">
          Visual premium e direto ao ponto: o site mostra valor em segundos e a plataforma sustenta a venda.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm font-semibold">Agenda inteligente</div>
            <div className="mt-1 text-sm text-white/70">
              Confirmação automática, reagendamento e visão clara do dia.
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
              <Image
                src="/media/agenda_1768298608814.png"
                alt="Agenda"
                width={1200}
                height={800}
                className="h-auto w-full"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm font-semibold">Pacientes</div>
            <div className="mt-1 text-sm text-white/70">
              Histórico, cadastro completo e acompanhamento da evolução.
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
              <Image
                src="/media/clinical_1768298622892.png"
                alt="Pacientes"
                width={1200}
                height={800}
                className="h-auto w-full"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm font-semibold">Equipe</div>
            <div className="mt-1 text-sm text-white/70">
              Usuários, cargos, permissões e gestão por unidade.
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
              <Image
                src="/media/team_1768298636870.png"
                alt="Equipe"
                width={1200}
                height={800}
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm font-semibold">Financeiro</div>
            <div className="mt-1 text-sm text-white/70">
              Controle de entradas/saídas, visão do mês e relatórios.
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
              <Image
                src="/media/financial_1768298650926.png"
                alt="Financeiro"
                width={1400}
                height={900}
                className="h-auto w-full"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm font-semibold">Visual e credibilidade</div>
            <div className="mt-1 text-sm text-white/70">
              A vitrine vende. O sistema entrega.
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
              <Image
                src="/media/hero_clinic_1768298594031.png"
                alt="Hero"
                width={1400}
                height={900}
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* VÍDEOS */}
      <section id="videos" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Demonstrações em vídeo</h2>
            <p className="mt-2 max-w-2xl text-sm text-white/70 md:text-base">
              Aqui os vídeos ficam “clean” (sem tempo/segundos). Se quiser ver com áudio e controles, abre no modal.
            </p>
          </div>

          <Link
            href="/treinamento"
            className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold hover:bg-white/10"
          >
            Ver Treinamento rápido
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {videos.map((v) => (
            <VideoCard key={v.src} title={v.title} src={v.src} onOpen={() => openVideo(v)} />
          ))}
        </div>
      </section>

      {/* MODAL */}
      {open && active && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-4"
          onClick={closeVideo}
        >
          <div
            className="w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#05060a]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
              <div className="text-sm font-semibold">{active.title}</div>
              <button
                onClick={closeVideo}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 hover:bg-white/10"
              >
                Fechar
              </button>
            </div>

            <div className="p-5">
              <div className="overflow-hidden rounded-xl border border-white/10">
                <video className="h-auto w-full" src={active.src} controls playsInline preload="metadata" />
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-white/60">
                  Dica: aqui é o modo “com áudio/controles”. Na home, os vídeos ficam clean pra vender.
                </div>
                <a
                  href="https://wa.me/5511939479749"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-[#2f6bff] px-5 py-2 text-xs font-semibold hover:brightness-110"
                >
                  Quero uma demonstração no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING WHATS */}
      <a
        href="https://wa.me/5511939479749"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-black shadow-lg hover:brightness-110"
      >
        WhatsApp
      </a>
    </main>
  );
}

function VideoCard({ title, src, onOpen }: { title: string; src: string; onOpen: () => void }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold">{title}</div>
        <button
          onClick={onOpen}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold hover:bg-white/10"
        >
          Ver com áudio
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
        {/* SEM CONTROLS = SEM SEGUNDOS */}
        <video
          className="h-auto w-full"
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>

      <div className="mt-3 text-xs text-white/60">
        Vídeo em modo “demo” (sem tempo/segundos). Abra em “Ver com áudio” se quiser controles.
      </div>
    </div>
  );
}
