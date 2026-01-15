import { NextResponse } from "next/server";

// IMPORTS RELATIVOS CERTOS a partir de: app/api/master/create-clinic/route.ts
import { supabaseAdmin } from "../../../lib/supabase/admin";
import { createSupabaseServer } from "../../../lib/supabase/server";

type CreateClinicBody = {
  clinic_name?: string;
  owner_name?: string;
  email?: string; // opcional (se não vier, cria email de teste automático)
};

function buildTestEmail(clinicName: string) {
  const slug = (clinicName || "clinica")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);

  const stamp = Date.now().toString().slice(-6);
  return `clinica+${slug}-${stamp}@odontoflow.online`;
}

export async function POST(req: Request) {
  try {
    // 1) valida sessão do usuário logado (MASTER)
    const supabase = await createSupabaseServer();
    const { data: authData, error: authErr } = await supabase.auth.getUser();

    if (authErr || !authData?.user) {
      return NextResponse.json(
        { ok: false, error: "Auth session missing! Faça login novamente." },
        { status: 401 }
      );
    }

    const user = authData.user;

    // 2) garante role master
    const { data: profile, error: profErr } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (profErr || !profile) {
      return NextResponse.json(
        { ok: false, error: "Profile não encontrado. Rode o bootstrap-master novamente." },
        { status: 403 }
      );
    }

    if (profile.role !== "master") {
      return NextResponse.json(
        { ok: false, error: "Apenas MASTER pode criar clínicas." },
        { status: 403 }
      );
    }

    // 3) lê body
    const body = (await req.json().catch(() => ({}))) as CreateClinicBody;

    const clinicName = (body.clinic_name || "").trim();
    const ownerName = (body.owner_name || "").trim();

    if (!clinicName) {
      return NextResponse.json({ ok: false, error: "Informe clinic_name." }, { status: 400 });
    }

    const defaultPassword = "123456";
    const finalEmail = (body.email || "").trim() || buildTestEmail(clinicName);

    // 4) cria clínica (trial 7 dias)
    const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: clinicRow, error: clinicErr } = await supabaseAdmin
      .from("clinics")
      .insert({
        name: clinicName,
        owner_name: ownerName || null,
        status: "trial",
        trial_ends_at: trialEndsAt,
        blocked: false,
      })
      .select("id, name, status, trial_ends_at")
      .single();

    if (clinicErr || !clinicRow) {
      return NextResponse.json(
        { ok: false, error: clinicErr?.message || "Erro ao criar clínica." },
        { status: 500 }
      );
    }

    // 5) cria usuário da clínica no Auth (admin)
    const { data: createdUser, error: createUserErr } = await supabaseAdmin.auth.admin.createUser({
      email: finalEmail,
      password: defaultPassword,
      email_confirm: true,
    });

    if (createUserErr || !createdUser?.user) {
      await supabaseAdmin.from("clinics").delete().eq("id", clinicRow.id);

      return NextResponse.json(
        { ok: false, error: createUserErr?.message || "Erro ao criar usuário da clínica." },
        { status: 500 }
      );
    }

    const clinicUserId = createdUser.user.id;

    // 6) cria profile do usuário da clínica (força troca de senha)
    const { error: profInsertErr } = await supabaseAdmin.from("profiles").insert({
      user_id: clinicUserId,
      role: "clinic_admin",
      clinic_id: clinicRow.id,
      must_change_password: true,
      full_name: ownerName || clinicName,
    });

    if (profInsertErr) {
      await supabaseAdmin.auth.admin.deleteUser(clinicUserId);
      await supabaseAdmin.from("clinics").delete().eq("id", clinicRow.id);

      return NextResponse.json(
        { ok: false, error: profInsertErr.message || "Erro ao criar profile do usuário." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      clinic: clinicRow,
      credentials: {
        email: finalEmail,
        password: defaultPassword,
        note: "Senha padrão 123456. Usuário será obrigado a trocar no primeiro login.",
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Erro inesperado." },
      { status: 500 }
    );
  }
}
