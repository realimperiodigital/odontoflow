import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Importantíssimo: isso aqui "carimba" a sessão nos cookies do Next
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  const isAuthRoute = path === "/login" || path.startsWith("/reset");
  const isPublicRoute =
    path === "/" ||
    path.startsWith("/site") ||
    path.startsWith("/api") ||
    path.startsWith("/_next") ||
    path.startsWith("/favicon") ||
    path.startsWith("/images") ||
    path.startsWith("/videos");

  // Ajuste aqui quais rotas são "protegidas"
  const isProtectedRoute =
    path.startsWith("/app") ||
    path.startsWith("/dashboard") ||
    path.startsWith("/master") ||
    path.startsWith("/painel");

  // Se tentou entrar em rota protegida sem sessão -> manda pro login
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Se já está logado e fica indo no /login -> manda pra área interna
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/app";
    return NextResponse.redirect(url);
  }

  // Rotas públicas passam
  if (isPublicRoute) return response;

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
