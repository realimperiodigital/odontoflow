import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase/admin";

export const runtime = "nodejs";

function corsHeaders(origin?: string) {
  // libera só seu próprio domínio (e localhost)
  const allowed = new Set([
    "https://odontoflow.online",
    "https://www.odontoflow.online",
    "http://localhost:3000",
  ]);

  const o = origin && allowed.has(origin) ? origin : "https://www.odontoflow.online";

  return {
    "Access-Control-Allow-Origin": o,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin") || undefined;
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin") || undefined;

  try {
    const body = await req.json().catch(() => ({}));

    const email = String(body?.email || "").trim().toLowerCase();
    const newPassword = String(body?.newPassword || "").trim();
    const secret = String(body?.secret || "").trim();

    const expectedSecret = process.env.MASTER_RESET_SECRET || "";

    if (!expectedSecret) {
      return NextResponse.json(
        { ok: false, error: "MASTER_RESET_SECRET não configurado no servidor." },
        { status: 500, headers: corsHeaders(origin) }
      );
    }

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized (secret inválido)." },
        { status: 401, headers: corsHeaders(origin) }
      );
    }

    if (!email || !newPassword) {
      return NextResponse.json(
        { ok: false, error: "Informe email e newPassword." },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    const { data: usersData, error: listErr } =
      await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });

    if (listErr) {
      return NextResponse.json(
        { ok: false, error: `Falha listUsers: ${listErr.message}` },
        { status: 500, headers: corsHeaders(origin) }
      );
    }

    const user = (usersData?.users || []).find(
      (u) => (u.email || "").toLowerCase() === email
    );

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Usuário não encontrado no Supabase Auth." },
        { status: 404, headers: corsHeaders(origin) }
      );
    }

    const { data: updated, error: updErr } =
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        password: newPassword,
        email_confirm: true,
      });

    if (updErr) {
      return NextResponse.json(
        { ok: false, error: `Falha updateUserById: ${updErr.message}` },
        { status: 500, headers: corsHeaders(origin) }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        user_id: updated.user.id,
        email: updated.user.email,
        message: "Senha redefinida com sucesso.",
      },
      { status: 200, headers: corsHeaders(origin) }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Erro inesperado." },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
