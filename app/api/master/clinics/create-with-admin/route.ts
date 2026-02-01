// app/api/master/clinics/create-with-admin/route.ts

import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Body = {
  clinic_name: string;
  clinic_email: string;
  admin_name: string;
  admin_email: string;
  admin_password: string;
};

function cleanStr(v: unknown) {
  return String(v ?? "").trim();
}

export async function POST(req: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const body = (await req.json()) as Partial<Body>;

    const clinic_name = cleanStr(body.clinic_name);
    const clinic_email = cleanStr(body.clinic_email).toLowerCase();
    const admin_name = cleanStr(body.admin_name);
    const admin_email = cleanStr(body.admin_email).toLowerCase();
    const admin_password = cleanStr(body.admin_password);

    if (!clinic_name || !clinic_email || !admin_name || !admin_email || !admin_password) {
      return NextResponse.json(
        { ok: false, error: "Campos obrigatórios faltando." },
        { status: 400 }
      );
    }

    // 1) Cria a clínica
    const { data: clinicRow, error: clinicErr } = await supabaseAdmin
      .from("clinics")
      .insert({ name: clinic_name, email: clinic_email } as any)
      .select("*")
      .single();

    if (clinicErr) {
      return NextResponse.json(
        { ok: false, error: `Erro criando clínica: ${clinicErr.message}` },
        { status: 400 }
      );
    }

    const clinicId = String((clinicRow as any)?.id ?? "");
    if (!clinicId) {
      return NextResponse.json(
        { ok: false, error: "Clínica criada, mas não retornou ID." },
        { status: 500 }
      );
    }

    // 2) Cria o usuário admin (Auth)
    const created = await supabaseAdmin.auth.admin.createUser({
      email: admin_email,
      password: admin_password,
      email_confirm: true,
      user_metadata: {
        full_name: admin_name,
        clinic_id: clinicId,
        role: "clinic_admin",
      } as any,
    });

    if (created.error) {
      return NextResponse.json(
        { ok: false, error: `Erro criando admin da clínica: ${created.error.message}` },
        { status: 400 }
      );
    }

    const userId = String((created.data as any)?.user?.id ?? "");
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Usuário criado, mas não retornou user.id." },
        { status: 500 }
      );
    }

    // 3) Garante/atualiza profile (se sua tabela profiles existir)
    const { error: profileErr } = await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          id: userId,
          full_name: admin_name,
          email: admin_email,
          role: "clinic_admin",
          clinic_id: clinicId,
        } as any,
        { onConflict: "id" } as any
      );

    if (profileErr) {
      return NextResponse.json(
        { ok: false, error: `Erro criando profile: ${profileErr.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      clinic: clinicRow,
      admin_user_id: userId,
      clinic_id: clinicId,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Erro inesperado." },
      { status: 500 }
    );
  }
}
