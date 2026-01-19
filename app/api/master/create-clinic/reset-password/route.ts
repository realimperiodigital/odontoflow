import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function corsHeaders(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin");

  try {
    const SUPABASE_URL =
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    const MASTER_RESET_SECRET = process.env.MASTER_RESET_SECRET || "";

    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { ok: false, error: "Variáveis do Supabase não configuradas na Vercel." },
        { status: 500, headers: corsHeaders(origin) }
      );
    }

    const body = await req.json().catch(() => ({}));
    const secret = String(body?.secret || "");
    const userId = String(body?.userId || body?.user_id || "");
    const newPassword = String(body?.newPassword || body?.new_password || "");

    if (!MASTER_RESET_SECRET) {
      return NextResponse.json(
        { ok: false, error: "MASTER_RESET_SECRET não está configurada." },
        { status: 500, headers: corsHeaders(origin) }
      );
    }

    if (!secret || secret !== MASTER_RESET_SECRET) {
      return NextResponse.json(
        { ok: false, error: "Chave inválida." },
        { status: 401, headers: corsHeaders(origin) }
      );
    }

    if (!userId || !newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { ok: false, error: "Informe userId e uma senha com pelo menos 6 caracteres." },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword,
    });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    return NextResponse.json(
      { ok: true },
      { status: 200, headers: corsHeaders(origin) }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Erro inesperado." },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
