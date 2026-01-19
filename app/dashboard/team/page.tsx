"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

type TeamMember = {
  id: string;
  full_name?: string | null;
  role?: string | null;
};

export default function TeamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<TeamMember[]>([]);

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

      // tenta listar equipe (se existir tabela profiles). Se não existir, fica vazio e não quebra.
      const { data: rows } = await supabase
        .from("profiles")
        .select("id, full_name, role")
        .limit(50);

      setTeam((rows as any) || []);
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
        <h1 className="text-2xl font-semibold">Equipe</h1>
        <p className="mt-2 text-white/70">
          Lista simples. Depois a gente liga isso com clinic_users e permissões.
        </p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          {team.length === 0 ? (
            <div className="text-white/70 text-sm">
              Nenhum membro encontrado (ou a tabela <b>profiles</b> não existe ainda).
            </div>
          ) : (
            <div className="space-y-3">
              {team.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-4"
                >
                  <div>
                    <div className="font-semibold">{m.full_name || m.id}</div>
                    <div className="text-xs text-white/60">{m.role || "—"}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
