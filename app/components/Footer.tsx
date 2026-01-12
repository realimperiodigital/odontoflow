export default function Footer() {
    return (
        <footer className="bg-[#02050A] border-t border-[#18A8FF]/10 py-12 text-[#B0B7C3]">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Brand */}
                <div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                        Odonto<span className="text-[#18A8FF]">Flow</span>
                    </h3>
                    <p className="text-sm leading-relaxed mb-4">
                        Transformando clínicas odontológicas com tecnologia, gestão eficiente e inteligência de dados.
                    </p>
                    <div className="flex gap-4">
                        {/* Social Icons Placeholders */}
                        <div className="w-8 h-8 rounded bg-[#18A8FF]/10 flex items-center justify-center text-[#18A8FF]">IG</div>
                        <div className="w-8 h-8 rounded bg-[#18A8FF]/10 flex items-center justify-center text-[#18A8FF]">LI</div>
                    </div>
                </div>

                {/* Links 1 */}
                <div>
                    <h4 className="text-white font-bold mb-4">Produto</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/solucao" className="hover:text-[#18A8FF] transition-colors">Solução</a></li>
                        <li><a href="/modulos" className="hover:text-[#18A8FF] transition-colors">Módulos</a></li>
                        <li><a href="/planos" className="hover:text-[#18A8FF] transition-colors">Planos</a></li>
                        <li><a href="/franquias" className="hover:text-[#18A8FF] transition-colors">Para Franquias</a></li>
                    </ul>
                </div>

                {/* Links 2 */}
                <div>
                    <h4 className="text-white font-bold mb-4">Institucional</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/seguranca" className="hover:text-[#18A8FF] transition-colors">Segurança e LGPD</a></li>
                        <li><a href="/suporte" className="hover:text-[#18A8FF] transition-colors">Suporte</a></li>
                        <li><a href="/login" className="hover:text-[#18A8FF] transition-colors">Área do Cliente</a></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="text-white font-bold mb-4">Contato</h4>
                    <p className="text-sm mb-2">Precisa de ajuda?</p>
                    <a href="https://wa.me/5511939479749" target="_blank" className="flex items-center gap-2 text-white hover:text-[#18A8FF] transition-colors mb-4">
                        <span className="text-green-500 text-lg"></span>
                        <span className="font-bold text-lg">11 93947-9749</span>
                    </a>
                    <p className="text-xs text-gray-500">
                        Segunda a Sexta, das 9h às 18h
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-[#18A8FF]/5 text-center text-xs text-gray-600">
                <p>OdontoFlow © {new Date().getFullYear()}. Todos os direitos reservados.</p>
            </div>
        </footer>
    );
}
