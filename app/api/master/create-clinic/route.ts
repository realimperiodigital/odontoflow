import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type Body = {
  name: string;
  cnpj?: string | null;
  phone?: string | null;
  admin_email: string;
  is_headquarters?: boolean;
  parent_clinic_id?: string | null;
};

export async function POST(req: Request) {
  try {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return NextResponse.json(
        { error: "ENV faltando: NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const body = (await req.json()) as Body;

    const name = (body.name || "").trim();
    const admin_email = (body.admin_email || "").trim().toLowerCase();
    const cnpj = (body.cnpj || null)?.toString().trim() || null;
    const phone = (body.phone || null)?.toString().trim() || null;
    const is_headquarters = !!body.is_headquarters;
    const parent_clinic_id = body.parent_clinic_id || null;

    if (!name) return NextResponse.json({ error: "Nome da clínica é obrigatório" }, { status: 400 });
    if (!admin_email || !admin_email.includes("@")) {
      return NextResponse.json({ error: "Email do admin inválido" }, { status: 400 });
    }

    // 1) cria usuário no AUTH primeiro (pra termos owner_id)
    const tempPassword = `Odonto@${Math.random().toString(36).slice(2, 8)}!`;

    const { data: createdUser, error: createUserErr } = await supabaseAdmin.auth.admin.createUser({
      email: admin_email,
      password: tempPassword,
      email_confirm: true,
    });

    if (createUserErr || !createdUser?.user) {
      return NextResponse.json(
        { error: `Falha ao criar usuário no Auth: ${createUserErr?.message || "sem detalhes"}`, details: createUserErr },
        { status: 400 }
      );
    }

    const userId = createdUser.user.id;

    // 2) cria a clínica com owner_id preenchido
    const { data: clinic, error: clinicErr } = await supabaseAdmin
      .from("clinics")
      .insert({
        name,
        cnpj,
        phone,
        is_headquarters,
        parent_clinic_id,
        owner_id: userId, // <<< aqui está o conserto
      })
      .select("id, name")
      .single();

    if (clinicErr || !clinic) {
      // rollback: remove usuário criado, pra não sujar
      await supabaseAdmin.auth.admin.deleteUser(userId);

      return NextResponse.json(
        { error: `Falha ao criar clínica: ${clinicErr?.message || "sem detalhes"}`, details: clinicErr },
        { status: 400 }
      );
    }

    // 3) cria/atualiza profile do admin da clínica
    const { error: profileErr } = await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          user_id: userId,
          role: "clinic_admin",
          clinic_id: clinic.id,
          name: name,
        },
        { onConflict: "user_id" }
      );

    if (profileErr) {
      // rollback: remove clinic + user
      await supabaseAdmin.from("clinics").delete().eq("id", clinic.id);
      await supabaseAdmin.auth.admin.deleteUser(userId);

      return NextResponse.json(
        { error: `Falha ao criar profile: ${profileErr.message}`, details: profileErr },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      clinic: { id: clinic.id, name: clinic.name },
      admin: { email: admin_email, user_id: userId },
      temp_password: tempPassword,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro inesperado", details: String(err) },
      { status: 500 }
    );
  }
}
