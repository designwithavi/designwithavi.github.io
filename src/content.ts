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

  skills: [
    "Design research",
    "Illustration",
    "Adobe Illustrator",
    "Photoshop",
    "InDesign",
    "Figma",
    "Styling",
    "Photography",
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
  { name: "Graphic Design", art: "glacier", tone: "light", image: "" },
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
  /** Optional link to the full project on Behance — adds a button at the end of the project page. */
  behance?: string
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
    images: [{ src: "work/visual-merchandising/chumbak/02-model-and-process.jpg", caption: "The set, in studio and against the city" }],
    color: "#c9b8c8",
  },
  // ── Projects from Behance ───────────────────────────────────
  // Years are when each was posted on Behance — correct them if they differ.
  // Summaries/descriptions are empty until you send text; each links to Behance.
  {
    title: "Product Advertisement: Sprite Can",
    category: "Photography & Videography",
    year: "2024",
    summary: "",
    description: "",
    behance: "https://www.behance.net/gallery/203334665/Product-advertisement-Sprite-Can",
    cover: "",
    images: [],
    color: "#cfe3c4",
  },
  {
    title: "Product Advertisement: Zudio Nail Paint",
    category: "Photography & Videography",
    year: "2024",
    summary: "",
    description: "",
    behance: "https://www.behance.net/gallery/203398089/Product-Advertisement-Zudio-Nail-Paint",
    cover: "",
    images: [],
    color: "#e7c4cf",
  },
  {
    title: "Studio Photography: Keibu Keioiba",
    category: "Photography & Videography",
    year: "2026",
    summary: "",
    description: "",
    behance: "https://www.behance.net/gallery/248127531/STUDIO-PHOTOGRAPHY-KEIBU-KEIOIBA",
    cover: "",
    images: [],
    color: "#d9cbb6",
  },
  {
    title: "Studio Photography: Buldak Ramen",
    category: "Photography & Videography",
    year: "2026",
    summary: "",
    description: "",
    behance: "https://www.behance.net/gallery/248170591/Studio-Photography-Buldak-Ramen",
    cover: "",
    images: [],
    color: "#e8c3a8",
  },
  {
    title: "Faredoon's Food Photography",
    category: "Photography & Videography",
    year: "2026",
    summary: "",
    description: "",
    behance: "https://www.behance.net/gallery/256987947/Faredoons-Food-Photography",
    cover: "",
    images: [],
    color: "#e2d0b0",
  },
  {
    title: "Fashion Editorial Shoot",
    category: "Photography & Videography",
    year: "2026",
    summary: "",
    description: "",
    behance: "https://www.behance.net/gallery/250810673/Fashion-Editorial-Shoot",
    cover: "",
    images: [],
    color: "#cfc4d9",
  },
  {
    title: "Shorona: Costume Styling",
    category: "Photography & Videography",
    year: "2026",
    summary: "",
    description: "",
    behance: "https://www.behance.net/gallery/248551049/Shorona-Costume-Styling",
    cover: "",
    images: [],
    color: "#d9b8b0",
  },
  {
    title: "Experience Nashik: Photobook",
    category: "Photography & Videography",
    year: "2024",
    summary: "",
    description: "",
    behance: "https://www.behance.net/gallery/215579545/EXPERIENCE-NASHIK-PHOTOBOOK",
    cover: "",
    images: [],
    color: "#c4d3d9",
  },
  {
    title: "Flash Cryogenics",
    category: "Branding",
    year: "2026",
    summary: "",
    description: "",
    behance: "https://www.behance.net/gallery/257094239/Branding-Flash-Cryogenics",
    cover: "",
    images: [],
    color: "#bfd0dd",
  },
  {
    title: "Verve Magazine Design",
    category: "Graphic Design",
    year: "2025",
    summary: "",
    description: "",
    behance: "https://www.behance.net/gallery/241015223/Verve-Magazine-Design",
    cover: "",
    images: [],
    color: "#e0cfc4",
  },
  {
    title: "Cassiopea: Devanagari Script Typeface",
    category: "Graphic Design",
    year: "2026",
    summary: "",
    description: "",
    behance: "https://www.behance.net/gallery/248290199/Cassiopea-Typeface-design-Script-Devanagari",
    cover: "",
    images: [],
    color: "#d6d0c4",
  },
  {
    title: "NOVUS",
    category: "UX Design",
    year: "2026",
    summary: "",
    description: "",
    behance: "https://www.behance.net/gallery/248288401/NOVUS-User-Experience-Design",
    cover: "",
    images: [],
    color: "#c8cfe0",
  },
  {
    title: "ECO-Amphi: Emergency Medical Transport",
    category: "Product Design",
    year: "2026",
    summary: "",
    description: "",
    behance: "https://www.behance.net/gallery/248630719/ECO-Amphi-Transport-for-Emergency-Medical-Services",
    cover: "",
    images: [],
    color: "#c9d9cc",
  },
]
