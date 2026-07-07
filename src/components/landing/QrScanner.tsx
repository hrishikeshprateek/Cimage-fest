"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

/**
 * Full-screen camera QR scanner. Uses the rear camera, decodes frames with
 * jsQR (works on iOS Safari + Android Chrome), and calls onDetect with the
 * decoded text. Falls back to a friendly message + manual entry on error.
 */
export default function QrScanner({
  onDetect,
  onClose,
}: {
  onDetect: (text: string) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Keep the latest callbacks in refs so the camera effect runs exactly once.
  const onDetectRef = useRef(onDetect);
  onDetectRef.current = onDetect;

  useEffect(() => {
    let cancelled = false;
    let raf = 0;
    let stream: MediaStream | null = null;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    const stop = () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
    };

    const tick = () => {
      const video = videoRef.current;
      if (cancelled || !video || !ctx) return;
      if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(img.data, img.width, img.height, {
          inversionAttempts: "dontInvert",
        });
        if (code?.data) {
          stop();
          onDetectRef.current(code.data);
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "environment" } })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = s;
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = s;
        return video.play();
      })
      .then(() => {
        if (!cancelled) raf = requestAnimationFrame(tick);
      })
      .catch((err: unknown) => {
        const name = err instanceof DOMException ? err.name : "";
        setError(
          name === "NotAllowedError"
            ? "Camera access was denied. Allow it, or type the code below."
            : "Couldn't start the camera. Please type the code instead.",
        );
      });

    return stop;
  }, []);

  return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-black/95 p-6">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close scanner"
        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 hover:text-white"
      >
        ✕
      </button>

      {error ? (
        <div className="max-w-xs text-center">
          <p className="text-sm text-white/70">{error}</p>
          <button
            type="button"
            onClick={onClose}
            className="mt-5 rounded-full border border-white/15 px-6 py-2.5 text-sm font-semibold text-white/80 hover:text-white"
          >
            Enter code manually
          </button>
        </div>
      ) : (
        <>
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.3em] text-white/60">
            Point at the pass QR
          </p>
          <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-2xl border border-white/15">
            <video
              ref={videoRef}
              muted
              playsInline
              className="h-full w-full object-cover"
            />
            {/* Reticle */}
            <div className="pointer-events-none absolute inset-6 rounded-xl border-2 border-cyan/70 shadow-[0_0_40px_rgba(34,211,238,0.35)]" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 rounded-full border border-white/15 px-6 py-2.5 text-sm font-semibold text-white/80 hover:text-white"
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
}
