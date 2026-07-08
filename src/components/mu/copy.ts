import { asset, S3_BASE } from "./assets";
import { OFFER_LETTERS } from "./offerLetters";
// Reel media is served from S3 (CDN-friendly, keeps heavy video off the app host).
const REELS = `${S3_BASE}/reels`;

export const copy = {
  hero: {
    display: "Mummy, job lag gaya — CIMAGE BCA Admissions 2026",
    headline: "Mummy, job lag gaya, yeh moment yahin se start hota hai",
    // Two-tone rendering: the middle clause sits in the accent colour.
    headlineParts: [
      { text: "Mummy, ", accent: false },
      { text: "job lag gaya, yeh moment ", accent: true },
      { text: "yahin se start hota hai", accent: false },
    ],
    sub: "Industry-focused programs designed to build real careers — not just degrees.",
    cta: "Apply Now",
    counsellorCta: "Talk to Counsellor",
    phone: "7250767676",
  },
  numbers: {
    eyebrow: "The numbers do the talking.",
    sub: "Seventeen-plus years. One pattern.",
    closing: "Consistently high placement rate, batch after batch.",
    items: [
      { value: "13,500+", label: "alumni placed across 17+ years" },
      { value: "₹37 LPA", label: "highest package · BCA" },
      { value: "₹4.5 LPA", label: "average package" },
      { value: "317", label: "selections in TCS, single drive" },
      { value: "130+", label: "ICICI Bank PO offers · ₹4.5 LPA each" },
      { value: "200+", label: "recruiting companies" },
      { value: "50%+", label: "of Bihar's IT placements" },
      { value: "17+", label: "years of placement track record" },
    ],
  },
  recruiters: {
    eyebrow: "Where they get hired.",
    items: [
      // logo = full colour (shown in light theme); logoWhite = monochrome
      // white (shown in dark theme). Swapped via [data-theme] in globals.css.
      { name: "Wipro", logo: asset("/recruiter-logos/frame-19.webp"), logoWhite: asset("/recruiter-logos/frame-19_w.webp") },
      { name: "HCL", logo: asset("/recruiter-logos/frame-20.webp"), logoWhite: asset("/recruiter-logos/frame-20_w.webp") },
      { name: "Accenture", logo: asset("/recruiter-logos/frame-21.webp"), logoWhite: asset("/recruiter-logos/frame-21_w.webp") },
      { name: "Deloitte", logo: asset("/recruiter-logos/frame-22.webp"), logoWhite: asset("/recruiter-logos/frame-22_w.webp") },
      { name: "Cognizant", logo: asset("/recruiter-logos/frame-23.webp"), logoWhite: asset("/recruiter-logos/frame-23_w.webp") },
      { name: "Amdocs", logo: asset("/recruiter-logos/frame-24.webp"), logoWhite: asset("/recruiter-logos/frame-24_w.webp") },
    ],
    extras: ["TCS", "ICICI Bank", "IBM", "Rackspace", "J.P. Morgan", "Ernst & Young", "HSBC", "HDFC", "Coca-Cola"],
  },
  reasons: {
    eyebrow: "Behtar aur Better.",
    display: "Six reasons it works.",
    sub: "Why CIMAGE has been the first IT/Management pick in Bihar for 17+ years.",
    items: [
      {
        title: "Industry-Aligned Curriculum",
        body: "Java, Python, DBMS, Web Dev, Cloud — updated each year against what the IT market is actually testing for.",
        glyph: "01",
        image: asset("/sumedh.webp"),
      },
      {
        title: "IIT Bombay E-Yantra Lab",
        body: "The only BCA college in Bihar with an IIT Bombay-certified robotics & AI lab on campus.",
        glyph: "02",
        image: asset("/eyantra.jpeg"),
      },
      {
        title: "Wipro Centre of Excellence",
        body: "An active MOU with Wipro Ltd. for student training and domain learning. Wipro-signed certification before you graduate.",
        glyph: "03",
        image: asset("/wipro.webp"),
      },
      {
        title: "Dedicated Placement Cell",
        body: "Structured training from year one — aptitude, mock interviews, GD prep, soft skills. The interview is round four, not round one.",
        glyph: "04",
        image: asset("/placement.webp"),
      },
      {
        title: "Only Google for Education Partner in Bihar",
        body: "CIMAGE is the only Google for Education partner in the state — Google's certified tools and Workspace built into everyday teaching, so you train on the same platforms the industry actually runs on.",
        glyph: "05",
        image: asset("/google-cloud.png"),
        imageContain: true,
      },
      {
        title: "Language Lab Support",
        body: "Hindi-medium students get a year of dedicated English-communication training. By placement season, the language gap is closed.",
        glyph: "06",
        image: asset("/lab.jpeg"),
      },
    ],
    closing: "From day one, you're groomed for the offer round — not just the exam round.",
  },
  visitors: {
    eyebrow: "Who's walked through these gates.",
    sub: "Past campus guests, in their own words on the stage.",
    // photo: self-hosted in /public/visitors (sourced from Wikimedia Commons).
    // credit: required attribution — keep it; the licenses (GODL-India, CC-BY,
    // CC-BY-SA, free "Attribution") all mandate crediting the source.
    items: [
      { name: "Dr. A.P.J. Abdul Kalam", role: "Former President of India", photo: asset("/visitors/abdul-kalam-cimage.webp"), credit: "CIMAGE Archives" },
      { name: "Shri Nitish Kumar", role: "Ex-Chief Minister of Bihar", photo: asset("/visitors/nitish-kumar-cimage.webp"), credit: "CIMAGE Archives" },
      { name: "Shri Rajendra Arlekar", role: "Hon. Governor of Bihar", photo: asset("/visitors/rajendra-arlekar.jpg"), credit: "PMO, Govt. of India · GODL-India" },
      { name: "Shri Ramesh Pokhriyal", role: "Former HRD Minister, Govt. of India", photo: asset("/visitors/ramesh-pokhriyal.jpg"), credit: "Ministry of Education · GODL-India" },
      { name: "Shri Ashok Choudhary", role: "Minister, Govt. of Bihar", photo: asset("/visitors/ashok-choudhary.jpg"), credit: "Govt. of Bihar" },
      { name: "Dr. Sanjay Paswan", role: "Former Union Minister", photo: asset("/visitors/sanjay-paswan.jpg"), credit: "Govt. of India · GODL-India" },
      { name: "Piyush Mishra", role: "Actor, Lyricist & Theatre Artist", photo: asset("/visitors/piyush-mishra-cimage.webp"), credit: "CIMAGE Archives" },
      { name: "Shri Shekhar Sen", role: "Theatre Artist", photo: asset("/visitors/shekhar-sen.jpg"), credit: "Niteshukla / Wikimedia · CC BY-SA 4.0" },
      { name: "Sudesh Lehri", role: "Comedian & Actor", photo: asset("/visitors/sudesh-lehri.jpg"), credit: "Bollywood Hungama · CC BY 3.0" },
      { name: "Shri Padamjit Sahrawat", role: "Author & Commentator" },
      { name: "Vice-Chancellor", role: "Patliputra University" },
    ],
    // Real CIMAGE guest/event photos (S3). Caption-less gallery — add per-photo
    // names later if needed. Shown by MUVisitors in place of the `items` rail.
    gallery: [
      `${S3_BASE}/WhatsApp+Image+2026-06-26+at+16.11.40+(1).jpeg`,
      `${S3_BASE}/WhatsApp+Image+2026-06-26+at+17.46.49.jpeg`,
      `${S3_BASE}/WhatsApp+Image+2026-06-26+at+16.11.05.jpeg`,
      `${S3_BASE}/WhatsApp+Image+2026-06-26+at+16.11.36.jpeg`,
      `${S3_BASE}/WhatsApp+Image+2026-06-26+at+16.11.22.jpeg`,
      `${S3_BASE}/WhatsApp+Image+2026-06-26+at+16.11.23.jpeg`,
      `${S3_BASE}/WhatsApp+Image+2026-06-26+at+16.11.34.jpeg`,
      `${S3_BASE}/WhatsApp+Image+2026-06-26+at+16.11.21.jpeg`,
      `${S3_BASE}/WhatsApp+Image+2026-06-26+at+16.11.38.jpeg`,
      `${S3_BASE}/WhatsApp+Image+2026-06-26+at+16.11.40.jpeg`,
      `${S3_BASE}/WhatsApp+Image+2026-06-26+at+16.11.15.jpeg`,
      `${S3_BASE}/WhatsApp+Image+2026-06-26+at+16.10.50.jpeg`,
      `${S3_BASE}/WhatsApp+Image+2026-06-26+at+16.10.41.jpeg`,
    ],
  },
  // Immersive "wall of offer letters" (MUOfferWall). 149 real offer letters,
  // sourced from cimage.in/offer-letters and re-hosted on S3 — see OFFER_LETTERS
  // in lib/offerLetters.ts. The wall auto-fills and loops however many you add.
  offerLetters: {
    display: "Pehle CIMAGE jaisa",
    displayAccent: "offer letter dikhao.",
    sub: "Real company offer letters our students have earned — and counting. Tap any letter to view it full-size.",
    items: OFFER_LETTERS.map((img) => ({ img })),
  },
  stack: {
    display: "What you'll actually build.",
    sub: "A curriculum tuned to what hiring managers are testing for — not what textbooks last reprinted.",
    pillars: [
      { name: "Java", hint: "OOP · DSA · Spring", logo: asset("/tech/java.svg") },
      { name: "Python", hint: "Scripting · Data · ML basics", logo: asset("/tech/python.svg") },
      { name: "DBMS", hint: "SQL · Modeling · Optimization", logo: asset("/tech/mysql.svg") },
      { name: "Cloud", hint: "AWS · Azure fundamentals", logo: asset("/tech/cloud.svg") },
      { name: "Web", hint: "HTML · React · APIs", logo: asset("/tech/react.svg") },
      { name: "AI & Robotics", hint: "E-Yantra · CV · NLP", logo: asset("/tech/ai.svg") },
    ],
    closing: "Sab kuch hands-on. First semester se.",
  },
  labs: {
    display: "Wipro and IIT Bombay, on campus.",
    sub: "The only BCA college in Bihar with an IIT Bombay-certified robotics & AI lab on campus. We've signed an MoU with Wipro for the Centre of Excellence, and we're IIT Bombay's Spoken Tutorial Nodal Resource Centre for Patna. Both agreements are below.",
    blocks: [
      {
        title: "E-Yantra · IIT Bombay",
        body: "Robotics teams. Real competition tracks. Certified by an IIT.",
        image: `${S3_BASE}/Screenshot+2026-06-26+at+3.44.20%E2%80%AFPM.png`,
        badge: "IIT Bombay · E-Yantra Certified",
      },
      {
        title: "Wipro Centre of Excellence",
        body: "Industry-graded coursework, signed off by a Wipro panel. The certification sits on your CV before you graduate.",
        image: asset("/collab/Right-Image.webp"),
        badge: "Wipro CoE · Active Partnership",
      },
      {
        title: "Google for Education Partner",
        body: "The only Google for Education partner in Bihar — certified Google tools and Workspace built into everyday teaching, so you train on the platforms the industry actually runs on.",
        image: "https://cimage.in/wp-content/uploads/2026/05/Google-Cloud-2.png",
        badge: "Google Partner · Certified",
      },
      {
        title: "Skill Acceleration Lab",
        body: "Hands-on AI, full-stack and industry-certification tracks that fast-track you from coursework to a job-ready portfolio — on campus, every semester.",
        image: "https://cimagedigital.com/wp-content/uploads/2026/05/Recognition-and-appreciation-for-establishing-the-Spoken-Tutorial-Skill-Accelerator-Lab-at-CIMAGE.jpeg",
        badge: "Skill Acceleration · On Campus",
      },
    ],
  },
  alumni: {
    display: "Where the alumni went.",
    sub: "Patna, Bengaluru, Dubai, London, Zurich. Here are a few of them.",
    closing: "",
    cards: [
      { img: asset("/alumni-cards/a1.webp"), company: "Ernst & Young" },
      { img: asset("/alumni-cards/a2.webp"), company: "Plant Ground Engineering Services" },
      { img: asset("/alumni-cards/a3.webp"), company: "Wipro" },
      { img: asset("/alumni-cards/a4.webp"), company: "J.P. Morgan" },
      { img: asset("/alumni-cards/a5.webp"), company: "Rackspace" },
      { img: asset("/alumni-cards/a6.webp"), company: "Rackspace" },
      { img: asset("/alumni-cards/a7.webp"), company: "TCS" },
      { img: asset("/alumni-cards/a8.webp"), company: "HCL Tech" },
    ],
    pins: [
      { city: "California", country: "USA", companies: ["TK Company"], x: 13, y: 37 },
      { city: "Boston", country: "USA", companies: ["TK Company"], x: 26, y: 34 },
      { city: "London", country: "UK", companies: ["J.P. Morgan", "Rackspace"], x: 47, y: 28 },
      { city: "Zurich", country: "Switzerland", companies: ["Wipro", "TCS"], x: 50, y: 31 },
      { city: "Dubai", country: "UAE", companies: ["Ernst & Young", "Plant Ground Engineering"], x: 59, y: 42 },
    ],
    patna: { x: 69, y: 41 },
  },
  starPlacements: {
    eyebrow: "The star placements",
    display: "Real students. Real offers.",
    sub: "From Patna classrooms to the Big Four and global tech — a few of the names behind the numbers.",
    // Extracted from the official CIMAGE Star Placements records. `package` is
    // the headline stat for domestic offers; `location` carries the same weight
    // for the alumni placed abroad.
    students: [
      { img: asset("/star-placements/anup-gupta.webp"), name: "Anup Gupta", course: "BCA", company: "PwC", role: "Manager / Principal Consultant", package: "26 LPA", district: "Chhapra" },
      { img: asset("/star-placements/priyanka-kumari-novigo.webp"), name: "Priyanka Kumari", course: "BCA", company: "Novigo Solutions", role: "Associate Test Manager", package: "24 LPA" },
      { img: asset("/star-placements/pratik-kumar.webp"), name: "Pratik Kumar", course: "BCA", company: "Ernst & Young LLP", role: "Senior Consultant", package: "15 LPA", district: "Patna" },
      { img: asset("/star-placements/sushant-ketu.webp"), name: "Sushant Ketu", course: "BSc. IT", company: "Coforge", role: "Technical Lead", package: "15 LPA", district: "Siwan, Bihar" },
      { img: asset("/star-placements/ankit-raj-capgemini.webp"), name: "Ankit Raj", course: "BSc. IT", company: "Capgemini", role: "Consultant", package: "15 LPA", district: "Bhojpur" },
      { img: asset("/star-placements/raj-priyadarshi.webp"), name: "Raj Priyadarshi", course: "BCA", company: "EY Global Services", role: "Consultant", package: "14.36 LPA" },
      { img: asset("/star-placements/saket-kumar.webp"), name: "Saket Kumar", course: "BBA", company: "Capgemini", package: "14 LPA", district: "Saran" },
      { img: asset("/star-placements/diksha.webp"), name: "Diksha", course: "BCA", company: "Gupshup Technology", role: "Bangalore", package: "6.5 LPA", district: "Patna" },
      { img: asset("/star-placements/ritik-anand.webp"), name: "Ritik Anand", course: "BBA", company: "Kotak Mahindra Bank", role: "Deputy Manager", package: "5.6 LPA" },
      { img: asset("/star-placements/suman-kumar.webp"), name: "Suman Kumar", course: "BBA", company: "Kotak Mahindra Bank", role: "Deputy Manager", package: "5.5 LPA", district: "Bhagalpur" },
      { img: asset("/star-placements/vishesh-sahay.webp"), name: "Vishesh Sahay", company: "Ernst & Young", location: "Dubai, UAE" },
      { img: asset("/star-placements/amrendra-kumar-pandey.webp"), name: "Amrendra Kumar Pandey", company: "Strong Plant Ground Engineering Services", location: "Dubai, UAE" },
      { img: asset("/star-placements/sweta-kumari.webp"), name: "Sweta Kumari", company: "J.P. Morgan", location: "London, UK" },
      { img: asset("/star-placements/nishi-prakash.webp"), name: "Nishi Prakash", company: "Rackspace", location: "London, UK" },
      { img: asset("/star-placements/rahul-sharma.webp"), name: "Rahul Sharma", company: "Rackspace", location: "London, UK" },
      { img: asset("/star-placements/samiksha-gupta.webp"), name: "Samiksha Gupta", company: "Wipro", location: "Irving, Texas, USA" },
      { img: asset("/star-placements/suraj-prakash.webp"), name: "Suraj Prakash", company: "Wipro", location: "Sydney, Australia" },
      { img: asset("/star-placements/priyanka-kumari-tcs.webp"), name: "Priyanka Kumari", course: "BCA", company: "TCS", location: "Michigan, USA" },
      { img: asset("/star-placements/monu-singh.webp"), name: "Monu Singh", course: "BCA", company: "HCL Tech", location: "Vancouver, Canada" },
      { img: asset("/star-placements/monika-roy.webp"), name: "Monika Roy", company: "Ocado Technology", location: "Tokyo, Japan" },
    ],
  },
  campus: {
    display: "Not just the classroom.",
    sub: "There's National Technology Day, the Ojas Sports Meet, Robo Race, and the Holi Mela that takes over the entire campus.",
    body: "An annual cultural fest the city shows up for. An innovation summit where startups pitch before they have an office. An inter-college sports tournament. A robo race that takes over the atrium. A Holi Mela that takes over campus. A one-day start-up challenge — and sometimes, a real start-up afterwards.",
    events: [
      { name: "National Technology Day", image: asset("/event/ntd.jpeg"), desc: "A campus-wide celebration of innovation, student projects, and tech demos." },
      { name: "Ojas Sports Meet", image: asset("/event/ojas.jpeg"), desc: "An inter-college sports tournament that runs through the year." },
      { name: "Robo Race", image: asset("/event/robo.jpeg"), desc: "A robotics race that takes over the campus atrium." },
      { name: "Industry Oriented Workshop", image: asset("/event/drone.jpeg"), desc: "Hands-on workshops on AI, drones, and emerging tech led by industry experts." },
      { name: "Holi Mela", image: asset("/event/holi.jpeg"), desc: "A Holi celebration that takes over the entire campus." },
      { name: "Cultural Fest", image: asset("/event/kathak.jpeg"), desc: "Music, dance, and performances on the main stage." },
    ],
  },
  trust: {
    display: "What the alumni say.",
    sub: "Five graduates, in their own words.",
    visitorLine: "Past campus visitors include Dr. A.P.J. Abdul Kalam, Shri Nitish Kumar, and the Governor of Bihar.",
    badges: ["AICTE", "NAAC B++", "NIRF", "ISO 9001:2015"],
    testimonials: [
      {
        photo: asset("/testimonials/t-0.webp"),
        meta: "BCA · placed in Dubai",
        quote:
          "Three years of being pushed harder than I thought I could be — and one day I was in Dubai for the offer.",
      },
      {
        photo: asset("/testimonials/t-3.webp"),
        meta: "BCA · placed in the UK",
        quote:
          "First semester se hi projects — Java, DBMS, web. I had a working portfolio before I had a CV.",
      },
      {
        photo: asset("/testimonials/t-5.webp"),
        meta: "BCA · placed in London",
        quote:
          "By the time TCS came to campus, I'd already given mock interviews to seniors who'd been placed there the year before. The real one felt like the fourth round, not the first.",
      },
      {
        photo: asset("/testimonials/t-2.webp"),
        meta: "BCA · Batch 2024",
        quote:
          "Seeing top companies like TCS and Wipro recruiting on campus was a reality, not a brochure line.",
      },
      {
        photo: asset("/testimonials/t-1.webp"),
        meta: "BCA · placed at a Big Four",
        quote:
          "Faculty here aren't lecturing from a textbook — they're former engineers who actually shipped things. That changes how you study.",
      },
    ],
  },
  // ── "Hear straight from our alumni" — MU's .insightSection card rail. Each
  //    card is a video still with a centred play button (opens the clip in a
  //    lightbox), then a title + short description. `youtube` = a YouTube id
  //    (preferred); `video` = a direct mp4 fallback (CIMAGE reels as placeholders
  //    — swap in real alumni interview clips). Thumbnails are real star-placement
  //    photos used as placeholders; swap `thumb` for the video still.
  videoStories: {
    display: "Hear straight from",
    displayAccent: "our alumni",
    sub: "Placements, the campus, internships and the years in between — all in their own words.",
    stories: [
      { title: "Vijaya Shree (BBA) shares her experience", desc: "CIMAGE alumna Vijaya Shree on her BBA years and life after CIMAGE — in her own words.", thumb: "https://i.ytimg.com/vi/pP7u0AeeQZo/hqdefault.jpg", youtube: "pP7u0AeeQZo", video: "" },
      { title: "₹20 LPA at Rackspace", desc: "Rahul on landing a ₹20 lakh annual package at cloud-computing company Rackspace.", thumb: "https://i.ytimg.com/vi/lrfEqlEA7C8/hqdefault.jpg", youtube: "lrfEqlEA7C8", video: "" },
      { title: "₹11 LPA — Logistics Head at Toyota", desc: "A CIMAGE student lands the Bihar–Jharkhand Logistics Head role at Toyota with an ₹11 lakh package.", thumb: "https://i.ytimg.com/vi/up0pUqzVaR8/hqdefault.jpg", youtube: "up0pUqzVaR8", video: "" },
      { title: "₹16.5 LPA in US cyber security", desc: "Prashant on his ₹16.5 lakh offer from a California-based cyber security company.", thumb: "https://i.ytimg.com/vi/7CFZT1_0lFQ/hqdefault.jpg", youtube: "7CFZT1_0lFQ", video: "" },
      { title: "A ₹16 lakh placement story", desc: "The success story behind a CIMAGE student's ₹16 lakh placement.", thumb: "https://i.ytimg.com/vi/GERmSNbj8ZI/hqdefault.jpg", youtube: "GERmSNbj8ZI", video: "" },
      { title: "Saurabh Kumar — ₹10 LPA", desc: "Saurabh Kumar (BBA/BCA) on his journey to a ₹10 lakh package — a CIMAGE Patna placement story.", thumb: "https://i.ytimg.com/vi/YPYPVLT-b3U/hqdefault.jpg", youtube: "YPYPVLT-b3U", video: "" },
    ],
  },
  awards: {
    display: "Recognized where it counts.",
    items: [
      { name: "AICTE Approved", logo: asset("/badges/aicte.webp") },
      { name: "NAAC B++", logo: asset("/badges/naac.webp") },
      { name: "ISO 9001:2015", logo: asset("/badges/iso.svg") },
      { name: "Atal Shresth Sansthan Samman · Govt. of India", logo: asset("/badges/emblem-india.png") },
      { name: "Shining Stars of Bihar · Hon. Governor", logo: asset("/badges/affiliation.webp") },
    ],
  },
  about: {
    title: "Bihar's largest IT & Management college,",
    titleAccent: "built for placements.",
    body: "17+ years. 13,500+ alumni placed. The only college with an IIT Bombay E-Yantra Lab and a Wipro Centre of Excellence — where students from across Bihar are trained, certified, and placed at TCS, ICICI Bank, and beyond.",
    cta: "Apply Now",
  },
  apply: {
    display: "Your move.",
    sub: "Batch 2026 fills fast.",
    cta: "Send me a call from admissions",
    successMsg: "Got it. We'll call you within one working day.",
    errorMsg: "Something went wrong. Please call 7250 767 676 or try again.",
    trustLine: "No spam. Counsellor calls within one working day. CIMAGE Tower, Patliputra Industrial Area · 7250 767 676.",
    // Lead-form section
    infoEyebrow: "Admissions Open 2026–27",
    infoTitle: "Bihar's #1 College",
    infoDesc: "For over 17 years, CIMAGE has been the first pick in Bihar. More than 13,500 of our alumni now work at TCS, Wipro, ICICI and beyond, and ours is still the only campus in the state with an IIT Bombay E-Yantra robotics lab.",
    infoPoints: [
      "317 students walked out with TCS offers in a single placement drive.",
      "Highest package so far is ₹37 LPA, with the batch averaging around ₹4.5 LPA.",
      "On campus you get both an IIT Bombay E-Yantra lab and a Wipro Centre of Excellence.",
      "AICTE approved and NAAC accredited.",
    ],
    formHeading: "Request a call - Batch 2026",
    formSub: "Drop your details and a counsellor calls you within one working day.",
    // `label` is shown in the dropdown; `value` is the short code sent to the
    // admission backend. Backend must whitelist each `value` string below.
    courses: [
      { label: "BCA", value: "BCA" },
      { label: "B.Tech – Computer Science & Engineering (CSE)", value: "B.Tech-CSE" },
      { label: "B.Tech – Artificial Intelligence & Machine Learning (AI-ML)", value: "B.Tech-AIML" },
      { label: "B.Tech – Electronics & Communication Engineering (ECE)", value: "B.Tech-ECE" },
      { label: "B.Tech – Electrical Engineering (EE)", value: "B.Tech-EE" },
      { label: "B.Tech – Civil Engineering (CE)", value: "B.Tech-CE" },
      { label: "MCA", value: "MCA" },
      { label: "B.Sc-IT", value: "B.Sc-IT" },
      { label: "MBA", value: "MBA" },
      { label: "BBA", value: "BBA" },
      { label: "B.Com.(P)", value: "B.Com.(P)" },
    ],
    boards: ["CBSE", "BSEB", "BIOS", "ICSE", "JAC", "UP Board", "NIOS", "Other"],
    streams: ["PCM", "PCB", "Commerce", "Arts", "Vocational", "Polytechnic"],
  },
  whyChoose: {
    title: "Why Choose ",
    titleAccent: "CIMAGE?",
    items: [
      { icon: "rank", title: "Top-Ranked Institute", body: "Recognized among the leading colleges for IT & Management education." },
      { icon: "lab", title: "Advanced IT Labs", body: "Hands-on learning with updated systems and a practical training environment." },
      { icon: "link", title: "Industry Linked", body: "Programs aligned with industry requirements, including IIT-linked training." },
      { icon: "briefcase", title: "Placement-Focused", body: "Training designed to prepare students for real job roles with industry exposure." },
      { icon: "laptop", title: "Digital Learning", body: "Access to online resources, recorded sessions, and hybrid learning options." },
      { icon: "briefcase", title: "Academic Ecosystem", body: "From classrooms to digital platforms, learning stays consistent everywhere." },
    ],
  },
  programs: {
    title: "Our Programs",
    sub: "Choose the right course across IT, Management, and Commerce — with practical learning and career-focused training.",
    groups: [
      {
        label: "Undergraduate",
        items: [
          { name: "BCA", desc: "Includes add-on courses aligned with industry needs, preparing students for IT roles.", href: "https://cimage.in/courses/bca/", img: asset("/programs/bca.webp") },
          { name: "B.Tech", desc: "Four-year engineering degree with hands-on labs, IIT Bombay-certified robotics & AI training, and strong placement support.", href: "https://cimage.in/courses/btech/", img: "https://cimage.in/wp-content/uploads/2025/07/bsc-it-1024x955.jpg" },
          { name: "BBA", desc: "Designed to develop skills required for business and corporate roles with placement support.", href: "https://cimage.in/courses/bba/", img: "https://cimage.in/wp-content/uploads/2025/07/bba-1024x955.jpg" },
          { name: "B.Sc. (IT)", desc: "Focused on Information Technology, preparing students for careers in the IT industry.", href: "https://cimage.in/courses/bsc/", img: "https://cimage.in/wp-content/uploads/2025/07/bsc-it-1024x955.jpg" },
          { name: "B.Com (P)", desc: "Covers accounting, economics, business law, and taxation with a strong academic foundation.", href: "https://cimage.in/courses/b-comp/", img: "https://cimage.in/wp-content/uploads/2025/07/bcom-1-1024x955.jpg" },
        ],
      },
      {
        label: "Postgraduate",
        items: [
          { name: "MCA", desc: "Advanced program focused on software development and deep technical expertise.", href: "https://cimage.in/courses/mca/", img: "https://cimage.in/wp-content/uploads/2025/07/pgdm-1024x955.jpg" },
          { name: "MBA", desc: "Covers key areas of business administration and management with practical scenario learning.", href: "https://cimage.in/courses/mba/", img: "https://cimage.in/wp-content/uploads/2025/07/pgdm-1024x955.jpg" },
        ],
      },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    sub: "Sab kuch jo aap admission se pehle jaanna chahte hain.",
    items: [
      { q: "Kya CIMAGE mein admission ke liye entrance exam zaroori hai?", a: "Haan, CIMAGE mein admission ke liye Entrance Exam dena zaruri hai. Iske baad Personal Interview bhi conduct kiya jata hai." },
      { q: "Kya yahan placement support milta hai?", a: "Haan, dedicated placement training milti hai — resume, interviews, aptitude sab cover hota hai." },
      { q: "Kya Hindi medium students yahan adjust kar paate hain?", a: "Bilkul. Teaching aur support system aisa hai ki students gradually comfortable ho jaate hain." },
      { q: "CIMAGE mein kaun-kaun se courses available hain?", a: "IT, Management aur Commerce ke multiple undergraduate aur postgraduate programs available hain." },
      { q: "Kya internships ka support milta hai?", a: "Haan, students ko internships aur practical exposure ke opportunities milte hain during the course." },
      { q: "Kya degree government recognized hai?", a: "Haan, courses recognized universities se affiliated hote hain." },
      { q: "Kya hostel facility available hai?", a: "Hostel aur accommodation support available hai (details counselling mein mil jaayengi)." },
      { q: "Kaunse companies placement ke liye aati hain?", a: "IT, banking aur corporate sector ki multiple companies campus hiring ke liye aati hain." },
    ],
  },
  join: {
    title: "Where Innovation Meets Opportunity",
    sub: "Your Journey Starts at CIMAGE",
    cta: "Join Us",
  },
  reels: {
    title: "Life at CIMAGE, in reels",
    sub: "Tap a story — placements, campus moments, and student journeys.",
    // Real vertical reels — compressed (H.264, faststart) with a poster frame
    // generated from each clip so the story bar loads instantly.
    items: [
      { name: "Campus Moments", cover: `${REELS}/reel-1.jpg`, video: `${REELS}/reel-1.mp4` },
      { name: "Campus Tour", cover: `${REELS}/reel-6.jpg`, video: `${REELS}/reel-6.mp4` },
      { name: "Student Diaries", cover: `${REELS}/reel-3.jpg`, video: `${REELS}/reel-3.mp4` },
      { name: "On Campus", cover: `${REELS}/reel-4.jpg`, video: `${REELS}/reel-4.mp4` },
      { name: "A Day at CIMAGE", cover: `${REELS}/reel-9.jpg`, video: `${REELS}/reel-9.mp4` },
      { name: "Behind the Scenes", cover: `${REELS}/reel-5.jpg`, video: `${REELS}/reel-5.mp4` },
      { name: "Student Voices", cover: `${REELS}/reel-7.jpg`, video: `${REELS}/reel-7.mp4` },
      { name: "Fest Highlights", cover: `${REELS}/reel-8.jpg`, video: `${REELS}/reel-8.mp4` },
      { name: "Life at CIMAGE", cover: `${REELS}/reel-2.jpg`, video: `${REELS}/reel-2.mp4` },
    ],
  },
  footer: {
    brand: "CIMAGE",
    tagline: "Behtar aur Better.",
    blurb: "Bihar's #1 college and Patna's premier institution for industry-ready IT and business education since 2003.",
    address: ["CIMAGE Tower, C, 10-11", "Off Atal Path, Patliputra Industrial Area", "Patna, Bihar 800013"],
    phones: ["7250 767 676", "9835 024 444"],
    email: "info@cimage.in",
    hours: "Mon — Sat · 9:00 AM to 6:00 PM",
    mapsUrl: "https://maps.google.com/?q=CIMAGE+Tower+Patliputra+Industrial+Area+Patna",
    socials: [
      { name: "Facebook", url: "https://facebook.com/cimage" },
      { name: "Instagram", url: "https://instagram.com/cimage_official" },
      { name: "Twitter", url: "https://twitter.com/cimage" },
      { name: "YouTube", url: "https://youtube.com/@cimage" },
      { name: "LinkedIn", url: "https://linkedin.com/school/cimage" },
    ],
    programs: [
      { name: "BCA", full: "Bachelor of Computer Applications", href: "#apply" },
      { name: "MCA", full: "Master of Computer Applications", href: "https://admissions.cimagepatna.com/mca-admission-open/" },
      { name: "B.Sc-IT", full: "Information Technology", href: "#apply" },
      { name: "MBA", full: "Master of Business Administration", href: "#apply" },
      { name: "BBA", full: "Bachelor of Business Administration", href: "#apply" },
      { name: "B.Com (P)", full: "Bachelor of Commerce", href: "#apply" },
    ],
    quickLinks: [
      { name: "Apply Now", href: "#apply" },
      { name: "Placements", href: "#" },
      { name: "Campus Life", href: "#" },
      { name: "Labs & Workshops", href: "#" },
      { name: "Accreditations", href: "#" },
      { name: "Visit Campus", href: "https://maps.google.com/?q=CIMAGE+Tower+Patna" },
    ],
    accreditations: ["AICTE Approved", "NAAC B++", "NIRF Ranked", "AKU Affiliated", "PPU Affiliated", "ISO 9001:2015"],
    copyright: "VIJAYAM Educational Trust",
    developer: "Built with care for Batch 2026.",
  },
};
