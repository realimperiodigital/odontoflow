import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type Body = {
  clinic_name?: string;
  clinic_email?: string;
  admin_name?: string;
  admin_email?: string;
  admin_password?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    const clinic_name = String(body?.clinic_name ?? "").trim();
    const clinic_email = String(body?.clinic_email ?? "")
      .trim()
      .toLowerCase();

    const admin_name = String(body?.admin_name ?? "").trim();
    const admin_email = String(body?.admin_email ?? "")
      .trim()
      .toLowerCase();

    const admin_password =
      String(body?.admin_password ?? "").trim() ||
      `Odonto@${Math.random().toString(36).slice(2, 8)}${new Date().getFullYear()}`;

    if (!clinic_name || !clinic_email || !admin_name || !admin_email) {
      return NextResponse.json(
        {
          error:
            "Campos obrigatórios: clinic_name, clinic_email, admin_name, admin_email",
        },
        { status: 400 }
      );
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return NextResponse.json(
        {
          error:
            "Env faltando no servidor: SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY",
        },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 1) Criar clínica
    // Ajuste os nomes das colunas AQUI se sua tabela clinics for diferente.
    // Pelo que você já usa no projeto, normalmente é name/email.
    const clinicInsert = await supabaseAdmin
      .from("clinics")
      .insert([
        {
          name: clinic_name,
          email: clinic_email,
        },
      ] as any)
      .select("id")
      .single();

    if (clinicInsert.error || !clinicInsert.data) {
      return NextResponse.json(
        {
          error: "Erro criando clínica",
          details: clinicInsert.error?.message ?? "Sem retorno do insert",
        },
        { status: 400 }
      );
    }

    // 🔥 Linha cirúrgica que evita o erro do build
    const clinicId = (clinicInsert.data as any).id as string;

    if (!clinicId) {
      return NextResponse.json(
        { error: "Clínica criada sem id (inesperado)" },
        { status: 500 }
      );
    }

    // 2) Criar usuário admin no Auth
    const createdUser = await supabaseAdmin.auth.admin.createUser({
      email: admin_email,
      password: admin_password,
      email_confirm: true,
      user_metadata: {
        name: admin_name,
        clinic_id: clinicId,
      },
    });

    if (createdUser.error || !createdUser.data?.user) {
      return NextResponse.json(
        {
          error: "Erro criando usuário admin",
          details: createdUser.error?.message ?? "Sem user",
        },
        { status: 400 }
      );
    }

    const admin_user_id = createdUser.data.user.id;

    // 3) Criar profile do admin
    // Ajuste role se você usa outro padrão: 'clinic_admin' / 'admin' / etc.
    const profileUpsert = await supabaseAdmin.from("profiles").upsert(
      [
        {
          id: admin_user_id,
          name: admin_name,
          role: "clinic_admin",
          clinic_id: clinicId,
        },
      ] as any,
      { onConflict: "id" }
    );

    if (profileUpsert.error) {
      return NextResponse.json(
        {
          error: "Clínica e usuário criados, mas falhou ao criar profile",
          details: profileUpsert.error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        clinic: {
          id: clinicId,
          name: clinic_name,
          email: clinic_email,
        },
        admin: {
          id: admin_user_id,
          email: admin_email,
          temp_password: admin_password,
        },
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: "Erro inesperado", details: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}
