"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/* Labs / on-campus section — MU's two-column card grid (image with a badge,
   title, blurb). Self-contained: the labs copy lives here, and the MU-only
   primitives are reproduced inline — Reveal (scroll fade-up) and ZoomableImage
   (click-to-zoom lightbox) — while remote images use a plain <img> to match
   this project's convention (remote next/image hosts aren't configured). */

const labs = {
  display: "Wipro and IIT Bombay, on campus.",
  sub: "Partnerships most colleges only talk about — here they're wired into everyday learning.",
  blocks: [
    {
      badge: "IIT Bombay · E-Yantra Certified",
      title: "E-Yantra · IIT Bombay",
      body: "Robotics teams. Real competition tracks. Certified by an IIT.",
      image: "https://cimage-web.s3.ap-south-1.amazonaws.com/public/Screenshot+2026-06-26+at+3.44.20%E2%80%AFPM.png",
    },
    {
      badge: "Wipro CoE · Active Partnership",
      title: "Wipro Centre of Excellence",
      body: "Industry-graded coursework delivered on campus under an active MoU.",
      image: "https://cimage-web.s3.ap-south-1.amazonaws.com/public/public/collab/Right-Image.webp",
    },
    {
      badge: "Google Partner · Certified",
      title: "Google for Education Partner",
      body: "The only state-wide Google Workspace teaching partnership.",
      image: "https://cimage.in/wp-content/uploads/2026/05/Google-Cloud-2.png",
    },
    {
      badge: "Skill Acceleration · On Campus",
      title: "Skill Acceleration Lab",
      body: "Hands-on AI and full-stack tracks with AWS Academy support.",
      image: "https://cimagedigital.com/wp-content/uploads/2026/05/Recognition-and-appreciation-for-establishing-the-Spoken-Tutorial-Skill-Accelerator-Lab-at-CIMAGE.jpeg",
    },
  ],
};

// Scroll-triggered fade-up. Reveals once when it enters the viewport.
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reduced motion: content is already shown via the initial state.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

// Click-to-zoom: opens the image in a full-screen lightbox.
function ZoomableImage({
  src,
  alt,
  children,
}: {
  src: string;
  alt: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Zoom ${alt}`}
        className="block w-full cursor-zoom-in"
      >
        {children}
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-6 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="max-h-full max-w-full cursor-zoom-out rounded-lg object-contain shadow-2xl"
            />
          </div>,
          document.body,
        )}
    </>
  );
}

export default function MULabs() {
  const l = labs;

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="max-w-3xl">
          <h2 className="mu-serif text-[2.1rem] leading-[1.1] text-[#090909] sm:text-[3rem]">
            {l.display}
          </h2>
          <p className="mt-4 text-[17px] text-[#525252]">{l.sub}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {l.blocks.map((b, i) => (
            <Reveal
              key={i}
              delay={i * 0.08}
              className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm"
            >
              <ZoomableImage src={b.image} alt={b.title}>
                <div className="relative aspect-[16/9] overflow-hidden bg-[#eee]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.image}
                    alt={b.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3.5 py-1.5 text-[12.5px] font-semibold text-[#090909] shadow">
                    {b.badge}
                  </span>
                </div>
              </ZoomableImage>
              <div className="p-7">
                <h3 className="text-[22px] font-semibold text-[#090909]">{b.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#737373]">{b.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
