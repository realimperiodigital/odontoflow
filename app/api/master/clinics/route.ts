import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServer } from "@/lib/supabase/server";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(req: Request) {
  try {
    // 1) Confere se quem está chamando está logado (sessão)
    const supabase = await createSupabaseServer();
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;

    if (!user) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    // 2) Confere se esse usuário é Master (profiles.role)
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileErr || !profile) {
      return NextResponse.json(
        { error: "Seu perfil não foi encontrado." },
        { status: 403 }
      );
    }

    if (profile.role !== "master") {
      return NextResponse.json({ error: "Sem permissão." }, { status: 403 });
    }

    // 3) Lê dados do formulário
    const body = await req.json();

    const clinicName = String(body?.clinicName ?? "").trim();
    const clinicSlugRaw = String(body?.clinicSlug ?? "").trim();
    const adminEmail = String(body?.adminEmail ?? "").trim().toLowerCase();
    const adminPassword = String(body?.adminPassword ?? "").trim();

    if (!clinicName || !adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "Preencha: Nome da clínica, Email do admin e Senha." },
        { status: 400 }
      );
    }

    const slug = clinicSlugRaw ? slugify(clinicSlugRaw) : slugify(clinicName);

    // 4) Cria clínica
    const { data: clinic, error: clinicErr } = await supabaseAdmin
      .from("clinics")
      .insert({
        name: clinicName,
        slug,
        is_active: true,
      })
      .select("id, name, slug")
      .single();

    if (clinicErr || !clinic) {
      return NextResponse.json(
        { error: clinicErr?.message || "Erro ao criar clínica." },
        { status: 400 }
      );
    }

    // 5) Cria usuário auth (admin da clínica)
    const { data: created, error: createUserErr } =
      await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
      });

    if (createUserErr || !created?.user) {
      // rollback: remove clínica
      await supabaseAdmin.from("clinics").delete().eq("id", clinic.id);

      return NextResponse.json(
        { error: createUserErr?.message || "Erro ao criar usuário da clínica." },
        { status: 400 }
      );
    }

    const clinicUserId = created.user.id;

    // 6) Cria profile do admin da clínica
    const { error: profileCreateErr } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: clinicUserId,
        email: adminEmail,
        role: "clinic_admin",
        clinic_id: clinic.id,
      });

    if (profileCreateErr) {
      // rollback completo
      await supabaseAdmin.auth.admin.deleteUser(clinicUserId);
      await supabaseAdmin.from("clinics").delete().eq("id", clinic.id);

      return NextResponse.json(
        { error: profileCreateErr.message || "Erro ao criar profile do admin." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      clinic,
      adminUserId: clinicUserId,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Erro inesperado." },
      { status: 500 }
    );
  }
}
