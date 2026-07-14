"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { fest } from "@/lib/data";
import {
  BOARD_OPTIONS,
  getFestEvent,
  registerForFest,
  type FestEventInfo,
  type RegisterSuccess,
} from "@/lib/festApi";
import { rememberBuyer } from "@/lib/dataLayer";
import {
  Field,
  SelectField,
  FileField,
  DateSlotField,
  submitCls,
  TicketCard,
} from "./form";

type Slug = string;

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
};

const DEFAULT_TRIGGER_CLS = "btn-tech btn-tech-primary shrink-0";

export default function GetPassButton({
  slug = fest.passSlug,
  label = "Get Pass",
  className = DEFAULT_TRIGGER_CLS,
}: {
  slug?: Slug;
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>({ kind: "loading" });
  const [form, setForm] = useState(EMPTY_FORM);
  const [idCard, setIdCard] = useState<File | null>(null);
  const [slotIds, setSlotIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSlot = (id: string) =>
    setSlotIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
    );

  // Close on Escape and lock scroll while the popup is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Fetch the event each time the dialog opens. The "loading" reset happens in
  // the open handler so we don't setState synchronously inside the effect.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    getFestEvent(slug)
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
  }, [open, slug]);

  const openDialog = () => {
    setPhase({ kind: "loading" });
    setForm(EMPTY_FORM);
    setIdCard(null);
    setSlotIds([]);
    setError(null);
    setOpen(true);
  };

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
      const result = await registerForFest(slug, {
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

  const close = () => {
    setOpen(false);
    // Reset for next time once the fade is out of view.
    setForm(EMPTY_FORM);
    setIdCard(null);
    setSlotIds([]);
    setError(null);
  };

  return (
    <>
      <button type="button" onClick={openDialog} className={className}>
        {label}
      </button>

      {open && createPortal(
        <div
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto px-6 pt-10 pb-[calc(7rem+env(safe-area-inset-bottom))] md:pb-10"
          role="dialog"
          aria-modal="true"
          aria-label="Register for CIMAGE Fest"
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          <div className="animate-rise relative my-auto">
            {phase.kind === "loading" && (
              <TicketCard onClose={close} title="Loading…">
                <p className="text-center text-sm text-white/60">
                  Fetching registration details.
                </p>
              </TicketCard>
            )}

            {phase.kind === "closed" && (
              <TicketCard onClose={close} title="Registration Opens Soon">
                <p className="text-center text-sm leading-relaxed text-white/65">
                  Passes for CIMAGE Fest aren&apos;t live just yet. Check back
                  shortly — this is where you&apos;ll grab yours.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className={`mt-6 ${submitCls}`}
                >
                  Got it
                </button>
              </TicketCard>
            )}

            {phase.kind === "form" && (
              <TicketCard
                onClose={close}
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
                  <Field label="School / College" value={form.school_name} onChange={setField("school_name")} />

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
            )}

            {phase.kind === "done" && (
              <TicketCard onClose={close} title="You're In!">
                <div className="text-center">
                  <p className="text-sm text-white/65">
                    Your pass has been {phase.pass.status}. Save it — you&apos;ll
                    need the QR at the gate.
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
                  <button
                    type="button"
                    onClick={close}
                    className="mt-3 w-full rounded-lg border border-white/15 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </TicketCard>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
