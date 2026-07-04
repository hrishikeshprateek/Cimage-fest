"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Extra delay (ms) before the reveal transition kicks in — for staggering. */
  delay?: number;
  as?: "div" | "li" | "section";
};

/**
 * Fades + slides its children in the first time they scroll into view.
 * Relies on the `.reveal` / `.is-visible` classes in globals.css.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLLIElement & HTMLElement>}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
