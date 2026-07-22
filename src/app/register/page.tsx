import type { Metadata } from "next";
import TopBar from "@/components/landing/TopBar";
import RegisterForm from "@/components/landing/RegisterForm";

export const metadata: Metadata = {
  title: "Register — CIMAGE Fest",
  description:
    "Register for the CIMAGE Weekend Fest and grab your pass — fill in your details and complete payment.",
};

export default function RegisterPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0a0716] px-6 pb-28 pt-28 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_38%,rgba(99,102,241,0.18),transparent_70%)]" />
      <div className="relative">
        <TopBar />
        <RegisterForm />
      </div>
    </main>
  );
}
