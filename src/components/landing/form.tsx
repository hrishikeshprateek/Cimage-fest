import type { ReactNode } from "react";
import Image from "next/image";

// Shared form styling used across the pass / registration UIs.
export const inputCls =
  "w-full rounded-lg border border-white/15 bg-white/[0.07] px-4 py-2.5 text-sm text-white outline-none transition duration-200 placeholder:text-white/35 focus:border-indigo-400/70 focus:bg-white/[0.1] focus:ring-2 focus:ring-indigo-400/15";

export const labelCls =
  "mb-1.5 block text-[11px] font-medium uppercase tracking-[0.13em] text-white/55";

// Soothing indigo → violet, soft (not a harsh neon).
export const submitCls =
  "flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-400 to-violet-400 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60";

// A physical-ticket card: a logo header stub, a perforated tear line with
// punched-hole notches on each edge, and a body for the content/form.
export function TicketCard({
  pill,
  title,
  subtitle,
  children,
  onClose,
  notchColor = "#0a0716",
}: {
  pill?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  onClose?: () => void;
  notchColor?: string;
}) {
  // Notches reveal the page behind the ticket, so this should match the page bg.
  return (
    <div className="relative w-full max-w-sm rounded-2xl border border-white/15 bg-[#1c1636] shadow-2xl shadow-black/50">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3.5 top-3.5 z-10 flex h-8 w-8 items-center justify-center rounded-full text-white/55 transition-colors hover:bg-white/10 hover:text-white"
        >
          ✕
        </button>
      )}

      {/* Header stub with the fest logo */}
      <div className="flex flex-col items-center rounded-t-2xl bg-white/[0.06] px-7 pb-6 pt-8 text-center">
        <div className="h-16 w-16 overflow-hidden rounded-full ring-1 ring-white/15 shadow-lg">
          <Image
            src="/fest-logo.png"
            alt="CIMAGE Weekend Fest"
            width={128}
            height={128}
            className="h-full w-full object-cover"
          />
        </div>
        {pill && <div className="mt-4">{pill}</div>}
        {title && (
          <h2 className="mt-3 text-xl font-extrabold tracking-tight text-white">
            {title}
          </h2>
        )}
        {subtitle && <div className="mt-3 w-full">{subtitle}</div>}
      </div>

      {/* Perforation with punched-hole notches */}
      <div className="relative">
        <span
          className="absolute -left-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full"
          style={{ background: notchColor }}
        />
        <span
          className="absolute -right-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full"
          style={{ background: notchColor }}
        />
        <div className="mx-3 border-t border-dashed border-white/15" />
      </div>

      {/* Body */}
      <div className="px-7 pb-8 pt-6">{children}</div>
    </div>
  );
}

function Req() {
  return <span className="text-cyan"> *</span>;
}

export function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  autoComplete,
  inputMode,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "numeric" | "text" | "tel" | "email";
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className={labelCls}>
        {label}
        {required && <Req />}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputCls} cursor-pointer appearance-none pr-10`}
        >
          {children}
        </select>
        <svg
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </label>
  );
}

export function FileField({
  label,
  cta = "Upload file",
  hint = "JPG, PNG or PDF",
  accept,
  required = false,
  file,
  onFile,
}: {
  label: string;
  cta?: string;
  hint?: string;
  accept?: string;
  required?: boolean;
  file: File | null;
  onFile: (f: File | null) => void;
}) {
  return (
    <label className="block cursor-pointer">
      <span className={labelCls}>
        {label}
        {required ? (
          <Req />
        ) : (
          <span className="ml-1 tracking-normal text-white/30 lowercase">
            (optional)
          </span>
        )}
      </span>
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-3 transition hover:border-cyan/40">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-cyan">
          {file ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 16V4M7 9l5-5 5 5M4 20h16" />
            </svg>
          )}
        </span>
        <span className="min-w-0 flex-1 text-left">
          {file ? (
            <span className="block truncate text-sm text-white">{file.name}</span>
          ) : (
            <>
              <span className="block text-sm text-white/80">{cta}</span>
              <span className="block text-xs text-white/35">{hint}</span>
            </>
          )}
        </span>
        <input
          type="file"
          accept={accept}
          required={required}
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          className="hidden"
        />
      </div>
    </label>
  );
}
