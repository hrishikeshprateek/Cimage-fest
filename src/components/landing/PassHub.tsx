"use client";

import { useState } from "react";
import PaymentRetry from "./PaymentRetry";
import PassFlow from "./PassFlow";

type Tab = "claim" | "status" | "pay";

const TABS: [Tab, string][] = [
  ["claim", "Claim"],
  ["status", "Status"],
  ["pay", "Payment"],
];

export default function PassHub() {
  const [tab, setTab] = useState<Tab>("claim");

  return (
    <div className="w-full max-w-sm">
      <div className="mb-2 text-center">
        <p className="mt-1 text-xs text-white/50">
          Claim a hard pass, check its status, or complete a payment.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="my-5 flex rounded-full border border-white/15 bg-white/5 p-1 text-xs font-semibold uppercase tracking-[0.1em]">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex-1 rounded-full py-2 transition-colors ${
              tab === key
                ? "bg-gradient-to-r from-violet-500 to-cyan-500 text-white"
                : "text-white/55 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "claim" && <PassFlow mode="claim" />}
      {tab === "status" && <PassFlow mode="status" />}
      {tab === "pay" && <PaymentRetry />}
    </div>
  );
}
