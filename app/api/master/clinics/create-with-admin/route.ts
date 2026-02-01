// app/api/master/clinics/create-with-admin/route.ts
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../../lib/supabase/admin";

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

    if (!clinic_email) {
      return NextResponse.json({ ok: false, error: "clinic_email é obrigatório" }, { status: 400 });
    }
    if (!admin_email) {
      return NextResponse.json({ ok: false, error: "admin_email é obrigatório" }, { status: 400 });
    }
    if (!admin_password || admin_password.length < 6) {
      return NextResponse.json(
        { ok: false, error: "admin_password precisa ter pelo menos 6 caracteres" },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    // 1) cria clínica (garante que a coluna clinics.name exista no banco)
    const { data: clinicRow, error: clinicErr } = await supabaseAdmin
      .from("clinics")
      .insert({
        name: clinic_name || clinic_email,
        email: clinic_email,
      })
      .select("*")
      .single();

    if (clinicErr) {
      return NextResponse.json(
        { ok: false, error: `Erro criando clínica: ${clinicErr.message}` },
        { status: 400 }
      );
    }

    const clinicId = clinicRow.id;

    // 2) cria usuário no Auth (ADMIN)
    const createRes: any = await supabaseAdmin.auth.admin.createUser({
      email: admin_email,
      password: admin_password,
      email_confirm: true,
      user_metadata: {
        full_name: admin_name || null,
        clinic_id: clinicId,
        role: "clinic_admin",
      },
    });

    if (createRes?.error) {
      // se der erro, remove a clínica criada pra não ficar sujeira
      await supabaseAdmin.from("clinics").delete().eq("id", clinicId);
      return NextResponse.json(
        { ok: false, error: `Erro criando usuário admin: ${createRes.error.message}` },
        { status: 400 }
      );
    }

    const userId: string | undefined = createRes?.data?.user?.id;

    if (!userId) {
      await supabaseAdmin.from("clinics").delete().eq("id", clinicId);
      return NextResponse.json(
        { ok: false, error: "Usuário admin não retornou id" },
        { status: 400 }
      );
    }

    // 3) garante profile do admin
    const { error: profileErr } = await supabaseAdmin.from("profiles").upsert(
      {
        id: userId,
        role: "clinic_admin",
        clinic_id: clinicId,
        full_name: admin_name || null,
      },
      { onConflict: "id" }
    );

    if (profileErr) {
      return NextResponse.json(
        { ok: false, error: `Clínica criada, mas falhou ao criar profile: ${profileErr.message}` },
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
