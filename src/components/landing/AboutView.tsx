import Link from "next/link";
import GetPassButton from "./GetPassButton";

// --- Content ---------------------------------------------------------------
const STATS = [
  { value: "13,500+", label: "Alumni placed" },
  { value: "₹37 LPA", label: "Highest package" },
  { value: "₹4.5 LPA", label: "Average package" },
  { value: "200+", label: "Recruiting companies" },
  { value: "317", label: "TCS selections, one drive" },
  { value: "50%+", label: "Of Bihar's IT placements" },
];

const PROGRAMS = [
  { code: "BCA", name: "Computer Applications" },
  { code: "B.Tech", name: "CSE · AI-ML · ECE · Electrical · Civil" },
  { code: "B.Sc IT", name: "Information Technology" },
  { code: "BBA", name: "Business Administration" },
  { code: "B.Com(P)", name: "Commerce — Professional" },
  { code: "MCA", name: "Master of Computer Applications" },
  { code: "MBA", name: "Business Administration" },
  { code: "PGDM", name: "AIMA — Post Graduate Diploma" },
];

const INSTITUTIONS = [
  {
    name: "CIMAGE",
    place: "S.K. Puri Park, Boring Road, Patna",
    affiliation: "Patliputra University",
  },
  {
    name: "Catalyst College",
    place: "Patliputra, Patna",
    affiliation: "Patliputra University",
  },
  {
    name: "CIMAGE Professional College",
    place: "Vivekanand Marg, Patna",
    affiliation: "Aryabhatta Knowledge University",
  },
  {
    name: "CIMAGE Center of Digital Technology & Entrepreneurship",
    place: "Atal Path, Patliputra Industrial Area",
    affiliation: "Aryabhatta Knowledge University",
  },
];

const FACILITIES = [
  {
    title: "E-Yantra Robotics & AI Lab",
    body: "An IIT Bombay-certified Super Resource Centre for hands-on robotics and AI.",
  },
  {
    title: "Addverb Industrial Robot",
    body: "A six-axis industrial arm students program directly — factory-grade practice.",
  },
  {
    title: "Skill Acceleration Lab",
    body: "Wipro Centre of Excellence training, AWS Academy and Google for Education.",
  },
  {
    title: "Language & Communication Lab",
    body: "Dedicated English communication training to make graduates interview-ready.",
  },
];

const RECOGNITIONS = [
  "AICTE Approved",
  "NAAC Accredited",
  "IIT Bombay Super Resource Centre",
  "Google for Education Partner",
  "AWS Academy",
  "Wipro Centre of Excellence",
  "ASSOCHAM — Best B-School of India (East)",
];

// --- Small building blocks -------------------------------------------------
function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-cyan">
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-4 max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-5xl">
      {children}
    </h2>
  );
}

export default function AboutView() {
  return (
    <div className="relative bg-[#05010f] text-white">
      {/* ---------------------------------------------------------------- */}
      {/* Hero — video background                                           */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative flex h-dvh min-h-[560px] items-center justify-center overflow-hidden px-6 text-center">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          src="/hero.mp4"
        />
        {/* Readability layers */}
        <div className="pointer-events-none absolute inset-0 bg-[#05010f]/55" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_45%,transparent,rgba(5,1,15,0.7))]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#05010f]" />

        <div className="relative z-10 flex flex-col items-center">
          <Kicker>About Us</Kicker>
          <h1 className="mt-5 text-6xl font-black leading-[0.9] tracking-tight drop-shadow-[0_6px_30px_rgba(0,0,0,0.9)] sm:text-8xl">
            <span className="text-gradient">CIMAGE</span>
          </h1>
          <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-white/85 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] sm:text-xl">
            Bihar&apos;s most successful IT &amp; Management college — 17+ years
            of turning students into placed, industry-ready professionals.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            {["Knowledge", "Skill", "Success"].map((w) => (
              <span
                key={w}
                className="rounded-full border border-white/15 bg-black/40 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm"
              >
                {w}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
          <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/25 p-1">
            <span className="h-2 w-1 animate-bounce rounded-full bg-white/60" />
          </span>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Story                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-5xl px-6 py-24 sm:py-28">
        <Kicker>Who we are</Kicker>
        <SectionTitle>
          A placement-first college, <span className="text-gradient">built for outcomes.</span>
        </SectionTitle>
        <div className="mt-8 grid gap-8 text-base leading-relaxed text-white/70 sm:grid-cols-2 sm:text-lg">
          <p>
            Founded in 2009 under the leadership of Dr. Neeraj Agarwal, CIMAGE
            has spent 17+ years building one of eastern India&apos;s strongest
            records in IT &amp; management education. The curriculum is rebuilt
            with industry every year, and placement preparation starts from the
            very first semester.
          </p>
          <p>
            More than half of Bihar&apos;s IT placements year-on-year come
            through our campus, with 200+ companies recruiting and an alumni
            network spanning Patna, Dubai, London, Zurich, the USA, Canada,
            Japan and Australia. We don&apos;t just teach — we get students
            hired.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Stats                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-6 pb-24 sm:pb-28">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center backdrop-blur-sm transition-colors hover:border-cyan/30 sm:p-8"
            >
              <div className="text-3xl font-black text-gradient sm:text-5xl">
                {s.value}
              </div>
              <div className="mt-2 text-xs font-medium uppercase tracking-wide text-white/55 sm:text-sm">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Programs                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-6 pb-24 sm:pb-28">
        <Kicker>What we teach</Kicker>
        <SectionTitle>Programs across the group</SectionTitle>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {PROGRAMS.map((p) => (
            <div
              key={p.code}
              className="group rounded-2xl border border-white/10 bg-black/25 p-5 transition-colors hover:border-violet-400/40 hover:bg-white/[0.04]"
            >
              <div className="text-lg font-bold text-white transition-colors group-hover:text-cyan sm:text-xl">
                {p.code}
              </div>
              <div className="mt-1.5 text-xs leading-relaxed text-white/55 sm:text-sm">
                {p.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Group of institutions                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden py-24 sm:py-28">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/15 blur-[130px]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <Kicker>The group</Kicker>
          <SectionTitle>
            Four colleges, <span className="text-gradient">one standard.</span>
          </SectionTitle>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
            The CIMAGE Group of Institutions brings four campuses under a single
            promise of Knowledge, Skill and Success.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {INSTITUTIONS.map((inst, i) => (
              <div
                key={inst.name}
                className="flex gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors hover:border-cyan/30"
              >
                <span className="font-mono text-2xl font-black text-white/15">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white">{inst.name}</h3>
                  <p className="mt-1 text-sm text-white/60">{inst.place}</p>
                  <p className="mt-2 inline-block rounded-full border border-white/10 bg-black/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-cyan/90">
                    {inst.affiliation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Facilities                                                        */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:py-28">
        <Kicker>On campus</Kicker>
        <SectionTitle>Labs that mirror the industry</SectionTitle>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {FACILITIES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/10 bg-black/25 p-7 transition-colors hover:border-violet-400/40"
            >
              <h3 className="text-lg font-bold text-white sm:text-xl">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60 sm:text-base">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Recognitions                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-5xl px-6 pb-24 text-center sm:pb-28">
        <Kicker>Recognised by</Kicker>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {RECOGNITIONS.map((r) => (
            <span
              key={r}
              className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/75 backdrop-blur-sm"
            >
              {r}
            </span>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Closing CTA                                                       */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden px-6 pb-32 pt-8 text-center">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-600/15 blur-[130px]" />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
            Be part of the <span className="text-gradient">CIMAGE Fest.</span>
          </h2>
          <div className="mt-9 flex w-full max-w-md flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center">
            <GetPassButton className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-lg shadow-violet-600/30 ring-1 ring-white/15 transition hover:brightness-110 sm:w-auto" />
            <Link
              href="/events"
              className="w-full rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white/90 backdrop-blur-sm transition-colors hover:bg-white/10 sm:w-auto"
            >
              Explore Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
