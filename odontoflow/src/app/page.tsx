"use client";

import Reveal from "./components/Reveal";
import Carousel from "./components/Carousel";

export default function Home() {
  return (
    <div style={{ background: "#05060a", color: "#fff", minHeight: "100vh" }}>
      {/* Topo */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px 48px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 22 }}>OdontoFlow</div>

        <div style={{ display: "flex", gap: 12 }}>
          <a
            href="https://wa.me/5511939479749"
            style={{
              padding: "10px 18px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            WhatsApp
          </a>
          <a
            href="/login"
            style={{
              padding: "10px 18px",
              borderRadius: 999,
              background: "#2563eb",
            }}
          >
            Entrar
          </a>
        </div>
      </header>

      {/* Hero */}
      <section style={{ padding: "100px 48px", maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <h1 style={{ fontSize: 56, fontWeight: 900, lineHeight: 1.1 }}>
            Pacientes na cadeira. <br />
            Agenda cheia.
          </h1>
          <p style={{ maxWidth: 600, marginTop: 20, opacity: 0.8 }}>
            Plataforma completa para clínicas odontológicas. Agenda, pacientes,
            equipe, financeiro, relatórios e automações, tudo em um só lugar.
          </p>

          <div style={{ marginTop: 32, display: "flex", gap: 16 }}>
            <a
              href="/login"
              style={{
                padding: "14px 28px",
                borderRadius: 999,
                background: "#2563eb",
                fontWeight: 700,
              }}
            >
              Acessar sistema
            </a>
            <a
              href="https://wa.me/5511939479749"
              style={{
                padding: "14px 28px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              Falar no WhatsApp
            </a>
          </div>
        </Reveal>
      </section>

      {/* Serviços */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
        <Reveal>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 24 }}>
            Tudo que sua clínica precisa
          </h2>
        </Reveal>

        <Carousel>
          {[
            ["Agenda inteligente", "Confirmação automática e redução de faltas"],
            ["Pacientes", "Cadastro, histórico e documentos"],
            ["Equipe", "Usuários, cargos e permissões"],
            ["Financeiro", "Receitas, despesas e repasses"],
            ["Relatórios", "Produção, crescimento e desempenho"],
            ["Redes e franquias", "Multi-clínicas em uma só plataforma"],
          ].map(([t, d]) => (
            <div
              key={t}
              style={{
                minWidth: 280,
                padding: 22,
                borderRadius: 18,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 18 }}>{t}</div>
              <div style={{ marginTop: 10, opacity: 0.75 }}>{d}</div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* Rodapé */}
      <footer
        style={{
          marginTop: 120,
          padding: 48,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          textAlign: "center",
          opacity: 0.6,
        }}
      >
        OdontoFlow © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
