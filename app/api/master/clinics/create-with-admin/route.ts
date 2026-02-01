import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function pickString(obj: any, keys: string[]) {
  for (const k of keys) {
    const v = obj?.[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

function normalizeDigits(v: string) {
  return (v || "").replace(/\D/g, "");
}

export async function POST(req: Request) {
  try {
    const masterKeyHeader =
      req.headers.get("x-master-key") || req.headers.get("X-Master-Key") || "";

    const MASTER_KEY = process.env.MASTER_KEY || "";
    if (!MASTER_KEY || masterKeyHeader !== MASTER_KEY) {
      return NextResponse.json(
        { ok: false, error: "Sem permissão (master-key inválida)." },
        { status: 401 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    const body = await req.json();

    // ====== CAMPOS DO FORM (aceita variações pra não travar) ======
    const nome_fantasia = pickString(body, ["nome_fantasia", "nomeFantasia", "nome_fantasia_clinica"]);
    const cnpj = normalizeDigits(pickString(body, ["cnpj"]));
    const telefone_clinica = normalizeDigits(pickString(body, ["telefone_clinica", "telefoneClinica", "telefone_clinica_numero"]));
    const email_clinica = pickString(body, ["email_clinica", "emailClinica", "email"]);

    const observacoes = pickString(body, ["observacoes", "obs", "observacao"]);

    const admin_responsavel = pickString(body, ["admin_responsavel", "adminResponsavel", "admin_nome", "adminNome"]);
    const cargo = pickString(body, ["cargo", "admin_cargo", "adminCargo"]);
    const telefone_admin = normalizeDigits(pickString(body, ["telefone_admin", "admin_telefone", "adminTelefone"]));
    const email_admin = pickString(body, ["email_admin", "admin_email", "adminEmail"]);

    // ====== VALIDAÇÃO ======
    if (!nome_fantasia) {
      return NextResponse.json({ ok: false, error: "Nome fantasia é obrigatório" }, { status: 400 });
    }
    if (!cnpj) {
      return NextResponse.json({ ok: false, error: "CNPJ é obrigatório" }, { status: 400 });
    }
    if (!admin_responsavel) {
      return NextResponse.json({ ok: false, error: "Admin responsável é obrigatório" }, { status: 400 });
    }
    if (!cargo) {
      return NextResponse.json({ ok: false, error: "Cargo é obrigatório" }, { status: 400 });
    }
    if (!telefone_admin) {
      return NextResponse.json({ ok: false, error: "Telefone do admin é obrigatório" }, { status: 400 });
    }
    if (!email_admin) {
      return NextResponse.json({ ok: false, error: "E-mail do admin é obrigatório" }, { status: 400 });
    }

    // Senha provisória do admin da clínica
    const TEMP_PASSWORD = process.env.CLINIC_TEMP_PASSWORD || "odontoflow123";

    // ====== 1) CRIAR USUÁRIO (ADMIN DA CLÍNICA) NO AUTH ======
    // Se já existir, vamos buscar pelo email e seguir sem travar.
    let adminUserId = "";

    const created = await supabaseAdmin.auth.admin.createUser({
      email: email_admin,
      password: TEMP_PASSWORD,
      email_confirm: true,
      user_metadata: {
        role: "clinic_admin",
        admin_responsavel,
        cargo,
        telefone_admin,
      },
    });

    if (created.error) {
      // Se já existe, tenta pegar pelo "listUsers" filtrando (pode ser limitado, mas funciona na maioria dos casos)
      const listed = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
      const found = listed.data?.users?.find((u) => (u.email || "").toLowerCase() === email_admin.toLowerCase());
      if (!found?.id) {
        return NextResponse.json(
          { ok: false, error: `Erro criando admin da clínica: ${created.error.message}` },
          { status: 500 }
        );
      }
      adminUserId = found.id;
    } else {
      adminUserId = created.data.user?.id || "";
    }

    if (!adminUserId) {
      return NextResponse.json({ ok: false, error: "Não foi possível obter o ID do admin." }, { status: 500 });
    }

    // ====== 2) CRIAR A CLÍNICA NO BANCO (owner_id = adminUserId) ======
    // Primeiro tenta com "nome_fantasia". Se seu banco ainda estiver com "name", ele tenta fallback.
    const clinicInsertA = await supabaseAdmin
      .from("clinics")
      .insert({
        nome_fantasia,
        cnpj,
        phone: telefone_clinica || null,
        email: email_clinica || null,
        status: "trial",
        owner_id: adminUserId,
        is_headquarters: true,
        parent_clinic_id: null,
      })
      .select("*")
      .single();

    let clinic = clinicInsertA.data;
    let clinicError = clinicInsertA.error;

    if (clinicError) {
      // fallback: bancos antigos com coluna "name"
      const clinicInsertB = await supabaseAdmin
        .from("clinics")
        .insert({
          name: nome_fantasia,
          cnpj,
          phone: telefone_clinica || null,
          email: email_clinica || null,
          status: "trial",
          owner_id: adminUserId,
          is_headquarters: true,
          parent_clinic_id: null,
        })
        .select("*")
        .single();

      clinic = clinicInsertB.data;
      clinicError = clinicInsertB.error;
    }

    if (clinicError || !clinic?.id) {
      return NextResponse.json(
        { ok: false, error: clinicError?.message || "Erro ao criar clínica." },
        { status: 500 }
      );
    }

    // ====== 3) SALVAR DADOS EXTRAS DO CADASTRO (observações + dados do admin)
    // Tenta em clinic_users (se existir). Se não existir, tenta profiles.
    const clinicId = clinic.id as string;

    const tryClinicUsers = await supabaseAdmin
      .from("clinic_users")
      .insert({
        clinic_id: clinicId,
        user_id: adminUserId,
        is_admin: true,
      });

    if (tryClinicUsers.error) {
      // fallback profiles
      await supabaseAdmin.from("profiles").upsert({
        id: adminUserId,
        clinic_id: clinicId,
        full_name: admin_responsavel,
        role: "clinic_admin",
        phone: telefone_admin,
      });
    }

    // Se você tiver uma tabela separada pra leads/cadastros, é aqui que gravaria também.
    // Por enquanto, guardamos observações no metadata do usuário (simples e resolve).
    await supabaseAdmin.auth.admin.updateUserById(adminUserId, {
      user_metadata: {
        role: "clinic_admin",
        admin_responsavel,
        cargo,
        telefone_admin,
        observacoes,
        clinic_id: clinicId,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        clinic,
        admin: {
          id: adminUserId,
          email: email_admin,
          senha_provisoria: TEMP_PASSWORD,
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
