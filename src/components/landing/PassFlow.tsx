"use client";

import { useState } from "react";
import PassCodeEntry from "./PassCodeEntry";
import PassView from "./PassView";

const COPY = {
  claim: {
    title: "Claim Your Pass",
    subtitle:
      "Scan your pass QR or enter its code to register your details and activate it.",
    cta: "Continue",
    back: "Claim another pass",
  },
  status: {
    title: "Check Pass Status",
    subtitle:
      "Scan your pass QR or enter its code to see whether it's valid, used, or not yet claimed.",
    cta: "Check Status",
    back: "Check another pass",
  },
} as const;

export default function PassFlow({ mode }: { mode: "claim" | "status" }) {
  const [token, setToken] = useState<string | null>(null);
  const c = COPY[mode];

  if (token) {
    return (
      <div className="flex w-full max-w-sm flex-col items-center gap-5">
        <PassView token={token} mode={mode} />
        <button
          type="button"
          onClick={() => setToken(null)}
          className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50 transition-colors hover:text-white"
        >
          ← {c.back}
        </button>
      </div>
    );
  }

  return (
    <PassCodeEntry
      title={c.title}
      subtitle={c.subtitle}
      cta={c.cta}
      onToken={setToken}
    />
  );
}
