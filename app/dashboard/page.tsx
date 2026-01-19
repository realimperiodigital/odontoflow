// app/dashboard/page.tsx
import Link from "next/link";

export default function DashboardHome() {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-semibold">Bem-vindo ao Dashboard</h1>
        <p className="mt-2 text-sm text-white/70">
          Escolha um módulo para começar.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/dashboard/agenda"
            className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
            Abrir Agenda
          </Link>

          <Link
            href="/dashboard/patients"
            className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
            Ver Pacientes
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm text-white/70">
          Se essa tela aparecer, significa que o dashboard está renderizando certo.
        </p>
      </div>
    </section>
  );
}
