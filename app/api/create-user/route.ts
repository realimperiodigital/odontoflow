// app/api/create-user/route.ts
import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";
import { supabaseAdmin } from "@/lib/supabase/admin";

function pickString(v: unknown) {
  if (typeof v === "string") return v.trim();
  return "";
}

export async function POST(req: Request) {
  const supabase = await createSupabaseRouteClient();

  // 1) quem está criando (tem que estar logado)
  const { data: authData, error: authErr } = await supabase.auth.getUser();
  if (authErr || !authData?.user) {
    return NextResponse.json({ ok: false, error: "Não autenticado" }, { status: 401 });
  }

  // 2) pega perfil do requester (ajuste os nomes se sua tabela for diferente)
  const { data: requesterProfile } = await supabase
    .from("profiles")
    .select("role, clinic_id")
    .eq("id", authData.user.id)
    .maybeSingle();

  const requesterRole = requesterProfile?.role || "";
  const requesterClinicId = requesterProfile?.clinic_id || null;

  // só master ou clinic_admin
  if (requesterRole !== "master" && requesterRole !== "clinic_admin") {
    return NextResponse.json({ ok: false, error: "Sem permissão" }, { status: 403 });
  }

  // 3) body
  const ct = req.headers.get("content-type") || "";
  let name = "";
  let email = "";
  let password = "";
  let role = "clinic_user";
  let clinic_id: string | null = null;

  if (ct.includes("application/json")) {
    const body = await req.json().catch(() => ({}));
    name = pickString(body?.name);
    email = pickString(body?.email);
    password = pickString(body?.password);
    role = pickString(body?.role) || role;
    clinic_id = pickString(body?.clinic_id) || null;
  } else {
    const form = await req.formData().catch(() => null);
    name = pickString(form?.get("name"));
    email = pickString(form?.get("email"));
    password = pickString(form?.get("password"));
    role = pickString(form?.get("role")) || role;
    clinic_id = pickString(form?.get("clinic_id")) || null;
  }

  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "Email e senha são obrigatórios" }, { status: 400 });
  }

  // se não vier clinic_id e o requester não for master, força a clínica do requester
  if (!clinic_id && requesterRole !== "master") {
    clinic_id = requesterClinicId;
  }

  if (!clinic_id) {
    return NextResponse.json({ ok: false, error: "clinic_id é obrigatório" }, { status: 400 });
  }

  // 4) cria usuário no Auth (service role)
  const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createErr || !created?.user) {
    return NextResponse.json({ ok: false, error: createErr?.message || "Falha ao criar usuário" }, { status: 500 });
  }

  const newUserId = created.user.id;

  // 5) cria/atualiza profile
  // ajuste nomes de colunas conforme seu banco:
  const { error: profErr } = await supabase
    .from("profiles")
    .upsert({
      id: newUserId,
      name: name || null,
      role,
      clinic_id,
    });

  if (profErr) {
    return NextResponse.json({ ok: false, error: profErr.message }, { status: 500 });
  }

  // 6) cria vínculo na clinic_users (se você usa isso)
  const { error: linkErr } = await supabase
    .from("clinic_users")
    .upsert({
      user_id: newUserId,
      clinic_id,
      role,
    });

  if (linkErr) {
    return NextResponse.json({ ok: false, error: linkErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, user_id: newUserId });
}
