import {
  HomeIcon,
  GridIcon,
  TicketIcon,
  PhoneIcon,
  PeopleIcon,
} from "./icons";

const items = [
  { label: "Home", href: "/", Icon: HomeIcon },
  { label: "Events", href: "/events", Icon: GridIcon },
  { label: "Pass", href: "#pass", Icon: TicketIcon },
  { label: "Contact", href: "#contact", Icon: PhoneIcon },
  { label: "About Us", href: "#about", Icon: PeopleIcon },
];

export default function SideNav() {
  return (
    <>
      {/* Desktop: vertical rail on the left */}
      <nav className="fixed left-3 top-1/2 z-30 hidden -translate-y-1/2 md:block">
        <ul className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-black/25 px-3 py-6 backdrop-blur-md">
          {items.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                className="group flex flex-col items-center gap-1.5 text-white/70 transition-colors hover:text-cyan"
              >
                <Icon className="h-6 w-6 drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]" />
                <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em]">
                  {label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile: fixed bottom navigation bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#05010f]/85 backdrop-blur-xl md:hidden [padding-bottom:env(safe-area-inset-bottom)]">
        <ul className="flex items-stretch justify-around px-1 py-2">
          {items.map(({ label, href, Icon }) => (
            <li key={label} className="flex-1">
              <a
                href={href}
                className="flex flex-col items-center gap-1 rounded-lg py-1.5 text-white/70 transition-colors active:text-cyan"
              >
                <Icon className="h-5 w-5 drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]" />
                <span className="font-mono text-[8px] font-semibold uppercase tracking-[0.1em]">
                  {label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
