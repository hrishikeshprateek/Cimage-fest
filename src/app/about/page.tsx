import type { Metadata } from "next";
import "../mu.css";
import AboutView from "@/components/landing/AboutView";

export const metadata: Metadata = {
  title: "About — CIMAGE",
  description:
    "About CIMAGE — Bihar's most successful IT & Management college. 17+ years, 13,500+ students placed, an IIT Bombay E-Yantra lab and a Wipro Centre of Excellence on campus.",
};

export default function AboutPage() {
  return (
    <main className="relative min-h-dvh bg-white text-slate-900">
      <AboutView />
    </main>
  );
}
