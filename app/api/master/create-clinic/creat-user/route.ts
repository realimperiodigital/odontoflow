import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const clinicName = (body?.name as string)?.trim() || "Clínica em teste";

    // 1) cria clínica em trial
    const { data: clinic, error: clinicErr } = await supabaseAdmin
      .from("clinics")
      .insert([{ name: clinicName, status: "trial" }])
      .select()
      .single();

    if (clinicErr) {
      return NextResponse.json({ ok: false, error: clinicErr.message }, { status: 400 });
    }

    // 2) cria usuário auth com email técnico (sem email real)
    const technicalEmail = `trial+${clinic.id}@odontoflow.local`;
    const defaultPassword = "123456";

    const { data: created, error: authErr } = await supabaseAdmin.auth.admin.createUser({
      email: technicalEmail,
      password: defaultPassword,
      email_confirm: true,
      user_metadata: { clinic_id: clinic.id, created_as: "trial" },
    });

    if (authErr || !created?.user) {
      await supabaseAdmin.from("clinics").delete().eq("id", clinic.id);
      return NextResponse.json(
        { ok: false, error: authErr?.message || "Falha ao criar usuário" },
        { status: 400 }
      );
    }

    // 3) cria profile clinic_admin (troca senha obrigatória)
    const { error: profileErr } = await supabaseAdmin.from("profiles").insert([
      {
        user_id: created.user.id,
        role: "clinic_admin",
        clinic_id: clinic.id,
        must_change_password: true,
      },
    ]);

    if (profileErr) {
      await supabaseAdmin.auth.admin.deleteUser(created.user.id);
      await supabaseAdmin.from("clinics").delete().eq("id", clinic.id);
      return NextResponse.json({ ok: false, error: profileErr.message }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      clinic: {
        id: clinic.id,
        name: clinic.name,
        status: clinic.status,
        trial_end: clinic.trial_end,
      },
      login: {
        email: technicalEmail,
        password: defaultPassword,
        must_change_password: true,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Erro inesperado" }, { status: 500 });
  }
}
