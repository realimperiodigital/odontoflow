import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  // Endpoint simples só pra NÃO quebrar o build
  // (você pode evoluir esse bootstrap depois)
  return NextResponse.json({ ok: true, route: "bootstrap-master" });
}

export async function POST() {
  return NextResponse.json({ ok: true, route: "bootstrap-master" });
}
