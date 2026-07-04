"use client";

import { useEffect, useState } from "react";

export default function GetPassButton() {
  const [open, setOpen] = useState(false);

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

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="shrink-0 rounded-md bg-gradient-to-r from-violet-600 to-violet-500 px-5 py-2 font-mono text-sm font-bold uppercase tracking-[0.15em] text-white shadow-lg shadow-violet-600/40 transition-transform hover:scale-105"
      >
        Get Pass
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Registration status"
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Card */}
          <div className="animate-rise relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/15 bg-[#0b0518]/95 p-8 text-center shadow-2xl">
            <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 animate-glow rounded-full bg-violet-600/40 blur-3xl" />

            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-white/50 transition-colors hover:text-white"
            >
              ✕
            </button>

            <div className="relative">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-cyan/30 bg-cyan/10 text-2xl">
                🎟️
              </div>
              <h2 className="text-2xl font-black tracking-tight">
                <span className="text-gradient">Registration Opens Soon</span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                Passes for CIMAGE Fest aren&apos;t live just yet. Check back
                shortly — this is where you&apos;ll grab yours.
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-6 w-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 py-3 font-semibold text-white transition-transform hover:scale-[1.02]"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
