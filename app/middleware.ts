import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(_req: NextRequest) {
  // Middleware neutro (não bloqueia nada). Deixa o deploy rodar limpo.
  return NextResponse.next();
}

// Opcional: não aplicar middleware em arquivos estáticos e mídia
export const config = {
  matcher: [
    "/((?!_next|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|mp4|webm|mov|css|js|map)$).*)",
  ],
};
