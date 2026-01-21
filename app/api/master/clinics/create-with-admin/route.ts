import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json({
    ok: true,
    version: "CREATE_WITH_ADMIN_V2_OK",
    now: new Date().toISOString(),
  });
}
