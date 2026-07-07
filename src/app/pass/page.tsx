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
    <main className="relative flex min-h-dvh items-center justify-center bg-[#05010f] px-6 pb-28 pt-28 text-white">
      <TopBar />
      <PassHub />
    </main>
  );
}
