import Section from "../Section";
import Reveal from "../Reveal";
import { sponsors } from "@/lib/data";

/** A text-based, brand-neutral logo placeholder. */
function LogoChip({ name, size = "md" }: { name: string; size?: "lg" | "md" | "sm" }) {
  const sizing =
    size === "lg"
      ? "px-10 py-8 text-3xl"
      : size === "md"
        ? "px-8 py-6 text-2xl"
        : "px-6 py-4 text-lg";
  return (
    <div
      className={`flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] font-black tracking-tight text-white/80 transition-colors hover:border-white/25 hover:text-white ${sizing}`}
    >
      {name}
    </div>
  );
}

export default function Sponsors() {
  const marquee = sponsors.find((t) => t.tier === "Associate Partners")?.names ?? [];
  const tiers = sponsors.filter((t) => t.tier !== "Associate Partners");

  return (
    <Section
      id="sponsors"
      eyebrow="In Partnership With"
      title={
        <>
          Backed by the <span className="text-gradient">best</span>
        </>
      }
      subtitle="Brands that fuel the next generation of builders. Sponsorship enquiries welcome."
    >
      <div className="space-y-12">
        {tiers.map((tier, ti) => (
          <Reveal key={tier.tier} delay={ti * 80} className="text-center">
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.3em] text-white/40">
              {tier.tier}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-5">
              {tier.names.map((name) => (
                <LogoChip
                  key={name}
                  name={name}
                  size={ti === 0 ? "lg" : ti === 1 ? "md" : "sm"}
                />
              ))}
            </div>
          </Reveal>
        ))}
      </div>

      {/* Scrolling associate-partner strip */}
      {marquee.length > 0 && (
        <div className="relative mt-16 overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
          <div className="flex w-max animate-marquee gap-4">
            {[...marquee, ...marquee].map((name, i) => (
              <div
                key={`${name}-${i}`}
                className="whitespace-nowrap rounded-lg border border-white/10 bg-white/[0.03] px-6 py-3 font-semibold text-white/60"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
