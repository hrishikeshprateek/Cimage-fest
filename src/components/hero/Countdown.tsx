"use client";

import { useEffect, useState } from "react";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function getTimeLeft(target: number): TimeLeft {
  const diff = Math.max(0, target - Date.now());
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

export default function Countdown({ targetISO }: { targetISO: string }) {
  const target = new Date(targetISO).getTime();
  // Start null so server and first client render match, avoiding hydration drift.
  const [left, setLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setLeft(getTimeLeft(target));
    const id = setInterval(() => setLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units: [string, number | null][] = [
    ["Days", left?.days ?? null],
    ["Hours", left?.hours ?? null],
    ["Minutes", left?.minutes ?? null],
    ["Seconds", left?.seconds ?? null],
  ];

  return (
    <div className="flex items-stretch gap-2 sm:gap-4">
      {units.map(([label, value], i) => (
        <div key={label} className="flex items-stretch gap-2 sm:gap-4">
          <div className="flex min-w-[64px] flex-col items-center rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur sm:min-w-[84px] sm:px-4 sm:py-4">
            <span className="font-mono text-2xl font-black tabular-nums text-white sm:text-4xl">
              {value === null ? "--" : String(value).padStart(2, "0")}
            </span>
            <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 sm:text-xs">
              {label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="self-center font-mono text-2xl font-black text-white/25 sm:text-4xl">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
