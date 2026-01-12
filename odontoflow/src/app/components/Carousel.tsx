"use client";

import { useRef } from "react";

export default function Carousel({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <button
        onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-full"
      >
        ‹
      </button>

      <div
        ref={ref}
        className="flex gap-6 overflow-x-auto scroll-smooth px-10 no-scrollbar"
      >
        {children}
      </div>

      <button
        onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-full"
      >
        ›
      </button>
    </div>
  );
}
