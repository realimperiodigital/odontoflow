export default function FirstAccessPage() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0a0a0a",
      color: "white",
      fontFamily: "sans-serif"
    }}>
      <div style={{
        background: "#111",
        padding: "40px",
        borderRadius: "12px",
        maxWidth: "420px",
        width: "100%",
        textAlign: "center",
        boxShadow: "0 0 40px rgba(0,0,0,0.6)"
      }}>
        <h1 style={{ fontSize: "28px", marginBottom: "12px" }}>
          Bem-vindo ao OdontoFlow
        </h1>
        <p style={{ opacity: 0.8, marginBottom: "24px" }}>
          Vamos configurar sua clínica em poucos passos.
        </p>

        <a
          href="/login"
          style={{
            display: "block",
            background: "#2563eb",
            color: "white",
            padding: "14px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold"
          }}
        >
          Ir para o login
        </a>
      </div>
    </div>
  );
}
