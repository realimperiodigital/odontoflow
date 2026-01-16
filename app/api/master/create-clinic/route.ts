import { NextResponse } from "next/server";

// IMPORT RELATIVO (sem @/)
import { supabaseAdmin } from "../../../../lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const clinicName = String(body?.clinicName || "").trim();
    const adminEmail = String(body?.adminEmail || "").trim().toLowerCase();
    const adminPassword = String(body?.adminPassword || "").trim();

    if (!clinicName) {
      return NextResponse.json({ ok: false, error: "Nome da clínica é obrigatório" }, { status: 400 });
    }
    if (!adminEmail) {
      return NextResponse.json({ ok: false, error: "Email do admin é obrigatório" }, { status: 400 });
    }
    if (adminPassword.length < 6) {
      return NextResponse.json({ ok: false, error: "Senha do admin precisa ter pelo menos 6 caracteres" }, { status: 400 });
    }

    // 1) cria a clínica
    const { data: clinic, error: clinicErr } = await supabaseAdmin
      .from("clinics")
      .insert([{ name: clinicName }])
      .select("*")
      .single();

    if (clinicErr || !clinic) {
      return NextResponse.json({ ok: false, error: clinicErr?.message || "Erro ao criar clínica" }, { status: 500 });
    }

    // 2) cria o usuário do admin da clínica
    const { data: created, error: userErr } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true
    });

    if (userErr || !created?.user) {
      // rollback: remove a clínica
      await supabaseAdmin.from("clinics").delete().eq("id", clinic.id);
      return NextResponse.json({ ok: false, error: userErr?.message || "Erro ao criar usuário" }, { status: 500 });
    }

    const newUserId = created.user.id;

    // 3) cria profile do admin da clínica
    // sua tabela profiles: user_id, role, clinic_id, name, full_name
    const { error: profileErr } = await supabaseAdmin.from("profiles").insert([
      {
        user_id: newUserId,
        role: "clinic_admin",
        clinic_id: clinic.id,
        name: clinicName,
        full_name: clinicName
      }
    ]);

    if (profileErr) {
      // rollback: remove user e clinic
      await supabaseAdmin.auth.admin.deleteUser(newUserId);
      await supabaseAdmin.from("clinics").delete().eq("id", clinic.id);
      return NextResponse.json({ ok: false, error: profileErr.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      clinic,
      adminUserId: newUserId,
      adminEmail
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Erro inesperado" }, { status: 500 });
  }
}
