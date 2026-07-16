"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fest } from "@/lib/data";
import { getFestEvent, type FestEventInfo } from "@/lib/festApi";
import { submitCls, TicketCard } from "./form";
import GetPassButton from "./GetPassButton";

// Non-CIMAGE ("outside") students register against their own backend event, so
// the fee and the registration list stay separate from the main fest. The form
// itself is the shared one — only the slug differs.
const OUTSIDER_SLUG = fest.outsiderPassSlug;

type State =
  | { kind: "loading" }
  | { kind: "closed" } // inactive / not found
  | { kind: "ready"; event: FestEventInfo };

function formatRange(startsAt: string | null, endsAt: string | null) {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  if (!startsAt || !endsAt) return null;
  return `${fmt(startsAt)} – ${fmt(endsAt)}`;
}

export default function OutsiderRegister() {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    getFestEvent(OUTSIDER_SLUG)
      .then((event) => {
        if (cancelled) return;
        setState(
          event && event.is_active ? { kind: "ready", event } : { kind: "closed" },
        );
      })
      .catch(() => {
        if (!cancelled) setState({ kind: "closed" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.kind === "loading") {
    return (
      <TicketCard title="Loading…">
        <p className="text-center text-sm text-white/60">
          Fetching registration details.
        </p>
      </TicketCard>
    );
  }

  if (state.kind === "closed") {
    return (
      <TicketCard title="Registration Opens Soon">
        <p className="text-center text-sm leading-relaxed text-white/65">
          Passes aren&apos;t live just yet. Check back shortly — this is where
          you&apos;ll grab yours.
        </p>
        <Link
          href="/"
          className="mt-6 block w-full rounded-lg border border-white/15 py-2.5 text-center text-sm font-semibold text-white/80 transition-colors hover:text-white"
        >
          Back to Home
        </Link>
      </TicketCard>
    );
  }

  const { event } = state;
  const range = formatRange(event.starts_at, event.ends_at);

  return (
    <TicketCard
      pill={
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-cyan-300">
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          Other Participants
        </span>
      }
      title="Register for the Fest"
      subtitle={
        <div className="inline-flex max-w-full items-center gap-2 rounded-md border border-white/10 bg-black/25 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white/60">
          <span className="truncate">{event.name}</span>
          <span className="text-white/25">·</span>
          <span className="truncate text-white/45">{event.venue}</span>
        </div>
      }
    >
      <div className="text-center">
        <p className="text-sm leading-relaxed text-white/65">
          Not from the 2025, 2026 or 2027 batch? You&apos;re still invited —
          register here to grab your Weekend Fest pass.
        </p>

        <dl className="mt-5 space-y-2.5">
          {range && (
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-left">
              <dt className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/45">
                Dates
              </dt>
              <dd className="text-sm font-semibold text-white">{range}</dd>
            </div>
          )}
          {event.requires_payment && (
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-left">
              <dt className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/45">
                Entry Fee
              </dt>
              <dd className="font-mono text-base font-bold tracking-wide text-white">
                {event.currency} {event.amount}
              </dd>
            </div>
          )}
        </dl>

        {/* Same registration form as the main fest — only the slug (and so the
            event + its fee) differs. */}
        <GetPassButton
          slug={OUTSIDER_SLUG}
          label={
            event.requires_payment
              ? `Register — ${event.currency} ${event.amount}`
              : "Register Now"
          }
          className={`mt-5 ${submitCls}`}
        />

        <Link
          href="/"
          className="mt-3 block w-full rounded-lg border border-white/15 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:text-white"
        >
          Back to Home
        </Link>
      </div>
    </TicketCard>
  );
}
