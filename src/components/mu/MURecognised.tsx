import { asset } from "@/lib/assets";

/* "Recognised by" accreditation band, right under the hero. A clean credential
   bar: equal cells split by hairline dividers (no boxes/cards around the logos),
   each logo height-matched and centred in its cell. Logos are pre-trimmed to
   their content so they sit consistently.

   ── To resize a logo: tweak its `scale` below (per-logo optical nudge). The
      shared size caps live in app/mu.css: `.mu-recog-logobox img` (wide logos)
      and `.mu-recog-logobox.seal img` (the seal badges), plus the box height on
      `.mu-recog-logobox`. `seal` just gives a logo the taller cap. */
const ITEMS: { src: string; alt: string; label: string; seal?: boolean; scale?: number }[] = [
  { src: "/badges/aicte-n.png", alt: "AICTE", label: "Approved", seal: true, scale: 1.2 },
  { src: "/badges/naac-n.png", alt: "NAAC", label: "Accredited", seal: true, scale: 1.4 },
  { src: "/badges/affiliation-n.png", alt: "Permanent Affiliation", label: "Permanent Affiliation", seal: true, scale: 1.5 },
  { src: "/badges/iitb-n.png", alt: "IIT Bombay", label: "Super Resource Centre", seal: true },
  // Google for Education logo as used on the "/" route.
  { src: asset("/badges/gfe.png"), alt: "Google for Education", label: "Google for Education", scale: 2.2 },
  { src: "/badges/aws.svg", alt: "Amazon Web Services", label: "AWS Academy" },
];

export default function MURecognised() {
  return (
    <section className="mu-recog">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <p className="mu-recog-eyebrow">Approved &amp; Recognised by</p>
        <span className="mu-recog-rule" aria-hidden="true" />

        <div className="mu-recog-row">
          {ITEMS.map((it) => (
            <div key={it.alt} className="mu-recog-item">
              <span className={`mu-recog-logobox${it.seal ? " seal" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={it.src}
                  alt={it.alt}
                  style={it.scale ? { transform: `scale(${it.scale})` } : undefined}
                />
              </span>
              <span className="mu-recog-label">{it.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
