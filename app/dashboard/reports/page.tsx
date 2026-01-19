"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export default function ReportsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
      const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

      if (!url || !anon) {
        setLoading(false);
        return;
      }

      const supabase = createClient(url, anon);

      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        router.replace("/login");
        return;
      }

      setLoading(false);
    };

    run();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05060a] text-white flex items-center justify-center">
        <div className="text-white/70">Carregando...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#05060a] text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Relatórios</h1>
        <p className="mt-2 text-white/70">
          Aqui vão entrar os relatórios do sistema (agenda, faltas, faturamento, avaliações).
        </p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-white/70 text-sm">
            Próximo passo: puxar dados do Supabase e montar os cards/gráficos.
          </div>
        </div>

        <button
          onClick={() => router.push("/app")}
          className="mt-6 rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold hover:opacity-90"
        >
          Voltar
        </button>
      </div>
    </main>
  );
}
