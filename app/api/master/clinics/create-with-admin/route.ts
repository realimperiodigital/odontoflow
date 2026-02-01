import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      clinic_name,
      clinic_email,
      admin_name,
      admin_email,
      admin_password,
    } = body;

    if (!clinic_name || !clinic_email || !admin_email || !admin_password) {
      return NextResponse.json(
        { ok: false, error: "Dados obrigatórios ausentes" },
        { status: 400 }
      );
    }

    // 1. Cria a clínica
    const { data: clinic, error: clinicError } = await supabaseAdmin
      .from("clinics")
      .insert({
        name: clinic_name,
        email: clinic_email,
      })
      .select()
      .single();

    if (clinicError) {
      return NextResponse.json(
        { ok: false, error: clinicError.message },
        { status: 400 }
      );
    }

    // 2. Cria o usuário admin da clínica
    const { data: createdUser, error: createUserError } =
      await supabaseAdmin.auth.admin.createUser({
        email: admin_email,
        password: admin_password,
        email_confirm: true,
        user_metadata: {
          name: admin_name,
          role: "clinic_admin",
          clinic_id: clinic.id,
        },
      });

    if (createUserError || !createdUser.user) {
      return NextResponse.json(
        {
          ok: false,
          error: createUserError?.message || "Erro ao criar usuário",
        },
        { status: 400 }
      );
    }

    // 3. Cria profile do admin
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: createdUser.user.id,
        email: admin_email,
        role: "clinic_admin",
        clinic_id: clinic.id,
      });

    if (profileError) {
      return NextResponse.json(
        { ok: false, error: profileError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      clinic,
      admin_id: createdUser.user.id,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message || "Erro interno" },
      { status: 500 }
    );
  }
}
