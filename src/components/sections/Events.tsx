import Section from "../Section";
import Reveal from "../Reveal";
import { events } from "@/lib/data";

export default function Events() {
  return (
    <Section
      id="events"
      eyebrow="60+ Events"
      title={
        <>
          Compete. Build. <span className="text-gradient">Win.</span>
        </>
      }
      subtitle="From 36-hour hackathons to combat robotics and headline concerts — there's a stage for every kind of genius."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {events.map((event, i) => (
          <Reveal
            key={event.title}
            delay={(i % 4) * 90}
            className="group relative h-full"
          >
            <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/25">
              {/* Accent glow on hover */}
              <div
                className={`absolute -right-16 -top-16 h-32 w-32 rounded-full bg-gradient-to-br ${event.accent} opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40`}
              />
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${event.accent} text-2xl shadow-lg`}
              >
                {event.icon}
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan">
                {event.category}
              </p>
              <h3 className="mt-1 text-xl font-bold">{event.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/60">
                {event.blurb}
              </p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-white/80 transition-colors group-hover:text-white">
                Learn more
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
