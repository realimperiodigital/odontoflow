// app/api/master/clinics/create-with-admin/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase/admin";

export const runtime = "nodejs";

type Body = {
  clinic_name: string;
  clinic_email: string;
  admin_name?: string;
  admin_email: string;
  admin_password: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<Body>;

    const clinic_name = (body.clinic_name || "").trim();
    const clinic_email = (body.clinic_email || "").trim().toLowerCase();
    const admin_name = (body.admin_name || "").trim();
    const admin_email = (body.admin_email || "").trim().toLowerCase();
    const admin_password = (body.admin_password || "").trim();

    if (!clinic_name || !clinic_email || !admin_email || !admin_password) {
      return NextResponse.json(
        { ok: false, error: "Campos obrigatórios faltando." },
        { status: 400 }
      );
    }

    // 1) cria a clínica
    const { data: clinic, error: clinicErr } = await supabaseAdmin
      .from("clinics")
      .insert({
        name: clinic_name,
        email: clinic_email,
        status: "active",
      })
      .select("*")
      .single();

    if (clinicErr || !clinic) {
      return NextResponse.json(
        { ok: false, error: clinicErr?.message || "Erro ao criar clínica." },
        { status: 500 }
      );
    }

    // 2) cria o usuário admin (Auth)
    const created = await supabaseAdmin.auth.admin.createUser({
      email: admin_email,
      password: admin_password,
      email_confirm: true,
      user_metadata: {
        name: admin_name || undefined,
        role: "clinic_admin",
        clinic_id: clinic.id,
      },
    });

    if (created.error || !created.data?.user?.id) {
      return NextResponse.json(
        {
          ok: false,
          error: created.error?.message || "Erro ao criar usuário admin.",
        },
        { status: 500 }
      );
    }

    const userId = created.data.user.id;

    // 3) cria/garante profile
    const { error: profileErr } = await supabaseAdmin.from("profiles").upsert({
      id: userId,
      email: admin_email,
      role: "clinic_admin",
      clinic_id: clinic.id,
    });

    if (profileErr) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Clínica criada, mas falhou ao criar profile do admin: " +
            profileErr.message,
        },
        { status: 500 }
      );
    }

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
