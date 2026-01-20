import { redirect } from "next/navigation";
import { createSupabaseServer } from "../../../lib/supabase/server";

export default async function MasterPainelPage() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Se alguém tentar entrar direto, volta pro /master (que vai pedir senha)
  if (!user) redirect("/master");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, email")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "master") redirect("/");

  return (
    <main style={{ padding: 40 }}>
      <h1>Painel Master</h1>
      <p style={{ marginTop: 10 }}>
        Logado como: <b>{profile?.email ?? user.email}</b>
      </p>

      <p style={{ marginTop: 18 }}>
        Aqui vamos colocar os formulários de criação de clínica e criação do usuário da clínica.
      </p>
    </main>
  );
}
