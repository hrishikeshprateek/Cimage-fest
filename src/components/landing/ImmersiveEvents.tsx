"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { fest } from "@/lib/data";
import { getFestActivities, type FestActivity } from "@/lib/festApi";
import GetPassButton from "./GetPassButton";

// Gradient fallbacks used when an event has no banner image yet.
const ACCENTS = [
  "from-violet-500 to-fuchsia-500",
  "from-cyan-500 to-blue-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-pink-500 to-rose-500",
  "from-indigo-500 to-violet-500",
];
const accentOf = (i: number) => ACCENTS[i % ACCENTS.length];

export default function ImmersiveEvents() {
  const scroller = useRef<HTMLDivElement>(null);
  const panels = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [list, setList] = useState<FestActivity[] | null>(null);

  // Fetch the fest's activity cards. No fallback — an empty/failed result
  // renders the empty state below.
  useEffect(() => {
    let cancelled = false;
    getFestActivities(fest.passSlug)
      .then((d) => {
        if (!cancelled) setList([...d].sort((a, b) => a.order - b.order));
      })
      .catch(() => {
        if (!cancelled) setList([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Track which panel is centered — re-attaches once the list renders.
  useEffect(() => {
    if (!list) return;
    const root = scroller.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.index ?? 0));
          }
        });
      },
      { root, threshold: 0.55 },
    );
    panels.current.forEach((p) => p && observer.observe(p));
    return () => observer.disconnect();
  }, [list]);

  const scrollTo = (i: number) =>
    panels.current[i]?.scrollIntoView({ behavior: "smooth" });

  if (!list) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-violet-400" />
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/50">
          Loading events…
        </p>
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-cyan">
          Events
        </p>
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
          No events yet
        </h1>
        <p className="max-w-md text-white/60">
          The line-up is being finalised. Check back soon.
        </p>
        <Link
          href="/"
          className="mt-4 rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const events = list;
  const total = events.length + 2; // intro + events + outro

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
          const accent = accentOf(i);
          const hasImage = !!event.background_image_url;
          return (
            <section
              key={event.id}
              data-index={index}
              ref={(el) => {
                panels.current[index] = el;
              }}
              className="relative flex h-dvh snap-start items-center overflow-hidden px-6 sm:px-16 md:px-24"
            >
              {/* Background: banner image, or gradient fallback */}
              {hasImage ? (
                <>
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${event.background_image_url})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#05010f] via-[#05010f]/85 to-[#05010f]/30" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05010f] via-transparent to-[#05010f]/40" />
                </>
              ) : (
                <>
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-[0.14]`}
                  />
                  <div
                    className={`pointer-events-none absolute -right-32 top-1/4 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br ${accent} opacity-25 blur-[120px] transition-transform duration-1000 ${
                      isActive ? "translate-x-0" : "translate-x-24"
                    }`}
                  />
                </>
              )}

              {/* Giant ghost index */}
              <span className="pointer-events-none absolute -bottom-10 right-2 select-none text-[34vw] font-black leading-none text-white/[0.04] sm:text-[26vw]">
                {String(index).padStart(2, "0")}
              </span>

              {/* Content */}
              <div
                className={`relative z-10 max-w-3xl transition-all duration-700 ${
                  isActive ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
              >
                {(event.icon || event.category) && (
                  <div className="mb-5 flex items-center gap-4">
                    {event.icon && (
                      <span
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-3xl shadow-xl`}
                      >
                        {event.icon}
                      </span>
                    )}
                    {event.category && (
                      <span className="rounded-full border border-white/15 bg-black/30 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-cyan">
                        {event.category}
                      </span>
                    )}
                  </div>
                )}

                <h2 className="text-5xl font-black tracking-tighter sm:text-7xl">
                  {event.name}
                </h2>
                {event.description && (
                  <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
                    {event.description}
                  </p>
                )}

                <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
                  {[
                    ["Date", event.date_label],
                    ["Time", event.time_label],
                    ["Venue", event.venue],
                    ["Team", event.team_size],
                    ["Prize Pool", event.prize_pool],
                  ]
                    .filter(([, value]) => value)
                    .map(([label, value]) => (
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

                <div className="mt-9">
                  <GetPassButton
                    slug={event.register_slug}
                    label="Register"
                    className={`inline-flex rounded-full bg-gradient-to-r ${accent} px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:brightness-110`}
                  />
                </div>
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
            <GetPassButton
              slug={fest.passSlug}
              label="Register Now"
              className="rounded-full bg-gradient-to-r from-indigo-400 to-violet-400 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-105"
            />
            <Link
              href="/"
              className="rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10"
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
              key={event.id}
              type="button"
              aria-label={`Go to ${event.name}`}
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
