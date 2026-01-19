"use client";

import { useEffect, useMemo, useRef, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export default function LoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowser(), []);

  const emailRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Zera input no DOM (mesmo que o navegador/autofill tente colocar algo)
  function hardClearInputs() {
    setEmail("");
    setPassword("");
    if (emailRef.current) emailRef.current.value = "";
    if (passRef.current) passRef.current.value = "";
  }

  useEffect(() => {
    // 1) Garante que a página de login SEMPRE abre "limpa"
    hardClearInputs();

    // 2) Se tiver sessão antiga presa, derruba (isso evita “efeito fantasma”)
    // Se você quiser manter sessão e só limpar o campo, comente esta linha.
    supabase.auth.signOut().catch(() => {});

    // 3) Mata o autofill insistente: limpa algumas vezes nos primeiros 1-2s
    // (Chrome às vezes preenche depois que o React renderiza)
    let i = 0;
    const iv = setInterval(() => {
      i += 1;
      const domEmail = emailRef.current?.value ?? "";
      const domPass = passRef.current?.value ?? "";

      if (domEmail) emailRef.current!.value = "";
      if (domPass) passRef.current!.value = "";

      // também zera o state para não voltar
      if (email) setEmail("");
      if (password) setPassword("");

      if (i >= 10) clearInterval(iv);
    }, 150);

    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <p className="text-sm text-white/60 mb-6">
          Entre com seu usuário MASTER.
        </p>

        {/* Iscas invisíveis pra enganar autofill */}
        <input className="hidden" tabIndex={-1} autoComplete="username" />
        <input className="hidden" tabIndex={-1} autoComplete="current-password" />

        <label className="text-sm">Email</label>
        <input
          ref={emailRef}
          type="email"
          name="email_fake"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={hardClearInputs}
          placeholder="seuemail@dominio.com"
          autoComplete="new-password"
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
          name="password_fake"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => {
            if (passRef.current) passRef.current.value = "";
            setPassword("");
          }}
          placeholder="Sua senha"
          autoComplete="new-password"
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
