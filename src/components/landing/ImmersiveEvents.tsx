"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { fest, TRACKS, trackOf, type Track } from "@/lib/data";
import { getFestActivities, type FestActivity } from "@/lib/festApi";
import GetPassButton from "./GetPassButton";
import ContactButton from "./ContactButton";
import OrbitStage from "./OrbitStage";

type Filter = Track | "all";

const isTrack = (v: string | null): v is Track =>
  v === "learn" || v === "play" || v === "celebrate";

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

// A single event "poster" tile for the intro wall — image only, no text.
function PosterCard({ event, accent }: { event: FestActivity; accent: string }) {
  return (
    <div className="h-32 w-56 shrink-0 overflow-hidden rounded-2xl border border-white/10 shadow-xl ring-1 ring-black/20">
      {event.background_image_url ? (
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${event.background_image_url})` }}
        />
      ) : (
        <div className={`h-full w-full bg-gradient-to-br ${accent}`} />
      )}
    </div>
  );
}

// Tilted, auto-scrolling wall of event posters — a cinematic backdrop that's
// built from the real line-up.
function PosterWall({ events }: { events: FestActivity[] }) {
  // Very slow drift, each row a bit different.
  const durations = [140, 175, 155, 165];
  const rows = [0, 1, 2, 3].map((r) => {
    let cards = events.filter((_, i) => i % 4 === r);
    if (cards.length < 5) cards = events; // small line-up → reuse the full set
    // rotate each row so they don't line up identically
    return [...cards.slice(r), ...cards.slice(0, r)];
  });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden [perspective:1200px]">
      <div className="absolute inset-0 flex flex-col justify-center gap-3 [transform:rotateX(20deg)_rotateZ(-6deg)_scale(1.4)]">
        {rows.map((cards, r) => (
          <div
            key={r}
            className="animate-marquee-x flex w-max gap-3"
            style={{
              animationDuration: `${durations[r]}s`,
              animationDirection: r % 2 ? "reverse" : "normal",
            }}
          >
            {[...cards, ...cards].map((ev, i) => (
              <PosterCard
                key={`${r}-${i}`}
                event={ev}
                accent={accentOf(r * 2 + i)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ImmersiveEvents() {
  const scroller = useRef<HTMLDivElement>(null);
  const panels = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [list, setList] = useState<FestActivity[] | null>(null);
  // Initial track comes from the ?track= query param (deep-linked from the
  // top-bar Learn / Play / Celebrate links). Read lazily on the client; the
  // page shows a loader until the fetch resolves, so this never affects the
  // server-rendered markup.
  const [filter, setFilter] = useState<Filter>(() => {
    if (typeof window === "undefined") return "all";
    const t = new URLSearchParams(window.location.search).get("track");
    return isTrack(t) ? t : "all";
  });

  // The line-up narrowed to the current track (or everything for "all").
  const events = useMemo(
    () =>
      list
        ? list.filter((a) => filter === "all" || trackOf(a) === filter)
        : [],
    [list, filter],
  );

  const chooseFilter = (next: Filter) => {
    setFilter(next);
    setActive(0);
    scroller.current?.scrollTo({ top: 0 });
    const url = next === "all" ? "/events" : `/events?track=${next}`;
    window.history.replaceState(null, "", url);
  };

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

  // Track which panel is centered — re-attaches when the visible set changes.
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
  }, [list, events]);

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

  const total = events.length + 2; // intro + events + outro
  const activeTrack = TRACKS.find((t) => t.key === filter);

  return (
    <>
      <div
        ref={scroller}
        className="no-scrollbar h-dvh snap-y snap-mandatory overflow-y-auto scroll-smooth"
      >
        {/* Intro — tilted, moving wall of the real line-up */}
        <section
          data-index={0}
          ref={(el) => {
            panels.current[0] = el;
          }}
          className="relative flex h-dvh snap-start flex-col items-center justify-center overflow-hidden px-6 text-center"
        >
          {/* Poster wall backdrop */}
          <PosterWall events={events} />
          {/* Lighter readability layers — keep the posters visible, darken just
              enough behind the title and fade into the next panel. */}
          <div className="pointer-events-none absolute inset-0 bg-[#05010f]/25" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_58%_52%_at_50%_46%,rgba(5,1,15,0.8),rgba(5,1,15,0.28)_55%,transparent_82%)]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#05010f]" />

          {/* Foreground */}
          <div className="relative z-10 flex flex-col items-center">
            <h1 className="text-6xl font-black uppercase leading-[0.85] tracking-[-0.03em] text-white drop-shadow-[0_6px_34px_rgba(0,0,0,0.9)] sm:text-8xl md:text-[9.5rem]">
              {activeTrack ? activeTrack.label : "Events"}
            </h1>
            <p className="mt-7 max-w-sm text-balance text-base leading-relaxed text-white/80 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] sm:max-w-md">
              {activeTrack ? activeTrack.tagline : "Every competition — one immersive reel."}
            </p>

            {/* Track selector */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/10 bg-black/40 p-1.5 backdrop-blur-md">
              {[{ key: "all" as const, label: "All" }, ...TRACKS].map((t) => {
                const selected = filter === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => chooseFilter(t.key)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors sm:text-sm ${
                      selected
                        ? "bg-cyan-400 text-[#04121a] shadow-lg shadow-cyan-500/25"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            {events.length > 0 ? (
              <button
                type="button"
                onClick={() => scrollTo(1)}
                className="btn-tech btn-tech-primary group mt-8"
              >
                Start Exploring
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            ) : (
              <p className="mt-8 max-w-xs text-balance text-sm text-white/55">
                No events in this track yet — try another.
              </p>
            )}
          </div>

          {/* Scroll cue */}
          {events.length > 0 && (
            <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
              <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/25 p-1">
                <span className="h-2 w-1 animate-bounce rounded-full bg-white/60" />
              </span>
            </div>
          )}
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
              className="relative flex h-dvh snap-start items-center overflow-hidden pl-8 pr-6 sm:pl-20 sm:pr-16 md:pl-32 md:pr-24"
            >
              {/* Background: banner image, or a rich gradient fallback */}
              {hasImage ? (
                <>
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${event.background_image_url})` }}
                  />
                  {/* Dark on the left (text) → clear on the right (image). Slightly
                      heavier on mobile where the text overlaps the image. */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#05010f] via-[#05010f]/80 to-[#05010f]/25 sm:via-[#05010f]/55 sm:to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05010f] via-transparent to-transparent" />
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-[#0a0614]" />
                  <div className="pointer-events-none absolute inset-0 grid-backdrop opacity-30" />
                  <div
                    className={`pointer-events-none absolute right-0 top-0 h-full w-2/3 bg-gradient-to-l ${accent} opacity-40 blur-[90px] transition-transform duration-1000 ${
                      isActive ? "translate-x-0" : "translate-x-16"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0a0614] via-[#0a0614]/40 to-transparent" />
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

                <h2 className="text-5xl font-black tracking-tighter drop-shadow-[0_2px_16px_rgba(0,0,0,0.85)] sm:text-7xl">
                  {event.name}
                </h2>
                {event.description && (
                  <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
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
                    className="btn-tech btn-tech-primary"
                  />
                </div>
              </div>
            </section>
          );
        })}

        {/* Outro — orbital stage */}
        <section
          data-index={total - 1}
          ref={(el) => {
            panels.current[total - 1] = el;
          }}
          className="relative flex h-dvh snap-start flex-col items-center justify-center overflow-hidden px-6 text-center"
        >
          {/* Ambient backdrop */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_42%,#0d0722,#070214_70%)]" />
          <div className="pointer-events-none absolute inset-0 grid-backdrop opacity-20" />
          <div className="pointer-events-none absolute left-1/2 top-[42%] h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/20 blur-[140px]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#05010f]/60 via-transparent to-[#05010f]" />

          {/* Drifting light particles */}
          {[
            { c: "left-[12%] top-[24%]", d: "0s", cls: "h-1.5 w-1.5 bg-cyan-300/70" },
            { c: "right-[14%] top-[30%]", d: "1.1s", cls: "h-1 w-1 bg-fuchsia-300/60" },
            { c: "left-[18%] bottom-[26%]", d: "1.7s", cls: "h-1 w-1 bg-violet-300/60" },
            { c: "right-[16%] bottom-[30%]", d: "0.6s", cls: "h-1.5 w-1.5 bg-cyan-300/60" },
            { c: "left-[46%] top-[16%]", d: "2.2s", cls: "h-1 w-1 bg-white/50" },
          ].map(({ c, d, cls }, i) => (
            <span
              key={i}
              className={`animate-float pointer-events-none absolute rounded-full blur-[0.5px] ${c} ${cls}`}
              style={{ animationDelay: d }}
            />
          ))}

          <div className="relative z-10 flex flex-col items-center">
            {/* 3D orbital centerpiece */}
            <OrbitStage />

            <h2 className="mt-4 max-w-2xl text-4xl font-black leading-[0.95] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] sm:text-6xl">
              Ready to <span className="text-gradient">enter the arena?</span>
            </h2>
            <p className="mt-5 max-w-md text-balance text-base leading-relaxed text-white/65 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              Grab your pass now.
            </p>

            <div className="mt-9 flex w-full max-w-md flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center">
              <GetPassButton
                slug={fest.passSlug}
                label="Register Now"
                className="btn-tech btn-tech-primary w-full sm:w-auto"
              />
              <Link
                href="/"
                className="btn-tech btn-tech-ghost w-full sm:w-auto"
              >
                Back to Home
              </Link>
            </div>

            {/* Secondary, de-emphasised help link */}
            <ContactButton className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-white/55 transition-colors hover:text-cyan" />
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
