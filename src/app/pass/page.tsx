import type { Metadata } from "next";
import TopBar from "@/components/landing/TopBar";
import PassHub from "@/components/landing/PassHub";

export const metadata: Metadata = {
  title: "Your Pass — CIMAGE Fest",
  description:
    "Claim your CIMAGE Fest hard pass by scanning its QR or entering the code, or complete a pending payment to collect your pass.",
};

export default function PassPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0a0716] px-6 pb-28 pt-28 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_38%,rgba(99,102,241,0.18),transparent_70%)]" />
      <div className="relative">
        <TopBar />
        <PassHub />
      </div>
    </main>
  );
}
