import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const MASTER_EMAIL = "realimperiodigital@gmail.com";
const MASTER_PASSWORD = "Nr47444682@";

function adminClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

// ✅ GET pra você testar no navegador (sem botão, sem POST)
export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "/api/bootstrap-master",
    env: {
      SUPABASE_URL: SUPABASE_URL || null,
      SUPABASE_SERVICE_ROLE_KEY_exists: Boolean(SUPABASE_SERVICE_ROLE_KEY),
    },
  });
}

// ✅ POST faz o bootstrap de verdade
export async function POST() {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { ok: false, error: "Faltou SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY no .env.local" },
        { status: 400 }
      );
    }

    const supabaseAdmin = adminClient();

    const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });

    if (listErr) {
      return NextResponse.json({ ok: false, error: listErr.message }, { status: 400 });
    }

    let userId =
      list?.users?.find((u) => u.email?.toLowerCase() === MASTER_EMAIL.toLowerCase())?.id || null;

    if (!userId) {
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: MASTER_EMAIL,
        password: MASTER_PASSWORD,
        email_confirm: true,
      });

      if (createErr || !created?.user?.id) {
        return NextResponse.json(
          { ok: false, error: createErr?.message || "Falha ao criar MASTER" },
          { status: 400 }
        );
      }

      userId = created.user.id;
    }

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
    return NextResponse.json(
      { ok: false, error: e?.message || "Erro inesperado" },
      { status: 500 }
    );
  }
}
