// Central placeholder content for CIMAGE Fest. Swap these out for real data
// as the event details are finalised.

export const fest = {
  name: "CIMAGE FEST",
  edition: "2027",
  tagline: "Bihar's Biggest Tech, Culture & Innovation Festival",
  // Countdown target — update to the confirmed opening date/time.
  startISO: "2027-03-13T09:00:00+05:30",
  dates: "March 13 – 15, 2027",
  venue: "CIMAGE Campus, Patna, Bihar",
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Events", href: "#events" },
  { label: "Speakers", href: "#speakers" },
  { label: "Sponsors", href: "#sponsors" },
  { label: "Gallery", href: "#gallery" },
  { label: "FAQ", href: "#faq" },
];

export const stats = [
  { value: 20000, suffix: "+", label: "Footfall" },
  { value: 60, suffix: "+", label: "Events" },
  { value: 150, suffix: "+", label: "Colleges" },
  { value: 10, suffix: "L+", label: "Prize Pool" },
];

export type FestEvent = {
  title: string;
  category: string;
  blurb: string;
  accent: string; // tailwind gradient stops
  icon: string;
};

export const events: FestEvent[] = [
  {
    title: "Hack the Future",
    category: "Hackathon",
    blurb: "36-hour flagship hackathon — build products that ship, mentored by industry engineers.",
    accent: "from-violet-500 to-fuchsia-500",
    icon: "⚡",
  },
  {
    title: "RoboWars",
    category: "Robotics",
    blurb: "Combat robots clash in the arena. Design, build and battle for the championship belt.",
    accent: "from-cyan-500 to-blue-500",
    icon: "🤖",
  },
  {
    title: "Code Sprint",
    category: "Competitive Programming",
    blurb: "An ICPC-style algorithmic showdown. Three hours, ten problems, one leaderboard.",
    accent: "from-emerald-500 to-teal-500",
    icon: "💻",
  },
  {
    title: "PitchX",
    category: "Startup",
    blurb: "Pitch your venture to real VCs and founders. Seed grants for the standout ideas.",
    accent: "from-amber-500 to-orange-500",
    icon: "🚀",
  },
  {
    title: "AI Arena",
    category: "Machine Learning",
    blurb: "A data-science gauntlet — train models against a live hidden test set to top the board.",
    accent: "from-pink-500 to-rose-500",
    icon: "🧠",
  },
  {
    title: "Drone Grand Prix",
    category: "Aeromodelling",
    blurb: "FPV drones race a neon obstacle circuit at breakneck speed. Fastest lap wins.",
    accent: "from-indigo-500 to-violet-500",
    icon: "🛸",
  },
  {
    title: "CyberSiege",
    category: "Capture the Flag",
    blurb: "A live cybersecurity CTF. Breach the defenses, capture the flags, own the scoreboard.",
    accent: "from-red-500 to-rose-600",
    icon: "🛡️",
  },
  {
    title: "Rhythm Nights",
    category: "Cultural",
    blurb: "Headline concerts, DJ sets and the campus lit up after dark. The fest never sleeps.",
    accent: "from-sky-500 to-cyan-500",
    icon: "🎶",
  },
];

export type Speaker = {
  name: string;
  role: string;
  initials: string;
  accent: string;
};

export const speakers: Speaker[] = [
  { name: "Dr. Aarav Mehta", role: "AI Researcher, DeepMind", initials: "AM", accent: "from-violet-500 to-indigo-500" },
  { name: "Priya Nair", role: "Founder & CEO, OrbitLabs", initials: "PN", accent: "from-cyan-500 to-teal-500" },
  { name: "Rahul Verma", role: "VP Engineering, Stripe", initials: "RV", accent: "from-fuchsia-500 to-pink-500" },
  { name: "Ananya Rao", role: "Astrophysicist, ISRO", initials: "AR", accent: "from-amber-500 to-orange-500" },
  { name: "Kabir Singh", role: "Robotics Lead, Boston Dynamics", initials: "KS", accent: "from-emerald-500 to-green-500" },
  { name: "Meera Iyer", role: "Design Director, Figma", initials: "MI", accent: "from-rose-500 to-red-500" },
];

export type SponsorTier = {
  tier: string;
  names: string[];
};

export const sponsors: SponsorTier[] = [
  { tier: "Title Sponsor", names: ["NEXUS"] },
  { tier: "Powered By", names: ["Voltix", "Quantech"] },
  {
    tier: "Gold Partners",
    names: ["Aeronova", "ByteForge", "Nimbus Cloud", "Helios"],
  },
  {
    tier: "Associate Partners",
    names: ["Pixel Co", "Corely", "Stratum", "Vertex", "Lumen", "Hexad"],
  },
];

// Gallery tiles are gradient placeholders — replace `label` swatches with real
// event photos once available.
export const gallery = [
  { label: "Main Stage", accent: "from-violet-600 to-fuchsia-600" },
  { label: "Hackathon Floor", accent: "from-cyan-600 to-blue-600" },
  { label: "RoboWars Arena", accent: "from-amber-600 to-orange-600" },
  { label: "Night Concert", accent: "from-pink-600 to-rose-600" },
  { label: "Startup Expo", accent: "from-emerald-600 to-teal-600" },
  { label: "Drone Circuit", accent: "from-indigo-600 to-violet-600" },
  { label: "Keynote Hall", accent: "from-sky-600 to-cyan-600" },
  { label: "Closing Ceremony", accent: "from-red-600 to-rose-600" },
];

export const faqs = [
  {
    q: "Who can participate in CIMAGE Fest?",
    a: "Everyone. Students from any school, college or university across the country are welcome, and most events are open to enthusiasts and professionals too.",
  },
  {
    q: "How do I register?",
    a: "Registration opens closer to the event. Hit any “Register” button to join the waitlist and you'll be the first to get your pass when it goes live.",
  },
  {
    q: "Is there an entry fee?",
    a: "General fest entry is free. A handful of premium competitions and workshops carry a nominal fee, always listed on the event page.",
  },
  {
    q: "Will accommodation be provided?",
    a: "Yes — subsidised on-campus accommodation is available for outstation participants on a first-come, first-served basis.",
  },
  {
    q: "Can I volunteer or join the team?",
    a: "Absolutely. We onboard campus ambassadors and volunteers every year — reach out through the contact details in the footer.",
  },
];
