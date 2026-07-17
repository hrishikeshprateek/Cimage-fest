"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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

type Slug = string;

type Phase =
  | { kind: "choose" } // pick CIMAGE vs outside student (main pass only)
  | { kind: "loading" }
  | { kind: "closed" } // event inactive / not found
  | { kind: "form"; event: FestEventInfo }
  | { kind: "done"; pass: RegisterSuccess["pass"] };

// Who's registering — each option is just a different backend event (and so a
// different fee). The form itself is identical for both.
const AUDIENCES = [
  {
    slug: fest.passSlug,
    title: "2025, 2026 or 2027 Batch",
    desc: "Passed out in one of these batches",
  },
  {
    slug: fest.outsiderPassSlug,
    title: "Any Other Participant",
    desc: "Everyone else",
  },
];

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
  // Which event we're actually registering against. Null while the audience
  // chooser is up; otherwise the slug we fetch + submit to.
  const [chosenSlug, setChosenSlug] = useState<string | null>(null);
  const [audienceInfo, setAudienceInfo] = useState<
    Record<string, FestEventInfo | null>
  >({});

  // Only the main fest pass offers the CIMAGE/outside choice — activity-specific
  // buttons (which pass their own slug) go straight to their form as before.
  const showChooser = slug === fest.passSlug;
  const activeSlug = chosenSlug ?? slug;

  // Single-select: picking a day replaces the previous one; clicking the
  // selected day again clears it.
  const toggleSlot = (id: string) =>
    setSlotIds((ids) => (ids[0] === id ? [] : [id]));

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

  // Fetch the chosen event. The "loading" reset happens in the open/choose
  // handlers so we don't setState synchronously inside the effect.
  useEffect(() => {
    if (!open || !chosenSlug) return;
    let cancelled = false;
    getFestEvent(chosenSlug)
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
  }, [open, chosenSlug]);

  // While the chooser is up, pull both events so each option can show its fee.
  useEffect(() => {
    if (!open || !showChooser) return;
    let cancelled = false;
    AUDIENCES.forEach((a) => {
      getFestEvent(a.slug)
        .then((event) => {
          if (!cancelled) {
            setAudienceInfo((m) => ({ ...m, [a.slug]: event }));
          }
        })
        .catch(() => {
          // fee just won't show for that option
        });
    });
    return () => {
      cancelled = true;
    };
  }, [open, showChooser]);

  const openDialog = () => {
    // Main pass → ask who's registering first; activity buttons → straight in.
    setChosenSlug(showChooser ? null : slug);
    setPhase(showChooser ? { kind: "choose" } : { kind: "loading" });
    setForm(EMPTY_FORM);
    setIdCard(null);
    setSlotIds([]);
    setError(null);
    setOpen(true);
  };

  const chooseAudience = (s: string) => {
    setChosenSlug(s);
    setPhase({ kind: "loading" });
  };

  const backToChooser = () => {
    setChosenSlug(null);
    setSlotIds([]);
    setError(null);
    setPhase({ kind: "choose" });
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
      const result = await registerForFest(activeSlug, {
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

  const close = () => {
    setOpen(false);
    // Reset for next time once the fade is out of view.
    setForm(EMPTY_FORM);
    setIdCard(null);
    setSlotIds([]);
    setChosenSlug(null);
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
            {phase.kind === "choose" && (
              <TicketCard onClose={close} title="Who's Registering?">
                <p className="text-center text-sm leading-relaxed text-white/65">
                  Pick the one that applies to you — each has its own pass.
                </p>
                <div className="mt-5 space-y-3">
                  {AUDIENCES.map((a) => {
                    const info = audienceInfo[a.slug];
                    return (
                      <button
                        key={a.slug}
                        type="button"
                        onClick={() => chooseAudience(a.slug)}
                        className="flex w-full items-center justify-between gap-3 rounded-lg border border-white/15 bg-white/[0.05] px-4 py-3.5 text-left transition hover:border-indigo-400/70 hover:bg-white/[0.09]"
                      >
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-white">
                            {a.title}
                          </span>
                          <span className="block text-xs text-white/50">
                            {a.desc}
                          </span>
                        </span>
                        <span className="flex shrink-0 items-center gap-2">
                          {info?.requires_payment && (
                            <span className="font-mono text-sm font-bold text-white">
                              ₹{info.amount}
                            </span>
                          )}
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </TicketCard>
            )}

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

                {showChooser && (
                  <button
                    type="button"
                    onClick={backToChooser}
                    className="mt-3 block w-full text-center text-xs font-medium text-white/45 transition-colors hover:text-cyan"
                  >
                    ← Not you? Change
                  </button>
                )}

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
