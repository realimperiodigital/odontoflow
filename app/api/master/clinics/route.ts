// app/api/master/clinics/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { name, email, phone } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { ok: false, error: "Nome e e-mail são obrigatórios" },
        { status: 400 }
      );
    }

    // Verifica duplicidade
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

    // Insere clínica
    const { data, error } = await supabaseAdmin
      .from("clinics")
      .insert([
        {
          name,
          email,
          phone: phone || null,
          status: "active",
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
