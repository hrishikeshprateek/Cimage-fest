"use client";

import { useState } from "react";
import Section from "../Section";
import Reveal from "../Reveal";
import { faqs } from "@/lib/data";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section
      id="faq"
      eyebrow="Good to Know"
      title={
        <>
          Frequently <span className="text-gradient">asked</span>
        </>
      }
      className="grid-backdrop"
    >
      <div className="mx-auto max-w-3xl space-y-3">
        {faqs.map((item, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={item.q} delay={i * 60}>
              <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-base font-semibold sm:text-lg">
                    {item.q}
                  </span>
                  <span
                    className={`shrink-0 text-xl text-cyan transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-white/60">{item.a}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
