"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { admissionSupport } from "@/lib/data";

// Small ringing-handset glyph for the number rows.
function HandsetIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6.5 3.5 9 4l1 3-1.7 1.4a11 11 0 0 0 5.3 5.3L15 12l3 1 .5 2.5c0 1-.8 1.8-1.8 1.7A14 14 0 0 1 4.8 5.3C4.7 4.3 5.5 3.5 6.5 3.5Z" />
    </svg>
  );
}

export default function ContactDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center px-6"
      role="dialog"
      aria-modal="true"
      aria-label="Admission Support Numbers"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
      />

      <div className="animate-rise relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#0e0a1a]/95 shadow-2xl ring-1 ring-white/10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 bg-gradient-to-r from-cyan-500/15 to-violet-600/15 px-6 py-5">
          <h2 className="font-sans text-xl font-medium text-white">Support</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 -mt-1 rounded-full p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        {/* Numbers */}
        <ul className="flex flex-col gap-2.5 p-5">
          {admissionSupport.map((num) => (
            <li key={num}>
              <a
                href={`tel:${num.replace(/\s/g, "")}`}
                className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 transition-colors hover:border-cyan/40 hover:bg-white/[0.06]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 text-white shadow-lg shadow-violet-600/25">
                  <HandsetIcon className="h-5 w-5" />
                </span>
                <span className="font-mono text-lg font-semibold tracking-wide text-white transition-colors group-hover:text-cyan">
                  {num}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body,
  );
}
