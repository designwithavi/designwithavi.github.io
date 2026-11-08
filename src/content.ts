import type { GalleryImage } from "@/components/project-gallery"

// ─────────────────────────────────────────────────────────────
//  EDIT THIS FILE to change everything written on your portfolio.
//  Only change the text inside the quotes "like this".
//  Save the file and the website updates by itself.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: "Avishkar Kale",
  nickname: "avixkar", // the big word on the landing page
  location: "Mumbai, India",
  // Your cut-out photo (PNG, transparent background). public/me.png is the original;
  // the site loads a smaller copy, me-web.png — ask to regenerate it if you swap the photo.
  portrait: "me-web.png",
  role: "Design student · NIFT Mumbai",
  tagline: "I design thoughtful things where craft meets culture.",
  availability: "Open to internships & full-time roles — 2027",

  about:
    "I'm a design student at the National Institute of Fashion Technology, Mumbai. " +
    "I love research-led projects, material exploration and telling stories through design. " +
    "Replace this paragraph with two or three lines about yourself.",

  // from your projects and the tools tagged on Behance
  skills: [
    "Photography",
    "Styling",
    "Visual Merchandising",
    "Set & Prop Design",
    "Branding",
    "Typography",
    "Editorial Design",
    "UX Design",
    "3D (Blender)",
    "Photoshop",
    "Illustrator",
    "InDesign",
    "Lightroom",
    "Capture One",
    "Figma",
  ],

  education: [
    { title: "B.Des, NIFT Mumbai", detail: "Your specialisation", years: "2023 – 2027" },
    { title: "Internship / Workshop", detail: "Company or studio name", years: "2025" },
  ],

  // Put your CV PDF inside the "public" folder and name it cv.pdf
  cvFile: "cv.pdf",

  contact: {
    email: "kaleavishkar11@gmail.com",
    phone: "", // leave empty to hide the phone number
    instagram: "https://www.instagram.com/avixkar",
    linkedin: "https://www.linkedin.com/in/avishkar-kale-b018b3296/",
    behance: "https://www.behance.net/avishkarkale1",
  },
}

// ─────────────────────────────────────────────────────────────
//  CATEGORIES — each one is shown as a glass folder.
//  art:   the swirl pattern on the folder — "aurora", "ember", "dusk", "glacier" or "verdant"
//  tone:  "light" (milk glass) or "dark" (smoked glass)
//  image: put a photo path here (e.g. "work/visual-merchandising/cover.jpg") to use it instead of the swirl
// ─────────────────────────────────────────────────────────────

export type ArtStyle = "aurora" | "ember" | "dusk" | "glacier" | "verdant"

export type Category = {
  name: string
  art: ArtStyle
  tone: "light" | "dark"
  image: string
}

export const categories: Category[] = [
  { name: "Visual Merchandising", art: "dusk", tone: "light", image: "" },
  { name: "Photography & Videography", art: "aurora", tone: "light", image: "" },
  { name: "Branding", art: "verdant", tone: "light", image: "" },
  { name: "Graphics & Publication Design", art: "glacier", tone: "light", image: "" },
  { name: "UX Design", art: "ember", tone: "dark", image: "" },
  { name: "Product Design", art: "dusk", tone: "dark", image: "" },
]

// ─────────────────────────────────────────────────────────────
//  PROJECTS
//  category: must match one of the category names above exactly.
//  To add images: put them in  public/work/<project-folder>/
//  then write the file names below, e.g.  "work/kalamkari/cover.jpg"
//  Leave  cover: ""  to show a placeholder instead.
// ─────────────────────────────────────────────────────────────

export type Project = {
  title: string
  category: string
  year: string
  summary: string
  description: string
  cover: string
  /** About page: was it made by hand / shot ("hands") or made on screen ("screen")? */
  medium?: "hands" | "screen"
  /** About page: skills this project used — they draw the skill radar. */
  skills?: string[]
  /** About page: a team project? */
  team?: boolean
  /** About page: Behance views and appreciations. */
  stats?: { views: number; appreciations: number }
  /** Optional link to the full project on Behance — adds a button at the end of the project page. */
  behance?: string
  /** Optional film, played at the top of the project page (poster = its still). */
  video?: { src: string; poster: string }
  /** Optional embedded viewer (e.g. a Heyzine flipbook) shown after the description. */
  embed?: { src: string; label: string }
  /** Optional magazine to page through, shown after the description: pages in reading order, page width ÷ height. */
  flipbook?: { label: string; pages: string[]; ratio: number }
  /**
   * Optional chapters: the project page is laid out section by section, with a
   * menu to jump between them. Sections that share a `group` (e.g. the looks) are shown
   * together as vertical tabs; `columns: 2` shows a section's images two to a row.
   */
  sections?: { nav: string; group?: string; title: string; intro?: string; columns?: 1 | 2; layout?: "carousel" | "scroll-grid"; images: GalleryImage[] }[]
  /** Optional cut-out (transparent PNG/WebP) shown full screen at the top of the project page. */
  hero?: string
  /** Optional label for the cover in the image grid. */
  coverCaption?: string
  /** More images, shown in the grid after the cover. Each can be just a path, or { src, caption }. */
  images: GalleryImage[]
  color: string // tints the image cards (and is the placeholder colour when there's no cover)
}

export const projects: Project[] = [
  {
    title: "Chumbak",
    category: "Visual Merchandising",
    year: "2024",
    medium: "hands", // "hands" (made / shot) or "screen" (digital) — for the About page
    skills: ["Props", "3D"],
    stats: { views: 343, appreciations: 17 }, // Behance, 25 Oct 2026
    summary: "Mumbai's auto-rickshaw meets the Chumbak owl in a moving in-store display.",
    description:
      "Designed for a Chumbak store in Mumbai, this set draws its inspiration from the city. " +
      "The auto-rickshaw — an icon of Mumbai's local commute — is the main element: its traditional form " +
      "is combined with the Chumbak owl to give it a quirky character. The moving backdrop makes the prop dynamic, " +
      "and the motifs on the border follow a dawn-to-dusk colour scheme, reflecting the relentless elegance of Chumbak.",
    behance: "https://www.behance.net/gallery/215517643/CHUMBAK-IN-MUMBAI-FROM-DAWN-TO-DUSK",
    hero: "work/visual-merchandising/chumbak/00-hero-cutout.webp",
    cover: "work/visual-merchandising/chumbak/01-in-store.jpg",
    coverCaption: "In store",
    images: [
      { src: "work/visual-merchandising/chumbak/02-model-and-process.jpg", caption: "The set, in studio and against the city" },
      // from Behance: the full process board
      { src: "work/visual-merchandising/chumbak/behance-01.webp", w: 1600, h: 11453, caption: "Process — brief, ideation, mechanism and making" },
    ],
    color: "#c9b8c8",
  },
  // ── Projects from Behance ───────────────────────────────────
  // Years are when each was posted on Behance — correct them if they differ.
  // Text is from Behance where there was any; entries marked DRAFT were written from the images.
  {
    title: "Fashion Editorial Shoot",
    category: "Photography & Videography",
    year: "2026",
    medium: "hands", // "hands" (made / shot) or "screen" (digital) — for the About page
    skills: ["Photography", "Styling"],
    stats: { views: 103, appreciations: 7 }, // Behance, 25 Oct 2026
    summary: "An editorial shoot for a designer collection, built on mood and atmosphere.",
    description: "An editorial-style fashion shoot for a designer collection, focusing on mood and atmosphere.",
    behance: "https://www.behance.net/gallery/250810673/Fashion-Editorial-Shoot",
    cover: "work/photography-videography/fashion-editorial/01.webp",
    images: [],
    sections: [
      {
        nav: "Shoot",
        title: "The shoot",
        layout: "scroll-grid",
        images: [
          { src: "work/photography-videography/fashion-editorial/01.webp", w: 1600, h: 1067 },
          { src: "work/photography-videography/fashion-editorial/02.webp", w: 1400, h: 2100 },
          { src: "work/photography-videography/fashion-editorial/03.webp", w: 1400, h: 2100 },
          { src: "work/photography-videography/fashion-editorial/04.webp", w: 1400, h: 2100 },
          { src: "work/photography-videography/fashion-editorial/05.webp", w: 1400, h: 2100 },
          { src: "work/photography-videography/fashion-editorial/06.webp", w: 1600, h: 1067 },
          { src: "work/photography-videography/fashion-editorial/07.webp", w: 1400, h: 2100 },
          { src: "work/photography-videography/fashion-editorial/08.webp", w: 1400, h: 2488 },
          { src: "work/photography-videography/fashion-editorial/09.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/fashion-editorial/10.webp", w: 1400, h: 2100 },
          { src: "work/photography-videography/fashion-editorial/11.webp", w: 1400, h: 2100 },
          { src: "work/photography-videography/fashion-editorial/12.webp", w: 1400, h: 2100 },
          { src: "work/photography-videography/fashion-editorial/13.webp", w: 1600, h: 1067 },
          { src: "work/photography-videography/fashion-editorial/14.webp", w: 1400, h: 2488 },
          { src: "work/photography-videography/fashion-editorial/15.webp", w: 1400, h: 2100 },
        ],
      },
    ],
    color: "#cfc4d9",
  },
  {
    title: "#WhatIsSexy? — Styling Campaign",
    category: "Photography & Videography",
    year: "2026",
    medium: "hands", // "hands" (made / shot) or "screen" (digital) — for the About page
    skills: ["Styling", "Photography", "Branding"],
    team: true,
    stats: { views: 1, appreciations: 1 }, // Behance, 25 Oct 2026 (published that day)
    summary: "Five looks styled for a Durex campaign on consent, respect and confidence — from brand research to billboards.",
    description: "An academic fashion styling exercise exploring the intersection of fashion, visual storytelling, and responsible brand communication. Inspired by Durex's bold communication identity, #WhatIsSexy? challenges conventional perceptions of attraction by highlighting consent, respect, confidence, personal boundaries, and emotional safety. An independent academic concept developed for educational purposes, not an official Durex campaign. Team: Aashana Ramavat, Avishkar Kale, Prajakta Mahindrakar, Paraj Parikh, Sanskruti Zankar.",
    behance: "https://www.behance.net/gallery/257582083/Fashion-Styling-ft-Durex",
    cover: "work/photography-videography/durex-styling/cover.webp", // the Behance cover
    images: [],
    sections: [
      {
        nav: "Shoot",
        title: "The shoot",
        intro: "Raw frames from the studio shoot, look by look.",
        layout: "scroll-grid",
        images: [
          { src: "work/photography-videography/durex-styling/shoot/01.webp", w: 1190, h: 1684 },
          { src: "work/photography-videography/durex-styling/shoot/02.webp", w: 1190, h: 1684 },
          { src: "work/photography-videography/durex-styling/shoot/03.webp", w: 1190, h: 1684 },
          { src: "work/photography-videography/durex-styling/shoot/04.webp", w: 1094, h: 728 },
          { src: "work/photography-videography/durex-styling/shoot/05.webp", w: 1190, h: 1684 },
          { src: "work/photography-videography/durex-styling/shoot/06.webp", w: 1190, h: 1684 },
          { src: "work/photography-videography/durex-styling/shoot/07.webp", w: 1094, h: 686 },
          { src: "work/photography-videography/durex-styling/shoot/08.webp", w: 1400, h: 933 },
          { src: "work/photography-videography/durex-styling/shoot/09.webp", w: 1190, h: 1684 },
          { src: "work/photography-videography/durex-styling/shoot/10.webp", w: 1190, h: 1684 },
          { src: "work/photography-videography/durex-styling/shoot/11.webp", w: 1190, h: 1684 },
          { src: "work/photography-videography/durex-styling/shoot/12.webp", w: 1190, h: 1684 },
          { src: "work/photography-videography/durex-styling/shoot/13.webp", w: 1190, h: 1684 },
          { src: "work/photography-videography/durex-styling/shoot/14.webp", w: 1190, h: 1684 },
          { src: "work/photography-videography/durex-styling/shoot/15.webp", w: 1190, h: 1684 },
          { src: "work/photography-videography/durex-styling/shoot/16.webp", w: 1190, h: 1684 },
          { src: "work/photography-videography/durex-styling/shoot/17.webp", w: 1190, h: 1684 },
          { src: "work/photography-videography/durex-styling/shoot/18.webp", w: 1190, h: 1684 },
          { src: "work/photography-videography/durex-styling/shoot/19.webp", w: 1094, h: 728 },
        ],
      },
      {
        nav: "Research",
        title: "Brand research & campaign",
        intro: "Who Durex is and how it speaks — product range, audience, communication style, packaging and social media — leading to the #WhatIsSexy? campaign, its elements, lighting, moodboard and personas.",
        images: [
          { src: "work/photography-videography/durex-styling/02.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/03.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/04.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/05.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/06.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/07.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/08.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/09.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/10.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/11.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/12.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/13.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/14.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/15.webp", w: 1600, h: 900 },
        ],
      },
      {
        nav: "Look 1",
        group: "Look ideation",
        title: "A Date Gone Wrong",
        intro: "A girl on a first date who wants comfort, choice and clear communication instead of pressure. Her persona shows that consent is sexy and attraction should never feel forced.",
        images: [
          { src: "work/photography-videography/durex-styling/16.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/17.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/18.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/19.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/20.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/21.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/22.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/23.webp", w: 1600, h: 900 },
        ],
      },
      {
        nav: "Look 2",
        group: "Look ideation",
        title: "Crashing the Party",
        intro: "A social, outgoing guy in a party setting who learns that confidence is not about pushing limits. His persona shows that knowing when to stop is sexy.",
        images: [
          { src: "work/photography-videography/durex-styling/24.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/25.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/26.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/27.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/28.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/29.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/30.webp", w: 1600, h: 900 },
        ],
      },
      {
        nav: "Look 3",
        group: "Look ideation",
        title: "Unplugging at Midnight",
        intro: "A girl who unwinds after a long day by scrolling on her bed, and gets an unsolicited image from an unknown number without consent.",
        images: [
          { src: "work/photography-videography/durex-styling/31.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/32.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/33.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/34.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/35.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/36.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/37.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/38.webp", w: 1600, h: 900 },
        ],
      },
      {
        nav: "Look 4",
        group: "Look ideation",
        title: "Campus Catwalk",
        intro: "A confident queer student expressing identity through fashion, body language and self-assurance. Their storyline shows that acceptance and boundaries are sexy, especially in spaces where people are often judged.",
        images: [
          { src: "work/photography-videography/durex-styling/39.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/40.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/41.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/42.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/43.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/44.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/45.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/46.webp", w: 1600, h: 900 },
        ],
      },
      {
        nav: "Look 5",
        group: "Look ideation",
        title: "The Cubicle Chronicles",
        intro: "A young intern navigating workplace attention, power dynamics and uncomfortable comments. Their storyline shows that respect is sexy, especially in professional spaces.",
        images: [
          { src: "work/photography-videography/durex-styling/47.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/48.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/49.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/50.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/51.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/52.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/53.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/54.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/55.webp", w: 1600, h: 900 },
        ],
      },
      {
        nav: "Application",
        title: "The campaign in application",
        intro: "The looks carried into Instagram posts and billboards.",
        images: [
          { src: "work/photography-videography/durex-styling/56.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/57.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/58.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/59.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/60.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/durex-styling/61.webp", w: 1600, h: 900 },
        ],
      },
    ],
    color: "#c6d6e8",
  },
  {
    title: "Sthetix in Stone",
    category: "Photography & Videography",
    year: "2026",
    medium: "hands", // "hands" (made / shot) or "screen" (digital) — for the About page
    skills: ["Photography"],
    stats: { views: 3, appreciations: 1 }, // Behance, 4 Nov 2026
    summary: "Product photography of carved marble objects — form, texture and light on black.",
    description: "STHETIX IN STONE is a product photography project that explores the timeless beauty of sculptural stone objects through form, texture, and light. The series captures the intricate craftsmanship, organic curves, and natural patterns of marble, transforming functional objects into artistic statements.\\n\\nSet against a minimal black backdrop, the photographs emphasize the contrast between light and shadow, highlighting the unique textures, polished surfaces, and intricate detailing of each piece. Carefully controlled lighting brings out the depth and dimensionality of the stone, while thoughtfully composed frames create a sense of sophistication and exclusivity.\\n\\nThe project combines minimalist product photography with an editorial luxury aesthetic, celebrating the relationship between material, craftsmanship, and visual storytelling. Through dramatic contrasts and refined compositions, STHETIX IN STONE presents everyday objects as timeless pieces of art.",
    behance: "https://www.behance.net/gallery/258007489/Product-Shoot-STHETIX-IN-STONE",
    cover: "work/photography-videography/sthetix-in-stone/cover.webp",
    images: [],
    sections: [
      {
        nav: "Shoot",
        title: "The shoot",
        layout: "scroll-grid",
        images: [
          { src: "work/photography-videography/sthetix-in-stone/02.webp", w: 1400, h: 934 },
          { src: "work/photography-videography/sthetix-in-stone/03.webp", w: 1400, h: 933 },
          { src: "work/photography-videography/sthetix-in-stone/04.webp", w: 1600, h: 1068 },
          { src: "work/photography-videography/sthetix-in-stone/05.webp", w: 1400, h: 936 },
          { src: "work/photography-videography/sthetix-in-stone/06.webp", w: 1400, h: 936 },
          { src: "work/photography-videography/sthetix-in-stone/07.webp", w: 1600, h: 1068 },
        ],
      },
    ],
    color: "#3a3a3a",
  },
  {
    title: "Sanganeri Block Print",
    category: "Photography & Videography",
    year: "", // TODO: year
    medium: "hands", // "hands" (made / shot) or "screen" (digital) — for the About page
    skills: ["Film", "Photography"],
    summary: "", // TODO: one line
    description: "", // TODO: description
    video: { src: "work/photography-videography/craft-documentation/film.mp4", poster: "work/photography-videography/craft-documentation/poster.webp" },
    cover: "work/photography-videography/craft-documentation/poster.webp",
    images: [],
    color: "#c9a48c",
  },
  {
    title: "WIPO Documentary",
    category: "Photography & Videography",
    year: "", // TODO: year
    medium: "hands", // "hands" (made / shot) or "screen" (digital) — for the About page
    skills: ["Film", "Photography"],
    summary: "", // TODO: one line
    description: "", // TODO: description
    video: { src: "work/photography-videography/wipo-documentary/film.mp4", poster: "work/photography-videography/wipo-documentary/poster.webp" },
    cover: "work/photography-videography/wipo-documentary/poster.webp",
    images: [],
    color: "#a9bfa4",
  },
  {
    title: "Shorona: Costume Styling",
    category: "Photography & Videography",
    year: "2026",
    medium: "hands", // "hands" (made / shot) or "screen" (digital) — for the About page
    skills: ["Styling", "Photography"],
    team: true,
    stats: { views: 78, appreciations: 3 }, // Behance, 25 Oct 2026
    summary: "Helena from A Midsummer Night's Dream, reimagined in 1880s colonial Bengal.",
    description: "This project reimagines A Midsummer Night's Dream by adapting the character of Helena into the setting of 1880s colonial Bengal (Alipore, Calcutta). The goal was to reconstruct her identity within a new cultural and historical context, blending Bengali traditions with British colonial influences. Through character study and research on textiles, folktales, and social dynamics, a new visual interpretation of Helena was developed. The final outcome is expressed through a cohesive styling approach, translating the character into a fully realised visual narrative. Team: Aashana Ramavati, Avishkar Kale, Prajakta Mahindrakar, Paraj Parikh, Sanskruti Zankar.",
    behance: "https://www.behance.net/gallery/248551049/Shorona-Costume-Styling",
    cover: "work/photography-videography/shorona/01.webp",
    images: [],
    sections: [
      {
        nav: "Shoot",
        title: "The shoot",
        layout: "scroll-grid",
        images: [
          { src: "work/photography-videography/shorona/shoot/01.webp", w: 1400, h: 934 },
          { src: "work/photography-videography/shorona/shoot/02.webp", w: 1400, h: 2099 },
          { src: "work/photography-videography/shorona/shoot/03.webp", w: 1400, h: 934 },
          { src: "work/photography-videography/shorona/shoot/04.webp", w: 1400, h: 2100 },
          { src: "work/photography-videography/shorona/shoot/05.webp", w: 1400, h: 2099 },
          { src: "work/photography-videography/shorona/shoot/06.webp", w: 1400, h: 2099 },
          { src: "work/photography-videography/shorona/shoot/07.webp", w: 1400, h: 2100 },
          { src: "work/photography-videography/shorona/shoot/08.webp", w: 1400, h: 2101 },
          { src: "work/photography-videography/shorona/shoot/09.webp", w: 1400, h: 934 },
          { src: "work/photography-videography/shorona/shoot/10.webp", w: 1400, h: 788 },
          { src: "work/photography-videography/shorona/shoot/11.webp", w: 1400, h: 1867 },
          { src: "work/photography-videography/shorona/shoot/12.webp", w: 1400, h: 1867 },
          { src: "work/photography-videography/shorona/shoot/13.webp", w: 1400, h: 2488 },
          { src: "work/photography-videography/shorona/shoot/14.webp", w: 1400, h: 2488 },
          { src: "work/photography-videography/shorona/shoot/15.webp", w: 1400, h: 2488 },
          { src: "work/photography-videography/shorona/shoot/16.webp", w: 1400, h: 2488 },
        ],
      },
      {
        nav: "Story",
        title: "The story",
        intro: "Helena from A Midsummer Night's Dream, carried into 1880s colonial Bengal — the brief, her role in the play and who she is.",
        images: [
          { src: "work/photography-videography/shorona/02.webp", w: 1600, h: 1067 },
          { src: "work/photography-videography/shorona/04.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/shorona/05.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/shorona/06.webp", w: 1600, h: 900 },
        ],
      },
      {
        nav: "Petni",
        title: "Helena × Petni",
        intro: "The Bengali folk spirit she becomes: why the Petni, and where the two meet.",
        images: [
          { src: "work/photography-videography/shorona/07.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/shorona/08.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/shorona/09.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/shorona/10.webp", w: 1600, h: 900 },
        ],
      },
      {
        nav: "Shorona",
        title: "Becoming Shorona",
        intro: "The character, her sketch and the transformation from Helena to Shorona.",
        images: [
          { src: "work/photography-videography/shorona/11.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/shorona/12.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/shorona/14.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/shorona/19.webp", w: 1600, h: 900 },
        ],
      },
      {
        nav: "Boards",
        title: "Boards",
        intro: "Character, mood, look and accessories, hair and makeup, pose and lighting.",
        images: [
          { src: "work/photography-videography/shorona/13.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/shorona/15.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/shorona/16.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/shorona/17.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/shorona/18.webp", w: 1600, h: 900 },
        ],
      },
      {
        nav: "BTS",
        title: "Behind the scenes",
        images: [
          { src: "work/photography-videography/shorona/23.webp", w: 1600, h: 900 },
        ],
      },
    ],
    color: "#d9b8b0",
  },
  {
    title: "Studio Photography: Keibu Keioiba",
    category: "Photography & Videography",
    year: "2025",
    medium: "hands", // "hands" (made / shot) or "screen" (digital) — for the About page
    skills: ["Photography", "Styling"],
    stats: { views: 51, appreciations: 5 }, // Behance, 25 Oct 2026
    summary: "Characters from the Manipuri folktale Keibu Keioiba, brought to life in the studio.",
    // DRAFT — written from the images; check it
    description: "A studio photography project that showcases characters from the Manipuri folklore Keibu Keioiba — from the story and its characters to the moodboard, makeup and final portraits.",
    behance: "https://www.behance.net/gallery/248127531/STUDIO-PHOTOGRAPHY-KEIBU-KEIOIBA",
    cover: "work/photography-videography/keibu-keioiba/01.webp",
    images: [],
    sections: [
      {
        nav: "Shoot",
        title: "The shoot",
        layout: "scroll-grid",
        images: [
          { src: "work/photography-videography/keibu-keioiba/shoot/01.webp", w: 1400, h: 932 },
          { src: "work/photography-videography/keibu-keioiba/shoot/02.webp", w: 1400, h: 934 },
          { src: "work/photography-videography/keibu-keioiba/shoot/03.webp", w: 1400, h: 2099 },
          { src: "work/photography-videography/keibu-keioiba/shoot/04.webp", w: 1400, h: 2100 },
          { src: "work/photography-videography/keibu-keioiba/shoot/05.webp", w: 1400, h: 934 },
          { src: "work/photography-videography/keibu-keioiba/shoot/06.webp", w: 1400, h: 934 },
          { src: "work/photography-videography/keibu-keioiba/shoot/07.webp", w: 1400, h: 2098 },
          { src: "work/photography-videography/keibu-keioiba/shoot/08.webp", w: 1318, h: 1976 },
          { src: "work/photography-videography/keibu-keioiba/shoot/09.webp", w: 1126, h: 1688 },
          { src: "work/photography-videography/keibu-keioiba/shoot/10.webp", w: 1400, h: 934 },
          { src: "work/photography-videography/keibu-keioiba/shoot/11.webp", w: 1140, h: 1710 },
          { src: "work/photography-videography/keibu-keioiba/shoot/12.webp", w: 1024, h: 1536 },
        ],
      },
      {
        nav: "Process",
        title: "Story, characters & styling",
        intro: "The folktale and its characters, the moodboard, makeup, styling and pose references behind the shoot.",
        images: [
          { src: "work/photography-videography/keibu-keioiba/01.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/keibu-keioiba/02.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/keibu-keioiba/03.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/keibu-keioiba/04.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/keibu-keioiba/05.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/keibu-keioiba/06.webp", w: 1600, h: 900 },
          { src: "work/photography-videography/keibu-keioiba/07.webp", w: 1600, h: 900 },
        ],
      },
    ],
    color: "#d9cbb6",
  },
  {
    title: "Studio Photography: Buldak Ramen",
    category: "Photography & Videography",
    year: "2025",
    medium: "hands", // "hands" (made / shot) or "screen" (digital) — for the About page
    skills: ["Photography", "Styling"],
    stats: { views: 102, appreciations: 4 }, // Behance, 25 Oct 2026
    summary: "Concept-based food photography that turns Buldak's heat into image.",
    description: "This project explores concept-based food photography for Buldak, focusing on visually expressing the intensity of spice. Combining studio photography with illustrative elements, the visuals highlight texture, movement, and heat through bold compositions and high-contrast lighting. By blending real imagery with expressive overlays, the project moves beyond traditional food photography to create a dynamic and sensory representation of Buldak's fiery identity.",
    behance: "https://www.behance.net/gallery/248170591/Studio-Photography-Buldak-Ramen",
    cover: "work/photography-videography/buldak-ramen/01.webp",
    images: [
      { src: "work/photography-videography/buldak-ramen/02.webp", w: 1600, h: 2170 },
      { src: "work/photography-videography/buldak-ramen/03.webp", w: 1600, h: 1948 },
      { src: "work/photography-videography/buldak-ramen/04.webp", w: 1600, h: 1744 },
      { src: "work/photography-videography/buldak-ramen/05.webp", w: 1600, h: 3753 },
    ],
    color: "#e8c3a8",
  },
  {
    title: "Faredoon's Food Photography",
    category: "Photography & Videography",
    year: "2025",
    medium: "hands", // "hands" (made / shot) or "screen" (digital) — for the About page
    skills: ["Photography", "Styling", "Props", "3D"],
    team: true,
    stats: { views: 31, appreciations: 4 }, // Behance, 25 Oct 2026
    summary: "Food photography and styling for Faredoon's, from moodboard to a planned set.",
    // DRAFT — written from the images; check it
    description: "A food photography and styling project for Faredoon's — from the moodboard and colour palette to a 3D-planned set and the final shoot. Shot on a Sony A7 III and edited in Capture One, Lightroom and Photoshop.",
    behance: "https://www.behance.net/gallery/256987947/Faredoons-Food-Photography",
    cover: "work/photography-videography/faredoons/01.webp",
    images: [],
    sections: [
      {
        nav: "Shoot",
        title: "The shoot",
        intro: "The final photographs, shot on a miniature café set.",
        layout: "scroll-grid",
        images: [
          { src: "work/photography-videography/faredoons/shoot/01.webp", w: 794, h: 525 },
          { src: "work/photography-videography/faredoons/shoot/02.webp", w: 792, h: 525 },
          { src: "work/photography-videography/faredoons/shoot/03.webp", w: 1594, h: 1061 },
          { src: "work/photography-videography/faredoons/shoot/04.webp", w: 794, h: 527 },
          { src: "work/photography-videography/faredoons/shoot/05.webp", w: 792, h: 527 },
          { src: "work/photography-videography/faredoons/shoot/06.webp", w: 1594, h: 1064 },
          { src: "work/photography-videography/faredoons/shoot/07.webp", w: 794, h: 526 },
          { src: "work/photography-videography/faredoons/shoot/08.webp", w: 792, h: 526 },
          { src: "work/photography-videography/faredoons/shoot/09.webp", w: 1594, h: 1068 },
          { src: "work/photography-videography/faredoons/shoot/10.webp", w: 793, h: 526 },
          { src: "work/photography-videography/faredoons/shoot/11.webp", w: 793, h: 526 },
        ],
      },
      {
        nav: "Process",
        title: "Concept & set",
        intro: "The brand, palette, menu picks and the 3D-planned miniature set, from design to setup.",
        images: [
          { src: "work/photography-videography/faredoons/01.webp", w: 1600, h: 856 },
          { src: "work/photography-videography/faredoons/02.webp", w: 1600, h: 585 },
          { src: "work/photography-videography/faredoons/03.webp", w: 1600, h: 806 },
          { src: "work/photography-videography/faredoons/04.webp", w: 1600, h: 1032 },
          { src: "work/photography-videography/faredoons/05.webp", w: 1600, h: 1013 },
          { src: "work/photography-videography/faredoons/06.webp", w: 1600, h: 913 },
        ],
      },
      {
        nav: "In use",
        title: "Photographs in use",
        images: [
          { src: "work/photography-videography/faredoons/12.webp", w: 1600, h: 2326 },
          { src: "work/photography-videography/faredoons/13.webp", w: 1600, h: 2307 },
        ],
      },
    ],
    color: "#e2d0b0",
  },
  {
    title: "Experience Nashik: Photobook",
    category: "Photography & Videography",
    year: "2024",
    medium: "hands", // "hands" (made / shot) or "screen" (digital) — for the About page
    skills: ["Photography", "Editorial"],
    stats: { views: 210, appreciations: 8 }, // Behance, 25 Oct 2026
    summary: "A coffee table book: a slow walk through Nashik.",
    description: "This coffee table book is a slow walk through Nashik, seen through my lens and shaped by instinct rather than intent. The photographs move between the sacred and the ordinary — early mornings, restless streets, fading light, and unnoticed details that often go unrecorded. Each image lingers like a pause, inviting the viewer to experience the city not as a destination, but as a feeling: layered, lived-in, and quietly enduring.",
    behance: "https://www.behance.net/gallery/215579545/EXPERIENCE-NASHIK-PHOTOBOOK",
    cover: "work/photography-videography/experience-nashik/01.webp",
    images: [
      { src: "work/photography-videography/experience-nashik/02.webp", w: 1600, h: 896 },
      { src: "work/photography-videography/experience-nashik/03.webp", w: 1600, h: 1024 },
      { src: "work/photography-videography/experience-nashik/04.webp", w: 1600, h: 948 },
      { src: "work/photography-videography/experience-nashik/05.webp", w: 1600, h: 1024 },
      { src: "work/photography-videography/experience-nashik/06.webp", w: 1600, h: 1024 },
      { src: "work/photography-videography/experience-nashik/07.webp", w: 1600, h: 948 },
      { src: "work/photography-videography/experience-nashik/08.webp", w: 1600, h: 948 },
      { src: "work/photography-videography/experience-nashik/09.webp", w: 1600, h: 1024 },
      { src: "work/photography-videography/experience-nashik/10.webp", w: 1600, h: 1024 },
      { src: "work/photography-videography/experience-nashik/11.webp", w: 1600, h: 1152 },
      { src: "work/photography-videography/experience-nashik/12.webp", w: 1600, h: 1152 },
      { src: "work/photography-videography/experience-nashik/13.webp", w: 1600, h: 5768 },
    ],
    color: "#c4d3d9",
  },
  {
    title: "Product Advertisement: Sprite Can",
    category: "Photography & Videography",
    year: "2023",
    medium: "screen", // "hands" (made / shot) or "screen" (digital) — for the About page
    skills: ["Photography"],
    stats: { views: 166, appreciations: 13 }, // Behance, 25 Oct 2026
    summary: "A bold product poster for Sprite, made in Semester 1 of the Foundation Programme at NIFT Hyderabad.",
    description: "A product advertisement for Sprite, made for the Digital Design and Communication course in Semester 1 of the Foundation Programme at NIFT Hyderabad.",
    behance: "https://www.behance.net/gallery/203334665/Product-advertisement-Sprite-Can",
    cover: "work/photography-videography/sprite-can/01.webp",
    images: [],
    color: "#cfe3c4",
  },
  {
    title: "Product Advertisement: Zudio Nail Paint",
    category: "Photography & Videography",
    year: "2023",
    medium: "screen", // "hands" (made / shot) or "screen" (digital) — for the About page
    skills: ["Photography"],
    stats: { views: 144, appreciations: 12 }, // Behance, 25 Oct 2026
    summary: "A product poster for Zudio's nail paint, made in Semester 1 at NIFT Hyderabad.",
    description: "A product advertisement for Zudio nail paint, made for the Digital Design and Communication course in Semester 1 of the Foundation Programme at NIFT Hyderabad.",
    behance: "https://www.behance.net/gallery/203398089/Product-Advertisement-Zudio-Nail-Paint",
    cover: "work/photography-videography/zudio-nail-paint/01.webp",
    images: [],
    color: "#e7c4cf",
  },







  {
    title: "Xyricon",
    category: "Branding",
    year: "2026",
    medium: "screen", // "hands" (made / shot) or "screen" (digital) — for the About page
    skills: ["Branding", "Typography"],
    stats: { views: 9, appreciations: 2 }, // Behance, 4 Nov 2026
    summary: "Room Tone: an identity for a one-night electronic music festival in a warehouse.",
    description: "Room Tone is a visual identity for Xyricon, a one-night electronic music festival imagined inside the East Dock warehouse. A jagged waveform runs through the experience, small enough to fit on a wristband and large enough to hang in acid-lime light above the crowd. The warehouse has three rooms, each with its own sound, number and colour. SUB carries the bass, WIRE hosts live electronics, and AIR closes the night with an ambient set. Violet 02 always leads to WIRE, whether you spot it on a street poster, check it in the mobile programme, or follow it through a dark corridor.",
    behance: "https://www.behance.net/gallery/257932255/Logo-Design-Xyricon",
    cover: "work/branding/xyricon/cover.webp",
    images: [
      { src: "work/branding/xyricon/01.webp", w: 1600, h: 1000 },
      { src: "work/branding/xyricon/02.webp", w: 1400, h: 470 },
      { src: "work/branding/xyricon/03.webp", w: 1600, h: 1000 },
      { src: "work/branding/xyricon/04.webp", w: 1600, h: 1000 },
      { src: "work/branding/xyricon/05.webp", w: 1600, h: 1000 },
      { src: "work/branding/xyricon/06.webp", w: 1600, h: 1000 },
      { src: "work/branding/xyricon/07.webp", w: 1600, h: 1000 },
      { src: "work/branding/xyricon/08.webp", w: 1600, h: 1000 },
      { src: "work/branding/xyricon/09.webp", w: 1600, h: 1000 },
      { src: "work/branding/xyricon/10.webp", w: 1600, h: 1000 },
      { src: "work/branding/xyricon/11.webp", w: 1600, h: 1000 },
      { src: "work/branding/xyricon/12.webp", w: 1600, h: 1000 },
      { src: "work/branding/xyricon/13.webp", w: 1600, h: 1000 },
      { src: "work/branding/xyricon/14.webp", w: 1600, h: 1000 },
      { src: "work/branding/xyricon/15.webp", w: 1600, h: 1000 },
      { src: "work/branding/xyricon/16.webp", w: 1600, h: 1000 },
      { src: "work/branding/xyricon/17.webp", w: 1600, h: 1000 },
      { src: "work/branding/xyricon/18.webp", w: 1600, h: 1000 },
      { src: "work/branding/xyricon/19.webp", w: 1600, h: 1000 },
      { src: "work/branding/xyricon/20.webp", w: 1600, h: 1000 },
      { src: "work/branding/xyricon/21.webp", w: 1600, h: 1000 },
    ],
    color: "#c6f24e",
  },
  {
    title: "Aurevia",
    category: "Branding",
    year: "2026",
    medium: "screen", // "hands" (made / shot) or "screen" (digital) — for the About page
    skills: ["Branding", "Props"],
    stats: { views: 11, appreciations: 2 }, // Behance, 4 Nov 2026
    summary: "Luxury paper packaging where the box becomes a tray after the gift is opened.",
    description: "Aurevia is a luxury paper packaging concept built around a simple question. What happens to the box after the gift is opened? Its signature Pennon box closes with two overlapping ivory flaps. Fold them back and the vermilion lining becomes a shallow tray for a ring on a bedside table or a key by the door. The logo echoes that gesture through two opposing origami forms, one outlined and one solid. Pressed into paper without ink, the mark reveals itself in light and shadow. The same diagonal fold shapes the carrier handle and, at a larger scale, the paper installation in the shop window.",
    behance: "https://www.behance.net/gallery/257929553/Logo-Design-Aurevia",
    cover: "work/branding/aurevia/cover.webp",
    images: [
      { src: "work/branding/aurevia/01.webp", w: 1600, h: 1000 },
      { src: "work/branding/aurevia/02.webp", w: 1400, h: 470 },
      { src: "work/branding/aurevia/03.webp", w: 1600, h: 1000 },
      { src: "work/branding/aurevia/04.webp", w: 1600, h: 1000 },
      { src: "work/branding/aurevia/05.webp", w: 1600, h: 1000 },
      { src: "work/branding/aurevia/06.webp", w: 1600, h: 1000 },
      { src: "work/branding/aurevia/07.webp", w: 1600, h: 1000 },
      { src: "work/branding/aurevia/08.webp", w: 1600, h: 1000 },
      { src: "work/branding/aurevia/09.webp", w: 1600, h: 1000 },
      { src: "work/branding/aurevia/10.webp", w: 1600, h: 1000 },
      { src: "work/branding/aurevia/11.webp", w: 1600, h: 1000 },
      { src: "work/branding/aurevia/12.webp", w: 1600, h: 1000 },
      { src: "work/branding/aurevia/13.webp", w: 1600, h: 1000 },
      { src: "work/branding/aurevia/14.webp", w: 1600, h: 1000 },
      { src: "work/branding/aurevia/15.webp", w: 1600, h: 1000 },
      { src: "work/branding/aurevia/16.webp", w: 1600, h: 1000 },
      { src: "work/branding/aurevia/17.webp", w: 1600, h: 1000 },
      { src: "work/branding/aurevia/18.webp", w: 1600, h: 1000 },
    ],
    color: "#e8553e",
  },
  {
    title: "Flash Cryogenics",
    category: "Branding",
    year: "2024",
    medium: "screen", // "hands" (made / shot) or "screen" (digital) — for the About page
    skills: ["Branding", "3D"],
    stats: { views: 19, appreciations: 2 }, // Behance, 25 Oct 2026
    summary: "Something flashy, something cool: an identity for a cryogenics startup.",
    // DRAFT — written from the images; check it
    description: "Brand identity for Flash Cryogenics, a startup founded by PhD students of IIT Bombay that builds ultra-low-temperature cooling technology — from the logomark and visual language to brand applications.",
    behance: "https://www.behance.net/gallery/257094239/Branding-Flash-Cryogenics",
    cover: "work/branding/flash-cryogenics/01.webp",
    images: [
      { src: "work/branding/flash-cryogenics/02.webp", w: 1600, h: 423 },
      { src: "work/branding/flash-cryogenics/03.webp", w: 1600, h: 900 },
      { src: "work/branding/flash-cryogenics/04.webp", w: 1600, h: 137 },
      { src: "work/branding/flash-cryogenics/05.webp", w: 1600, h: 900 },
      { src: "work/branding/flash-cryogenics/06.webp", w: 1600, h: 900 },
      { src: "work/branding/flash-cryogenics/07.webp", w: 1600, h: 900 },
      { src: "work/branding/flash-cryogenics/08.webp", w: 1600, h: 900 },
      { src: "work/branding/flash-cryogenics/09.webp", w: 1600, h: 900 },
      { src: "work/branding/flash-cryogenics/10.webp", w: 1600, h: 900 },
      { src: "work/branding/flash-cryogenics/11.webp", w: 1600, h: 900 },
      { src: "work/branding/flash-cryogenics/12.webp", w: 1600, h: 900 },
      { src: "work/branding/flash-cryogenics/13.webp", w: 1600, h: 900 },
      { src: "work/branding/flash-cryogenics/14.webp", w: 1600, h: 900 },
      { src: "work/branding/flash-cryogenics/15.webp", w: 1400, h: 788 },
      { src: "work/branding/flash-cryogenics/16.webp", w: 1400, h: 788 },
      { src: "work/branding/flash-cryogenics/17.webp", w: 1400, h: 788 },
      { src: "work/branding/flash-cryogenics/18.webp", w: 1600, h: 900 },
    ],
    color: "#bfd0dd",
  },
  {
    title: "#WhatIsSexy?",
    category: "Graphics & Publication Design",
    year: "2026",
    medium: "hands", // "hands" (made / shot) or "screen" (digital) — for the About page
    skills: ["Styling", "Photography", "Editorial"],
    team: true,
    stats: { views: 9, appreciations: 2 }, // Behance, 25 Oct 2026
    summary: "A fashion styling feature on consent, respect and confidence, laid out as a Femina special.",
    description: "Developed as an academic fashion styling exercise exploring the intersection of fashion, visual storytelling, and responsible brand communication. Inspired by Durex's bold communication identity, #WhatIsSexy? challenges conventional perceptions of attraction by highlighting consent, respect, confidence, personal boundaries, and emotional safety. An independent academic concept developed for educational purposes, not an official Durex campaign. Concept & creative direction: Aashana Ramavat, Avishkar Kale, Prajakta Mahindrakar, Paraj Parikh, Sanskruti Zankar.",
    behance: "https://www.behance.net/gallery/257578227/Fashion-Styling-whatissexy",
    flipbook: {
      label: "Flip through the issue",
      ratio: 1190 / 1684,
      pages: [
        "work/graphic-design/whatissexy/04.webp",
        "work/graphic-design/whatissexy/05.webp",
        "work/graphic-design/whatissexy/06.webp",
        "work/graphic-design/whatissexy/07.webp",
        "work/graphic-design/whatissexy/08.webp",
        "work/graphic-design/whatissexy/09.webp",
        "work/graphic-design/whatissexy/10.webp",
        "work/graphic-design/whatissexy/11.webp",
        "work/graphic-design/whatissexy/12.webp",
        "work/graphic-design/whatissexy/13.webp",
        "work/graphic-design/whatissexy/14.webp",
        "work/graphic-design/whatissexy/15.webp",
        "work/graphic-design/whatissexy/16.webp",
        "work/graphic-design/whatissexy/17.webp",
        "work/graphic-design/whatissexy/18.webp",
        "work/graphic-design/whatissexy/19.webp",
        "work/graphic-design/whatissexy/20.webp",
        "work/graphic-design/whatissexy/21.webp",
        "work/graphic-design/whatissexy/22.webp",
        "work/graphic-design/whatissexy/23.webp",
        "work/graphic-design/whatissexy/24.webp",
        "work/graphic-design/whatissexy/25.webp",
        "work/graphic-design/whatissexy/26.webp",
        "work/graphic-design/whatissexy/27.webp",
        "work/graphic-design/whatissexy/28.webp",
        "work/graphic-design/whatissexy/29.webp",
        "work/graphic-design/whatissexy/30.webp",
        "work/graphic-design/whatissexy/31.webp",
        "work/graphic-design/whatissexy/32.webp",
        "work/graphic-design/whatissexy/33.webp",
        "work/graphic-design/whatissexy/34.webp",
        "work/graphic-design/whatissexy/35.webp",
      ],
    },
    cover: "work/graphic-design/whatissexy/01.webp",
    images: [
      { src: "work/graphic-design/whatissexy/02.webp", w: 1536, h: 1024 },
      { src: "work/graphic-design/whatissexy/03.webp", w: 1536, h: 1024 },
    ],
    color: "#c6d6e8",
  },
  {
    title: "Verve Magazine Design",
    category: "Graphics & Publication Design",
    year: "2024",
    medium: "screen", // "hands" (made / shot) or "screen" (digital) — for the About page
    skills: ["Editorial", "Typography"],
    team: true,
    stats: { views: 88, appreciations: 6 }, // Behance, 25 Oct 2026
    summary: "Editorial design for Verve magazine: cover, layouts and spreads.",
    // DRAFT — written from the images; check it
    description: "Editorial design for Verve magazine — cover, layouts and spreads. A team project with Aarya Tambe, Keerti Manojna, Gargi Gujar and Komal Vishwakarma. Images used for educational purposes only.",
    behance: "https://www.behance.net/gallery/241015223/Verve-Magazine-Design",
    cover: "work/graphic-design/verve/01.webp",
    images: [
      { src: "work/graphic-design/verve/02.webp", w: 1600, h: 841 },
      { src: "work/graphic-design/verve/03.webp", w: 1600, h: 2286 },
      { src: "work/graphic-design/verve/04.webp", w: 1600, h: 1200 },
      { src: "work/graphic-design/verve/05.webp", w: 1600, h: 1200 },
      { src: "work/graphic-design/verve/06.webp", w: 1600, h: 1200 },
      { src: "work/graphic-design/verve/07.webp", w: 1600, h: 1200 },
      { src: "work/graphic-design/verve/08.webp", w: 1600, h: 1200 },
      { src: "work/graphic-design/verve/09.webp", w: 1600, h: 1200 },
    ],
    color: "#e0cfc4",
  },
  {
    title: "Cassiopea: Devanagari Script Typeface",
    category: "Graphics & Publication Design",
    year: "2024",
    medium: "screen", // "hands" (made / shot) or "screen" (digital) — for the About page
    skills: ["Typography"],
    stats: { views: 67, appreciations: 4 }, // Behance, 25 Oct 2026
    summary: "A Devanagari typeface inspired by the upside-down jellyfish.",
    description: "Cassiopea is a Devanagari typeface derived from the form of the upside-down jellyfish. Organic textures, flowing strokes, and subtle irregularities translate marine movement into letterforms. Cassiopea explores how type can feel alive, balancing readability with fluid, bio-inspired expression.",
    behance: "https://www.behance.net/gallery/248290199/Cassiopea-Typeface-design-Script-Devanagari",
    cover: "work/graphic-design/cassiopea/01.webp",
    images: [
      { src: "work/graphic-design/cassiopea/02.webp", w: 1600, h: 900 },
      { src: "work/graphic-design/cassiopea/03.webp", w: 1600, h: 900 },
      { src: "work/graphic-design/cassiopea/04.webp", w: 1600, h: 900 },
      { src: "work/graphic-design/cassiopea/05.webp", w: 1600, h: 900 },
      { src: "work/graphic-design/cassiopea/06.webp", w: 1600, h: 900 },
      { src: "work/graphic-design/cassiopea/07.webp", w: 1600, h: 900 },
      { src: "work/graphic-design/cassiopea/08.webp", w: 1600, h: 900 },
      { src: "work/graphic-design/cassiopea/09.webp", w: 1600, h: 900 },
      { src: "work/graphic-design/cassiopea/10.webp", w: 1600, h: 900 },
      { src: "work/graphic-design/cassiopea/11.webp", w: 1600, h: 900 },
      { src: "work/graphic-design/cassiopea/12.webp", w: 1600, h: 900 },
      { src: "work/graphic-design/cassiopea/13.webp", w: 1600, h: 900 },
    ],
    color: "#d6d0c4",
  },
  {
    title: "NOVUS",
    category: "UX Design",
    year: "2025",
    medium: "screen", // "hands" (made / shot) or "screen" (digital) — for the About page
    skills: ["UX", "Branding"],
    team: true,
    stats: { views: 80, appreciations: 5 }, // Behance, 25 Oct 2026
    summary: "Perfume reimagined as a journey of self-discovery.",
    description: "Novus reimagines perfume as a journey of self-discovery. Instead of choosing a fragrance, users create one that reflects who they are. The project tackles a key challenge: translating scent into a digital experience. Through an archetype-based quiz and cross-sensory design (visuals, motion, and sound), Novus allows users to 'feel' a fragrance before it exists. Extending beyond screens, the physical store becomes a customization lab where users interact, experiment, and co-create their signature scent. Minimal, calm, and intentional, Novus turns perfume from a product into a personal expression. Team: Aashana Ramavati, Keerti Manojna, Avishkar Kale, Jyotsana K, Sivnandan KS.",
    behance: "https://www.behance.net/gallery/248288401/NOVUS-User-Experience-Design",
    cover: "work/ux-design/novus/01.webp",
    images: [],
    sections: [
      {
        nav: "Brand",
        title: "About the brand",
        intro: "Overview, the brand and its identity, who it's for, and the problem and solution: translating scent into a digital experience.",
        images: [
          { src: "work/ux-design/novus/02.webp", w: 1600, h: 900 },
          { src: "work/ux-design/novus/03.webp", w: 1600, h: 900 },
          { src: "work/ux-design/novus/04.webp", w: 1600, h: 900 },
          { src: "work/ux-design/novus/05.webp", w: 1600, h: 900 },
          { src: "work/ux-design/novus/06.webp", w: 1600, h: 900 },
          { src: "work/ux-design/novus/07.webp", w: 1600, h: 900 },
          { src: "work/ux-design/novus/08.webp", w: 1600, h: 900 },
        ],
      },
      {
        nav: "Visual",
        title: "Visual design",
        intro: "Typography, colour story and imagery.",
        images: [
          { src: "work/ux-design/novus/09.webp", w: 1600, h: 900 },
          { src: "work/ux-design/novus/10.webp", w: 1600, h: 900 },
          { src: "work/ux-design/novus/11.webp", w: 1600, h: 900 },
        ],
      },
      {
        nav: "Interface",
        title: "Website & app",
        intro: "Website overview, user journey, the archetype quiz, ingredient picking and UI components.",
        images: [
          { src: "work/ux-design/novus/12.webp", w: 1600, h: 900 },
          { src: "work/ux-design/novus/13.webp", w: 1600, h: 900 },
          { src: "work/ux-design/novus/14.webp", w: 1600, h: 900 },
          { src: "work/ux-design/novus/15.webp", w: 1600, h: 900 },
          { src: "work/ux-design/novus/16.webp", w: 1600, h: 900 },
          { src: "work/ux-design/novus/17.webp", w: 1600, h: 900 },
        ],
      },
      {
        nav: "Store",
        title: "Store concept",
        intro: "The physical store as a customization lab: its journey, sketches, 3D model and a human for scale.",
        images: [
          { src: "work/ux-design/novus/18.webp", w: 1600, h: 900 },
          { src: "work/ux-design/novus/19.webp", w: 1600, h: 900 },
          { src: "work/ux-design/novus/20.webp", w: 1600, h: 900 },
          { src: "work/ux-design/novus/21.webp", w: 1600, h: 900 },
          { src: "work/ux-design/novus/22.webp", w: 1600, h: 900 },
          { src: "work/ux-design/novus/23.webp", w: 1600, h: 900 },
          { src: "work/ux-design/novus/24.webp", w: 1600, h: 900 },
        ],
      },
    ],
    color: "#c8cfe0",
  },

  {
    title: "Titan × Anita Dongre",
    category: "Product Design",
    year: "2026",
    medium: "screen", // "hands" (made / shot) or "screen" (digital) — for the About page
    skills: ["Branding", "Props"],
    team: true,
    stats: { views: 1, appreciations: 0 }, // Behance, 4 Nov 2026 (published that day)
    summary: "Colour psychology for a smartwatch collab: Pichwai-inspired pastel faces, straps and packaging.",
    description: "A conceptual watch collaboration blending traditional Pichwai art with contemporary design. Rooted in colour psychology, the collection uses soothing pastels, intricate floral motifs and cultural symbolism to evoke elegance, serenity and nostalgia. From watch faces to packaging, every detail celebrates Indian heritage through modern craftsmanship and timeless storytelling. A concept project. Team: Avishkar Kale & Shreya Arya.",
    behance: "https://www.behance.net/gallery/258032813/Colour-Psychology-Titan-x-Anita-Dongre",
    cover: "work/product-design/titan-anita-dongre/cover.webp",
    images: [
      { src: "work/product-design/titan-anita-dongre/01.webp", w: 1600, h: 1131 },
      { src: "work/product-design/titan-anita-dongre/02.webp", w: 1536, h: 1024 },
      { src: "work/product-design/titan-anita-dongre/03.webp", w: 1600, h: 1131 },
      { src: "work/product-design/titan-anita-dongre/04.webp", w: 607, h: 695 },
      { src: "work/product-design/titan-anita-dongre/05.webp", w: 1600, h: 1131 },
      { src: "work/product-design/titan-anita-dongre/06.webp", w: 1600, h: 1131 },
      { src: "work/product-design/titan-anita-dongre/07.webp", w: 1600, h: 1131 },
      { src: "work/product-design/titan-anita-dongre/08.webp", w: 1400, h: 989 },
      { src: "work/product-design/titan-anita-dongre/09.webp", w: 1400, h: 989 },
      { src: "work/product-design/titan-anita-dongre/10.webp", w: 1536, h: 1024 },
    ],
    color: "#e7c9c4",
  },  {
    title: "ECO-Amphi: Emergency Medical Transport",
    category: "Product Design",
    year: "2024",
    medium: "screen", // "hands" (made / shot) or "screen" (digital) — for the About page
    skills: ["3D"],
    team: true,
    stats: { views: 88, appreciations: 6 }, // Behance, 25 Oct 2026
    summary: "Emergency Care Orbit: an amphibious transport concept for emergency medical services.",
    // DRAFT — written from the images; check it
    description: "ECO (Emergency Care Orbit) is an amphibious transport concept for emergency medical services — from research into the problem and context to a 3D-modelled solution built in Blender.",
    behance: "https://www.behance.net/gallery/248630719/ECO-Amphi-Transport-for-Emergency-Medical-Services",
    cover: "work/product-design/eco-amphi/01.webp",
    images: [
      { src: "work/product-design/eco-amphi/02.webp", w: 1600, h: 900 },
      { src: "work/product-design/eco-amphi/03.webp", w: 1600, h: 906 },
      { src: "work/product-design/eco-amphi/04.webp", w: 1600, h: 583 },
      { src: "work/product-design/eco-amphi/05.webp", w: 1600, h: 900 },
      { src: "work/product-design/eco-amphi/06.webp", w: 1600, h: 900 },
      { src: "work/product-design/eco-amphi/07.webp", w: 1600, h: 900 },
      { src: "work/product-design/eco-amphi/08.webp", w: 1600, h: 900 },
      { src: "work/product-design/eco-amphi/09.webp", w: 1600, h: 900 },
      { src: "work/product-design/eco-amphi/10.webp", w: 1600, h: 900 },
      { src: "work/product-design/eco-amphi/11.webp", w: 1600, h: 949 },
      { src: "work/product-design/eco-amphi/12.webp", w: 1600, h: 525 },
    ],
    color: "#c9d9cc",
  },

]

// ─────────────────────────────────────────────────────────────
//  FEATURED — the projects that rotate in the big hero at the top of Work,
//  each with a wide, cinematic backdrop image. Change the order or swap them freely.
// ─────────────────────────────────────────────────────────────
export const featured: { title: string; backdrop: string; line?: string }[] = [
  { title: "Xyricon", backdrop: "work/branding/xyricon/20.webp" },
  { title: "Shorona: Costume Styling", backdrop: "work/photography-videography/shorona/shoot/01.webp" },
  { title: "Studio Photography: Keibu Keioiba", backdrop: "work/photography-videography/keibu-keioiba/shoot/02.webp" },
  { title: "Fashion Editorial Shoot", backdrop: "work/photography-videography/fashion-editorial/01.webp" },
  { title: "Aurevia", backdrop: "work/branding/aurevia/18.webp" },
  { title: "#WhatIsSexy? — Styling Campaign", backdrop: "work/photography-videography/durex-styling/59.webp" },
]


// ─────────────────────────────────────────────────────────────
//  PHOTO GALLERY — photographs shown on the home page between the featured
//  projects and the rest. Each photo names the project it belongs to.
// ─────────────────────────────────────────────────────────────
export const gallery: { src: string; w: number; h: number; project: string }[] = [
  { src: "work/photography-videography/shorona/shoot/02.webp", w: 1400, h: 2099, project: "Shorona: Costume Styling" },
  { src: "work/photography-videography/fashion-editorial/05.webp", w: 1400, h: 2100, project: "Fashion Editorial Shoot" },
  { src: "work/photography-videography/keibu-keioiba/shoot/04.webp", w: 1400, h: 2100, project: "Studio Photography: Keibu Keioiba" },
  { src: "work/photography-videography/durex-styling/shoot/01.webp", w: 1190, h: 1684, project: "#WhatIsSexy? — Styling Campaign" },
  { src: "work/photography-videography/shorona/shoot/06.webp", w: 1400, h: 2099, project: "Shorona: Costume Styling" },
  { src: "work/photography-videography/fashion-editorial/13.webp", w: 1600, h: 1067, project: "Fashion Editorial Shoot" },
  { src: "work/photography-videography/keibu-keioiba/shoot/01.webp", w: 1400, h: 932, project: "Studio Photography: Keibu Keioiba" },
  { src: "work/photography-videography/sthetix-in-stone/02.webp", w: 1400, h: 934, project: "Sthetix in Stone" },
  { src: "work/photography-videography/shorona/shoot/12.webp", w: 1400, h: 1867, project: "Shorona: Costume Styling" },
  { src: "work/photography-videography/fashion-editorial/07.webp", w: 1400, h: 2100, project: "Fashion Editorial Shoot" },
  { src: "work/photography-videography/durex-styling/shoot/05.webp", w: 1190, h: 1684, project: "#WhatIsSexy? — Styling Campaign" },
  { src: "work/photography-videography/faredoons/shoot/03.webp", w: 1594, h: 1061, project: "Faredoon's Food Photography" },
  { src: "work/photography-videography/keibu-keioiba/shoot/05.webp", w: 1400, h: 934, project: "Studio Photography: Keibu Keioiba" },
  { src: "work/photography-videography/fashion-editorial/02.webp", w: 1400, h: 2100, project: "Fashion Editorial Shoot" },
  { src: "work/photography-videography/shorona/shoot/16.webp", w: 1400, h: 2488, project: "Shorona: Costume Styling" },
  { src: "work/photography-videography/sthetix-in-stone/07.webp", w: 1600, h: 1068, project: "Sthetix in Stone" },
]

// ─────────────────────────────────────────────────────────────
//  FEATURED PROJECTS — the row of big cards right below the banner.
// ─────────────────────────────────────────────────────────────
export const featuredProjects = [
  "Fashion Editorial Shoot",
  "Xyricon",
  "#WhatIsSexy? — Styling Campaign",
  "Shorona: Costume Styling",
  "Faredoon's Food Photography",
]
