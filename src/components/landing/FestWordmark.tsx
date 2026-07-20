import Image from "next/image";
import { fest } from "@/lib/data";
import GetPassButton from "./GetPassButton";

export default function FestWordmark() {
  return (
    <div className="relative z-20 flex flex-col items-center px-6 text-center">
      {/* Fest logo — circular clip removes the square background */}
      <div className="relative">
        <div className="pointer-events-none absolute -inset-6 animate-glow rounded-full bg-violet-600/25 blur-3xl" />
        <div className="relative h-48 w-48 animate-breathe overflow-hidden rounded-full shadow-[0_0_40px_8px_rgba(139,92,246,0.5)] ring-1 ring-white/15 sm:h-60 sm:w-60">
          <Image
            src="/fest-logo.webp"
            alt="CIMAGE Weekend Fest"
            width={640}
            height={640}
            priority
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="mt-7 flex flex-col items-center gap-2.5 sm:flex-row sm:gap-3">
        <span className="max-w-[92vw] rounded-full border border-cyan/50 bg-black/70 px-4 py-1.5 text-center font-mono text-xs font-bold uppercase leading-tight tracking-[0.12em] text-cyan shadow-[0_0_20px_rgba(34,211,238,0.3)] backdrop-blur-sm sm:text-sm sm:tracking-[0.16em]">
          {fest.dates.toUpperCase()}
        </span>
        <span className="rounded-full border border-violet-400/50 bg-black/70 px-4 py-1.5 pl-[calc(1rem+0.2em)] font-mono text-sm font-extrabold tracking-[0.2em] text-violet-200 shadow-[0_0_20px_rgba(139,92,246,0.35)] backdrop-blur-sm sm:text-base">
          {fest.edition}
        </span>
      </div>

      <div className="mt-6">
        <GetPassButton className="btn-tech btn-tech-primary px-16 sm:px-24" />
      </div>
    </div>
  );
}
