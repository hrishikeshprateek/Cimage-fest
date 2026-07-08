import { asset } from "@/lib/assets";

// Content model for the MU-styled sections on the About page.
// `programs` drives <MUPrograms/> — grouped UG/PG programme rails.
// Programme names match the FIELD map keys in MUPrograms so each card gets the
// nicer "…in <field>" wording; anything unmapped falls back to the raw name.

const APPLY = "https://admissions.cimagepatna.com/";

type Program = { name: string; href: string; img: string; desc: string };
type ProgramGroup = { label: string; items: Program[] };

// `reasons` drives <MUReasons/> — the sticky-stack "Six reasons it works" deck.
// Each item supplies the card image + a numbered glyph; imageContain flags a
// logo (fit: contain) rather than a photo (fit: cover).
type Reason = { image: string; glyph: string; imageContain?: boolean };

export const copy: {
  programs: { groups: ProgramGroup[] };
  reasons: { sub: string; items: Reason[] };
} = {
  reasons: {
    sub: "Why CIMAGE has been the first IT / Management pick in Bihar for 17+ years.",
    items: [
      { image: asset("/sumedh.webp"), glyph: "01" },
      { image: asset("/eyantra.jpeg"), glyph: "02" },
      { image: asset("/collab/Right-Image.webp"), glyph: "03" },
      { image: asset("/placement.webp"), glyph: "04" },
      { image: asset("/google-cloud.png"), glyph: "05", imageContain: true },
      { image: asset("/lab.jpeg"), glyph: "06" },
    ],
  },
  programs: {
    groups: [
      {
        label: "Undergraduate",
        items: [
          {
            name: "BCA",
            href: APPLY,
            img: asset("/sumedh.webp"),
            desc: "Computer Applications, industry-integrated — Java, Python, full-stack and cloud, rebuilt with recruiters every year.",
          },
          {
            name: "B.Tech",
            href: APPLY,
            img: asset("/eyantra.jpeg"),
            desc: "CSE · AI-ML · ECE · Electrical · Civil, with hands-on time in an IIT Bombay–certified E-Yantra robotics lab.",
          },
          {
            name: "BBA",
            href: APPLY,
            img: asset("/placement.webp"),
            desc: "Business Administration built around live projects, case work and a placement cell that starts in year one.",
          },
          {
            name: "B.Sc. (IT)",
            href: APPLY,
            img: asset("/lab.jpeg"),
            desc: "Information Technology from fundamentals to cloud, taught in dedicated labs with Google Workspace built in.",
          },
          {
            name: "B.Com (P)",
            href: APPLY,
            img: asset("/event/ntd.jpeg"),
            desc: "Commerce — Professional track, pairing accounting and finance depth with the campus's tech-first culture.",
          },
        ],
      },
      {
        label: "Postgraduate",
        items: [
          {
            name: "MCA",
            href: APPLY,
            img: asset("/collab/Right-Image.webp"),
            desc: "Master of Computer Applications — advanced software, systems and industry-graded coursework under a Wipro CoE MoU.",
          },
          {
            name: "MBA",
            href: APPLY,
            img: asset("/event/ojas.jpeg"),
            desc: "Business Administration, industry-mentored, with 200+ recruiting companies and a state-leading placement record.",
          },
          {
            name: "PGDM",
            href: APPLY,
            img: asset("/event/robo.jpeg"),
            desc: "AIMA Post Graduate Diploma in Management — a professional management track with a strong industry interface.",
          },
        ],
      },
    ],
  },
};
