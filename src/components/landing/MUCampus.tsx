"use client";

import { useState } from "react";

/* Campus section — CIMAGE's horizontal expanding-accordion widget (the one on
   the "/" route), restyled for the MU light band. Self-contained: the campus
   copy and events live here, and remote images use a plain fill <img> to match
   this project's convention (remote next/image hosts aren't configured). */

const EVT_BASE =
  "https://cimage-web.s3.ap-south-1.amazonaws.com/public/public/event/";

const campus = {
  display: "Not just the classroom.",
  sub: "There's always something on — campus life runs right through the year.",
  body:
    "National Technology Day, the Ojas Sports Meet, Robo Race, industry workshops, the Cultural Fest and the Holi Mela that takes over the entire campus.",
  events: [
    { name: "National Technology Day", image: EVT_BASE + "ntd.jpeg", desc: "A campus-wide celebration of innovation, student projects and tech demos." },
    { name: "Ojas Sports Meet", image: EVT_BASE + "ojas.jpeg", desc: "An inter-college sports tournament that runs through the year." },
    { name: "Robo Race", image: EVT_BASE + "robo.jpeg", desc: "A robotics race that takes over the campus atrium." },
    { name: "Industry Workshops", image: EVT_BASE + "drone.jpeg", desc: "Hands-on workshops on AI, drones and emerging tech." },
    { name: "Holi Mela", image: EVT_BASE + "holi.jpeg", desc: "A Holi celebration that takes over the entire campus." },
    { name: "Cultural Fest", image: EVT_BASE + "kathak.jpeg", desc: "Music, dance and performances on the main stage." },
  ],
};

export default function MUCampus() {
  const c = campus;
  const [active, setActive] = useState(0);

  return (
    <section id="campus" className="bg-[#fefcf5] py-20 sm:py-28">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="max-w-3xl">
          <h2 className="mu-serif text-[2.1rem] leading-[1.1] text-[#090909] sm:text-[3rem]">
            {c.display}
          </h2>
          <p className="mt-4 text-[17px] text-[#525252]">{c.sub}</p>
        </div>

        {/* Default widget: horizontal accordion (desktop) → vertical (mobile) */}
        <div className="mt-12 flex flex-col gap-2 md:h-[460px] md:flex-row md:gap-3">
          {c.events.map((e, i) => {
            const on = active === i;
            return (
              <button
                key={e.name}
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-expanded={on}
                className={[
                  "group relative overflow-hidden rounded-2xl text-left outline-none transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-[#fad133]/70",
                  "md:h-full",
                  on ? "h-80 md:flex-[5]" : "h-16 md:flex-[1]",
                ].join(" ")}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={e.image}
                  alt={e.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {/* base gradient + extra dim when collapsed */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
                <div
                  className={`pointer-events-none absolute inset-0 bg-black/40 transition-opacity duration-500 ${
                    on ? "opacity-0" : "opacity-100"
                  }`}
                />

                {/* Vertical label — desktop, collapsed only */}
                <span
                  className={`pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-lg font-semibold text-white drop-shadow [writing-mode:vertical-rl] rotate-180 transition-opacity duration-300 md:block ${
                    on ? "opacity-0" : "opacity-100"
                  }`}
                >
                  {e.name}
                </span>

                {/* Horizontal content — active (desktop) + all mobile */}
                <div
                  className={`absolute inset-x-0 bottom-0 p-4 transition-opacity duration-300 sm:p-6 ${
                    on ? "opacity-100" : "opacity-100 md:opacity-0"
                  }`}
                >
                  <span className="mb-2 hidden h-1 w-8 rounded-full bg-[#fad133] md:block" />
                  <h3 className="text-xl font-semibold text-white drop-shadow sm:text-2xl">
                    {e.name}
                  </h3>
                  <p
                    className={`mt-1 max-w-sm text-sm leading-relaxed text-white/90 transition-all duration-300 ${
                      on ? "max-h-24 opacity-100" : "max-h-0 overflow-hidden opacity-0 md:opacity-0"
                    }`}
                  >
                    {e.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-10 max-w-3xl text-[16px] leading-relaxed text-[#525252]">{c.body}</p>
      </div>
    </section>
  );
}
