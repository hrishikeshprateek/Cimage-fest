"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/* Full-bleed wall of fest reels — fills the whole viewport (2×2 on phones,
   a single row of 4 on desktop). Tapping one opens it as a true 9:16 reel in
   a full-screen player you can page through, feed-style.

   Thumbnails are used in the grid (rather than live iframes) so the panel stays
   light; the YouTube embed only loads once a reel is opened. */

// Fest reels (YouTube Shorts ids). The wall shows the first WALL_COUNT; the
// full-screen player pages through all of them.
const REELS = [
  "dtvPk4_-BfM",
  "vaocoarFNqY", // ← swapped with the id now at position 5
  "NxrUKZV_9No",
  "at5aIUmhW3o",
  "1QJQTsNVpfw",
  "g9wqEGbdl2Q",
  "MX156WXFMKY",
];

const WALL_COUNT = 4;

// `oardefault` keeps a Short's original vertical framing; a few ids don't have
// it, so we fall back to `hqdefault` (always present) on error.
const thumbOf = (id: string) => `https://i.ytimg.com/vi/${id}/oardefault.jpg`;
const thumbFallbackOf = (id: string) =>
  `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
// `controls=0` for a true reel look (no seek bar); `enablejsapi=1` lets the
// gesture layer above the iframe drive play/pause via postMessage.
const embedOf = (id: string) =>
  `https://www.youtube.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1&loop=1&playlist=${id}&controls=0&enablejsapi=1`;

// Min distance (px) before a drag counts as a swipe rather than a tap.
const SWIPE_MIN = 45;

export default function EventReels() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const close = useCallback(() => setOpenIdx(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setOpenIdx((i) =>
        i === null ? i : (i + dir + REELS.length) % REELS.length,
      ),
    [],
  );

  // Each reel starts playing fresh (the iframe is remounted per id).
  useEffect(() => setPaused(false), [openIdx]);

  const togglePlay = useCallback(() => {
    setPaused((wasPaused) => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: wasPaused ? "playVideo" : "pauseVideo",
          args: [],
        }),
        "*",
      );
      return !wasPaused;
    });
  }, []);

  // Reel-style gestures: swipe up/left → next, down/right → previous. A short
  // press with no travel is a tap, which toggles playback.
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchRef.current;
    touchRef.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) < SWIPE_MIN) {
      togglePlay();
      return;
    }
    if (absY > absX) step(dy < 0 ? 1 : -1);
    else step(dx < 0 ? 1 : -1);
  };

  // Escape closes; arrows page through the feed.
  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight" || e.key === "ArrowDown") step(1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIdx, close, step]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#05010f]">
      {/* Liquid colour wash — slow-drifting blobs behind the wall */}
      <div className="pointer-events-none absolute -left-24 top-[-10%] h-[45vh] w-[45vh] animate-breathe rounded-full bg-violet-600/30 blur-[110px]" />
      <div className="pointer-events-none absolute -right-24 bottom-[-12%] h-[50vh] w-[50vh] animate-glow rounded-full bg-cyan-500/25 blur-[120px]" />

      {/* The wall — fills the screen: 2×2 on phone, 1×4 on desktop */}
      <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-px md:grid-cols-4 md:grid-rows-1">
        {REELS.slice(0, WALL_COUNT).map((id, i) => (
          <button
            key={id}
            type="button"
            onClick={() => setOpenIdx(i)}
            aria-label={`Play reel ${i + 1}`}
            className="group relative overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
          >
            <img
              src={thumbOf(id)}
              alt=""
              onError={(e) => {
                const el = e.currentTarget;
                if (!el.dataset.fallback) {
                  el.dataset.fallback = "1";
                  el.src = thumbFallbackOf(id);
                }
              }}
              className="absolute inset-0 h-full w-full scale-[1.02] object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
            />
            {/* legibility + hover lift */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 transition-opacity duration-500 group-hover:from-black/70" />
            {/* liquid sheen on hover */}
            <div className="pointer-events-none absolute inset-0 translate-y-full bg-gradient-to-t from-cyan-400/20 via-transparent to-transparent transition-transform duration-700 group-hover:translate-y-0" />

            {/* Play badge */}
            <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/35 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:border-cyan-300/60 group-hover:bg-cyan-400/20">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 text-white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>

            {/* Caption */}
            <span className="pointer-events-none absolute inset-x-0 bottom-0 p-4 text-left">
              <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">
                Reel {String(i + 1).padStart(2, "0")}
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* Full-screen reel player — strict 9:16, nothing else */}
      {openIdx !== null &&
        createPortal(
          <div
            className="fixed inset-0 z-[95] flex items-center justify-center bg-black/95 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={`Reel ${openIdx + 1} of ${REELS.length}`}
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close reel"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              ✕
            </button>

            {/* Feed position */}
            <span className="pointer-events-none absolute left-1/2 top-5 z-10 -translate-x-1/2 font-mono text-[11px] tabular-nums tracking-widest text-white/60">
              {String(openIdx + 1).padStart(2, "0")} / {String(REELS.length).padStart(2, "0")}
            </span>

            {/* Prev / next through the whole feed */}
            {(["prev", "next"] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                aria-label={dir === "prev" ? "Previous reel" : "Next reel"}
                onClick={(e) => {
                  e.stopPropagation();
                  step(dir === "next" ? 1 : -1);
                }}
                className={`absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 ${
                  dir === "prev" ? "left-3 sm:left-6" : "right-3 sm:right-6"
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={dir === "prev" ? "M15 18l-6-6 6-6" : "M9 6l6 6-6 6"} />
                </svg>
              </button>
            ))}

            {/* 9:16 stage — as tall as the screen allows, never wider */}
            <div
              className="relative aspect-[9/16] h-full max-h-dvh w-auto max-w-full overflow-hidden bg-black sm:rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                key={REELS[openIdx]}
                ref={iframeRef}
                src={embedOf(REELS[openIdx])}
                title={`Fest reel ${openIdx + 1}`}
                className="absolute inset-0 h-full w-full"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />

              {/* Gesture layer — a cross-origin iframe swallows touch events, so
                  swipes have to be caught above it. */}
              <div
                className="absolute inset-0 touch-none"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                onClick={togglePlay}
              />

              {/* Paused indicator */}
              {paused && (
                <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 backdrop-blur-sm">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1 text-white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
