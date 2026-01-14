"use client"

import Image from "next/image"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative h-[90vh] flex items-center px-12">
        <Image
          src="/media/hero_clinic_1768298594031.png"
          alt="Clínica moderna"
          fill
          className="object-cover opacity-40"
        />

        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl font-bold mb-4">
            Pacientes na cadeira. Agenda cheia.
          </h1>

          <p className="text-lg text-gray-300 mb-6">
            Plataforma completa para clínicas odontológicas: agenda, pacientes,
            equipe, financeiro e automações em um único lugar.
          </p>

          <div className="flex gap-4">
            <a href="/login" className="bg-blue-600 px-6 py-3 rounded-lg">
              Acessar sistema
            </a>

            <a
              href="https://wa.me/5511939479749"
              className="border border-white px-6 py-3 rounded-lg"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="py-24 px-12 grid grid-cols-2 md:grid-cols-4 gap-6">
        <Feature
          img="/media/agenda_1768298608814.png"
          title="Agenda inteligente"
        />
        <Feature
          img="/media/clinical_1768298622892.png"
          title="Pacientes"
        />
        <Feature
          img="/media/team_1768298636870.png"
          title="Equipe"
        />
        <Feature
          img="/media/financial_1768298650926.png"
          title="Financeiro"
        />
      </section>
    </main>
  )
}

function Feature({ img, title }: { img: string; title: string }) {
  return (
    <div className="bg-zinc-900 rounded-xl p-6">
      <Image src={img} alt={title} width={400} height={250} className="mb-4" />
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
  )
}
