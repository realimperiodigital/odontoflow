"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const emailRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // trava e limpa pra impedir qualquer preenchimento vindo de fora
    const lockAndClear = () => {
      if (emailRef.current) {
        emailRef.current.readOnly = true;
        emailRef.current.value = "";
      }
      if (passRef.current) {
        passRef.current.readOnly = true;
        passRef.current.value = "";
      }
    };

    lockAndClear();

    // limpa algumas vezes no início (caso algo injete depois do primeiro render)
    let n = 0;
    const iv = setInterval(() => {
      n += 1;
      lockAndClear();
      if (n >= 12) clearInterval(iv);
    }, 120);

    // libera pra digitar depois que a “injeção” já teria acontecido
    const t = setTimeout(() => {
      if (emailRef.current) emailRef.current.readOnly = false;
      if (passRef.current) passRef.current.readOnly = false;
    }, 800);

    return () => {
      clearInterval(iv);
      clearTimeout(t);
    };
  }, []);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const email = (emailRef.current?.value ?? "").trim();
      const password = passRef.current?.value ?? "";

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data?.session) {
        setError("Email ou senha inválidos.");
        setLoading(false);
        return;
      }

      router.replace("/app");
    } catch {
      setError("Falha inesperada no login. Veja os logs do Vercel.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <form
        onSubmit={handleLogin}
        autoComplete="off"
        className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        <h1 className="text-xl font-semibold mb-1">Login</h1>

        {/* CARIMBO pra provar que o deploy atualizou */}
        <p className="text-sm text-white/60 mb-6">
          Entre com seu usuário MASTER. (DEPLOY-1901-1646)
        </p>

        <label className="text-sm">Email</label>
        <input
          ref={emailRef}
          type="email"
          name="email"
          placeholder="seuemail@dominio.com"
          autoComplete="off"
          className="w-full mt-2 mb-4 px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none"
          required
        />

        <label className="text-sm">Senha</label>
        <input
          ref={passRef}
          type="password"
          name="password"
          placeholder="Sua senha"
          autoComplete="off"
          className="w-full mt-2 mb-4 px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none"
          required
        />

        {error && <div className="text-red-400 text-sm mb-4">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black font-semibold py-3 rounded-xl disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
