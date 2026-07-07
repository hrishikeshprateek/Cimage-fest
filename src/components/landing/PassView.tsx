"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import {
  resolvePass,
  claimPass,
  BOARD_OPTIONS,
  type PassResolution,
  type FestPassDetail,
} from "@/lib/festApi";

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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        extra: {},
      });
      // Claim returns the updated pass directly — flip to the valid view
      // without a second round-trip, reusing the event we already have.
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
    // Gate the upload if the backend ever exposes the flag; until then it's
    // always shown as optional.
    (state.data.event as { requires_id_card?: boolean }).requires_id_card;

  return (
    <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-[#0b0518]/95 p-8 text-center shadow-2xl">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-cyan/30 bg-cyan/10 text-2xl">
        🎟️
      </div>

      {state.kind === "loading" && (
        <p className="text-sm text-white/60">Resolving pass…</p>
      )}

      {state.kind === "error" && (
        <>
          <span className="inline-block rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-rose-300">
            Invalid Pass
          </span>
          <h1 className="mt-4 text-xl font-black text-white">Pass Not Found</h1>
          <p className="mt-3 text-sm text-white/60">{state.message}</p>
          <button
            type="button"
            onClick={load}
            className="mt-5 w-full rounded-full border border-white/15 py-2.5 text-sm font-semibold text-white/80 hover:text-white"
          >
            Try Again
          </button>
        </>
      )}

      {/* Status mode + unclaimed → read-only "not yet claimed" card */}
      {state.kind === "resolved" &&
        mode === "status" &&
        state.data.needs_claim && (
          <>
            <span className={`inline-block rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] ${statusPill("blank").cls}`}>
              {statusPill("blank").label}
            </span>
            <h1 className="mt-4 text-2xl font-black tracking-tight">
              <span className="text-gradient">Not Yet Claimed</span>
            </h1>
            <p className="mt-2 text-xs uppercase tracking-[0.15em] text-white/55">
              {state.data.event.name} · {state.data.event.venue}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              This pass is still blank. Head to{" "}
              <span className="font-semibold text-cyan">Claim</span> to register
              your details and activate it.
            </p>
          </>
        )}

      {/* Claim mode + unclaimed → full claim form */}
      {state.kind === "resolved" && mode === "claim" && state.data.needs_claim && (
        <>
          <span className={`inline-block rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] ${statusPill("blank").cls}`}>
            {statusPill("blank").label}
          </span>
          <h1 className="mt-4 text-2xl font-black tracking-tight">
            <span className="text-gradient">Claim Your Pass</span>
          </h1>
          <p className="mt-2 text-xs uppercase tracking-[0.15em] text-white/55">
            {state.data.event.name} · {state.data.event.venue}
          </p>

          <form onSubmit={claim} className="mt-5 space-y-3 text-left">
            <Field label="Full name *" value={form.name} onChange={setField("name")} autoComplete="name" required />
            <Field label="Phone *" value={form.phone} onChange={setField("phone")} type="tel" inputMode="numeric" autoComplete="tel" required />
            <Field label="Email" value={form.email} onChange={setField("email")} type="email" autoComplete="email" />

            <label className="block">
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">
                Board
              </span>
              <select
                value={form.board}
                onChange={(e) => setField("board")(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-cyan/60"
              >
                <option value="" className="bg-[#0b0518]">Select board (optional)</option>
                {BOARD_OPTIONS.map((b) => (
                  <option key={b.value} value={b.value} className="bg-[#0b0518]">
                    {b.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex gap-3">
              <Field label="Course" value={form.course} onChange={setField("course")} />
              <Field label="City" value={form.city} onChange={setField("city")} />
            </div>
            <Field label="School / College" value={form.school_name} onChange={setField("school_name")} />

            <label className="block">
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">
                ID Card {requiresIdCard ? "*" : "(optional)"}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                required={!!requiresIdCard}
                onChange={(e) => setIdCard(e.target.files?.[0] ?? null)}
                className="w-full rounded-lg border border-white/15 bg-white/5 text-sm text-white/80 outline-none file:mr-3 file:cursor-pointer file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-wide file:text-cyan focus:border-cyan/60"
              />
              {idCard && (
                <span className="mt-1 block truncate text-[11px] text-white/50">
                  {idCard.name}
                </span>
              )}
            </label>

            {error && <p className="text-xs font-medium text-rose-400">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 w-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 py-3 font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              {submitting ? "Validating…" : "Validate & Claim"}
            </button>
          </form>
        </>
      )}

      {/* Already claimed / used / cancelled → status view (no form) */}
      {state.kind === "resolved" && !state.data.needs_claim && (
        <>
          <span className={`inline-block rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] ${statusPill(state.data.pass.status).cls}`}>
            {statusPill(state.data.pass.status).label}
          </span>
          <h1 className="mt-4 text-2xl font-black tracking-tight">
            <span className="text-gradient">
              {state.data.pass.registration_name
                ? `Hi, ${state.data.pass.registration_name}`
                : "Your Pass"}
            </span>
          </h1>
          <p className="mt-2 text-xs uppercase tracking-[0.15em] text-white/55">
            {state.data.event.name} · {state.data.event.venue}
          </p>

          {state.data.pass.png_s3_url && (
            <img
              src={state.data.pass.png_s3_url}
              alt={`Pass ${state.data.pass.code}`}
              className="mx-auto mt-5 w-full rounded-xl border border-white/10"
            />
          )}

          <div className="mt-4 rounded-xl border border-cyan/25 bg-cyan/5 px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">
              Pass Code
            </p>
            <p className="font-mono text-lg font-bold text-cyan">
              {state.data.pass.code}
            </p>
          </div>

          {(state.data.pass.s3_url || state.data.pass.png_s3_url) && (
            <a
              href={state.data.pass.s3_url || state.data.pass.png_s3_url}
              target="_blank"
              rel="noreferrer"
              className="mt-5 block w-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 py-3 font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              Download Pass
            </a>
          )}
        </>
      )}
    </div>
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
        className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyan/60"
      />
    </label>
  );
}
