import Link from "next/link";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "#050814", color: "white" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 22px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          position: "sticky",
          top: 0,
          background: "rgba(5,8,20,0.85)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/logo-odontoflow.png" alt="OdontoFlow" style={{ height: 34 }} />
          <strong style={{ letterSpacing: 0.3 }}>OdontoFlow</strong>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a
            href="https://wa.me/5511939479749?text=Ol%C3%A1%2C%20preciso%20de%20suporte%20no%20OdontoFlow"
            target="_blank"
            rel="noreferrer"
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.18)",
              textDecoration: "none",
              color: "white",
              opacity: 0.9,
            }}
          >
            Suporte WhatsApp
          </a>

          <Link
            href="/login"
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              background: "linear-gradient(90deg, #00D4FF, #2B5BFF)",
              color: "white",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Entrar
          </Link>
        </div>
      </header>

      <section style={{ padding: "56px 22px", maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontSize: 44, margin: 0, lineHeight: 1.1 }}>
          Pacientes na Cadeira. Agenda Cheia.
        </h1>
        <p style={{ marginTop: 14, fontSize: 18, opacity: 0.86, maxWidth: 820 }}>
          Plataforma completa para clínicas odontológicas, da pequena clínica até redes e franquias:
          agenda, pacientes, equipe, produção, financeiro, relatórios e automações.
        </p>

        <div style={{ marginTop: 22, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link
            href="/login"
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              background: "white",
              color: "#050814",
              textDecoration: "none",
              fontWeight: 800,
            }}
          >
            Acessar sistema
          </Link>

          <a
            href="https://wa.me/5511939479749?text=Quero%20conhecer%20o%20OdontoFlow%20e%20ver%20os%20m%C3%B3dulos"
            target="_blank"
            rel="noreferrer"
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.18)",
              color: "white",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Falar no WhatsApp
          </a>
        </div>

        <div
          style={{
            marginTop: 34,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 14,
          }}
        >
          {[
            ["Agenda & Confirmação", "Calendário, encaixes, lembretes e no-show"],
            ["Pacientes", "Cadastro completo, histórico e documentos"],
            ["Equipe", "Usuários, cargos, setores e permissões por clínica"],
            ["Financeiro", "Receitas, despesas, repasses e relatórios"],
            ["Relatórios", "Produção, crescimento, atendimentos e performance"],
            ["Multi-clínica", "Estrutura para grupos, redes e franquias"],
          ].map(([title, desc]) => (
            <div
              key={title}
