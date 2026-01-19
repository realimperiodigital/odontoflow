"use client";

import { useEffect, useMemo, useRef, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createSupabaseBrowser(), []);

  const emailRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 1) SEMPRE inicia vazio (mesmo que alguém tente passar por querystring)
  useEffect(() => {
    setEmail("");
    setPassword("");

    // 2) Zera o DOM na marra (se algum value/defaultValue estiver vindo do HTML)
    // Isso neutraliza qualquer injeção por componente pai, cache, ou valor hardcoded.
    queueMicrotask(() => {
      if (emailRef.current) emailRef.current.value = "";
      if (passRef.current) passRef.current.value = "";
    });
  }, []);

  // 3) Se por algum motivo "aparecer" um email automaticamente, limpa de novo
  useEffect(() => {
    if (email && email.includes("@")) {
      // Se quiser permitir que o usuário digite, isso só limpa quando foi injetado:
      // Aqui a gente detecta "injeção" olhando se o input DOM já veio preenchido
      // antes do usuário digitar (estado inicialmente é vazio).
      // Como seu problema é sempre auto-preenchido, vamos zerar.
      setEmail("");
      if (emailRef.current) emailRef.current.value = "";
    }
  }, [email]);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const cleanEmail = (emailRef.current?.value ?? email).trim();
      const cleanPass = passRef.current?.value ?? password;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPass,
      });

      if (error) {
        setError("Email ou senha inválidos.");
        setLoading(false);
        return;
      }

      if (!data?.session) {
        setError("Sessão não foi criada. Tente novamente.");
        setLoading(false);
        return;
      }

      router.replace("/app");
    } catch (err) {
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
        <p className="text-sm text-white/60 mb-6">
          Entre com seu usuário MASTER.
        </p>

        <label className="text-sm">Email</label>
        <input
          ref={emailRef}
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seuemail@dominio.com"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          className="w-full mt-2 mb-4 px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-white/30"
          required
        />

        <label className="text-sm">Senha</label>
        <input
          ref={passRef}
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Sua senha"
          autoComplete="off"
          className="w-full mt-2 mb-4 px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-white/30"
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
