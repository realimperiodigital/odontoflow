import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase/admin";

const MASTER_EMAIL = process.env.MASTER_EMAIL;

export async function POST() {
  if (!MASTER_EMAIL) {
    return NextResponse.json(
      { error: "MASTER_EMAIL não configurado" },
      { status: 500 }
    );
  }

  // ✅ lista usuários sem gerar 'never'
  const { data, error: listError } =
    await supabaseAdmin.auth.admin.listUsers();

  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 500 });
  }

  const users = data?.users ?? [];

  const master = users.find(
    (u) => (u.email ?? "").toLowerCase() === MASTER_EMAIL.toLowerCase()
  );

  if (master) {
    return NextResponse.json({
      ok: true,
      message: "Usuário MASTER já existe",
      userId: master.id,
    });
  }

  const { data: created, error: createError } =
    await supabaseAdmin.auth.admin.createUser({
      email: MASTER_EMAIL,
      password: "Master@123456",
      email_confirm: true,
    });

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    message: "Usuário MASTER criado com sucesso",
    userId: created.user?.id,
  });
}
