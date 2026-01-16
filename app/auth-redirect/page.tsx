"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash || "";

    // Se veio token no hash, manda direto pra tela de trocar senha com o hash junto
    if (hash.includes("access_token=")) {
      router.replace("/trocar-senha" + hash);
      return;
    }

    // Se não veio hash, volta pro login
    router.replace("/login");
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#05060a] text-white">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
        <div className="text-lg font-semibold">Redirecionando...</div>
        <div className="mt-2 text-sm text-white/70">
          Aguarde um instante.
        </div>
      </div>
    </main>
  );
}
