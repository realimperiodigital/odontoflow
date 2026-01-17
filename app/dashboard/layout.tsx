// app/dashboard/layout.tsx
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServer();

  const { data } = await supabase.auth.getUser();
  if (!data?.user) {
    redirect("/login");
  }

  return <div style={{ minHeight: "100vh" }}>{children}</div>;
}
