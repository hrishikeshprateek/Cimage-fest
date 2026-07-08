import type { Metadata } from "next";
import TopBar from "@/components/landing/TopBar";
import AboutView from "@/components/landing/AboutView";

export const metadata: Metadata = {
  title: "About — CIMAGE Fest",
  description:
    "About CIMAGE — Bihar's most successful IT & Management college. 17+ years, 13,500+ alumni placed, and a group of four campuses built on Knowledge, Skill, Success.",
};

export default function AboutPage() {
  return (
    <main className="relative min-h-dvh bg-[#05010f] text-white">
      <TopBar />
      <AboutView />
    </main>
  );
}
