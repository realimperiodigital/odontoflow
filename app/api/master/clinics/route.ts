import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

// 4d472a7c-44c4-4d5b-a012-75c29d913c1c (auth.users.id do masterodontoflow@gmail.com)
const MASTER_USER_ID = "4d472a7c-44c4-4d5b-a012-75c29d913c1c";

export async function POST(req: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { name, email, phone } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { ok: false, error: "Nome e e-mail são obrigatórios" },
        { status: 400 }
      );
    }

    if (!MASTER_USER_ID || MASTER_USER_ID === "COLE_O_UUID_DO_MASTER_AQUI") {
      return NextResponse.json(
        { ok: false, error: "MASTER_USER_ID não configurado." },
        { status: 500 }
      );
    }

    const { data: exists } = await supabaseAdmin
      .from("clinics")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (exists) {
      return NextResponse.json(
        { ok: false, error: "Clínica já cadastrada" },
        { status: 409 }
      );
    }

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
      { ok: false, error: err.message || "Erro inesperado" },
      { status: 500 }
    );
  }
}
