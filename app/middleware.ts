import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseServer } from "./lib/supabase/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // rotas públicas
  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/post-login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon");

  // IMPORTANTE: /master NÃO entra como pública,
  // porque vamos permitir abrir /master deslogado,
  // mas controlar o acesso dentro da própria página e aqui embaixo.

  if (isPublic) return NextResponse.next();

  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ✅ Caso especial: permitir abrir /master mesmo deslogado (pra fazer login lá)
  if (!user && pathname.startsWith("/master")) {
    return NextResponse.next();
  }

  // Se não estiver logado em qualquer outra rota protegida, manda pro login
  if (!user) {
    const to = url.clone();
    to.pathname = "/login";
    return NextResponse.redirect(to);
  }

  // Se estiver logado, pega role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "user";

  // Protege /master: só master entra
  if (pathname.startsWith("/master") && role !== "master") {
    const to = url.clone();
    to.pathname = "/";
    return NextResponse.redirect(to);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
