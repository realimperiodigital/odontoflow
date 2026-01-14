import Link from "next/link";

type Props = {
  label?: string;
  className?: string;
  variant?: "primary" | "ghost";
};

const WHATSAPP_LINK =
  "https://wa.me/5511939479749?text=Olá,%20quero%20ativar%20meu%20teste%20grátis%20de%207%20dias%20do%20OdontoFlow.%20Nome%20da%20clínica:%20____%20Cidade:%20____";

export default function WhatsAppCTA({
  label = "Teste grátis por 7 dias",
  className = "",
  variant = "primary",
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/20";
  const primary = "bg-white text-black hover:opacity-90";
  const ghost = "bg-white/10 text-white hover:bg-white/15 border border-white/15";

  return (
    <Link
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${variant === "primary" ? primary : ghost} ${className}`}
    >
      {label}
    </Link>
  );
}

export { WHATSAPP_LINK };
