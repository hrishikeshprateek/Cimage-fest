import type { Metadata } from "next";
import TopBar from "@/components/landing/TopBar";
import PassFlow from "@/components/landing/PassFlow";

export const metadata: Metadata = {
  title: "Validate Pass — CIMAGE Fest",
  description:
    "Check the status of your CIMAGE Fest pass and claim it — enter your pass code or paste the QR link.",
};

export default function ValidatePage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0a0716] px-6 pb-28 pt-28 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_38%,rgba(99,102,241,0.18),transparent_70%)]" />
      <TopBar />
      <div className="relative">
        <PassFlow mode="claim" />
      </div>
    </main>
  );
}
