"use client";

import { useState } from "react";
import QrScanner from "./QrScanner";
import { inputCls, labelCls, submitCls, TicketCard } from "./form";

// Accept a raw pass code/token or a pasted QR link (…/p/<token>).
// The token is an opaque RAW key — never decode/encode it, just pull the
// last path segment verbatim so we send exactly what the backend stored.
export function extractToken(raw: string): string {
  const s = raw.trim();
  const m = s.match(/\/p\/([^/?#\s]+)/);
  return m ? m[1] : s;
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
    <>
      <TicketCard
        title={title}
        subtitle={
          <p className="text-sm leading-relaxed text-white/60">{subtitle}</p>
        }
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const t = extractToken(input);
            if (t) onToken(t);
          }}
          className="space-y-3.5"
        >
          <label className="block">
            <span className={labelCls}>Pass code</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              required
              autoFocus
              placeholder="WF-XXXXXX"
              className={`${inputCls} text-center font-mono tracking-widest`}
            />
          </label>
          <button type="submit" disabled={!input.trim()} className={submitCls}>
            {cta}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/30">
          <span className="h-px flex-1 bg-white/10" />
          or
          <span className="h-px flex-1 bg-white/10" />
        </div>
        <button
          type="button"
          onClick={() => setScanning(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.06] py-3 text-sm font-semibold text-white/85 transition-colors hover:border-indigo-400/50 hover:bg-white/[0.1] hover:text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" />
            <path d="M4 12h16" />
          </svg>
          Scan QR Code
        </button>
      </TicketCard>

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
    </>
  );
}
