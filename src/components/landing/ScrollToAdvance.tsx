"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Where a "force scroll down" on the (non-scrolling) home page takes the user.
const TARGET = "/events";
// How much intent we require before advancing — tuned so a stray flick doesn't
// trigger, but a deliberate scroll/swipe does.
const WHEEL_THRESHOLD = 160; // accumulated downward deltaY
const TOUCH_THRESHOLD = 70; // px of upward swipe (= scroll-down intent)

/**
 * The home page is a fixed full-screen view (h-dvh, overflow-hidden), so it
 * never scrolls. This captures a deliberate downward wheel/swipe and navigates
 * to the next page — giving a "keep scrolling to continue" feel on top of the
 * tab-based structure. Guards against firing while a modal has locked scroll.
 */
export default function ScrollToAdvance() {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);
  const fired = useRef(false);
  const ready = useRef(false);
  const wheelAcc = useRef(0);
  const touchStartY = useRef<number | null>(null);

  // Prefetch the target and ignore gestures for a beat after mount (so the
  // loader / an accidental scroll on arrival doesn't immediately advance).
  useEffect(() => {
    router.prefetch(TARGET);
    const t = window.setTimeout(() => {
      ready.current = true;
    }, 700);
    return () => window.clearTimeout(t);
  }, [router]);

  useEffect(() => {
    const leave = () => {
      if (fired.current || !ready.current) return;
      // Don't hijack while a dialog/modal has locked body scroll.
      if (document.body.style.overflow === "hidden") return;
      fired.current = true;
      setLeaving(true);
      window.setTimeout(() => router.push(TARGET), 280);
    };

    const onWheel = (e: WheelEvent) => {
      if (fired.current) return;
      if (e.deltaY > 0) {
        wheelAcc.current += e.deltaY;
        if (wheelAcc.current > WHEEL_THRESHOLD) leave();
      } else {
        wheelAcc.current = 0;
      }
    };
    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (fired.current || touchStartY.current == null) return;
      const dy = touchStartY.current - (e.touches[0]?.clientY ?? 0);
      if (dy > TOUCH_THRESHOLD) leave();
    };
    const onTouchEnd = () => {
      touchStartY.current = null;
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [router]);

  // Fade to the fest background as we hand off to the next page.
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[70] bg-[#05010f] transition-opacity duration-300 ${
        leaving ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
