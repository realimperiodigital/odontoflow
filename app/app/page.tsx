import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function AppPage() {
  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Não assume que existe profile/clínica
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-semibold">Painel OdontoFlow</h1>

      <p className="text-white/60 mt-2">Logado como: {user.email}</p>

      {!profile ? (
        <div className="mt-6 text-white/60">
          Usuário master sem clínica vinculada ainda.
        </div>
      ) : (
        <pre className="mt-6 bg-white/5 p-4 rounded-xl text-sm overflow-auto">
          {JSON.stringify(profile, null, 2)}
        </pre>
      )}
    </main>
  );
}
