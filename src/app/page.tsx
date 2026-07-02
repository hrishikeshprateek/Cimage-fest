"use client";

import Image from "next/image";
import dynamic from "next/dynamic";

// WebGL can't render on the server, so load the scene client-side only.
const ComingSoonScene = dynamic(() => import("@/components/ComingSoonScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center text-sm tracking-[0.3em] text-violet-300/60">
      LOADING…
    </div>
  ),
});

export default function Home() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#05010f] text-white">
      {/* 3D canvas fills the viewport */}
      <div className="absolute inset-0">
        <ComingSoonScene />
      </div>

      {/* Overlay branding — non-interactive so the canvas stays draggable */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 sm:p-10">
        <header className="flex items-center justify-between gap-4">
          <div className="rounded-xl bg-white/95 px-3 py-2 shadow-lg shadow-black/30 ring-1 ring-white/20">
            <Image
              src="/logo.webp"
              alt="CIMAGE Group of Institutions"
              width={648}
              height={186}
              priority
              className="h-8 w-auto sm:h-10"
            />
          </div>
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-xs tracking-widest text-white/70 backdrop-blur">
            FEST&nbsp;2027
          </span>
        </header>

        <footer className="flex flex-col items-center gap-2 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-white/50">
            The next chapter is loading
          </p>
          <div
            aria-hidden
            className="h-px w-40 bg-gradient-to-r from-transparent via-violet-400/60 to-transparent"
          />
        </footer>
      </div>
    </main>
  );
}
