export const runtime = "nodejs";

import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function MasterPainelPage() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/master");
  }

  const { data: clinics } = await supabase
    .from("clinics")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main style={{ padding: 24 }}>
      <h1>Painel Master</h1>
      <p>Logado como: {user.email}</p>

      <hr style={{ margin: "16px 0" }} />

      <a href="/master/nova-clinica">+ Nova Clínica</a>

      <div style={{ marginTop: 24 }}>
        {!clinics || clinics.length === 0 ? (
          <p>Nenhuma clínica cadastrada.</p>
        ) : (
          clinics.map((c) => (
            <div key={c.id}>
              <strong>{c.name}</strong> – {c.email}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
