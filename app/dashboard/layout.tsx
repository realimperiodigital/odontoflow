// app/dashboard/layout.tsx
import type { ReactNode } from "react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#05060a] text-white">
      {/* TOP BAR ÚNICA do Dashboard */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05060a]/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
              <span className="text-sm font-semibold">O</span>
            </div>
            <div className="leading-tight">
              <div className="text-base font-semibold">OdontoFlow</div>
              <div className="text-xs text-white/60">Dashboard</div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/dashboard" className="text-sm text-white/70 hover:text-white">
              Início
            </Link>
            <Link href="/dashboard/agenda" className="text-sm text-white/70 hover:text-white">
              Agenda
            </Link>
            <Link href="/dashboard/patients" className="text-sm text-white/70 hover:text-white">
              Pacientes
            </Link>
            <Link href="/dashboard/clinics" className="text-sm text-white/70 hover:text-white">
              Clínicas
            </Link>
          </nav>
        </div>
      </header>

      {/* Conteúdo */}
      <section className="mx-auto w-full max-w-6xl px-6 py-10">{children}</section>
    </main>
  );
}
