import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseServer } from "./lib/supabase/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // Rotas públicas
  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/post-login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon");

  if (isPublic) return NextResponse.next();

  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ✅ Deixa abrir /master SEM estar logado (pra mostrar o login master)
  if (!user && pathname === "/master") {
    return NextResponse.next();
  }

  // ✅ Qualquer /master/* (tipo /master/painel) exige login
  if (!user && pathname.startsWith("/master/")) {
    const to = url.clone();
    to.pathname = "/master";
    return NextResponse.redirect(to);
  }

  // Outras rotas protegidas (se tiver) sem login -> /login
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

  // Protege /master/*: só master entra
  if (pathname.startsWith("/master/") && role !== "master") {
    const to = url.clone();
    to.pathname = "/";
    return NextResponse.redirect(to);
  }

  // Se tentar acessar /master (login) estando logado, ainda pode.
  // (mas o /master vai deslogar de qualquer forma, porque você quer senha sempre)
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
