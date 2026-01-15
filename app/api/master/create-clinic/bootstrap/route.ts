import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const MASTER_EMAIL = "realimperiodigital@gmail.com";
const MASTER_PASSWORD = "Nr47444682@";

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

export async function POST() {
  try {
    // 1) tenta achar o user pelo email
    const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });

    if (listErr) {
      return NextResponse.json({ ok: false, error: listErr.message }, { status: 400 });
    }

    let userId = list?.users?.find(
      (u) => u.email?.toLowerCase() === MASTER_EMAIL.toLowerCase()
    )?.id;

    // 2) se não existir, cria
    if (!userId) {
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: MASTER_EMAIL,
        password: MASTER_PASSWORD,
        email_confirm: true,
        user_metadata: { role: "master" },
      });

      if (createErr || !created?.user?.id) {
        return NextResponse.json(
          { ok: false, error: createErr?.message || "Falha ao criar MASTER" },
          { status: 400 }
        );
      }

      userId = created.user.id;
    }

    // 3) garante profile master
    const { data: profile, error: upsertErr } = await supabaseAdmin
      .from("profiles")
      .upsert(
        [
          {
            user_id: userId,
            role: "master",
            clinic_id: null,
            must_change_password: false,
          },
        ],
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (upsertErr) {
      return NextResponse.json({ ok: false, error: upsertErr.message }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      master: { email: MASTER_EMAIL, user_id: userId },
      profile,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Erro inesperado" }, { status: 500 });
  }
}
