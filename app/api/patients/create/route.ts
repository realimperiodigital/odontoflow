// app/api/patients/create/route.ts
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

  // 2) pegar clinic_id pelo vínculo
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

  // 3) ler body (aceita formData OU json)
  let name = "";
  let phone = "";
  let email = "";

  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const body = await req.json().catch(() => ({}));
    name = pickString(body?.name);
    phone = pickString(body?.phone);
    email = pickString(body?.email);
  } else {
    const form = await req.formData().catch(() => null);
    name = pickString(form?.get("name"));
    phone = pickString(form?.get("phone"));
    email = pickString(form?.get("email"));
  }

  if (!name) {
    return NextResponse.json({ ok: false, error: "Nome é obrigatório" }, { status: 400 });
  }

  // 4) inserir paciente
  const { error: insErr } = await supabase.from("patients").insert({
    clinic_id: membership.clinic_id,
    name,
    phone: phone || null,
    email: email || null,
  });

  if (insErr) {
    return NextResponse.json({ ok: false, error: insErr.message }, { status: 500 });
  }

  return NextResponse.redirect(new URL("/dashboard/patients", req.url));
}
