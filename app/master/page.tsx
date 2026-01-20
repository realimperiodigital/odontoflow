import { redirect } from "next/navigation";
import { createSupabaseServer } from "../../lib/supabase/server";
import MasterLoginClient from "./MasterLoginClient";

export default async function MasterPage() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Se não estiver logado, mostra a tela de login dentro do /master
  if (!user) {
    return <MasterLoginClient />;
  }

  // Se estiver logado, confere se é master
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, email")
    .eq("id", user.id)
    .single();

  // Logado, mas não é master -> não entra
  if (profile?.role !== "master") {
    redirect("/");
  }

  // Aqui é a área Master de verdade (vamos colocar os formulários depois)
  return (
    <main style={{ padding: 40 }}>
      <h1>Área Master</h1>
      <p style={{ marginTop: 8 }}>
        Logado como: <b>{profile?.email ?? user.email}</b>
      </p>

      <p style={{ marginTop: 18 }}>
        Próximo passo: aqui vamos colocar o formulário de criação de clínica e criação de usuário da clínica.
      </p>

      <form
        action={async () => {
          "use server";
          const supabase = await createSupabaseServer();
          await supabase.auth.signOut();
          redirect("/master");
        }}
        style={{ marginTop: 22 }}
      >
        <button type="submit" style={{ padding: "10px 14px", cursor: "pointer" }}>
          Sair
        </button>
      </form>
    </main>
  );
}
