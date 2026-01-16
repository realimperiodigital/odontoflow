import { NextResponse } from "next/server";
import { createSupabaseServer } from "../../../../lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 401 });
    }

    return NextResponse.json({ ok: true, user: data.user ?? null });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Erro inesperado" }, { status: 500 });
  }
}
