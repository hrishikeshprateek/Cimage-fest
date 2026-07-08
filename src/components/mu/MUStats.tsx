import { BRANDS, type BrandKey } from "./brandLogos";

/* Exact replica of Masters' Union's .bentoSection — black band, gradient
   curves behind, centred white heading, and a true masonry of frosted stat
   cards (per-card row/col spans). Each stat carries the big Galano amount, a
   two-line label, and crisp white company logos — each in its own bordered box.
   CIMAGE's real numbers + real recruiters (TCS, IBM, ICICI, HSBC, HDFC,
   Accenture, Wipro, HCL, Cognizant, Infosys, Coca-Cola). */

type Card = { amount: string; line1: string; line2?: string; logos: BrandKey[] };

// Order matches MU's nth-child spans: 1=tall, 4=taller, 5=wide(row), 6=short,
// 7=taller, 8=full-width.
// Each recruiter appears on exactly ONE card — no logo is repeated across the
// bento. (Only 11 brand glyphs exist, so the shorter cards stay number-only.)
const CARDS: Card[] = [
  { amount: "13,500+", line1: "Students Placed", line2: "across 17+ years", logos: ["tcs", "accenture"] },
  { amount: "₹37 LPA", line1: "Highest Package", line2: "BCA · single offer", logos: ["tcs", "ibm", "accenture", "hcl"] },
  { amount: "317", line1: "TCS Selections", line2: "in a single drive", logos: [] },
  { amount: "200+", line1: "Recruiting Companies", line2: "hiring on campus", logos: ["wipro", "hcl"] },
  { amount: "₹4.5 LPA", line1: "Average Package", line2: "across the batch", logos: ["tcs", "wipro", "infosys", "cognizant"] },
  { amount: "17+", line1: "Years of Excellence", line2: "in IT & Management education", logos: [] },
  { amount: "130+", line1: "ICICI Bank PO Offers in 2026", line2: "₹4.5 LPA each", logos: ["icicibank"] },
  {
    amount: "50%+",
    line1: "of Bihar's IT Placements",
    line2: "across the state, year on year",
    logos: ["ibm", "cognizant", "infosys", "accenture"],
  },
];

// Fit every glyph into a consistent CAP_H × CAP_W box (keeping aspect) so they
// all read at an even optical size despite different intrinsic shapes.
const CAP_H = 22;
const CAP_W = 72;

function BrandLogo({ k }: { k: BrandKey }) {
  const b = BRANDS[k];
  const aspect = b.w / b.h;
  const h = CAP_H * aspect <= CAP_W ? CAP_H : CAP_W / aspect;
  const w = h * aspect;
  return (
    <span className="mu-bento-logo" title={b.name}>
      <svg
        viewBox={b.vb}
        width={Math.round(w)}
        height={Math.round(h)}
        fill="currentColor"
        role="img"
        aria-label={b.name}
      >
        <path d={b.d} />
      </svg>
    </span>
  );
}

export default function MUStats() {
  return (
    <section className="relative overflow-hidden border-b border-[#262626] bg-[#090909] py-14 sm:py-20">
      {/* decorative gradient curves (MU .svgOne / .svgTwo) */}
      <svg
        className="pointer-events-none absolute left-0 top-0 z-0 w-full"
        height="244"
        viewBox="0 0 1440 244"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ maskImage: "linear-gradient(to top, black 0%, transparent 100%)", WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)" }}
      >
        <path
          d="M-161.494 198.13C113.015 219.228 208.884 207.101 389.001 37.9988C557.883 -120.555 727.584 -321.769 980.573 -263.823C1260.15 -199.787 1042.07 -119.111 1061 37.9988C1103.52 390.888 1446.36 138.092 1835.5 168"
          stroke="url(#mu_bento_g1)"
          strokeWidth="32"
        />
        <defs>
          <linearGradient id="mu_bento_g1" x1="-318.999" y1="-6" x2="1711.96" y2="703.987" gradientUnits="userSpaceOnUse">
            <stop stopColor="#39B5D7" />
            <stop offset="0.502211" stopColor="#F7D544" />
            <stop offset="1" stopColor="#E38330" />
          </linearGradient>
        </defs>
      </svg>
      <svg
        className="pointer-events-none absolute bottom-[2%] left-[-2%] z-0 hidden scale-110 sm:block"
        width="983"
        height="718"
        viewBox="0 0 983 718"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M-230.002 5.63986C-116.943 305.797 76.2677 546.107 414.154 479.815C564.585 450.301 877.377 275.062 956.051 476.047C1014.45 625.234 810.522 700.738 699.873 879.618C581.863 1070.4 685.183 1300.93 764.938 1512.67"
          stroke="url(#mu_bento_g2)"
          strokeWidth="32"
        />
        <defs>
          <linearGradient id="mu_bento_g2" x1="1171.5" y1="1275.52" x2="676.89" y2="-297.808" gradientUnits="userSpaceOnUse">
            <stop stopColor="#39B5D7" />
            <stop offset="0.116352" stopColor="#64BCB6" />
            <stop offset="0.241322" stopColor="#93C492" />
            <stop offset="0.511288" stopColor="#F7D544" />
            <stop offset="1" stopColor="#E38330" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative z-10 mx-auto flex max-w-[1240px] flex-col items-center gap-9 px-5 sm:px-8">
        {/* heading (MU .bentoHeadingContainer) */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-[32px] font-semibold leading-tight text-[#ffffff] sm:text-[44px]">Why CIMAGE</h2>
          <p className="text-[16px] leading-relaxed text-[#e5e5e5]">
            A placement-first approach to IT &amp; Management education.
          </p>
        </div>

        {/* masonry stat grid (MU .stats-grid) */}
        <div className="mu-bento-grid">
          {CARDS.map((c, i) => (
            <article key={i} className="mu-stat-card">
              <div className="mu-bento-head flex flex-col items-start gap-1">
                <p className="mu-amount">{c.amount}</p>
                <p className="mu-line1">{c.line1}</p>
                {c.line2 && <p className="mu-line2">{c.line2}</p>}
              </div>

              {c.logos.length > 0 && (
                <div className="mu-bento-logos">
                  {c.logos.map((k) => (
                    <BrandLogo key={k} k={k} />
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
