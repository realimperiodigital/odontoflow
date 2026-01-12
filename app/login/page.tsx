"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/app/lib/supabaseClient";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function entrar() {
    setErro(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    setLoading(false);

    if (error) {
      setErro(error.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#060B16] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#18A8FF]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#00D4FF]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="z-10 w-full max-w-md p-6">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-white tracking-wide hover:text-glow transition-all">
              Odonto<span className="text-[#18A8FF]">Flow</span>
            </h1>
          </Link>
          <p className="text-[#B0B7C3] mt-2">Acesse sua clínica digital</p>
        </div>

        <div className="glass-panel p-8 rounded-2xl border border-[#18A8FF]/30 shadow-2xl">
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-[#B0B7C3] mb-2">Email Profissional</label>
              <input
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0B0F1A] border border-[#18A8FF]/20 rounded-lg p-3 text-white focus:border-[#18A8FF] focus:shadow-[0_0_10px_rgba(24,168,255,0.2)] outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm text-[#B0B7C3] mb-2">Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full bg-[#0B0F1A] border border-[#18A8FF]/20 rounded-lg p-3 text-white focus:border-[#18A8FF] focus:shadow-[0_0_10px_rgba(24,168,255,0.2)] outline-none transition-all"
              />
            </div>

            {erro && <div className="p-3 bg-red-900/30 border border-red-500/50 rounded text-red-200 text-sm text-center">{erro}</div>}

            <button
              onClick={entrar}
              disabled={loading}
              className="w-full py-4 rounded-lg bg-gradient-to-r from-[#18A8FF] to-[#0093E9] text-white font-bold text-lg shadow-[0_0_20px_rgba(24,168,255,0.4)] hover:shadow-[0_0_30px_rgba(24,168,255,0.6)] transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Entrando..." : "Acessar Sistema"}
            </button>

            <div className="text-center text-sm text-gray-500">
              <a href="#" className="hover:text-[#18A8FF]">Esqueci minha senha</a>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-8">
          &copy; OdontoFlow Secure Login. Protegido por SSL 256-bit.
        </p>
      </div>
    </div>
  );
}
