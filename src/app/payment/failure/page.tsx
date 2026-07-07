import type { Metadata } from "next";
import TopBar from "@/components/landing/TopBar";
import PaymentFailure from "@/components/landing/PaymentFailure";

export const metadata: Metadata = {
  title: "Payment Failed — CIMAGE Fest",
  description: "Your CIMAGE Fest payment didn't complete. Retry here.",
};

// Landed here by the backend 302 after ICICI verification:
//   /payment/failure?reason=<invalid_signature|not_found|processing_failed>&txn=<txn>
export default async function PaymentFailurePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0a0716] px-6 pb-28 pt-28 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_38%,rgba(244,63,94,0.14),transparent_70%)]" />
      <TopBar />
      <div className="relative">
        <PaymentFailure
          reason={one(sp.reason)}
          txn={one(sp.txn)}
          slug={one(sp.event)}
        />
      </div>
    </main>
  );
}
