import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Body = {
  clinic_name: string;
  clinic_email: string;
  admin_name?: string;
  admin_email: string;
  admin_password: string;
};

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

export async function POST(req: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const body = (await req.json()) as Partial<Body>;

    const clinic_name = (body.clinic_name ?? "").trim();
    const clinic_email = (body.clinic_email ?? "").trim().toLowerCase();
    const admin_name = (body.admin_name ?? "").trim();
    const admin_email = (body.admin_email ?? "").trim().toLowerCase();
    const admin_password = (body.admin_password ?? "").trim();

    if (!clinic_name) return badRequest("Informe o nome da clínica.");
    if (!clinic_email) return badRequest("Informe o e-mail da clínica.");
    if (!admin_email) return badRequest("Informe o e-mail do admin.");
    if (!admin_password) return badRequest("Informe a senha do admin.");

    // 1) cria a clínica
    const { data: clinic, error: clinicErr } = await supabaseAdmin
      .from("clinics")
      .insert({ name: clinic_name, email: clinic_email })
      .select("*")
      .single();

    if (clinicErr) {
      return NextResponse.json(
        { ok: false, error: clinicErr.message },
        { status: 500 }
      );
    }

    // 2) cria usuário admin no Auth
    const created = await supabaseAdmin.auth.admin.createUser({
      email: admin_email,
      password: admin_password,
      email_confirm: true,
      user_metadata: {
        name: admin_name || "Admin",
        role: "clinic_admin",
        clinic_id: clinic.id,
      },
    });

    // Se já existe usuário, cria um erro aqui; então buscamos pelo listUsers (blindado)
    let userId: string | null = created.data.user?.id ?? null;

    if (created.error || !userId) {
      const listed = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 200,
      });

      const users = ((listed.data as any)?.users ?? []) as any[];
      const found = users.find(
        (u) => (u?.email ?? "").toLowerCase() === admin_email.toLowerCase()
      );

      userId = found?.id ?? null;

      if (!userId) {
        return NextResponse.json(
          {
            ok: false,
            error: `Erro criando admin: ${
              created.error?.message ?? "usuário não encontrado"
            }`,
          },
          { status: 500 }
        );
      }
    }

    // 3) garante profile (se existir essa tabela)
    await supabaseAdmin.from("profiles").upsert({
      id: userId,
      full_name: admin_name || "Admin",
      role: "clinic_admin",
      clinic_id: clinic.id,
    });

    return NextResponse.json({
      ok: true,
      clinic,
      admin_user_id: userId,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Erro inesperado." },
      { status: 500 }
    );
  }
}
