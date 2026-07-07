"use client";

import { useEffect, useState } from "react";
import { fest } from "@/lib/data";
import {
  BOARD_OPTIONS,
  getFestEvent,
  registerForFest,
  type FestEventInfo,
  type RegisterSuccess,
} from "@/lib/festApi";

type Slug = string;

type Phase =
  | { kind: "loading" }
  | { kind: "closed" } // event inactive / not found
  | { kind: "form"; event: FestEventInfo }
  | { kind: "done"; pass: RegisterSuccess["pass"] };

const EMPTY_FORM = {
  name: "",
  phone: "",
  email: "",
  board: "",
  course: "",
  school_name: "",
  city: "",
};

export default function GetPassButton({ slug = fest.passSlug }: { slug?: Slug }) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>({ kind: "loading" });
  const [form, setForm] = useState(EMPTY_FORM);
  const [idCard, setIdCard] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        extra: {},
      });
      if (result.requires_payment) {
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
    setError(null);
  };

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className="shrink-0 rounded-md bg-gradient-to-r from-violet-600 to-violet-500 px-5 py-2 font-mono text-sm font-bold uppercase tracking-[0.15em] text-white shadow-lg shadow-violet-600/40 transition-transform hover:scale-105"
      >
        Get Pass
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Register for CIMAGE Fest"
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Card */}
          <div className="animate-rise relative max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-2xl border border-white/15 bg-[#0b0518]/95 p-8 text-center shadow-2xl">
            <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 animate-glow rounded-full bg-violet-600/40 blur-3xl" />

            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="absolute right-4 top-4 z-10 text-white/50 transition-colors hover:text-white"
            >
              ✕
            </button>

            <div className="relative">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-cyan/30 bg-cyan/10 text-2xl">
                🎟️
              </div>

              {phase.kind === "loading" && (
                <>
                  <h2 className="text-xl font-black tracking-tight text-white">
                    Loading…
                  </h2>
                  <p className="mt-3 text-sm text-white/60">
                    Fetching registration details.
                  </p>
                </>
              )}

              {phase.kind === "closed" && (
                <>
                  <h2 className="text-2xl font-black tracking-tight">
                    <span className="text-gradient">
                      Registration Opens Soon
                    </span>
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">
                    Passes for CIMAGE Fest aren&apos;t live just yet. Check back
                    shortly — this is where you&apos;ll grab yours.
                  </p>
                  <button
                    type="button"
                    onClick={close}
                    className="mt-6 w-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 py-3 font-semibold text-white transition-transform hover:scale-[1.02]"
                  >
                    Got it
                  </button>
                </>
              )}

              {phase.kind === "form" && (
                <>
                  <h2 className="text-2xl font-black tracking-tight">
                    <span className="text-gradient">{phase.event.name}</span>
                  </h2>
                  <p className="mt-2 text-xs uppercase tracking-[0.15em] text-white/55">
                    {phase.event.venue}
                    {phase.event.requires_payment && (
                      <>
                        {" · "}
                        {phase.event.currency} {phase.event.amount}
                      </>
                    )}
                  </p>

                  <form onSubmit={submit} className="mt-5 space-y-3 text-left">
                    <Field
                      label="Full name *"
                      value={form.name}
                      onChange={setField("name")}
                      autoComplete="name"
                      required
                    />
                    <Field
                      label="Phone *"
                      value={form.phone}
                      onChange={setField("phone")}
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      required
                    />
                    <Field
                      label="Email"
                      value={form.email}
                      onChange={setField("email")}
                      type="email"
                      autoComplete="email"
                    />
                    {/* Education board dropdown */}
                    <label className="block">
                      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">
                        Board
                      </span>
                      <select
                        value={form.board}
                        onChange={(e) => setField("board")(e.target.value)}
                        className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-cyan/60"
                      >
                        <option value="" className="bg-[#0b0518]">
                          Select board (optional)
                        </option>
                        {BOARD_OPTIONS.map((b) => (
                          <option
                            key={b.value}
                            value={b.value}
                            className="bg-[#0b0518]"
                          >
                            {b.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="flex gap-3">
                      <Field
                        label="Course"
                        value={form.course}
                        onChange={setField("course")}
                      />
                      <Field
                        label="City"
                        value={form.city}
                        onChange={setField("city")}
                      />
                    </div>
                    <Field
                      label="School / College"
                      value={form.school_name}
                      onChange={setField("school_name")}
                    />

                    {/* ID card upload (optional) */}
                    <label className="block">
                      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">
                        ID Card (jpg / png / pdf)
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,application/pdf"
                        onChange={(e) => setIdCard(e.target.files?.[0] ?? null)}
                        className="w-full rounded-lg border border-white/15 bg-white/5 text-sm text-white/80 outline-none transition-colors file:mr-3 file:cursor-pointer file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-wide file:text-cyan focus:border-cyan/60"
                      />
                      {idCard && (
                        <span className="mt-1 block truncate text-[11px] text-white/50">
                          {idCard.name}
                        </span>
                      )}
                    </label>

                    {error && (
                      <p className="text-xs font-medium text-rose-400">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="mt-2 w-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 py-3 font-semibold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                    >
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
                      className="mt-4 block text-xs font-medium text-white/45 transition-colors hover:text-cyan"
                    >
                      Already registered? Complete payment →
                    </a>
                  )}
                </>
              )}

              {phase.kind === "done" && (
                <>
                  <h2 className="text-2xl font-black tracking-tight">
                    <span className="text-gradient">You&apos;re In!</span>
                  </h2>
                  <p className="mt-3 text-sm text-white/65">
                    Your pass has been {phase.pass.status}. Save it — you&apos;ll
                    need the QR at the gate.
                  </p>
                  <div className="mt-4 rounded-xl border border-cyan/25 bg-cyan/5 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                      Pass Code
                    </p>
                    <p className="font-mono text-lg font-bold text-cyan">
                      {phase.pass.code}
                    </p>
                  </div>
                  <a
                    href={phase.pass.s3_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 block w-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 py-3 font-semibold text-white transition-transform hover:scale-[1.02]"
                  >
                    Download Pass (PDF)
                  </a>
                  <button
                    type="button"
                    onClick={close}
                    className="mt-3 w-full rounded-full border border-white/15 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:text-white"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  autoComplete,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "numeric" | "text" | "tel" | "email";
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">
        {label}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-cyan/60"
      />
    </label>
  );
}
