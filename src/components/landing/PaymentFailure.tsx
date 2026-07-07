"use client";

import PaymentRetry from "./PaymentRetry";

// Backend reason codes → human copy.
const REASONS: Record<string, string> = {
  invalid_signature:
    "We couldn't verify the payment response. If money was deducted, it will be auto-refunded — retry below.",
  not_found:
    "We couldn't find a matching registration for this payment. Enter your phone to look it up and retry.",
  processing_failed:
    "The payment didn't go through. No pass was issued — you can retry safely.",
};

export default function PaymentFailure({
  reason,
  txn,
  slug,
}: {
  reason?: string;
  txn?: string;
  slug?: string;
}) {
  const message =
    (reason && REASONS[reason]) ||
    "Your payment didn't complete. No pass was issued — you can retry safely.";

  return (
    <div className="w-full max-w-sm">
      <div className="mb-5 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-rose-300">
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          Payment Failed
        </span>
        <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-white/65">
          {message}
        </p>
        {txn && (
          <p className="mt-3 font-mono text-[10px] tracking-wide text-white/30">
            Txn {txn}
          </p>
        )}
      </div>

      <PaymentRetry slug={slug} />
    </div>
  );
}
