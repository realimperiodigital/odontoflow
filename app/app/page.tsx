import { redirect } from "next/navigation";
import MasterDashboard from "./MasterDashboard";
import { createSupabaseServer } from "../../lib/supabase/server"; // ajuste se seu export tiver outro nome

export default async function AppPage() {
  const supabase = await createSupabaseServer();

  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (!user) {
    redirect("/login");
  }

  return <MasterDashboard masterEmail={user.email ?? ""} />;
}
