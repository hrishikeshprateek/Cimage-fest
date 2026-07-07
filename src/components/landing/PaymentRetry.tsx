"use client";

import { useState } from "react";
import Link from "next/link";
import { fest } from "@/lib/data";
import {
  lookupPayment,
  retryPayment,
  type PaymentLookup,
  type FestPass,
} from "@/lib/festApi";

type View =
  | { kind: "input" }
  | { kind: "status"; data: PaymentLookup }
  | { kind: "pass"; pass: FestPass };

const isTenDigits = (v: string) => /^\d{10}$/.test(v);

export default function PaymentRetry({ slug = fest.passSlug }: { slug?: string }) {
  const [phone, setPhone] = useState("");
  const [view, setView] = useState<View>({ kind: "input" });
  const [busy, setBusy] = useState<null | "lookup" | "retry">(null);
  const [error, setError] = useState<string | null>(null);

  const cleanPhone = phone.replace(/\D/g, "").slice(0, 10);

  const guardPhone = () => {
    if (!isTenDigits(cleanPhone)) {
      setError("Enter a valid 10-digit phone number.");
      return false;
    }
    setError(null);
    return true;
  };

  const check = async () => {
    if (busy || !guardPhone()) return;
    setBusy("lookup");
    setError(null);
    try {
      const data = await lookupPayment(slug, cleanPhone);
      if (data.paid && data.pass) setView({ kind: "pass", pass: data.pass });
      else setView({ kind: "status", data });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed.");
    } finally {
      setBusy(null);
    }
  };

  const retry = async () => {
    if (busy || !guardPhone()) return;
    setBusy("retry");
    setError(null);
    try {
      const result = await retryPayment(slug, cleanPhone);
      if (result.paid) {
        setView({ kind: "pass", pass: result.pass });
      } else {
        // Fresh ICICI order → hand off to the gateway.
        window.location.href = result.payment_url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start payment.");
    } finally {
      setBusy(null);
    }
  };

  const reset = () => {
    setView({ kind: "input" });
    setError(null);
  };

  return (
    <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-[#0b0518]/95 p-8 text-center shadow-2xl">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-cyan/30 bg-cyan/10 text-2xl">
        🎟️
      </div>

      {view.kind === "pass" ? (
        <>
          <h1 className="text-2xl font-black tracking-tight">
            <span className="text-gradient">Payment Complete</span>
          </h1>
          <p className="mt-3 text-sm text-white/65">
            Your pass is {view.pass.status}. Save it — you&apos;ll need the QR at
            the gate.
          </p>
          <div className="mt-4 rounded-xl border border-cyan/25 bg-cyan/5 px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">
              Pass Code
            </p>
            <p className="font-mono text-lg font-bold text-cyan">
              {view.pass.code}
            </p>
          </div>
          {view.pass.s3_url && (
            <a
              href={view.pass.s3_url}
              target="_blank"
              rel="noreferrer"
              className="mt-5 block w-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 py-3 font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              Download Pass (PDF)
            </a>
          )}
          <button
            type="button"
            onClick={reset}
            className="mt-3 w-full rounded-full border border-white/15 py-2.5 text-sm font-semibold text-white/80 hover:text-white"
          >
            Check another number
          </button>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-black tracking-tight">
            <span className="text-gradient">Complete Your Payment</span>
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Already registered but payment didn&apos;t go through? Enter your
            phone to retry — as many times as you need.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              retry();
            }}
            className="mt-6 text-left"
          >
            <label className="block">
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">
                Registered phone
              </span>
              <input
                value={phone}
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="10-digit number"
                maxLength={10}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                  setError(null);
                }}
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-cyan/60"
              />
            </label>

            {/* Pending-status hint after a lookup */}
            {view.kind === "status" && (
              <div className="mt-4 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2.5 text-xs text-amber-200">
                {view.data.registered ? (
                  <>
                    Payment pending
                    {view.data.amount ? ` · ₹${view.data.amount}` : ""}. Tap
                    Retry Payment to continue.
                  </>
                ) : (
                  <>
                    No registration found for this number.{" "}
                    <Link href="/" className="underline">
                      Register first
                    </Link>
                    .
                  </>
                )}
              </div>
            )}

            {error && (
              <p className="mt-3 text-xs font-medium text-rose-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={busy !== null}
              className="mt-5 w-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 py-3 font-semibold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy === "retry" ? "Starting payment…" : "Retry Payment"}
            </button>
            <button
              type="button"
              onClick={check}
              disabled={busy !== null}
              className="mt-3 w-full rounded-full border border-white/15 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:text-white disabled:opacity-60"
            >
              {busy === "lookup" ? "Checking…" : "Check status first"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
