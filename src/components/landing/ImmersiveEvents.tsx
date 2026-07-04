"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { events, fest } from "@/lib/data";

export default function ImmersiveEvents() {
  const scroller = useRef<HTMLDivElement>(null);
  const panels = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0); // index into event panels (0 = intro)

  // Track which panel is centered in the viewport.
  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(
              (entry.target as HTMLElement).dataset.index ?? 0
            );
            setActive(idx);
          }
        });
      },
      { root, threshold: 0.55 }
    );
    panels.current.forEach((p) => p && observer.observe(p));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (i: number) =>
    panels.current[i]?.scrollIntoView({ behavior: "smooth" });

  // Panel 0 = intro, panels 1..n = events, panel n+1 = outro
  const total = events.length + 2;

  return (
    <>
      <div
        ref={scroller}
        className="no-scrollbar h-dvh snap-y snap-mandatory overflow-y-auto scroll-smooth"
      >
        {/* Intro */}
        <section
          data-index={0}
          ref={(el) => {
            panels.current[0] = el;
          }}
          className="relative flex h-dvh snap-start flex-col items-center justify-center px-6 text-center"
        >
          <div className="pointer-events-none absolute inset-0 grid-backdrop opacity-40" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/25 blur-[130px]" />
          <p className="relative font-mono text-xs uppercase tracking-[0.4em] text-cyan">
            {events.length} Competitions · {fest.dates}
          </p>
          <h1 className="relative mt-4 text-6xl font-black tracking-tighter sm:text-8xl md:text-9xl">
            <span className="text-gradient">EVENTS</span>
          </h1>
          <p className="relative mt-5 max-w-xl text-balance text-white/60">
            Scroll to journey through every competition. Combat robots,
            hackathons, esports arenas and after-dark stages — one immersive
            reel.
          </p>
          <button
            type="button"
            onClick={() => scrollTo(1)}
            className="relative mt-12 flex flex-col items-center gap-2 text-white/50 transition-colors hover:text-white"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
              Begin
            </span>
            <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/25 p-1">
              <span className="h-2 w-1 animate-bounce rounded-full bg-white/60" />
            </span>
          </button>
        </section>

        {/* Event panels */}
        {events.map((event, i) => {
          const index = i + 1;
          const isActive = active === index;
          return (
            <section
              key={event.slug}
              data-index={index}
              ref={(el) => {
                panels.current[index] = el;
              }}
              className="relative flex h-dvh snap-start items-center overflow-hidden px-6 sm:px-16 md:px-24"
            >
              {/* Per-event gradient wash + glows */}
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${event.accent} opacity-[0.14]`}
              />
              <div
                className={`pointer-events-none absolute -right-32 top-1/4 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br ${event.accent} opacity-25 blur-[120px] transition-transform duration-1000 ${
                  isActive ? "translate-x-0" : "translate-x-24"
                }`}
              />

              {/* Giant ghost index */}
              <span className="pointer-events-none absolute -bottom-10 right-2 select-none text-[34vw] font-black leading-none text-white/[0.035] sm:text-[26vw]">
                {String(index).padStart(2, "0")}
              </span>

              {/* Content */}
              <div
                className={`relative z-10 max-w-3xl transition-all duration-700 ${
                  isActive
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
              >
                <div className="mb-5 flex items-center gap-4">
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${event.accent} text-3xl shadow-xl`}
                  >
                    {event.icon}
                  </span>
                  <span className="rounded-full border border-white/15 bg-black/30 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-cyan">
                    {event.category}
                  </span>
                </div>

                <h2 className="text-5xl font-black tracking-tighter sm:text-7xl">
                  {event.title}
                </h2>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
                  {event.blurb}
                </p>

                <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
                  {[
                    ["Date", event.date],
                    ["Time", event.time],
                    ["Venue", event.venue],
                    ["Team", event.team],
                    ["Prize Pool", event.prize],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                        {label}
                      </dt>
                      <dd
                        className={
                          label === "Prize Pool"
                            ? "text-lg font-bold text-gradient"
                            : "text-lg font-semibold text-white/90"
                        }
                      >
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <a
                  href="#register"
                  className={`mt-9 inline-flex rounded-full bg-gradient-to-r ${event.accent} px-8 py-3.5 font-semibold text-white shadow-lg transition-transform hover:scale-105`}
                >
                  Register for {event.title}
                </a>
              </div>
            </section>
          );
        })}

        {/* Outro */}
        <section
          data-index={total - 1}
          ref={(el) => {
            panels.current[total - 1] = el;
          }}
          className="relative flex h-dvh snap-start flex-col items-center justify-center px-6 text-center"
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-600/20 blur-[130px]" />
          <p className="relative font-mono text-xs uppercase tracking-[0.4em] text-cyan">
            That&apos;s the line-up
          </p>
          <h2 className="relative mt-4 max-w-2xl text-4xl font-black tracking-tight sm:text-6xl">
            Ready to <span className="text-gradient">enter the arena?</span>
          </h2>
          <div className="relative mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#register"
              className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-8 py-3.5 font-semibold text-white shadow-lg shadow-violet-500/30 transition-transform hover:scale-105"
            >
              Register Now
            </a>
            <Link
              href="/"
              className="rounded-full border border-white/20 bg-white/5 px-8 py-3.5 font-semibold text-white/90 transition-colors hover:bg-white/10"
            >
              Back to Home
            </Link>
          </div>
        </section>
      </div>

      {/* Progress rail (desktop) */}
      <div className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex">
        <span className="mb-1 font-mono text-[10px] tabular-nums tracking-widest text-white/50">
          {String(Math.min(active, events.length)).padStart(2, "0")}
        </span>
        {events.map((event, i) => {
          const index = i + 1;
          return (
            <button
              key={event.slug}
              type="button"
              aria-label={`Go to ${event.title}`}
              onClick={() => scrollTo(index)}
              className={`rounded-full transition-all duration-300 ${
                active === index
                  ? "h-6 w-1.5 bg-gradient-to-b from-violet-400 to-cyan-400"
                  : "h-1.5 w-1.5 bg-white/25 hover:bg-white/60"
              }`}
            />
          );
        })}
        <span className="mt-1 font-mono text-[10px] tabular-nums tracking-widest text-white/50">
          {String(events.length).padStart(2, "0")}
        </span>
      </div>

      {/* Progress bar (mobile) */}
      <div className="fixed inset-x-0 bottom-0 z-40 h-1 bg-white/10 md:hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-[width] duration-300"
          style={{ width: `${(active / (total - 1)) * 100}%` }}
        />
      </div>
    </>
  );
}
