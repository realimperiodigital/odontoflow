import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    server: {
      SUPABASE_URL: process.env.SUPABASE_URL || null,
      SUPABASE_ANON_KEY_exists: Boolean(process.env.SUPABASE_ANON_KEY),
      SUPABASE_SERVICE_ROLE_KEY_exists: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    },
    client_expected: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || null,
      NEXT_PUBLIC_SUPABASE_ANON_KEY_exists: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    },
  });
}
