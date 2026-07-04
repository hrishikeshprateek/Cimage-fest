import Section from "../Section";
import Reveal from "../Reveal";
import { speakers } from "@/lib/data";

export default function Speakers() {
  return (
    <Section
      id="speakers"
      eyebrow="Lectures & Keynotes"
      title={
        <>
          Minds that <span className="text-gradient">move the world</span>
        </>
      }
      subtitle="Scientists, founders and creators take the stage. Full speaker line-up revealed soon."
      className="grid-backdrop"
    >
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
        {speakers.map((sp, i) => (
          <Reveal
            key={sp.name}
            delay={(i % 3) * 90}
            className="group text-center"
          >
            <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-2xl border border-white/10">
              {/* Gradient avatar placeholder with initials */}
              <div
                className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${sp.accent} transition-transform duration-500 group-hover:scale-105`}
              >
                <span className="text-5xl font-black text-white/90">
                  {sp.initials}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#05010f] via-transparent to-transparent" />
            </div>
            <h3 className="mt-4 text-base font-bold sm:text-lg">{sp.name}</h3>
            <p className="mt-0.5 text-xs text-white/55 sm:text-sm">{sp.role}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
