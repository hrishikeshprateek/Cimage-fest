"use client";

import { useState } from "react";
import {
  HomeIcon,
  GridIcon,
  TicketIcon,
  PhoneIcon,
  PeopleIcon,
} from "./icons";
import ContactDialog from "./ContactDialog";

const items = [
  { label: "Home", href: "/", Icon: HomeIcon },
  { label: "Events", href: "/events", Icon: GridIcon },
  { label: "Pass", href: "/pass", Icon: TicketIcon },
  { label: "Contact", action: "contact" as const, Icon: PhoneIcon },
  { label: "About Us", href: "#about", Icon: PeopleIcon },
];

export default function SideNav() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      {/* Desktop: vertical rail on the left */}
      <nav className="fixed left-3 top-1/2 z-30 hidden -translate-y-1/2 md:block">
        <ul className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-black/25 px-3 py-6 backdrop-blur-md">
          {items.map(({ label, href, action, Icon }) => {
            const cls =
              "group flex flex-col items-center gap-1.5 text-white/70 transition-colors hover:text-cyan";
            const inner = (
              <>
                <Icon className="h-6 w-6 drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]" />
                <span className="font-sans text-[11px] font-medium tracking-tight">
                  {label}
                </span>
              </>
            );
            return (
              <li key={label}>
                {action === "contact" ? (
                  <button
                    type="button"
                    onClick={() => setContactOpen(true)}
                    className={cls}
                  >
                    {inner}
                  </button>
                ) : (
                  <a href={href} className={cls}>
                    {inner}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile: fixed bottom navigation bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#05010f]/85 backdrop-blur-xl md:hidden [padding-bottom:env(safe-area-inset-bottom)]">
        <ul className="flex items-stretch justify-around px-1 py-2">
          {items.map(({ label, href, action, Icon }) => {
            const cls =
              "flex flex-col items-center gap-1 rounded-lg py-1.5 text-white/70 transition-colors active:text-cyan";
            const inner = (
              <>
                <Icon className="h-5 w-5 drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]" />
                <span className="font-sans text-[10px] font-medium tracking-tight">
                  {label}
                </span>
              </>
            );
            return (
              <li key={label} className="flex-1">
                {action === "contact" ? (
                  <button
                    type="button"
                    onClick={() => setContactOpen(true)}
                    className={`w-full ${cls}`}
                  >
                    {inner}
                  </button>
                ) : (
                  <a href={href} className={cls}>
                    {inner}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
