import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

// UUID do usuário master (auth.users.id do masterodontoflow@gmail.com)
const MASTER_USER_ID = "4d472a7c-44c4-4d5b-a012-75c29d913c1c";

export async function POST(req: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { ok: false, error: "Body inválido (JSON)" },
        { status: 400 }
      );
    }

    const { name, email, phone } = body as {
      name?: string;
      email?: string;
      phone?: string;
    };

    if (!name || !email) {
      return NextResponse.json(
        { ok: false, error: "Nome e e-mail são obrigatórios" },
        { status: 400 }
      );
    }

    if (!MASTER_USER_ID) {
      return NextResponse.json(
        { ok: false, error: "MASTER_USER_ID não configurado." },
        { status: 500 }
      );
    }

    // Impede duplicar clínica por email
    const { data: exists, error: existsError } = await supabaseAdmin
      .from("clinics")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existsError) {
      return NextResponse.json(
        { ok: false, error: existsError.message },
        { status: 500 }
      );
    }

    if (exists) {
      return NextResponse.json(
        { ok: false, error: "Clínica já cadastrada com esse e-mail" },
        { status: 409 }
      );
    }

    // Cria a clínica
    const { data, error } = await supabaseAdmin
      .from("clinics")
      .insert([
        {
          name,
          email,
          phone: phone || null,
          status: "active",
          owner_id: MASTER_USER_ID,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, clinic: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Erro inesperado" },
      { status: 500 }
    );
  }
}
