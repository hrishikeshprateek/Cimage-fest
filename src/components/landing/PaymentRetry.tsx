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
import { rememberBuyer } from "@/lib/dataLayer";
import { inputCls, labelCls, submitCls, TicketCard } from "./form";

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
        // Carry what we know (phone, and a name if a status lookup ran) across
        // the gateway redirect for the purchase event on the success page.
        rememberBuyer({
          phone: cleanPhone,
          name: view.kind === "status" ? view.data.name ?? undefined : undefined,
        });
        // Fresh order → hand off to the gateway.
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

  if (view.kind === "pass") {
    return (
      <TicketCard title="Payment Complete">
        <div className="text-center">
          <p className="text-sm text-white/65">
            Your pass is {view.pass.status}. Save it — you&apos;ll need the QR at
            the gate.
          </p>
          <div className="mt-4 flex items-center justify-between rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-left">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/45">
              Pass Code
            </span>
            <span className="font-mono text-base font-bold tracking-wide text-white">
              {view.pass.code}
            </span>
          </div>
          {view.pass.s3_url && (
            <a
              href={view.pass.s3_url}
              target="_blank"
              rel="noreferrer"
              className={`mt-5 ${submitCls}`}
            >
              Download Pass (PDF)
            </a>
          )}
          <button
            type="button"
            onClick={reset}
            className="mt-3 w-full rounded-lg border border-white/15 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:text-white"
          >
            Check another number
          </button>
        </div>
      </TicketCard>
    );
  }

  return (
    <TicketCard
      title="Complete Your Payment"
      subtitle={
        <p className="text-sm leading-relaxed text-white/60">
          Already registered but payment didn&apos;t go through? Enter your phone
          to retry — as many times as you need.
        </p>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          retry();
        }}
      >
        <label className="block">
          <span className={labelCls}>Registered phone</span>
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
            className={inputCls}
          />
        </label>

        {/* Pending-status hint after a lookup */}
        {view.kind === "status" && (
          <div className="mt-4 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2.5 text-xs text-amber-200">
            {view.data.registered ? (
              <>
                Payment pending
                {view.data.amount ? ` · ₹${view.data.amount}` : ""}. Tap Retry
                Payment to continue.
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
          <p className="mt-3 rounded-md border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-300">
            {error}
          </p>
        )}

        <button type="submit" disabled={busy !== null} className={`mt-5 ${submitCls}`}>
          {busy === "retry" ? "Starting payment…" : "Retry Payment"}
        </button>
        <button
          type="button"
          onClick={check}
          disabled={busy !== null}
          className="mt-3 w-full rounded-lg border border-white/15 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:text-white disabled:opacity-60"
        >
          {busy === "lookup" ? "Checking…" : "Check status first"}
        </button>
      </form>
    </TicketCard>
  );
}
