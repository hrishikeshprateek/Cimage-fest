import Image from "next/image";
import Link from "next/link";
import GetPassButton from "./GetPassButton";

const links = [
  { label: "Learn", href: "/events?track=learn" },
  { label: "Play", href: "/events?track=play" },
  { label: "Celebrate", href: "/events?track=celebrate" },
];

export default function TopBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-gradient-to-b from-[#05010f]/90 to-transparent">
      <div className="flex items-center justify-between px-5 py-5 sm:px-8">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <span className="inline-block rounded-lg bg-white/95 px-2.5 py-1.5 shadow-lg shadow-black/40 ring-1 ring-white/20">
            <Image
              src="/logo.webp"
              alt="CIMAGE"
              width={648}
              height={186}
              priority
              className="h-6 w-auto sm:h-8"
            />
          </span>
        </Link>

        {/* Center nav */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-10 lg:gap-16">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="font-mono text-lg font-bold uppercase tracking-[0.15em] text-white/90 transition-colors hover:text-cyan"
                  style={{ textShadow: "0 0 12px rgba(139,92,246,0.5)" }}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Get pass → registration-soon popup */}
        <GetPassButton />
      </div>
    </header>
  );
}
