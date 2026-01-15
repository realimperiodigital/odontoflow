import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/app/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServer();

  // 1) usuário logado?
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) redirect("/login");

  // 2) pega profile
  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("role, clinic_id, must_change_password")
    .eq("user_id", user.id)
    .single();

  if (profileErr || !profile) redirect("/login");

  // 3) troca senha obrigatória
  if (profile.must_change_password) redirect("/trocar-senha");

  // 4) regras de trial/bloqueio para clínicas (master não tem clinic_id)
  if (profile.role !== "master" && profile.clinic_id) {
    const { data: clinic } = await supabase
      .from("clinics")
      .select("status, trial_ends_at")
      .eq("id", profile.clinic_id)
      .single();

    const status = clinic?.status || "trial";
    const trialEndsAt = clinic?.trial_ends_at ? new Date(clinic.trial_ends_at) : null;

    const now = new Date();
    const trialExpired = trialEndsAt ? now > trialEndsAt : false;

    if (status === "blocked" || trialExpired) {
      redirect("/assinatura");
    }
  }

  return <>{children}</>;
}
