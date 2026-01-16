import { redirect } from "next/navigation";
import { createSupabaseServer } from "../../lib/supabase/server";
import LogoutButton from "./LogoutButton";

export default async function AppHome() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <main className="min-h-screen bg-[#05060a] text-white p-8">
      <h1 className="text-2xl font-semibold">Bem-vindo, Master!</h1>
      <p className="mt-2 text-white/70">Sessão ativa: {user.email}</p>
      <LogoutButton />
    </main>
  );
}
