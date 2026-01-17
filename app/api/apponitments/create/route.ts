// app/api/appointments/create/route.ts
import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

function pickString(v: unknown) {
  if (typeof v === "string") return v.trim();
  return "";
}

export async function POST(req: Request) {
  const supabase = await createSupabaseRouteClient();

  // 1) usuário logado
  const { data: authData, error: authErr } = await supabase.auth.getUser();
  if (authErr || !authData?.user) {
    return NextResponse.json({ ok: false, error: "Não autenticado" }, { status: 401 });
  }

  // 2) pegar clinic_id do usuário
  const { data: membership, error: memErr } = await supabase
    .from("clinic_users")
    .select("clinic_id")
    .eq("user_id", authData.user.id)
    .maybeSingle();

  if (memErr) {
    return NextResponse.json({ ok: false, error: "Erro ao buscar vínculo com clínica" }, { status: 500 });
  }
  if (!membership?.clinic_id) {
    return NextResponse.json({ ok: false, error: "Usuário sem clínica vinculada" }, { status: 400 });
  }

  // 3) body
  let patient_id = "";
  let date = "";
  let time = "";

  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const body = await req.json().catch(() => ({}));
    patient_id = pickString(body?.patient_id);
    date = pickString(body?.date);
    time = pickString(body?.time);
  } else {
    const form = await req.formData().catch(() => null);
    patient_id = pickString(form?.get("patient_id"));
    date = pickString(form?.get("date"));
    time = pickString(form?.get("time"));
  }

  if (!date || !time) {
    return NextResponse.json({ ok: false, error: "Data e hora são obrigatórias" }, { status: 400 });
  }

  // 4) inserir appointment
  const { error: insErr } = await supabase.from("appointments").insert({
    clinic_id: membership.clinic_id,
    patient_id: patient_id || null,
    date,
    time,
    status: "scheduled",
  });

  if (insErr) {
    return NextResponse.json({ ok: false, error: insErr.message }, { status: 500 });
  }

  return NextResponse.redirect(new URL("/dashboard/agenda", req.url));
}
