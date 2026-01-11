import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type Body = {
  email: string;
  role: "reception" | "financial" | "dentist" | "staff";
  full_name?: string;
};

export async function POST(req: Request) {
  try {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const jwt = authHeader.replace("Bearer ", "");
    const { data: caller, error: callerErr } = await supabaseAdmin.auth.getUser(jwt);
    if (callerErr || !caller?.user) {
      return NextResponse.json({ error: "Sessão inválida" }, { status: 401 });
    }

    const callerId = caller.user.id;

    const { data: callerProfile, error: profErr } = await supabaseAdmin
      .from("profiles")
      .select("role, clinic_id")
      .eq("user_id", callerId)
      .single();

    if (profErr || !callerProfile) return NextResponse.json({ error: "Perfil não encontrado" }, { status: 403 });
    if (callerProfile.role !== "clinic_admin") return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

    const body = (await req.json()) as Body;

    const email = (body.email || "").trim().toLowerCase();
    const role = body.role;
    const full_name = (body.full_name || "").trim() || null;

    if (!email.includes("@")) return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    if (!role) return NextResponse.json({ error: "Role obrigatório" }, { status: 400 });

    const clinicId = callerProfile.clinic_id;
    if (!clinicId) return NextResponse.json({ error: "clinic_id inválido" }, { status: 400 });

    const tempPassword = `Odonto@${Math.random().toString(36).slice(2, 8)}!`;

    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
    });

    if (createErr || !created?.user) {
      return NextResponse.json({ error: createErr?.message || "Falha ao criar usuário" }, { status: 400 });
    }

    const newUserId = created.user.id;

    const { error: upErr } = await supabaseAdmin.from("profiles").upsert(
      {
        user_id: newUserId,
        clinic_id: clinicId,
        role,
        full_name,
        must_change_password: true,
      },
      { onConflict: "user_id" }
    );

    if (upErr) {
      await supabaseAdmin.auth.admin.deleteUser(newUserId);
      return NextResponse.json({ error: upErr.message }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      user: { id: newUserId, email, role },
      temp_password: tempPassword,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro interno" }, { status: 500 });
  }
}
