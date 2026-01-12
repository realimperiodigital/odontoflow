"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { name: "Início", href: "/" },
        { name: "Solução", href: "/solucao" },
        { name: "Módulos", href: "/modulos" },
        { name: "Planos", href: "/planos" },
        { name: "Franquias", href: "/franquias" },
        { name: "Segurança", href: "/seguranca" },
        { name: "Suporte", href: "/suporte" },
    ];

    return (
        <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-md bg-[#060B16]/80 border-b border-[#18A8FF]/20">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-[#18A8FF] to-[#00D4FF] flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(24,168,255,0.5)] group-hover:shadow-[0_0_25px_rgba(24,168,255,0.8)] transition-all">
                        O
                    </div>
                    <span className="text-2xl font-bold text-white tracking-wide group-hover:text-glow transition-all">
                        Odonto<span className="text-[#18A8FF]">Flow</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-sm font-medium transition-colors hover:text-[#18A8FF] ${pathname === link.href ? 'text-[#18A8FF] glow-text' : 'text-[#D7DEE8]'}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* CTA / Login */}
                <div className="hidden lg:flex items-center gap-4">
                    <Link href="/login" className="px-5 py-2 rounded-full border border-[#18A8FF]/50 text-[#18A8FF] font-semibold hover:bg-[#18A8FF]/10 transition-all text-sm">
                        Entrar
                    </Link>
                    <a href="https://wa.me/5511939479749" target="_blank" className="px-5 py-2 rounded-full bg-gradient-to-r from-[#18A8FF] to-[#0093E9] text-white font-bold text-sm shadow-[0_0_15px_rgba(24,168,255,0.3)] hover:shadow-[0_0_25px_rgba(24,168,255,0.6)] transition-all">
                        Falar no WhatsApp
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button className="lg:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden absolute top-20 left-0 w-full bg-[#060B16] border-b border-[#18A8FF]/20 p-6 flex flex-col gap-4 shadow-2xl">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className={`text-lg font-medium ${pathname === link.href ? 'text-[#18A8FF]' : 'text-gray-300'}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="h-px bg-white/10 my-2" />
                    <Link href="/login" className="text-center w-full py-3 rounded border border-[#18A8FF]/50 text-[#18A8FF]">
                        Entrar
                    </Link>
                    <a href="https://wa.me/5511939479749" className="text-center w-full py-3 rounded bg-[#18A8FF] text-white font-bold">
                        Falar no WhatsApp
                    </a>
                </div>
            )}
        </header>
    );
}
