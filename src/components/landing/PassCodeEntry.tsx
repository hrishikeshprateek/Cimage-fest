"use client";

import { useState } from "react";
import QrScanner from "./QrScanner";

// Accept a raw pass code/token or a pasted QR link (…/p/<token>).
export function extractToken(raw: string): string {
  const s = raw.trim();
  const m = s.match(/\/p\/([^/?#\s]+)/);
  return m ? decodeURIComponent(m[1]) : s;
}

export default function PassCodeEntry({
  title,
  subtitle,
  cta,
  onToken,
}: {
  title: string;
  subtitle: string;
  cta: string;
  onToken: (token: string) => void;
}) {
  const [input, setInput] = useState("");
  const [scanning, setScanning] = useState(false);

  return (
    <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-[#0b0518]/95 p-8 text-center shadow-2xl">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-cyan/30 bg-cyan/10 text-2xl">
        🎟️
      </div>
      <h1 className="text-2xl font-black tracking-tight">
        <span className="text-gradient">{title}</span>
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-white/60">{subtitle}</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const t = extractToken(input);
          if (t) onToken(t);
        }}
        className="mt-6 space-y-3 text-left"
      >
        <label className="block">
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">
            Pass code
          </span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
            autoFocus
            placeholder="WF-XXXXXX"
            className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-cyan/60"
          />
        </label>
        <button
          type="submit"
          disabled={!input.trim()}
          className="w-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 py-3 font-semibold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {cta}
        </button>
      </form>

      <div className="my-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/30">
        <span className="h-px flex-1 bg-white/10" />
        or
        <span className="h-px flex-1 bg-white/10" />
      </div>
      <button
        type="button"
        onClick={() => setScanning(true)}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 py-3 text-sm font-semibold text-white/85 transition-colors hover:border-cyan/50 hover:text-white"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" />
          <path d="M4 12h16" />
        </svg>
        Scan QR Code
      </button>

      {scanning && (
        <QrScanner
          onClose={() => setScanning(false)}
          onDetect={(text) => {
            const t = extractToken(text);
            setScanning(false);
            setInput(t);
            if (t) onToken(t);
          }}
        />
      )}
    </div>
  );
}
