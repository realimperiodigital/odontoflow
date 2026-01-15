import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/app/lib/supabase/server";

export default async function PatientsLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  // MASTER nunca pode acessar pacientes
  if (profile?.role === "master") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
