import { redirect } from "next/navigation";

type SupabaseLike = {
  auth: { getUser: () => Promise<{ data: { user: any } }> };
  from: (table: string) => any;
};

export async function getActiveClinicId(supabase: SupabaseLike) {
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (!user) redirect("/login");

  // Pega a clínica mais recente ligada ao usuário (1 clínica ativa por vez)
  const { data: membership, error } = await supabase
    .from("clinic_users")
    .select("clinic_id, role, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    // Se der erro aqui, normalmente é RLS/policy
    console.error("Erro buscando clinic_users:", error);
  }

  if (!membership?.clinic_id) {
    // Se não tem clínica ligada, manda pro primeiro acesso
    redirect("/first-access");
  }

  return {
    user,
    clinicId: membership.clinic_id as string,
    role: membership.role as string | null,
  };
}
