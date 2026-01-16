"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "../../lib/supabase/browser";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  async function sair() {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      onClick={sair}
      className="mt-6 rounded-xl bg-white text-black px-4 py-2 font-semibold"
    >
      Sair
    </button>
  );
}
