import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

// ⚠️ UUID do seu usuário master (auth.users.id)
const MASTER_USER_ID: string = "44d72a7c-44c4-4d5b-a012-75c29d913c1c";

// Senha provisória do admin da clínica
const TEMP_PASSWORD = "odontoflow123";

function jsonError(status: number, message: string, where?: string) {
  return NextResponse.json(
    { ok: false, error: message, ...(where ? { where } : {}) },
    { status }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(req: Request) {
  try {
    // validação simples (sem comparar com string fixa, pra não quebrar no build)
    if (!MASTER_USER_ID || MASTER_USER_ID.trim().length < 10) {
      return jsonError(500, "MASTER_USER_ID não configurado.", "config");
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

    // validações
    if (!nome_fantasia) return jsonError(400, "Nome fantasia é obrigatório");
    if (!cnpj) return jsonError(400, "CNPJ é obrigatório");
    if (!telefone_clinica) return jsonError(400, "Telefone da clínica é obrigatório");
    if (!email_clinica) return jsonError(400, "E-mail da clínica é obrigatório");

    if (!admin_nome) return jsonError(400, "Admin responsável é obrigatório");
    if (!admin_cargo) return jsonError(400, "Cargo do admin é obrigatório");
    if (!admin_telefone) return jsonError(400, "Telefone do admin é obrigatório");
    if (!admin_email) return jsonError(400, "E-mail do admin é obrigatório");

    // 1) cria clínica
    const { data: clinic, error: clinicErr } = await supabaseAdmin
      .from("clinics")
      .insert({
        name: String(nome_fantasia).trim(),
        cnpj: String(cnpj).trim(),
        phone: String(telefone_clinica).trim(),
        email: String(email_clinica).trim().toLowerCase(),
        is_headquarters: true,
        parent_clinic_id: null,
        owner_id: MASTER_USER_ID,

        // Se você criou a coluna "observacoes" em clinics, descomenta:
        // observacoes: String(observacoes || "").trim(),
      })
      .select("*")
      .single();

    if (clinicErr || !clinic) {
      return jsonError(500, clinicErr?.message || "Falha ao criar clínica", "insert clinics");
    }

    // 2) cria usuário admin no Auth
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
          observacoes: String(observacoes || "").trim(),
        },
      });

    if (createUserErr || !created?.user) {
      // rollback: apaga clínica
      await supabaseAdmin.from("clinics").delete().eq("id", clinic.id);
      return jsonError(
        500,
        createUserErr?.message || "Falha ao criar usuário admin",
        "create auth user"
      );
    }

    const adminUserId = created.user.id;

    // 3) vincula na clinic_users
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
      // rollback: apaga usuário e clínica
      await supabaseAdmin.auth.admin.deleteUser(adminUserId);
      await supabaseAdmin.from("clinics").delete().eq("id", clinic.id);

      return jsonError(500, linkErr.message, "insert clinic_users");
    }

    return NextResponse.json(
      {
        ok: true,
        clinic,
        admin: {
          id: adminUserId,
          nome: admin_nome,
          email: admin_email,
          cargo: admin_cargo,
          telefone: admin_telefone,
          senha_provisoria: TEMP_PASSWORD,
          observacoes: observacoes || "",
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return jsonError(500, err?.message || "Erro inesperado", "catch");
  }
}
