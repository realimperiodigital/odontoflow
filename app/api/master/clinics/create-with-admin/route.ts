import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

// ⚠️ Cole aqui o UUID do seu usuário master (auth.users.id)
const MASTER_USER_ID = "44d72a7c-44c4-4d5b-a012-75c29d913c1c";

// Senha provisória do admin da clínica
const TEMP_PASSWORD = "odontoflow123";

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

export async function OPTIONS() {
  // ajuda com preflight (às vezes evita dor de cabeça)
  return new NextResponse(null, { status: 204 });
}

export async function POST(req: Request) {
  try {
    if (!MASTER_USER_ID || MASTER_USER_ID === "COLE_O_UUID_DO_MASTER_AQUI") {
      return NextResponse.json(
        { ok: false, error: "MASTER_USER_ID não configurado." },
        { status: 500 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    const body = await req.json();

    const {
      nome_fantasia,
      cnpj,
      telefone_clinica,
      email_clinica,
      observacoes,

      admin_nome,
      admin_cargo,
      admin_telefone,
      admin_email,
    } = body || {};

    // validações básicas
    if (!nome_fantasia) return badRequest("Nome fantasia é obrigatório");
    if (!cnpj) return badRequest("CNPJ é obrigatório");
    if (!telefone_clinica) return badRequest("Telefone da clínica é obrigatório");
    if (!email_clinica) return badRequest("E-mail da clínica é obrigatório");

    if (!admin_nome) return badRequest("Admin responsável é obrigatório");
    if (!admin_cargo) return badRequest("Cargo do admin é obrigatório");
    if (!admin_telefone) return badRequest("Telefone do admin é obrigatório");
    if (!admin_email) return badRequest("E-mail do admin é obrigatório");

    // 1) cria clínica
    const { data: clinic, error: clinicErr } = await supabaseAdmin
      .from("clinics")
      .insert({
        name: String(nome_fantasia).trim(),
        cnpj: String(cnpj).trim(),
        phone: String(telefone_clinica).trim(),
        email: String(email_clinica).trim(),
        is_headquarters: true,
        parent_clinic_id: null,
        owner_id: MASTER_USER_ID,
        // 👇 OBS: só vai funcionar se você tiver a coluna.
        // se não tiver, comente a linha de baixo.
        // observacoes: String(observacoes || "").trim(),
      })
      .select("*")
      .single();

    if (clinicErr) {
      return NextResponse.json(
        { ok: false, error: clinicErr.message, where: "insert clinics" },
        { status: 500 }
      );
    }

    // 2) cria usuário no Auth (admin da clínica)
    const { data: created, error: createUserErr } =
      await supabaseAdmin.auth.admin.createUser({
        email: String(admin_email).trim().toLowerCase(),
        password: TEMP_PASSWORD,
        email_confirm: true,
        user_metadata: {
          full_name: String(admin_nome).trim(),
          cargo: String(admin_cargo).trim(),
          phone: String(admin_telefone).trim(),
          clinic_id: clinic.id,
          role: "clinic_admin",
        },
      });

    if (createUserErr || !created?.user) {
      // rollback simples: apaga a clínica se falhar o usuário
      await supabaseAdmin.from("clinics").delete().eq("id", clinic.id);

      return NextResponse.json(
        {
          ok: false,
          error: createUserErr?.message || "Falha ao criar usuário admin",
          where: "create auth user",
        },
        { status: 500 }
      );
    }

    const adminUserId = created.user.id;

    // 3) vincula usuário à clínica (tabela clinic_users)
    // ⚠️ ajuste nomes de colunas se o seu schema for diferente
    const { error: linkErr } = await supabaseAdmin.from("clinic_users").insert({
      clinic_id: clinic.id,
      user_id: adminUserId,
      role: "admin",
      name: String(admin_nome).trim(),
      cargo: String(admin_cargo).trim(),
      phone: String(admin_telefone).trim(),
      email: String(admin_email).trim().toLowerCase(),
      is_admin: true,
    });

    if (linkErr) {
      // rollback: apaga usuário criado e clínica
      await supabaseAdmin.auth.admin.deleteUser(adminUserId);
      await supabaseAdmin.from("clinics").delete().eq("id", clinic.id);

      return NextResponse.json(
        { ok: false, error: linkErr.message, where: "insert clinic_users" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        clinic,
        admin: {
          id: adminUserId,
          nome: admin_nome,
          email: admin_email,
          senha_provisoria: TEMP_PASSWORD,
          cargo: admin_cargo,
          telefone: admin_telefone,
          observacoes: observacoes || "",
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Erro inesperado" },
      { status: 500 }
    );
  }
}
