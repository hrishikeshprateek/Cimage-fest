"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const R = 88;
const CIRC = 2 * Math.PI * R;

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  // Driven by the real page load — no fixed/simulated delay. The arc eases
  // toward 90% while resources are still loading, then snaps to 100 and exits
  // the moment the page is ready (instant on a cached/fast load).
  useEffect(() => {
    let raf = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      setProgress(100);
      setDone(true);
    };

    const tick = () => {
      if (finished) return;
      setProgress((p) => Math.round(p + (90 - p) * 0.08));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Ready as soon as the DOM is parsed — don't block on every image/video.
    // This effect runs after hydration, so this is effectively immediate on a
    // normal load and simply waits out a genuinely slow first paint otherwise.
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", finish, { once: true });
    } else {
      finish();
    }
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("DOMContentLoaded", finish);
    };
  }, []);

  // Fully unmount after the fade-out transition.
  useEffect(() => {
    if (!done) return;
    document.body.style.overflow = "";
    const id = setTimeout(() => setGone(true), 900);
    return () => clearTimeout(id);
  }, [done]);

  // Lock scroll while loading.
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#05010f] transition-all duration-700 ${
        done ? "pointer-events-none scale-105 opacity-0" : "opacity-100"
      }`}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute h-[420px] w-[420px] animate-glow rounded-full bg-violet-600/20 blur-3xl" />

      <div className="relative flex h-56 w-56 items-center justify-center">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <defs>
            <linearGradient id="ldr" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="50%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#e879f9" />
            </linearGradient>
          </defs>

          {/* Track */}
          <circle
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.08"
            strokeWidth="3"
          />

          {/* Determinate progress arc */}
          <circle
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke="url(#ldr)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - progress / 100)}
            transform="rotate(-90 100 100)"
            style={{ filter: "drop-shadow(0 0 6px rgba(34,211,238,0.7))" }}
          />

          {/* Decorative spinning dashed rings */}
          <circle
            className="spin-cw"
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="#22d3ee"
            strokeOpacity="0.5"
            strokeWidth="1.5"
            strokeDasharray="4 12"
          />
          <circle
            className="spin-ccw"
            cx="100"
            cy="100"
            r="56"
            fill="none"
            stroke="#e879f9"
            strokeOpacity="0.5"
            strokeWidth="1.5"
            strokeDasharray="2 10"
          />
        </svg>

        {/* Orbiting particle */}
        <div className="absolute inset-0 animate-orbit">
          <span className="absolute left-1/2 top-1 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-cyan shadow-[0_0_12px_4px_rgba(34,211,238,0.8)]" />
        </div>

        {/* Fest logo — circular clip removes the square background, gentle breathing pulse */}
        <div className="absolute h-32 w-32 animate-breathe overflow-hidden rounded-full shadow-[0_0_28px_6px_rgba(139,92,246,0.55)] ring-1 ring-white/10">
          <Image
            src="/fest-logo.png"
            alt="CIMAGE Weekend Fest"
            width={512}
            height={512}
            priority
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
