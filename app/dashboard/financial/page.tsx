"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

type Profile = {
  id?: string;
  full_name?: string | null;
  clinic_id?: string | null;
  role?: string | null;
};

export default function FinancialPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const run = async () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
      const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

      if (!url || !anon) {
        setLoading(false);
        return;
      }

      const supabase = createClient(url, anon);

      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (!user) {
        router.replace("/login");
        return;
      }

      // tenta buscar perfil (se existir). Se não existir, não quebra o build.
      const { data: p } = await supabase
        .from("profiles")
        .select("id, full_name, clinic_id, role")
        .eq("id", user.id)
        .maybeSingle();

      setProfile(p || { id: user.id });
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
        <h1 className="text-2xl font-semibold">Financeiro</h1>
        <p className="mt-2 text-white/70">
          Página pronta para evoluir. Seu login está sendo validado.
        </p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm text-white/60">Usuário</div>
          <div className="mt-1 text-base">
            {profile?.full_name || profile?.id || "—"}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="text-sm text-white/60">Receita</div>
              <div className="mt-1 text-xl font-semibold">R$ 0,00</div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="text-sm text-white/60">Despesas</div>
              <div className="mt-1 text-xl font-semibold">R$ 0,00</div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="text-sm text-white/60">Lucro</div>
              <div className="mt-1 text-xl font-semibold">R$ 0,00</div>
            </div>
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
