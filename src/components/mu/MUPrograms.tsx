"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { copy } from "@/lib/copy";

/* Exact replica of MU's .ourProgramme — black band, "Our Programmes" heading,
   category tab pills with prev/next arrows, and a horizontal rail of large
   detail cards (image + play, "UG Programme in <field>", blurb,
   Format/Eligibility/Duration/Deadline grid, gradient-border Explore button).
   Driven by CIMAGE's real programmes. */

// Map each degree to the "field" wording MU uses (prefix + bold field).
const FIELD: Record<string, string> = {
  BCA: "Computer Applications (BCA)",
  "B.Tech": "Engineering & Technology (B.Tech)",
  BBA: "Business Administration (BBA)",
  "B.Sc. (IT)": "Information Technology (B.Sc. IT)",
  "B.Com (P)": "Commerce — Professional (B.Com P)",
  MCA: "Computer Applications (MCA)",
  MBA: "Business Administration (MBA)",
};

function facts(groupLabel: string) {
  const pg = /post/i.test(groupLabel);
  return {
    format: { value: "On Campus", note: "Industry-integrated" },
    eligibility: pg ? "Graduates in any discipline" : "Class 12th Students & Pass-outs",
    duration: pg ? "2 Years (Full Time)" : "3 Years (Incl. industry training)",
    deadline: "Admissions Open · Batch 2026",
  };
}

const ICONS = {
  format: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 2 8l10 5 10-5-10-5Z" /><path d="M6 10.5V15c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4.5" />
    </svg>
  ),
  eligibility: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M5 21V8l7-4 7 4v13" /><path d="M9 21v-5h6v5M9.5 11h0M14.5 11h0" />
    </svg>
  ),
  duration: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" />
    </svg>
  ),
  deadline: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2h12M6 22h12M8 2c0 4 8 6 8 10s-8 6-8 10M16 2c0 4-8 6-8 10s8 6 8 10" />
    </svg>
  ),
};

function Flexi({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string; note?: string }) {
  return (
    <div className="mu-prog-flexi">
      <span className="ic">{icon}</span>
      <div>
        <p className="lbl">{label}</p>
        <p className="val">
          {value}
          {note && (
            <>
              <br />
              <span>({note})</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default function MUPrograms() {
  const p = copy.programs;
  const [active, setActive] = useState(0);
  const railRef = useRef<HTMLDivElement | null>(null);
  const group = p.groups[active];
  const f = facts(group.label);

  const scrollBy = (dir: 1 | -1) => {
    railRef.current?.scrollBy({ left: dir * 534, behavior: "smooth" });
  };

  // Coverflow-style emphasis: the card nearest the rail centre gets full scale
  // + brightness (--t → 1) and an image zoom; neighbours recede as they move
  // away. Re-runs on scroll/resize and whenever the active tab swaps the cards.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let raf = 0;
    const update = () => {
      const rect = rail.getBoundingClientRect();
      const centre = rect.left + rect.width / 2;
      const cards = Array.from(rail.querySelectorAll<HTMLElement>(".mu-prog-card"));
      if (!cards.length) return;
      const dists = cards.map((c) => {
        const r = c.getBoundingClientRect();
        return Math.abs(r.left + r.width / 2 - centre);
      });
      const min = Math.min(...dists);
      cards.forEach((c, i) => {
        const w = c.getBoundingClientRect().width || 1;
        const t = Math.max(0, 1 - (dists[i] - min) / w);
        c.style.setProperty("--t", t.toFixed(3));
        c.classList.toggle("is-focus", dists[i] === min);
      });
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };
    update();
    rail.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      rail.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [active]);

  return (
    <section id="programs" className="bg-[#f4f4f5] py-16 text-[#090909] sm:py-24">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <h2 className="mu-serif text-[2.1rem] leading-[1.1] sm:text-[3rem]">
          Our <span className="italic">Programmes</span>
        </h2>

        {/* tab pills — own full-width row so they never clip on any screen */}
        <div className="mt-8">
          <div className="mu-no-scrollbar w-full">
            <div className="mu-prog-tabs">
              {p.groups.map((g, i) => (
                <button
                  key={g.label}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`mu-prog-tab ${i === active ? "is-active" : ""}`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* prev/next arrows sit below the tabs (desktop only) */}
          <div className="mt-4 hidden justify-end sm:flex">
            <div className="mu-prog-arrows">
              <button type="button" aria-label="Previous" className="mu-prog-arrow-btn" onClick={() => scrollBy(-1)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button type="button" aria-label="Next" className="mu-prog-arrow-btn" onClick={() => scrollBy(1)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* card rail — wrapper holds the right-edge fade cue */}
        <div className="mu-prog-railwrap mt-6">
        <div ref={railRef} className="mu-no-scrollbar mu-prog-rail">
          {group.items.map((item) => {
            const isUG = !/post/i.test(group.label);
            return (
              <article key={item.name} className="mu-prog-card">
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="mu-prog-imgwrap block">
                  <Image src={item.img} alt={item.name} width={560} height={336} />
                </a>

                <div>
                  <h3 className="mu-prog-title">
                    {isUG ? "UG Programme in " : "PG Programme in "}
                    <span>{FIELD[item.name] ?? item.name}</span>
                  </h3>
                  <p className="mu-prog-desc mt-2">{item.desc}</p>
                </div>

                <div className="mu-prog-info">
                  <Flexi icon={ICONS.format} label="Format" value={f.format.value} note={f.format.note} />
                  <Flexi icon={ICONS.eligibility} label="Eligibility" value={f.eligibility} />
                  <Flexi icon={ICONS.duration} label="Duration" value={f.duration} />
                  <Flexi icon={ICONS.deadline} label="Intake" value={f.deadline} />
                </div>
              </article>
            );
          })}
        </div>
          <span className="mu-prog-fade" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
