import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Libera tudo que é público
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // ✅ Regra do Master:
  // /master pode abrir (porque vai mostrar o login master)
  if (pathname === "/master") return NextResponse.next();

  // /master/painel não pode abrir sem antes passar pelo /master (login)
  if (pathname.startsWith("/master/")) {
    const url = req.nextUrl.clone();
    url.pathname = "/master";
    return NextResponse.redirect(url);
  }

  // Outras rotas: deixa passar por enquanto
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
