import Section from "../Section";
import Reveal from "../Reveal";
import { gallery } from "@/lib/data";

// A staggered, editorial grid — some tiles span two rows/cols for rhythm.
const spans = [
  "sm:col-span-2 sm:row-span-2",
  "",
  "",
  "sm:row-span-2",
  "sm:col-span-2",
  "",
  "",
  "",
];

export default function Gallery() {
  return (
    <Section
      id="gallery"
      eyebrow="Moments"
      title={
        <>
          Last year, in <span className="text-gradient">frames</span>
        </>
      }
      subtitle="A glimpse of the energy. Real photos land here after the fest."
    >
      <div className="grid auto-rows-[140px] grid-cols-2 gap-4 sm:auto-rows-[180px] sm:grid-cols-4">
        {gallery.map((tile, i) => (
          <Reveal
            key={tile.label}
            delay={(i % 4) * 70}
            className={`group relative overflow-hidden rounded-2xl ${spans[i] ?? ""}`}
          >
            <div
              className={`flex h-full w-full items-end bg-gradient-to-br ${tile.accent} p-4 transition-transform duration-500 group-hover:scale-105`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
              <span className="relative font-mono text-xs font-semibold uppercase tracking-[0.15em] text-white drop-shadow">
                {tile.label}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
