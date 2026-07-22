"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fest } from "@/lib/data";
import {
  BOARD_OPTIONS,
  COLLEGE_OPTIONS,
  getFestEvent,
  registerForFest,
  type FestEventInfo,
  type RegisterSuccess,
} from "@/lib/festApi";
import { rememberBuyer } from "@/lib/dataLayer";
import { getUtm } from "@/lib/utm";
import {
  Field,
  SelectField,
  FileField,
  DateSlotField,
  submitCls,
  TicketCard,
} from "./form";

// Full-page version of the registration form for the ₹100 pass (the main
// weekend-fest event). Same fields / validation / UTM / payment handoff as the
// GetPassButton dialog — just rendered inline on /register instead of a popup,
// and fixed to one event (no audience chooser).
const SLUG = fest.passSlug;

type Phase =
  | { kind: "loading" }
  | { kind: "closed" } // event inactive / not found
  | { kind: "form"; event: FestEventInfo }
  | { kind: "done"; pass: RegisterSuccess["pass"] };

const COURSE_OPTIONS = ["BCA", "BBA", "BCom(P)", "MCA", "MBA", "BTech", "BSC"];

const EMPTY_FORM = {
  name: "",
  phone: "",
  email: "",
  board: "",
  course: "",
  school_name: "",
  city: "",
  college_code: "",
  student_id: "",
};

export default function RegisterForm() {
  const [phase, setPhase] = useState<Phase>({ kind: "loading" });
  const [form, setForm] = useState(EMPTY_FORM);
  const [idCard, setIdCard] = useState<File | null>(null);
  const [slotIds, setSlotIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Single-select: picking a day replaces the previous one; clicking the
  // selected day again clears it.
  const toggleSlot = (id: string) =>
    setSlotIds((ids) => (ids[0] === id ? [] : [id]));

  // Fetch the event once on mount.
  useEffect(() => {
    let cancelled = false;
    getFestEvent(SLUG)
      .then((event) => {
        if (cancelled) return;
        setPhase(
          event && event.is_active
            ? { kind: "form", event }
            : { kind: "closed" },
        );
      })
      .catch(() => {
        if (!cancelled) setPhase({ kind: "closed" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setField = (k: keyof typeof EMPTY_FORM) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phase.kind !== "form" || submitting) return;
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Name and phone are required.");
      return;
    }
    // Require a day when the event has open slots to choose from.
    const openSlots = (phase.event.date_slots ?? []).filter((s) => s.selectable);
    if (openSlots.length && slotIds.length === 0) {
      setError("Please select at least one date to attend.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = await registerForFest(SLUG, {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        board: form.board || undefined,
        course: form.course.trim() || undefined,
        school_name: form.school_name.trim() || undefined,
        city: form.city.trim() || undefined,
        college_code: form.college_code || undefined,
        student_id: form.student_id.trim() || undefined,
        id_card: idCard,
        date_slots: slotIds.length ? slotIds : undefined,
        utm: getUtm(),
        extra: {},
      });
      if (result.requires_payment) {
        // Carry the buyer's details across the gateway redirect so the
        // payment-success page can attach them to the GA4 purchase event.
        rememberBuyer({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
        });
        // Hand off to the payment gateway.
        window.location.href = result.payment_url;
        return;
      }
      setPhase({ kind: "done", pass: result.pass });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (phase.kind === "loading") {
    return (
      <TicketCard title="Loading…">
        <p className="text-center text-sm text-white/60">
          Fetching registration details.
        </p>
      </TicketCard>
    );
  }

  if (phase.kind === "closed") {
    return (
      <TicketCard title="Registration Opens Soon">
        <p className="text-center text-sm leading-relaxed text-white/65">
          Passes for CIMAGE Fest aren&apos;t live just yet. Check back shortly —
          this is where you&apos;ll grab yours.
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

  if (phase.kind === "done") {
    return (
      <TicketCard title="You're In!">
        <div className="text-center">
          <p className="text-sm text-white/65">
            Your pass has been {phase.pass.status}. Save it — you&apos;ll need
            the QR at the gate.
          </p>
          <div className="mt-4 flex items-center justify-between rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-left">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/45">
              Pass Code
            </span>
            <span className="font-mono text-base font-bold tracking-wide text-white">
              {phase.pass.code}
            </span>
          </div>
          <a
            href={phase.pass.s3_url}
            target="_blank"
            rel="noreferrer"
            className={`mt-5 ${submitCls}`}
          >
            Download Pass (PDF)
          </a>
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

  return (
    <TicketCard
      title="Claim Your Pass"
      subtitle={
        <div className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-black/25 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white/60">
          <span className="truncate">{phase.event.name}</span>
          {phase.event.requires_payment && (
            <>
              <span className="text-white/25">·</span>
              <span className="text-white/70">
                {phase.event.currency} {phase.event.amount}
              </span>
            </>
          )}
        </div>
      }
    >
      <form onSubmit={submit} className="space-y-3.5 text-left">
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
          <div className="flex-1">
            <SelectField label="Course Interested" value={form.course} onChange={setField("course")}>
              <option value="" className="bg-[#0e0a1a]">Select course</option>
              {COURSE_OPTIONS.map((c) => (
                <option key={c} value={c} className="bg-[#0e0a1a]">
                  {c}
                </option>
              ))}
            </SelectField>
          </div>
          <div className="flex-1">
            <Field label="City" value={form.city} onChange={setField("city")} />
          </div>
        </div>
        <Field label="School / College / Institute" value={form.school_name} onChange={setField("school_name")} />

        {!!phase.event.date_slots?.length && (
          <DateSlotField
            slots={phase.event.date_slots}
            selected={slotIds}
            onToggle={toggleSlot}
          />
        )}

        <FileField
          label="ID Card"
          cta="Upload ID card"
          accept="image/jpeg,image/png,application/pdf"
          file={idCard}
          onFile={setIdCard}
        />

        {/* Referral — optional */}
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3.5">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.13em] text-white/70">
            Referral{" "}
            <span className="tracking-normal lowercase text-white/45">
              (optional)
            </span>
          </p>
          <div className="flex gap-3">
            <div className="flex-1">
              <SelectField label="College" value={form.college_code} onChange={setField("college_code")}>
                <option value="" className="bg-[#0e0a1a]">Select college</option>
                {COLLEGE_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value} className="bg-[#0e0a1a]">
                    {c.label}
                  </option>
                ))}
              </SelectField>
            </div>
            <div className="flex-1">
              <Field
                label="Student ID"
                value={form.student_id}
                onChange={(v) => setForm((f) => ({ ...f, student_id: v.replace(/\D/g, "").slice(0, 5) }))}
                inputMode="numeric"
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="rounded-md border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-300">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting} className={`mt-2 ${submitCls}`}>
          {submitting
            ? "Please wait…"
            : phase.event.requires_payment
              ? "Proceed to Payment"
              : "Get My Pass"}
        </button>
      </form>

      {phase.event.requires_payment && (
        <a
          href="/pass"
          className="mt-4 block text-center text-xs font-medium text-white/45 transition-colors hover:text-cyan"
        >
          Already registered? Complete payment →
        </a>
      )}
    </TicketCard>
  );
}
