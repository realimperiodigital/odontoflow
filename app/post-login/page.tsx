import { redirect } from "next/navigation";
import { createSupabaseServer } from "../../lib/supabase/server";

export default async function PostLoginPage() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  // Master vai para área interna
  if (profile.role === "master") {
    redirect("/master");
  }

  // Cliente logado corretamente
  redirect("/login"); // temporário até existir dashboard da clínica
}
