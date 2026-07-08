"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/assets";

/* MU-styled "Physical AI" section: a parallax robot-arm video background
   (Addverb Syncro arm) with centred copy. Self-contained — the parallax is a
   lightweight scroll transform and the footage is a plain autoplaying video,
   so it carries no extra dependencies. */

const CAPABILITIES = ["Robot programming", "Computer vision", "Motion planning", "Autonomy"];

export default function MUPhysicalAI() {
  const ref = useRef<HTMLElement | null>(null);
  // Background drifts slower than the page → parallax depth. Mirrors
  // useTransform(scrollYProgress, [0, 1], ["-14%", "14%"]).
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the section's top hits the viewport bottom, 1 when the
      // section's bottom hits the viewport top.
      const progress = (vh - rect.top) / (vh + rect.height);
      const clamped = Math.min(1, Math.max(0, progress));
      setOffset(-14 + clamped * 28);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[540px] items-center overflow-hidden bg-black px-5 py-20 sm:min-h-[640px] sm:px-8 sm:py-28"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-[-14%] h-[128%] will-change-transform"
        style={{ transform: `translate3d(0, ${offset}%, 0)` }}
      >
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          src={asset("/arm.mp4")}
        />
      </div>

      {/* Legibility overlays over the footage. */}
      <div className="pointer-events-none absolute inset-0 bg-black/35" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/45" />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-white/65">
          AI &amp; Robotics
        </p>
        <h2 className="mt-5 text-[2.3rem] font-semibold leading-[1.08] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.6)] sm:text-[3.3rem]">
          Where AI gets a{" "}
          <span className="font-normal italic">body</span>.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[#e5e5e5] drop-shadow-[0_1px_10px_rgba(0,0,0,0.7)] sm:text-[16px]">
          You won&apos;t just write code on a screen here. Students get real hands-on time with
          Addverb&apos;s six-axis Syncro arm, programming an actual industrial robot on campus instead
          of a simulation.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          {CAPABILITIES.map((c) => (
            <span
              key={c}
              className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-[12.5px] text-white/80 backdrop-blur-sm"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
