"use client";

import { useEffect, useRef, useState } from "react";

// Your fest intro lives at public/hero.mp4.
const SRC_MP4 = "/hero.mp4";
// First-frame still shown instantly while the mp4 buffers (helps LCP).
const POSTER = "/hero-poster.webp";

// 5 panels max; visibility trims the count down on smaller screens so each
// column stays roughly portrait-shaped.
const PANELS = [
  "block",
  "block",
  "hidden sm:block",
  "hidden lg:block",
  "hidden lg:block",
];

export default function VideoWall() {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const [soundOn, setSoundOn] = useState(true); // on by default
  // How many panels actually get a <video>. Even sharing one download, five
  // simultaneous decoders are heavy on phones, so we cap the count at the
  // breakpoint. Default 2 (mobile) so SSR matches and phones stay light.
  const [videoCount, setVideoCount] = useState(2);
  // The clip is identical in every panel, so fetch it ONCE and hand every
  // <video> the same in-memory Blob URL — one network download total, instead
  // of one per panel. Poster covers the panels until the blob is ready.
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    const compute = () =>
      window.matchMedia("(min-width: 1024px)").matches
        ? 5
        : window.matchMedia("(min-width: 640px)").matches
          ? 3
          : 2;
    const apply = () => setVideoCount(compute());
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  useEffect(() => {
    let url: string | null = null;
    let cancelled = false;
    fetch(SRC_MP4)
      .then((r) => r.blob())
      .then((blob) => {
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setBlobUrl(url);
      })
      // Network hiccup → fall back to the direct URL (each video loads its own).
      .catch(() => {
        if (!cancelled) setBlobUrl(SRC_MP4);
      });
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, []);

  // Autoplay muted (browser requirement) + stagger each panel to a different
  // point in the clip so it reads like a wall of live screens. Runs once the
  // shared blob is ready and re-runs as more panels mount on wider screens;
  // each video is only initialised once.
  useEffect(() => {
    if (!blobUrl) return;
    const vids = refs.current.filter(Boolean) as HTMLVideoElement[];
    vids.forEach((v, i) => {
      if (v.dataset.init) return;
      v.dataset.init = "1";
      v.muted = true; // required for autoplay; panel 0 gets unmuted later
      const seek = () => {
        if (v.duration && isFinite(v.duration)) {
          v.currentTime = (v.duration / (videoCount + 1)) * (i + 1);
        }
        v.play().catch(() => {});
      };
      if (v.readyState >= 1) seek();
      else v.addEventListener("loadedmetadata", seek, { once: true });
    });
  }, [videoCount, blobUrl]);

  // Apply the sound state to panel 0 (the only panel that carries audio).
  // If the browser blocks autoplay-with-audio, fall back to muted so the wall
  // keeps playing, then a real user gesture unmutes it for good.
  const applySound = (on: boolean) => {
    const primary = refs.current[0];
    if (!primary) return;
    primary.muted = !on;
    if (on) {
      primary.volume = 1;
      primary.play().catch(() => {
        primary.muted = true;
        primary.play().catch(() => {});
      });
    }
  };

  useEffect(() => {
    applySound(soundOn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundOn]);

  // Re-assert unmute at the first user gesture, in case the browser silenced
  // the on-load attempt.
  useEffect(() => {
    const enable = () => {
      setSoundOn(true);
      applySound(true);
    };
    window.addEventListener("pointerdown", enable, { once: true });
    return () => window.removeEventListener("pointerdown", enable);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Panels — always side-by-side columns (LED-wall look) on every screen. */}
      <div className="flex h-full w-full">
        {PANELS.map((vis, i) => (
          <div
            key={i}
            className={`relative h-full flex-1 overflow-hidden border-white/[0.06] ${
              i > 0 ? "border-l" : ""
            } ${vis}`}
          >
            {/* Poster fills every column immediately (paints the LCP); the video
                loads over it only where it will actually be shown. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={POSTER}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-[1.4] object-cover"
            />
            {i < videoCount && blobUrl && (
              <video
                ref={(el) => {
                  refs.current[i] = el;
                }}
                // Zoomed past object-cover so the clip's corner watermarks get
                // cropped out of each tile.
                className="absolute inset-0 h-full w-full scale-[1.4] object-cover"
                autoPlay
                muted
                loop
                playsInline
                poster={POSTER}
                // Same shared blob for every panel → one download, not five.
                src={blobUrl}
              />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#05010f]/40" />
          </div>
        ))}
      </div>

      {/* Single, slightly-dark overlay for readability */}
      <div className="pointer-events-none absolute inset-0 bg-black/35" />

      {/* Sound toggle */}
      <button
        type="button"
        onClick={() => setSoundOn((s) => !s)}
        aria-label={soundOn ? "Mute video" : "Unmute video"}
        className="pointer-events-auto fixed bottom-24 right-5 z-[60] flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/80 backdrop-blur-md transition-colors hover:text-cyan md:bottom-6 md:right-6"
      >
        {soundOn ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 9v6h4l5 4V5L8 9H4Z" />
            <path d="M16 9a3 3 0 0 1 0 6M18.5 7a6 6 0 0 1 0 10" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 9v6h4l5 4V5L8 9H4Z" />
            <path d="m17 9 4 6M21 9l-4 6" />
          </svg>
        )}
      </button>
    </div>
  );
}
