"use client";

import React from 'react';

export default function WhatsAppFloat() {
    return (
        <a
            href="https://wa.me/5511939479749?text=Ol%C3%A1%2C%20gostaria%20de%20suporte%20no%20OdontoFlow."
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#1da851] text-white p-4 rounded-full shadow-lg shadow-[#25D366]/40 transition-all hover:scale-110 flex items-center justify-center group"
            title="Falar no WhatsApp"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-8.68-2.031-.967-.272-.297-.471-.446-.917-.446-.445 0-.965-.003-1.488.568-.158.174-2.008 1.956-2.008 4.771s2.055 5.538 2.28 5.836c.224.297 3.992 6.095 9.771 8.526 3.957 1.665 4.767 1.334 5.61 1.251.842-.083 2.709-1.107 3.08-2.175.372-1.069.372-1.983.272-2.175z" />
            </svg>
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap ml-0 group-hover:ml-3">
                Suporte WhatsApp
            </span>
        </a>
    );
}
