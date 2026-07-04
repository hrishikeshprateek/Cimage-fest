import type { ReactNode } from "react";
import Reveal from "./Reveal";

type SectionProps = {
  id: string;
  eyebrow?: string;
  title?: ReactNode;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

/** Standard vertical rhythm + section heading used across the page. */
export default function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
}: SectionProps) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-24 px-6 py-24 sm:px-10 sm:py-28 ${className}`}
    >
      <div className="mx-auto max-w-6xl">
        {(eyebrow || title) && (
          <Reveal className="mb-14 text-center">
            {eyebrow && (
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.4em] text-cyan">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mx-auto mt-4 max-w-2xl text-balance text-white/60">
                {subtitle}
              </p>
            )}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
