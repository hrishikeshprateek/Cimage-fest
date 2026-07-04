import Image from "next/image";
import { fest, navLinks } from "@/lib/data";

const socials = [
  { label: "Instagram", href: "#" },
  { label: "X", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "YouTube", href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#05010f] px-6 py-16 sm:px-10">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <span className="inline-block rounded-lg bg-white/95 px-3 py-2 shadow-lg shadow-black/30 ring-1 ring-white/20">
            <Image
              src="/logo.webp"
              alt="CIMAGE Group of Institutions"
              width={648}
              height={186}
              className="h-8 w-auto"
            />
          </span>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
            {fest.name} {fest.edition} — {fest.tagline}.
          </p>
          <p className="mt-4 text-sm text-white/45">{fest.venue}</p>
        </div>

        <div>
          <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">
            Explore
          </h3>
          <ul className="mt-4 space-y-2.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-white/60 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">
            Connect
          </h3>
          <ul className="mt-4 space-y-2.5">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  className="text-sm text-white/60 transition-colors hover:text-white"
                >
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="mailto:web@cimage.in"
                className="text-sm text-white/60 transition-colors hover:text-white"
              >
                web@cimage.in
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center sm:flex-row sm:text-left">
        <p className="text-xs text-white/40">
          © {fest.edition} CIMAGE Group of Institutions. All rights reserved.
        </p>
        <p className="text-xs text-white/40">
          Crafted with <span className="text-magenta">♦</span> for the builders
          of Bihar.
        </p>
      </div>
    </footer>
  );
}
