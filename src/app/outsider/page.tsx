import type { Metadata } from "next";
import TopBar from "@/components/landing/TopBar";
import OutsiderRegister from "@/components/landing/OutsiderRegister";

export const metadata: Metadata = {
  title: "Outside Student Registration — CIMAGE Fest",
  description:
    "Not a CIMAGE student? Register here for the CIMAGE Weekend Fest and grab your pass.",
};

export default function OutsiderPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0a0716] px-6 pb-28 pt-28 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_38%,rgba(34,211,238,0.16),transparent_70%)]" />
      <div className="relative">
        <TopBar />
        <OutsiderRegister />
      </div>
    </main>
  );
}
