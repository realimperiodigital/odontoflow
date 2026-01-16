import { redirect } from "next/navigation";
import { createSupabaseServer } from "../../lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Se não tiver sessão, manda pro login
  if (!user) redirect("/login");

  // Busca o profile do usuário
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("must_change_password")
    .eq("id", user.id)
    .single();

  // Se der algum erro, por segurança manda pro login (ou você pode tratar diferente)
  if (error) redirect("/login");

  // Se precisa trocar senha e não está na rota de troca
  if (profile?.must_change_password) {
    redirect("/trocar-senha");
  }

  return <>{children}</>;
}
