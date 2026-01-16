import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase/admin";

const MASTER_EMAIL = process.env.MASTER_EMAIL!;

export async function POST() {
  if (!MASTER_EMAIL) {
    return NextResponse.json(
      { error: "MASTER_EMAIL não configurado" },
      { status: 500 }
    );
  }

  // Lista usuários (tipagem manual para evitar 'never')
  const { data: list, error: listError } =
    await supabaseAdmin.auth.admin.listUsers();

  if (listError) {
    return NextResponse.json(
      { error: listError.message },
      { status: 500 }
    );
  }

  // 🔧 AQUI está a correção
  const users = list?.users ?? [];

  const masterUser = users.find(
    (u: { email?: string }) =>
      u.email?.toLowerCase() === MASTER_EMAIL.toLowerCase()
  );

  if (masterUser) {
    return NextResponse.json({
      ok: true,
      message: "Usuário MASTER já existe",
      userId: masterUser.id,
    });
  }

  // Cria o usuário MASTER
  const { data: created, error: createError } =
    await supabaseAdmin.auth.admin.createUser({
      email: MASTER_EMAIL,
      password: "Master@123456",
      email_confirm: true,
    });

  if (createError) {
    return NextResponse.json(
      { error: createError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Usuário MASTER criado com sucesso",
    userId: created.user.id,
  });
}
