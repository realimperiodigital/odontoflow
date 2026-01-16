import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase/admin";
import { createSupabaseServer } from "../../../../lib/supabase/server";

type PlanType = "trial" | "start" | "pro" | "premium";

function normalizeEmail(email: string) {
  return (email || "").trim().toLowerCase();
}

export async function POST(req: Request) {
  try {
    // 1) Pega o usuário logado (Master) pela sessão do site
    const supabase = await createSupabaseServer();
    const { data: userData, error: userErr } = await supabase.auth.getUser();

    if (userErr || !userData?.user) {
      return NextResponse.json(
        { ok: false, error: "Você precisa estar logado como MASTER para criar clínica." },
        { status: 401 }
      );
    }

    const masterUser = userData.user;
    const masterEmail = normalizeEmail(masterUser.email || "");
    const allowedMasterEmail = normalizeEmail(process.env.MASTER_EMAIL || "");

    // Se você tiver MASTER_EMAIL no .env (recomendado), trava por email
    if (allowedMasterEmail && masterEmail !== allowedMasterEmail) {
      return NextResponse.json(
        { ok: false, error: "Acesso negado. Este usuário não é MASTER." },
        { status: 403 }
      );
    }

    // 2) Lê dados enviados
    const body = await req.json();

    const clinicName = String(body?.clinicName || "").trim();
    const adminEmail = normalizeEmail(String(body?.adminEmail || ""));
    const adminPassword = String(body?.adminPassword || "odontoflow123").trim();

    const planType: PlanType = (body?.plan?.type || "trial") as PlanType;
    const trialDays = Number(body?.plan?.trialDays ?? 7);
    const patientLimit = Number(body?.plan?.patientLimit ?? 30);
    const userLimit = Number(body?.plan?.userLimit ?? 1);

    const cnpj = body?.cnpj ? String(body.cnpj).trim() : null;
    const phone = body?.phone ? String(body.phone).trim() : null;

    if (!clinicName) {
      return NextResponse.json({ ok: false, error: "Informe o nome da clínica." }, { status: 400 });
    }
    if (!adminEmail) {
      return NextResponse.json({ ok: false, error: "Informe o email do usuário admin da clínica." }, { status: 400 });
    }
    if (!adminPassword || adminPassword.length < 6) {
      return NextResponse.json(
        { ok: false, error: "A senha provisória precisa ter pelo menos 6 caracteres." },
        { status: 400 }
      );
    }

    // 3) Cria (ou reaproveita) o usuário admin da clínica no Auth
    //    Se já existir, a gente só usa o ID dele.
    let adminUserId: string | null = null;

    // tenta achar usuário pelo email
    const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 2000,
    });

    if (listErr) {
      return NextResponse.json({ ok: false, error: listErr.message }, { status: 500 });
    }

    const existing = (list?.users || []).find((u) => normalizeEmail(u.email || "") === adminEmail);
    if (existing?.id) {
      adminUserId = existing.id;
    } else {
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
      });

      if (createErr) {
        return NextResponse.json({ ok: false, error: createErr.message }, { status: 500 });
      }

      adminUserId = created?.user?.id || null;
    }

    if (!adminUserId) {
      return NextResponse.json({ ok: false, error: "Não consegui obter o ID do usuário admin." }, { status: 500 });
    }

    // 4) Cria a clínica (IMPORTANTE: owner_id é o admin da clínica, então nunca fica nulo)
    const { data: clinicInserted, error: clinicErr } = await supabaseAdmin
      .from("clinics")
      .insert({
        name: clinicName,
        cnpj,
        phone,
        is_headquarters: false,
        parent_clinic_id: null,
        owner_id: adminUserId,
      })
      .select("id, name, owner_id, created_at")
      .single();

    if (clinicErr) {
      return NextResponse.json({ ok: false, error: clinicErr.message }, { status: 500 });
    }

    const clinicId = clinicInserted?.id;

    // 5) (Opcional, mas recomendado) liga Master -> clínica numa tabela própria
    //    Se a tabela não existir ainda, a gente ignora sem quebrar.
    try {
      await supabaseAdmin.from("master_clinics").insert({
        master_id: masterUser.id,
        clinic_id: clinicId,
      });
    } catch (_) {}

    // 6) (Opcional) liga o admin da clínica na clínica (se você já tiver a tabela clinic_users)
    try {
      await supabaseAdmin.from("clinic_users").insert({
        clinic_id: clinicId,
        user_id: adminUserId,
        role: "admin",
        is_active: true,
      });
    } catch (_) {}

    // 7) (Opcional) salva o plano/limites (se você tiver tabela de assinatura)
    try {
      await supabaseAdmin.from("clinic_plans").insert({
        clinic_id: clinicId,
        plan_type: planType,
        trial_days: trialDays,
        patient_limit: patientLimit,
        user_limit: userLimit,
        starts_at: new Date().toISOString(),
      });
    } catch (_) {}

    return NextResponse.json({
      ok: true,
      clinic: clinicInserted,
      adminUser: { id: adminUserId, email: adminEmail },
      plan: { type: planType, trialDays, patientLimit, userLimit },
      message: "Clínica criada com sucesso.",
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
