"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, type ReactNode } from "react";
import {
  resolvePass,
  claimPass,
  BOARD_OPTIONS,
  type PassResolution,
  type FestPassDetail,
} from "@/lib/festApi";
import {
  Field,
  SelectField,
  FileField,
  DateSlotField,
  submitCls,
  TicketCard,
} from "./form";

type State =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "resolved"; data: PassResolution };

const EMPTY_FORM = {
  name: "",
  phone: "",
  email: "",
  board: "",
  course: "",
  school_name: "",
  city: "",
};

// Status → pill label + colour.
function statusPill(status: string) {
  switch (status) {
    case "claimed":
      return { label: "Valid Pass", cls: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" };
    case "used":
      return { label: "Already Used", cls: "border-amber-400/30 bg-amber-400/10 text-amber-300" };
    case "cancelled":
      return { label: "Cancelled", cls: "border-rose-500/30 bg-rose-500/10 text-rose-300" };
    case "blank":
      return { label: "Unclaimed", cls: "border-sky-400/30 bg-sky-400/10 text-sky-300" };
    default:
      return { label: status, cls: "border-white/20 bg-white/10 text-white/70" };
  }
}

function Pill({ status }: { status: string }) {
  const p = statusPill(status);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] ${p.cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {p.label}
    </span>
  );
}

function EventChip({ name, venue }: { name: string; venue: string }) {
  return (
    <div className="inline-flex max-w-full items-center gap-2 rounded-md border border-white/10 bg-black/25 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white/60">
      <span className="truncate">{name}</span>
      <span className="text-white/25">·</span>
      <span className="truncate text-white/45">{venue}</span>
    </div>
  );
}

export default function PassView({
  token,
  mode = "claim",
}: {
  token: string;
  mode?: "claim" | "status";
}) {
  const [state, setState] = useState<State>({ kind: "loading" });
  const [form, setForm] = useState(EMPTY_FORM);
  const [idCard, setIdCard] = useState<File | null>(null);
  const [slotIds, setSlotIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSlot = (id: string) =>
    setSlotIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
    );

  const fetchPass = () =>
    resolvePass(token)
      .then((data) => setState({ kind: "resolved", data }))
      .catch((err) =>
        setState({
          kind: "error",
          message:
            err instanceof Error ? err.message : "Could not resolve this pass.",
        }),
      );

  const load = () => {
    setState({ kind: "loading" });
    void fetchPass();
  };

  useEffect(() => {
    void fetchPass();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const setField = (k: keyof typeof EMPTY_FORM) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const claim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.kind !== "resolved" || submitting) return;
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Name and phone are required.");
      return;
    }
    // Require a day when the event has open slots to choose from.
    const openSlots = (state.data.event.date_slots ?? []).filter(
      (s) => s.selectable,
    );
    if (openSlots.length && slotIds.length === 0) {
      setError("Please select at least one date to attend.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const pass: FestPassDetail = await claimPass(token, {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        board: form.board || undefined,
        course: form.course.trim() || undefined,
        school_name: form.school_name.trim() || undefined,
        city: form.city.trim() || undefined,
        id_card: idCard,
        date_slots: slotIds.length ? slotIds : undefined,
        extra: {},
      });
      setState({
        kind: "resolved",
        data: { needs_claim: false, event: state.data.event, pass },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Claim failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const requiresIdCard =
    state.kind === "resolved" &&
    (state.data.event as { requires_id_card?: boolean }).requires_id_card;

  // Compute the ticket header + body for the current state.
  let pill: ReactNode = null;
  let title: ReactNode = null;
  let subtitle: ReactNode = null;
  let body: ReactNode = null;

  if (state.kind === "loading") {
    body = (
      <div className="py-4 text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-violet-400" />
        <p className="text-sm text-white/60">Resolving pass…</p>
      </div>
    );
  } else if (state.kind === "error") {
    pill = <Pill status="cancelled" />;
    title = "Pass Not Found";
    body = (
      <div className="text-center">
        <p className="text-sm text-white/60">{state.message}</p>
        <button
          type="button"
          onClick={load}
          className="mt-6 w-full rounded-lg border border-white/15 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/5 hover:text-white"
        >
          Try Again
        </button>
      </div>
    );
  } else {
    const { event, pass, needs_claim } = state.data;
    subtitle = <EventChip name={event.name} venue={event.venue} />;

    if (mode === "status" && needs_claim) {
      pill = <Pill status="blank" />;
      title = "Not Yet Claimed";
      body = (
        <p className="text-center text-sm leading-relaxed text-white/60">
          This pass is still blank. Head to{" "}
          <span className="font-semibold text-cyan">Claim</span> to register your
          details and activate it.
        </p>
      );
    } else if (mode === "claim" && needs_claim) {
      pill = <Pill status="blank" />;
      title = "Claim Your Pass";
      body = (
        <form onSubmit={claim} className="space-y-3.5">
          <Field label="Full name" value={form.name} onChange={setField("name")} autoComplete="name" required />
          <Field label="Phone" value={form.phone} onChange={setField("phone")} type="tel" inputMode="numeric" autoComplete="tel" required />
          <Field label="Email" value={form.email} onChange={setField("email")} type="email" autoComplete="email" />

          <SelectField label="Board" value={form.board} onChange={setField("board")}>
            <option value="" className="bg-[#0e0a1a]">Select board (optional)</option>
            {BOARD_OPTIONS.map((b) => (
              <option key={b.value} value={b.value} className="bg-[#0e0a1a]">
                {b.label}
              </option>
            ))}
          </SelectField>

          <div className="flex gap-3">
            <Field label="Course" value={form.course} onChange={setField("course")} />
            <Field label="City" value={form.city} onChange={setField("city")} />
          </div>
          <Field label="School / College" value={form.school_name} onChange={setField("school_name")} />

          {!!state.data.event.date_slots?.length && (
            <DateSlotField
              slots={state.data.event.date_slots}
              selected={slotIds}
              onToggle={toggleSlot}
            />
          )}

          <FileField
            label="ID Card"
            cta="Upload ID card"
            accept="image/jpeg,image/png,application/pdf"
            required={!!requiresIdCard}
            file={idCard}
            onFile={setIdCard}
          />

          {error && (
            <p className="rounded-md border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-300">
              {error}
            </p>
          )}

          <button type="submit" disabled={submitting} className={`mt-2 ${submitCls}`}>
            {submitting ? "Validating…" : "Validate & Claim"}
          </button>
        </form>
      );
    } else {
      pill = <Pill status={pass.status} />;
      title = pass.registration_name ? `Hi, ${pass.registration_name}` : "Your Pass";
      body = (
        <div className="text-center">
          {pass.png_s3_url && (
            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20 p-2">
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
        </div>
      );
    }
  }

  return (
    <TicketCard pill={pill} title={title} subtitle={subtitle}>
      {body}
    </TicketCard>
  );
}
