"use client";

import { useEffect, useRef, useState } from "react";

/** Counts up from 0 to `value` the first time it scrolls into view. */
export default function StatCounter({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const duration = 1600;
        let start: number | null = null;
        const step = (t: number) => {
          if (start === null) start = t;
          const progress = Math.min(1, (t - start) / duration);
          // easeOutCubic
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(eased * value));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-black tracking-tight sm:text-5xl">
        <span className="text-gradient">
          {display.toLocaleString("en-IN")}
          {suffix}
        </span>
      </div>
      <div className="mt-2 font-mono text-xs uppercase tracking-[0.25em] text-white/50">
        {label}
      </div>
    </div>
  );
}
