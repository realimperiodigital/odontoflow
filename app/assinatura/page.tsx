export default function AssinaturaPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#05060a] text-white px-6">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-2xl font-semibold">Seu teste terminou</h1>
        <p className="text-white/70 mt-2">
          Para continuar usando o sistema, fale com o suporte e ative sua assinatura.
        </p>

        <a
          className="inline-flex mt-6 rounded-xl bg-white text-black font-semibold px-5 py-3"
          href="https://wa.me/5511939479749?text=Ol%C3%A1!%20Quero%20ativar%20a%20assinatura%20da%20minha%20cl%C3%ADnica%20no%20OdontoFlow."
          target="_blank"
          rel="noreferrer"
        >
          Falar no WhatsApp
        </a>
      </div>
    </main>
  );
}
