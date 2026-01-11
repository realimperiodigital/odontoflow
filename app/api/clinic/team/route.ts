import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const jwt = authHeader.replace("Bearer ", "");
    const { data: caller } = await supabaseAdmin.auth.getUser(jwt);
    if (!caller?.user) return NextResponse.json({ error: "Sessão inválida" }, { status: 401 });

    const { data: callerProfile } = await supabaseAdmin
      .from("profiles")
      .select("clinic_id")
      .eq("user_id", caller.user.id)
      .single();

    if (!callerProfile?.clinic_id) {
      return NextResponse.json({ error: "Usuário sem clínica" }, { status: 400 });
    }

    const { data: team } = await supabaseAdmin
      .from("profiles")
      .select("user_id, full_name, role")
      .eq("clinic_id", callerProfile.clinic_id)
      .order("created_at");

    return NextResponse.json({ team });
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
