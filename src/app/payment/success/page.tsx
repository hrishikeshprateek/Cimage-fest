import type { Metadata } from "next";
import TopBar from "@/components/landing/TopBar";
import PaymentSuccess from "@/components/landing/PaymentSuccess";

export const metadata: Metadata = {
  title: "Payment Successful — CIMAGE Fest",
  description: "Your CIMAGE Fest payment is complete. Grab your pass here.",
};

// Landed here by the backend 302 after ICICI verification:
//   /payment/success?event=<slug>&pass_code=<code>&txn=<txn>
export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0a0716] px-6 pb-28 pt-28 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_38%,rgba(16,185,129,0.16),transparent_70%)]" />
      <TopBar />
      <div className="relative">
        <PaymentSuccess
          passCode={one(sp.pass_code)}
          event={one(sp.event)}
          txn={one(sp.txn)}
        />
      </div>
    </main>
  );
}
