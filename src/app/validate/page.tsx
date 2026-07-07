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
    <main className="relative flex min-h-dvh items-center justify-center bg-[#05010f] px-6 pb-28 pt-28 text-white">
      <TopBar />
      <PassFlow mode="claim" />
    </main>
  );
}
