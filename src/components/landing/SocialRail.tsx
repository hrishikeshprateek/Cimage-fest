import {
  InstagramIcon,
  LinkedInIcon,
  YouTubeIcon,
  XIcon,
  FacebookIcon,
  DiscordIcon,
  WhatsAppIcon,
} from "./icons";

const socials = [
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "LinkedIn", href: "#", Icon: LinkedInIcon },
  { label: "YouTube", href: "#", Icon: YouTubeIcon },
  { label: "X", href: "#", Icon: XIcon },
  { label: "Facebook", href: "#", Icon: FacebookIcon },
  { label: "Discord", href: "#", Icon: DiscordIcon },
  { label: "WhatsApp", href: "#", Icon: WhatsAppIcon },
];

export default function SocialRail() {
  return (
    <nav className="fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 md:block">
      <ul className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-black/25 px-3 py-6 backdrop-blur-md">
        {socials.map(({ label, href, Icon }) => (
          <li key={label}>
            <a
              href={href}
              aria-label={label}
              className="block text-white/70 transition-colors hover:text-magenta"
            >
              <Icon className="h-5 w-5 drop-shadow-[0_0_6px_rgba(232,121,249,0.4)]" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
