import Loader from "@/components/landing/Loader";
import CyberCity from "@/components/landing/CyberCity";
import VideoWall from "@/components/landing/VideoWall";
import TopBar from "@/components/landing/TopBar";
import SocialRail from "@/components/landing/SocialRail";
import FestWordmark from "@/components/landing/FestWordmark";
import ScrollToAdvance from "@/components/landing/ScrollToAdvance";

export default function Home() {
  return (
    <main
      id="top"
      className="relative h-dvh w-full overflow-hidden bg-[#05010f] text-white"
    >
      {/* Preload the hero poster so it's the LCP and paints immediately. */}
      <link
        rel="preload"
        as="image"
        href="/hero-poster.webp"
        fetchPriority="high"
      />
      {/* Fancy neon preloader — plays once, then reveals the site */}
      <Loader />

      {/* Cityscape as a fallback beneath the video wall */}
      <div className="absolute inset-0">
        <CyberCity />
      </div>

      {/* Tiled portrait video wall (LED-stage look) */}
      <VideoWall />

      {/* Chrome (SideNav is global, in the root layout) */}
      <TopBar />
      <SocialRail />

      {/* Centered branding with the fest logo */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <FestWordmark />
      </div>

      {/* Force-scroll-down → advance to the next page (/events) */}
      <ScrollToAdvance />
    </main>
  );
}
