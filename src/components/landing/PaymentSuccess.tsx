"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useState } from "react";
import { resolvePass, type PassResolution } from "@/lib/festApi";
import { submitCls, TicketCard } from "./form";

type State =
  | { kind: "loading" }
  | { kind: "resolved"; data: PassResolution }
  | { kind: "error"; message: string };

export default function PaymentSuccess({
  passCode,
  event,
  txn,
}: {
  passCode?: string;
  event?: string;
  txn?: string;
}) {
  const [state, setState] = useState<State>(
    passCode ? { kind: "loading" } : { kind: "error", message: "" },
  );

  const fetchPass = () => {
    if (!passCode) return;
    resolvePass(passCode)
      .then((data) => setState({ kind: "resolved", data }))
      .catch((err) =>
        setState({
          kind: "error",
          message:
            err instanceof Error ? err.message : "Could not load your pass.",
        }),
      );
  };

  // Manual retry (button): show the spinner again, then re-fetch.
  const load = () => {
    setState({ kind: "loading" });
    fetchPass();
  };

  useEffect(() => {
    fetchPass();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passCode]);

  const SuccessPill = (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-300">
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      Payment Successful
    </span>
  );

  const eventName =
    state.kind === "resolved" ? state.data.event.name : event ?? undefined;

  const subtitle = eventName ? (
    <div className="inline-flex max-w-full items-center gap-2 rounded-md border border-white/10 bg-black/25 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white/60">
      <span className="truncate">{eventName}</span>
      {state.kind === "resolved" && (
        <>
          <span className="text-white/25">·</span>
          <span className="truncate text-white/45">
            {state.data.event.venue}
          </span>
        </>
      )}
    </div>
  ) : null;

  let body;
  if (state.kind === "loading") {
    body = (
      <div className="py-4 text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-emerald-400" />
        <p className="text-sm text-white/60">Fetching your pass…</p>
      </div>
    );
  } else if (state.kind === "resolved") {
    const { pass } = state.data;
    body = (
      <div className="text-center">
        <p className="text-sm leading-relaxed text-white/65">
          You&apos;re in! Save your pass — you&apos;ll need the QR at the gate.
        </p>

        {pass.png_s3_url && (
          <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-black/20 p-2">
            <img
              src={pass.png_s3_url}
              alt={`Pass ${pass.code}`}
              className="w-full rounded-lg"
            />
          </div>
        )}

        <div className="mt-5 flex items-center justify-between rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-left">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/45">
            Pass Code
          </span>
          <span className="font-mono text-base font-bold tracking-wide text-white">
            {pass.code}
          </span>
        </div>

        {(pass.s3_url || pass.png_s3_url) && (
          <a
            href={pass.s3_url || pass.png_s3_url}
            target="_blank"
            rel="noreferrer"
            className={`mt-5 ${submitCls}`}
          >
            Download Pass
          </a>
        )}

        <Link
          href="/"
          className="mt-3 block w-full rounded-lg border border-white/15 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:text-white"
        >
          Back to Home
        </Link>

        {txn && (
          <p className="mt-4 font-mono text-[10px] tracking-wide text-white/30">
            Txn {txn}
          </p>
        )}
      </div>
    );
  } else {
    // Payment succeeded on the gateway, but we couldn't load the pass here.
    body = (
      <div className="text-center">
        <p className="text-sm leading-relaxed text-white/65">
          Your payment went through. We couldn&apos;t load your pass on this
          page just yet — you can retrieve it by its code or phone number.
        </p>

        {passCode && (
          <div className="mt-5 flex items-center justify-between rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-left">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/45">
              Pass Code
            </span>
            <span className="font-mono text-base font-bold tracking-wide text-white">
              {passCode}
            </span>
          </div>
        )}

        {passCode && (
          <button type="button" onClick={load} className={`mt-5 ${submitCls}`}>
            Retry
          </button>
        )}
        <Link
          href="/validate"
          className="mt-3 block w-full rounded-lg border border-white/15 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:text-white"
        >
          Retrieve My Pass
        </Link>

        {txn && (
          <p className="mt-4 font-mono text-[10px] tracking-wide text-white/30">
            Txn {txn}
          </p>
        )}
      </div>
    );
  }

  return (
    <TicketCard pill={SuccessPill} title="Payment Successful" subtitle={subtitle}>
      {body}
    </TicketCard>
  );
}
