"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-white/10 bg-[#05010f]/80 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
        <a href="#top" className="flex items-center gap-3">
          <span className="rounded-lg bg-white/95 px-2 py-1.5 shadow-lg shadow-black/30 ring-1 ring-white/20">
            <Image
              src="/logo.webp"
              alt="CIMAGE"
              width={648}
              height={186}
              priority
              className="h-6 w-auto sm:h-7"
            />
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <a
            href="#register"
            className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-transform hover:scale-105"
          >
            Register
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg ring-1 ring-white/15 md:hidden"
        >
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-5 bg-white transition-transform ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-white transition-opacity ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-white transition-transform ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile dropdown */}
      <div
        className={`overflow-hidden bg-[#05010f]/95 backdrop-blur-xl transition-[max-height] duration-300 md:hidden ${
          open ? "max-h-96 border-t border-white/10" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col gap-1 px-5 py-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-base font-medium text-white/80 hover:bg-white/5"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="mt-2">
            <a
              href="#register"
              onClick={() => setOpen(false)}
              className="block rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-5 py-3 text-center text-base font-semibold text-white"
            >
              Register
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
