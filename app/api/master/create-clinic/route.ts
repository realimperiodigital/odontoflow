import { NextResponse } from "next/server";
import { createSupabaseServer } from "../../../../lib/supabase/server";

// Esperado no body:
// {
//   "clinic_name": "OdontoFlow 01",
//   "admin_email": "clinica@email.com",
//   "admin_password": "odontoflow123" (opcional)
// }
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const clinic_name = String(body?.clinic_name ?? "").trim();
    const admin_email = String(body?.admin_email ?? "").trim().toLowerCase();
    const admin_password = String(body?.admin_password ?? "odontoflow123");

    const masterSecret = String(body?.master_secret ?? "");
    const expectedSecret = process.env.MASTER_RESET_SECRET ?? "";

    if (!expectedSecret) {
      return NextResponse.json(
        { ok: false, error: "MASTER_RESET_SECRET não está configurado no .env.local" },
        { status: 500 }
      );
    }

    if (!masterSecret || masterSecret !== expectedSecret) {
      return NextResponse.json({ ok: false, error: "Segredo inválido" }, { status: 401 });
    }

    if (!clinic_name || !admin_email) {
      return NextResponse.json(
        { ok: false, error: "clinic_name e admin_email são obrigatórios" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServer();

    // 1) cria a clínica
    const { data: clinic, error: clinicErr } = await supabase
      .from("clinics")
      .insert({ name: clinic_name })
      .select("*")
      .single();

    if (clinicErr) {
      return NextResponse.json({ ok: false, error: clinicErr.message }, { status: 400 });
    }

    // 2) cria o perfil admin da clínica (vinculando por email)
    // Aqui eu NÃO estou criando usuário no Auth (porque isso exige service_role/admin client).
    // O fluxo ideal é: você cria o usuário via painel do Supabase ou com um admin client,
    // e no primeiro login o sistema vincula o user.id ao profile.
    const { data: profile, error: profErr } = await supabase
      .from("profiles")
      .insert({
        email: admin_email,
        role: "clinic_admin",
        clinic_id: clinic.id,
        temp_password: admin_password,
      })
      .select("*")
      .single();

    if (profErr) {
      return NextResponse.json({ ok: false, error: profErr.message }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      clinic,
      profile,
      next_step:
        "Crie o usuário no Auth com esse email (ou use um admin client). No primeiro login, o sistema vincula o profile ao user.id.",
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Erro inesperado" }, { status: 500 });
  }
}
