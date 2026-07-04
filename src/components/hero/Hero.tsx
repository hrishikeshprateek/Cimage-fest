"use client";

import dynamic from "next/dynamic";
import { fest } from "@/lib/data";
import Countdown from "./Countdown";

// WebGL can't render on the server — load the scene client-side only.
const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-[#05010f]"
    >
      {/* 3D animated background */}
      <div className="absolute inset-0">
        <HeroScene />
      </div>

      {/* Readability veil + vignette so text stays crisp over the scene */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#05010f]/40 via-transparent to-[#05010f]" />

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center px-6 py-28 text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.3em] text-white/70 backdrop-blur">
          <span className="h-1.5 w-1.5 animate-glow rounded-full bg-cyan" />
          {fest.dates} · {fest.venue}
        </span>

        <h1 className="text-5xl font-black leading-none tracking-tighter sm:text-7xl md:text-8xl">
          <span className="text-gradient">{fest.name}</span>
        </h1>
        <p className="mt-2 font-mono text-lg font-bold tracking-[0.5em] text-white/80 sm:text-2xl">
          {fest.edition}
        </p>

        <p className="mt-6 max-w-xl text-balance text-base text-white/70 sm:text-lg">
          {fest.tagline}
        </p>

        <div className="mt-10">
          <Countdown targetISO={fest.startISO} />
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            href="#register"
            className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-500/30 transition-transform hover:scale-105"
          >
            Register Now
          </a>
          <a
            href="#events"
            className="rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-base font-semibold text-white/90 backdrop-blur transition-colors hover:bg-white/10"
          >
            Explore Events
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/25 p-1">
          <span className="h-2 w-1 animate-bounce rounded-full bg-white/60" />
        </div>
      </div>
    </section>
  );
}
