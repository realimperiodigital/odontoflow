import { redirect } from "next/navigation";
import { createSupabaseServer } from "../../lib/supabase/server";
import MasterDashboard from "./MasterDashboard";

export default async function AppPage() {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase.auth.getUser();
  const user = data?.user ?? null;

  if (error || !user) redirect("/login");

  // tenta buscar perfil
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  // sem perfil -> primeiro acesso
  if (!profile) redirect("/first-access");

  // se não for master -> painel da clínica
  if (profile.role !== "master") redirect("/app/clinica");

  return <MasterDashboard masterEmail={user.email ?? ""} />;
}
