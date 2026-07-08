// Central festival details — swap these for the confirmed information.

export const fest = {
  name: "CIMAGE FEST",
  edition: "2026",
  tagline: "Bihar's Largest Science & Technology Festival",
  dates: "Jul 18–19, 25–26 · Aug 1–2, 8–9",
  venue: "CIMAGE Campus, Patna",
  // Backend slug used by the "Get Pass" registration dialog
  // (GET/POST /api/fest/{passSlug}/…). Override via NEXT_PUBLIC_FEST_PASS_SLUG.
  passSlug: process.env.NEXT_PUBLIC_FEST_PASS_SLUG ?? "weekend-fest",
};

// Admission / helpdesk numbers shown in the Contact popup.
export const admissionSupport = [
  "+91 7250767676",
  "+91 8294040444",
  "+91 9304721320",
  "+91 9693822512",
];

// --- Event tracks ---------------------------------------------------------
// The events page groups the same line-up into three tracks. Each activity is
// bucketed by keyword-matching its category (falling back to its name).
export type Track = "learn" | "play" | "celebrate";

export const TRACKS: {
  key: Track;
  label: string;
  tagline: string;
}[] = [
  { key: "learn", label: "Learn", tagline: "Hackathons, coding & tech showdowns." },
  { key: "play", label: "Play", tagline: "Robotics, gaming & arena battles." },
  { key: "celebrate", label: "Celebrate", tagline: "Music, culture & the main stage." },
];

const TRACK_KEYWORDS: Record<Track, string[]> = {
  learn: [
    "tech", "cod", "hack", "business", "pitch", "startup", "data", "ai",
    "cyber", "design", "ux", "ui", "seminar", "workshop", "quiz", "debate",
    "paper", "ideathon", "innovation", "web", "app",
  ],
  play: [
    "game", "gaming", "esport", "robot", "robo", "sport", "race", "drone",
    "arena", "battle", "clash", "war", "soccer", "cricket", "football",
    "valorant", "bgmi", "line follower",
  ],
  celebrate: [
    "cultural", "culture", "music", "band", "dance", "art", "fashion", "sing",
    "concert", "dj", "celebrat", "drama", "theatre", "theater", "fun", "nukkad",
    "photography", "open mic",
  ],
};

// Bucket an activity into a track. Category is the primary signal; the name is
// a fallback. Unmatched activities default to "play".
export function trackOf(activity: {
  category?: string | null;
  name?: string | null;
}): Track {
  const hay = `${activity.category ?? ""} ${activity.name ?? ""}`.toLowerCase();
  // Celebrate is checked first so e.g. "Battle of Bands" (band ✓) isn't
  // captured by "battle" in the Play list.
  const order: Track[] = ["celebrate", "learn", "play"];
  for (const t of order) {
    if (TRACK_KEYWORDS[t].some((k) => hay.includes(k))) return t;
  }
  return "play";
}

export type FestEvent = {
  slug: string;
  title: string;
  category: string;
  icon: string;
  accent: string; // tailwind gradient stops
  blurb: string;
  date: string;
  time: string;
  venue: string;
  prize: string;
  team: string;
};

export const eventCategories = [
  "All",
  "Technical",
  "Robotics",
  "Coding",
  "Gaming",
  "Business",
  "Cultural",
] as const;

export const events: FestEvent[] = [
  {
    slug: "hack-the-future",
    title: "Hack the Future",
    category: "Coding",
    icon: "⚡",
    accent: "from-violet-500 to-fuchsia-500",
    blurb:
      "Our 36-hour flagship hackathon. Form a squad, ship a working product and pitch it to a jury of industry engineers.",
    date: "Mar 13 – 14",
    time: "10:00 AM",
    venue: "Innovation Hall",
    prize: "₹2,00,000",
    team: "2 – 4",
  },
  {
    slug: "robowars",
    title: "RoboWars",
    category: "Robotics",
    icon: "🤖",
    accent: "from-cyan-500 to-blue-500",
    blurb:
      "Combat robots enter the arena. Design, build and battle it out for the championship belt in front of a roaring crowd.",
    date: "Mar 14",
    time: "02:00 PM",
    venue: "Arena Dome",
    prize: "₹1,50,000",
    team: "3 – 6",
  },
  {
    slug: "code-sprint",
    title: "Code Sprint",
    category: "Coding",
    icon: "💻",
    accent: "from-emerald-500 to-teal-500",
    blurb:
      "An ICPC-style algorithmic showdown. Three hours, ten problems, one leaderboard. May the fastest solver win.",
    date: "Mar 13",
    time: "11:00 AM",
    venue: "Lab Complex",
    prize: "₹75,000",
    team: "Solo",
  },
  {
    slug: "pitchx",
    title: "PitchX",
    category: "Business",
    icon: "🚀",
    accent: "from-amber-500 to-orange-500",
    blurb:
      "Pitch your venture to real VCs and founders. Standout ideas walk away with seed grants and incubation offers.",
    date: "Mar 15",
    time: "12:00 PM",
    venue: "Auditorium",
    prize: "₹1,00,000",
    team: "1 – 4",
  },
  {
    slug: "ai-arena",
    title: "AI Arena",
    category: "Technical",
    icon: "🧠",
    accent: "from-pink-500 to-rose-500",
    blurb:
      "A data-science gauntlet. Train your models against a live hidden test set and fight your way to the top of the board.",
    date: "Mar 14",
    time: "10:30 AM",
    venue: "Lab Complex",
    prize: "₹80,000",
    team: "1 – 3",
  },
  {
    slug: "drone-grand-prix",
    title: "Drone Grand Prix",
    category: "Technical",
    icon: "🛸",
    accent: "from-indigo-500 to-violet-500",
    blurb:
      "FPV drones scream through a neon obstacle circuit at breakneck speed. Fastest lap takes the trophy.",
    date: "Mar 15",
    time: "09:30 AM",
    venue: "Open Grounds",
    prize: "₹60,000",
    team: "1 – 2",
  },
  {
    slug: "cyber-siege",
    title: "CyberSiege",
    category: "Technical",
    icon: "🛡️",
    accent: "from-red-500 to-rose-600",
    blurb:
      "A live capture-the-flag. Breach the defenses, grab the flags and own the scoreboard before time runs out.",
    date: "Mar 13",
    time: "03:00 PM",
    venue: "Cyber Lab",
    prize: "₹90,000",
    team: "2 – 4",
  },
  {
    slug: "valorant-clash",
    title: "Valorant Clash",
    category: "Gaming",
    icon: "🎮",
    accent: "from-fuchsia-500 to-purple-600",
    blurb:
      "The premier esports showdown. Five-a-side squads battle through the bracket on the main gaming stage.",
    date: "Mar 14",
    time: "04:00 PM",
    venue: "Esports Stage",
    prize: "₹1,20,000",
    team: "5",
  },
  {
    slug: "line-follower",
    title: "Line Follower",
    category: "Robotics",
    icon: "🚗",
    accent: "from-sky-500 to-cyan-500",
    blurb:
      "Autonomous bots race a twisting track guided only by sensors. Precision engineering meets raw speed.",
    date: "Mar 13",
    time: "01:00 PM",
    venue: "Arena Dome",
    prize: "₹50,000",
    team: "2 – 3",
  },
  {
    slug: "battle-of-bands",
    title: "Battle of Bands",
    category: "Cultural",
    icon: "🎸",
    accent: "from-orange-500 to-red-500",
    blurb:
      "College bands take the main stage after dark. Play your heart out and let the crowd crown the champions.",
    date: "Mar 15",
    time: "06:00 PM",
    venue: "Main Stage",
    prize: "₹85,000",
    team: "3 – 8",
  },
  {
    slug: "robo-soccer",
    title: "Robo Soccer",
    category: "Robotics",
    icon: "⚽",
    accent: "from-green-500 to-emerald-500",
    blurb:
      "Remote-controlled bots go head-to-head on the pitch. Score more goals than your rival to advance.",
    date: "Mar 14",
    time: "11:30 AM",
    venue: "Arena Dome",
    prize: "₹55,000",
    team: "2 – 4",
  },
  {
    slug: "ui-ux-jam",
    title: "UI/UX Jam",
    category: "Business",
    icon: "🎨",
    accent: "from-teal-500 to-cyan-500",
    blurb:
      "A rapid design sprint. Solve a real product brief and present a polished prototype in a single day.",
    date: "Mar 15",
    time: "10:00 AM",
    venue: "Design Studio",
    prize: "₹45,000",
    team: "1 – 3",
  },
];
