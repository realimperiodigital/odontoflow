import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Se você tiver types do Database, dá pra tipar aqui depois.
// Agora o foco é: BUILD PASSAR e API FUNCIONAR.

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const clinic_name = String(body?.clinic_name ?? "").trim();
    const clinic_email = String(body?.clinic_email ?? "").trim().toLowerCase();

    const admin_name = String(body?.admin_name ?? "").trim();
    const admin_email = String(body?.admin_email ?? "").trim().toLowerCase();

    // senha opcional: se não vier, a gente gera uma temporária
    const admin_password =
      String(body?.admin_password ?? "").trim() ||
      `Odonto@${Math.random().toString(36).slice(2, 8)}${new Date().getFullYear()}`;

    if (!clinic_name || !clinic_email || !admin_name || !admin_email) {
      return NextResponse.json(
        { error: "Campos obrigatórios: clinic_name, clinic_email, admin_name, admin_email" },
        { status: 400 }
      );
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return NextResponse.json(
        { error: "Env faltando no servidor: SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 1) cria a clínica
    // IMPORTANTÍSSIMO: ajuste os nomes das colunas conforme sua tabela clinics
    // Vou assumir que você tem pelo menos: id (uuid), name, email
    const { data: clinicRow, error: clinicErr } = await supabaseAdmin
      .from("clinics")
      .insert(
        [
          {
            name: clinic_name,
            email: clinic_email,
          },
        ] as any
      )
      .select("id, name, email")
      .single();

    if (clinicErr) {
      return NextResponse.json(
        { error: "Erro criando clínica", details: clinicErr.message },
        { status: 400 }
      );
    }

    const clinic_id = clinicRow.id as string;

    // 2) cria o usuário admin no Auth
    const { data: createdUser, error: userErr } = await supabaseAdmin.auth.admin.createUser({
      email: admin_email,
      password: admin_password,
      email_confirm: true,
      user_metadata: {
        name: admin_name,
        clinic_id,
      },
    });

    if (userErr || !createdUser?.user) {
      return NextResponse.json(
        { error: "Erro criando usuário admin", details: userErr?.message ?? "Sem user" },
        { status: 400 }
      );
    }

    const admin_user_id = createdUser.user.id;

    // 3) cria/atualiza profile
    // Assumindo sua tabela profiles: id (uuid), role (text), clinic_id (uuid), name (text)
    const { error: profileErr } = await supabaseAdmin
      .from("profiles")
      .upsert(
        [
          {
            id: admin_user_id,
            name: admin_name,
            role: "clinic_admin",
            clinic_id: clinic_id,
          },
        ] as any,
        { onConflict: "id" }
      );

    if (profileErr) {
      return NextResponse.json(
        { error: "Clínica criada, mas falhou profile", details: profileErr.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        clinic: clinicRow,
        admin: {
          id: admin_user_id,
          email: admin_email,
          temp_password: admin_password, // depois você pode remover isso e mandar via WhatsApp/email
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
