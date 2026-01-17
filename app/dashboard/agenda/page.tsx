// app/app/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseReadOnly } from "@/lib/supabase/readonly";

export default async function AppEntry() {
  const supabase = await createSupabaseReadOnly();

  const { data } = await supabase.auth.getUser();
  if (!data?.user) {
    redirect("/login");
  }

  // procura vínculo com clínica
  const { data: membership } = await supabase
    .from("clinic_users")
    .select("clinic_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (!membership?.clinic_id) {
    redirect("/first-access");
  }

  redirect("/dashboard");
}
