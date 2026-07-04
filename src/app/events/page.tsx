import type { Metadata } from "next";
import TopBar from "@/components/landing/TopBar";
import ImmersiveEvents from "@/components/landing/ImmersiveEvents";

export const metadata: Metadata = {
  title: "Events — CIMAGE Fest",
  description:
    "Journey through every competition at CIMAGE Fest in one immersive full-scroll reel — hackathons, robotics, esports, business and cultural events.",
};

export default function EventsPage() {
  return (
    <main className="relative h-dvh overflow-hidden bg-[#05010f] text-white">
      <TopBar />
      <ImmersiveEvents />
    </main>
  );
}
