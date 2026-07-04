"use client";

import { useMemo, useState } from "react";
import { events, eventCategories } from "@/lib/data";

export default function EventsExplorer() {
  const [active, setActive] = useState<string>("All");

  const filtered = useMemo(
    () =>
      active === "All" ? events : events.filter((e) => e.category === active),
    [active]
  );

  return (
    <div>
      {/* Filter chips */}
      <div className="mb-10 flex flex-wrap justify-center gap-2.5">
        {eventCategories.map((cat) => {
          const isActive = active === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`rounded-full border px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.15em] transition-all ${
                isActive
                  ? "border-transparent bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-lg shadow-violet-500/25"
                  : "border-white/15 text-white/60 hover:border-white/40 hover:text-white"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Card grid — keyed on `active` so cards replay their entrance on filter */}
      <div
        key={active}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.map((event, i) => (
          <article
            key={event.slug}
            className="animate-rise group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/25"
            style={{ animationDelay: `${(i % 3) * 80 + Math.floor(i / 3) * 40}ms` }}
          >
            {/* Accent glow */}
            <div
              className={`absolute -right-16 -top-16 h-32 w-32 rounded-full bg-gradient-to-br ${event.accent} opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-45`}
            />

            <div className="flex items-start justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${event.accent} text-2xl shadow-lg`}
              >
                {event.icon}
              </div>
              <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-cyan">
                {event.category}
              </span>
            </div>

            <h3 className="mt-5 text-xl font-bold">{event.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">
              {event.blurb}
            </p>

            {/* Meta */}
            <dl className="mt-5 grid grid-cols-2 gap-y-2 border-t border-white/10 pt-4 text-sm">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                  Date
                </dt>
                <dd className="text-white/80">{event.date}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                  Time
                </dt>
                <dd className="text-white/80">{event.time}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                  Team
                </dt>
                <dd className="text-white/80">{event.team}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                  Prize Pool
                </dt>
                <dd className="font-semibold text-gradient">{event.prize}</dd>
              </div>
            </dl>

            <div className="mt-5 flex items-center gap-2">
              <span className="text-white/40">📍</span>
              <span className="text-sm text-white/60">{event.venue}</span>
            </div>

            <a
              href="#register"
              className="mt-5 inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 py-2.5 text-sm font-semibold text-white/90 transition-colors hover:border-transparent hover:bg-gradient-to-r hover:from-violet-500 hover:to-cyan-500"
            >
              Register
            </a>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-white/50">
          No events in this track yet — check back soon.
        </p>
      )}
    </div>
  );
}
