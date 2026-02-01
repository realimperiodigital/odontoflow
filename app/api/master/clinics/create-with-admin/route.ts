// app/api/master/clinics/create-with-admin/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { User } from "@supabase/supabase-js";

export const runtime = "nodejs";

type Body = {
  clinic_name: string;
  clinic_email: string;
  admin_email: string;
  admin_password: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<Body>;

    const clinic_name = (body.clinic_name || "").trim();
    const clinic_email = (body.clinic_email || "").trim().toLowerCase();
    const admin_email = (body.admin_email || "").trim().toLowerCase();
    const admin_password = (body.admin_password || "").trim();

    if (!clinic_name || !clinic_email || !admin_email || !admin_password) {
      return NextResponse.json(
        { ok: false, error: "Campos obrigatórios faltando." },
        { status: 400 }
      );
    }

    // 1) Cria a clínica
    const { data: clinic, error: clinicErr } = await supabaseAdmin
      .from("clinics")
      .insert({
        name: clinic_name,
        email: clinic_email,
        status: "active",
      })
      .select("*")
      .single();

    if (clinicErr || !clinic) {
      return NextResponse.json(
        { ok: false, error: clinicErr?.message || "Erro criando clínica." },
        { status: 500 }
      );
    }

    // 2) Cria o usuário admin (Auth)
    const created = await supabaseAdmin.auth.admin.createUser({
      email: admin_email,
      password: admin_password,
      email_confirm: true,
    });

    // Se criou com sucesso
    if (created.data?.user?.id) {
      const userId = created.data.user.id;

      // 3) Garante profile ligado à clínica
      await supabaseAdmin.from("profiles").upsert({
        id: userId,
        email: admin_email,
        role: "clinic_admin",
        clinic_id: clinic.id,
      });

      return NextResponse.json({
        ok: true,
        clinic,
        admin_user_id: userId,
      });
    }

    // 4) Se deu erro porque já existe, tenta localizar o usuário existente
    // (Aqui estava quebrando o build)
    const listed = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });

    if (listed.error) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Erro criando admin da clínica: " +
            (created.error?.message || "desconhecido") +
            " | E não consegui listar usuários: " +
            listed.error.message,
        },
        { status: 500 }
      );
    }

    const users: User[] = (listed.data?.users as User[]) || [];
    const found = users.find(
      (u) => (u.email ?? "").toLowerCase() === admin_email
    );

    if (!found?.id) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Erro criando admin da clínica: " +
            (created.error?.message || "desconhecido") +
            " | Não encontrei o usuário existente pelo email.",
        },
        { status: 500 }
      );
    }

    // 5) Atualiza/garante profile do usuário existente
    await supabaseAdmin.from("profiles").upsert({
      id: found.id,
      email: admin_email,
      role: "clinic_admin",
      clinic_id: clinic.id,
    });

    return NextResponse.json({
      ok: true,
      clinic,
      admin_user_id: found.id,
      note: "Usuário já existia, só vinculamos à clínica.",
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Erro inesperado." },
      { status: 500 }
    );
  }
}
