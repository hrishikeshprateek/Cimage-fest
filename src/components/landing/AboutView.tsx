import GetPassButton from "./GetPassButton";
import MUCampus from "./MUCampus";
import MULabs from "./MULabs";
import MUPhysicalAI from "./MUPhysicalAI";
import MUPrograms from "@/components/mu/MUPrograms";
import MUReasons from "@/components/mu/MUReasons";
import MURecognised from "@/components/mu/MURecognised";
import MUStats from "@/components/mu/MUStats";

const HERO_IMG =
  "https://cimage-web.s3.ap-south-1.amazonaws.com/public/public/hero/hro-poster.webp";
const HERO_VIDEO =
  "https://cimage-web.s3.ap-south-1.amazonaws.com/public/public/HRO-mobile.mp4";

// Google Maps directions to CCDTE — CIMAGE Center of Digital Technology &
// Entrepreneurship, Atal Path, Patliputra Industrial Area, Patna.
const CCDTE_DIRECTIONS =
  "https://www.google.com/maps/dir/?api=1&destination=" +
  encodeURIComponent(
    "CIMAGE Center of Digital Technology & Entrepreneurship, Atal Path, Patliputra Industrial Area, Patna",
  );

export default function AboutView() {
  return (
    <div className="bg-white text-slate-900">
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative flex h-dvh min-h-[560px] items-center justify-center overflow-hidden px-6 text-center">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={HERO_IMG}
          src={HERO_VIDEO}
        />
        {/* Moderate dark overlay in the site's theme color (#05010f), covering
            the entire section end to end — dark enough for white text, not as
            heavy as a full scrim. */}
        <div className="absolute inset-0 bg-[#05010f]/45" />

        <div className="relative z-10 flex max-w-3xl flex-col items-center">
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)] sm:text-6xl">
            Bihar&apos;s most successful IT &amp; Management college.
          </h1>
          <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-white/85">
            Home to Bihar&apos;s highest placements and most gold medallists,
            with a premium campus in the heart of Patna.
          </p>
          <div className="mt-9 flex w-full max-w-md flex-col gap-3">
            <GetPassButton
              label="Apply Now"
              className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:bg-blue-700"
            />
            <a
              href={CCDTE_DIRECTIONS}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              Get Direction
            </a>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Approvals strip (MU MURecognised)                                 */}
      {/* ---------------------------------------------------------------- */}
      <div className="mu-root">
        <MURecognised />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Why CIMAGE — stats (MU bento masonry)                             */}
      {/* ---------------------------------------------------------------- */}
      <div className="mu-root">
        <MUStats />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Six reasons it works (MU .LearnApply sticky stack)                */}
      {/* ---------------------------------------------------------------- */}
      <div className="mu-root">
        <MUReasons />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* AI & Robotics (Physical AI)                                       */}
      {/* ---------------------------------------------------------------- */}
      <MUPhysicalAI />

      {/* ---------------------------------------------------------------- */}
      {/* Programmes (MU .ourProgramme)                                      */}
      {/* ---------------------------------------------------------------- */}
      <div className="mu-root">
        <MUPrograms />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Partnerships / Labs (MU card grid)                                */}
      {/* ---------------------------------------------------------------- */}
      <MULabs />

      {/* ---------------------------------------------------------------- */}
      {/* Campus events (Physical accordion widget)                         */}
      {/* ---------------------------------------------------------------- */}
      <MUCampus />

    </div>
  );
}
