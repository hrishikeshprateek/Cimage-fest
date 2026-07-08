import Image from "next/image";
import type { CSSProperties } from "react";
import { copy } from "@/lib/copy";

/* MU .LearnApply sticky-STACK section, deck style. White cards on the black
   band; each card pins (position: sticky) a little lower than the one before
   (top = base + index·peek) so every card's header bar — number + reason name —
   stays visible as a stacked deck, and the active card "opens up" below its bar
   to reveal the rich content: image + play, gradient copy, two mini stat-chart
   widgets, CTA. CIMAGE's six reasons + real placement numbers. */

type Stat = { label: string; value: string; kind: "bar" | "line"; data: number[]; hi: number };
const PURPLE = "#6d5ef0";
const ORANGE = "#e38330";

const S: Record<string, Stat> = {
  pkg: { label: "Highest Package", value: "₹37 LPA", kind: "bar", data: [18, 22, 26, 37, 20], hi: 3 },
  avg: { label: "Average Package", value: "₹4.5 LPA", kind: "line", data: [3.2, 3.8, 4.1, 4.5, 4.3], hi: 3 },
  tcs: { label: "TCS · single drive", value: "317", kind: "bar", data: [120, 180, 240, 317, 200], hi: 3 },
  rec: { label: "Recruiting Companies", value: "200+", kind: "line", data: [120, 150, 175, 200, 190], hi: 3 },
  alum: { label: "Alumni Placed", value: "13,500+", kind: "bar", data: [6, 9, 11, 13.5, 12], hi: 3 },
  yrs: { label: "Track Record", value: "17+ yrs", kind: "line", data: [8, 11, 14, 17, 16], hi: 3 },
  icici: { label: "ICICI Bank Offers", value: "130+", kind: "bar", data: [60, 90, 110, 130, 100], hi: 3 },
  bihar: { label: "of Bihar's IT", value: "50%+", kind: "line", data: [30, 38, 44, 50, 46], hi: 3 },
};

type Seg = { t: string; g?: boolean };
type Block = {
  img: string;
  contain?: boolean;
  glyph: string;
  tag: string;
  lead: string;
  accent: string;
  body: Seg[];
  stats: [Stat, Stat];
};

const R = copy.reasons.items;
const BLOCKS: Block[] = [
  {
    img: R[0].image, glyph: R[0].glyph, tag: "Syllabus",
    lead: "An industry-aligned", accent: "Curriculum",
    body: [
      { t: "Java, Python, DBMS, web development and cloud fundamentals — the syllabus is " },
      { t: "rebuilt every year", g: true },
      { t: " against what hiring managers are actually testing for, not what textbooks last reprinted. You ship working projects from the very first semester, so you walk into interviews with a real portfolio, not just a transcript." },
    ],
    stats: [S.pkg, S.rec],
  },
  {
    img: R[1].image, glyph: R[1].glyph, tag: "Robotics Lab",
    lead: "An IIT Bombay–certified", accent: "E-Yantra Lab",
    body: [
      { t: "CIMAGE is the " },
      { t: "only BCA college in Bihar", g: true },
      { t: " with an IIT Bombay-certified E-Yantra robotics & AI lab on campus. Students join real competition tracks, build autonomous systems and earn an IIT-backed certification — the kind of hands-on credential that makes a fresher's CV stand out in a stack of hundreds." },
    ],
    stats: [S.tcs, S.yrs],
  },
  {
    img: "/reasons/wipro-coe.webp", glyph: R[2].glyph, tag: "Industry MoU",
    lead: "A Wipro", accent: "Centre of Excellence",
    body: [
      { t: "An active MoU with " },
      { t: "Wipro Ltd.", g: true },
      { t: " brings industry-graded coursework and domain training onto campus, signed off by a Wipro panel. You earn a Centre-of-Excellence certification before you graduate — proof to recruiters that you've already trained the way the industry actually works." },
    ],
    stats: [S.rec, S.icici],
  },
  {
    img: R[3].image, glyph: R[3].glyph, tag: "Placements",
    lead: "A dedicated", accent: "Placement Cell",
    body: [
      { t: "Placement preparation " },
      { t: "starts in year one", g: true },
      { t: ", not the final semester — aptitude drills, mock interviews, group discussions and soft-skills training run all the way through. By the time TCS or ICICI walks onto campus, you've already given mock rounds to seniors placed there last year, so the real interview feels like round four, not round one." },
    ],
    stats: [S.pkg, S.avg],
  },
  {
    img: R[4].image, contain: R[4].imageContain, glyph: R[4].glyph, tag: "Google Partner",
    lead: "The only", accent: "Google for Education Partner",
    body: [
      { t: "CIMAGE is the " },
      { t: "only Google for Education partner", g: true },
      { t: " in the state. Google's certified tools and Workspace are built into everyday teaching, so you train on the exact platforms companies run on — collaborating, building and presenting the way you will on the job from your very first day." },
    ],
    stats: [S.alum, S.bihar],
  },
  {
    img: R[5].image, glyph: R[5].glyph, tag: "Communication",
    lead: "A dedicated", accent: "Language Lab",
    body: [
      { t: "Hindi-medium students get a " },
      { t: "full year of dedicated English-communication training", g: true },
      { t: " in a structured language lab — reading, speaking, presentation and interview practice. By placement season the language gap is closed, so a strong candidate is never held back by hesitation in the interview room." },
    ],
    stats: [S.tcs, S.avg],
  },
];

function BarChart({ s }: { s: Stat }) {
  const max = Math.max(...s.data);
  return (
    <svg viewBox="0 0 132 58" preserveAspectRatio="none" aria-hidden="true">
      {s.data.map((v, i) => {
        const h = (v / max) * 42 + 3;
        return <rect key={i} x={i * 26 + 6} y={50 - h} width={15} height={h} rx={3} fill={i === s.hi ? PURPLE : "#e7e3fb"} />;
      })}
      {s.data.map((v, i) => (
        <text key={`t${i}`} x={i * 26 + 13.5} y={57} textAnchor="middle" fontSize="7" fill="#b0b0b0">{v < 10 ? v : Math.round(v)}</text>
      ))}
    </svg>
  );
}

function LineChart({ s }: { s: Stat }) {
  const max = Math.max(...s.data), min = Math.min(...s.data);
  const X = (i: number) => 8 + i * ((132 - 16) / (s.data.length - 1));
  const Y = (v: number) => 46 - ((v - min) / (max - min || 1)) * 36;
  const pts = s.data.map((v, i) => `${X(i)},${Y(v)}`).join(" ");
  return (
    <svg viewBox="0 0 132 58" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={pts} fill="none" stroke="#d9d9d9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1={X(s.hi)} y1={Y(s.data[s.hi])} x2={X(s.hi)} y2={50} stroke={ORANGE} strokeWidth="2" strokeOpacity="0.35" />
      <circle cx={X(s.hi)} cy={Y(s.data[s.hi])} r="4" fill={ORANGE} />
      {s.data.map((v, i) => (
        <text key={`t${i}`} x={X(i)} y={57} textAnchor="middle" fontSize="7" fill="#b0b0b0">{v < 10 ? v : Math.round(v)}</text>
      ))}
    </svg>
  );
}

function StatWidget({ s }: { s: Stat }) {
  return (
    <div className="mu-stat-w">
      <p className="wl">{s.label}</p>
      <p className="wv">{s.value}</p>
      {s.kind === "bar" ? <BarChart s={s} /> : <LineChart s={s} />}
    </div>
  );
}

export default function MUReasons() {
  const r = copy.reasons;

  return (
    <section className="bg-[#f4f4f5] py-16 text-[#090909] sm:py-24">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="max-w-3xl">
          <h2 className="mu-serif text-[2.1rem] leading-[1.12] sm:text-[3rem]">
            Six reasons it <span className="mu-gradient-text not-italic">works.</span>
          </h2>
          <p className="mt-4 text-[17px] text-[#52525b]">{r.sub}</p>
        </div>

        <div className="mu-stack mt-12">
          {BLOCKS.map((b, i) => (
            <article key={i} className="mu-stack-card" style={{ "--i": i } as CSSProperties}>
              {/* Header bar — stays visible (peeks) when the card is stacked. */}
              <div className="mu-stack-bar">
                <span className="mu-stack-num">{b.glyph}</span>
                <span className="mu-stack-label">{b.accent}</span>
                <span className="mu-stack-tag">{b.tag}</span>
              </div>

              {/* Body — revealed as the card opens up. */}
              <div className="mu-stack-body">
                <div className={`mu-stack-left ${b.contain ? "contain" : ""}`}>
                  <Image src={b.img} alt={b.accent} width={620} height={460} sizes="(max-width:900px) 100vw, 560px" />
                </div>

                <div className="mu-stack-right">
                  <h3 className="mu-stack-head">
                    {b.lead} <span className="ac">{b.accent}</span>
                  </h3>
                  <p className="mu-stack-sub">
                    {b.body.map((seg, j) => (seg.g ? <span key={j} className="g">{seg.t}</span> : <span key={j}>{seg.t}</span>))}
                  </p>
                  <div className="mu-stack-stats">
                    <StatWidget s={b.stats[0]} />
                    <StatWidget s={b.stats[1]} />
                  </div>
                  <a href="#placements" className="mu-stack-cta">
                    See the Placement Record
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </a>
                </div>
              </div>
            </article>
          ))}

          {/* Trailing room so the last card can pin BELOW the others (completing
              the stack) instead of scrolling up over them, and the finished deck
              holds for a beat before the whole section scrolls away. */}
          <div className="mu-stack-tail" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
