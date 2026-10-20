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
//  image: put a photo path here (e.g. "work/set-design/cover.jpg") to use it instead of the swirl
// ─────────────────────────────────────────────────────────────

export type ArtStyle = "aurora" | "ember" | "dusk" | "glacier" | "verdant"

export type Category = {
  name: string
  art: ArtStyle
  tone: "light" | "dark"
  image: string
}

export const categories: Category[] = [
  { name: "Set Design", art: "dusk", tone: "light", image: "" },
  { name: "Photography", art: "aurora", tone: "light", image: "" },
  { name: "Videography", art: "ember", tone: "dark", image: "" },
  { name: "Branding", art: "verdant", tone: "light", image: "" },
  { name: "Graphic Design", art: "glacier", tone: "light", image: "" },
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
  images: string[]
  color: string // placeholder colour, used when there is no image yet
}

export const projects: Project[] = [
  {
    title: "Chumbak",
    category: "Set Design",
    year: "2025", // TODO: check the year
    // DRAFT text, written from the images — rewrite in your own words
    summary: "A playful in-store display: a city roundabout in miniature, with Chumbak's owl-faced autos doing the rounds.",
    description:
      "A tabletop set for a Chumbak store. A two-tier drum dressed as a little city — arched windows, a ring road with lane markings, a folk-pattern border — with hand-built paper auto-rickshaws wearing the brand's owl face. Shot in the studio and against the city skyline, then placed in the store.",
    cover: "work/set-design/chumbak/01-in-store.jpg",
    images: ["work/set-design/chumbak/02-model-and-process.jpg", "work/set-design/chumbak/03-detail.jpg"],
    color: "#c9b8c8",
  },
  {
    title: "Set Design Project 2",
    category: "Set Design",
    year: "2025",
    summary: "A short one-line hook about this project.",
    description: "Explain the brief, your research, the process and the outcome. Recruiters love seeing how you think, not just the final result.",
    cover: "",
    images: [],
    color: "#c9b8c8",
  },
  {
    title: "Photography Project 1",
    category: "Photography",
    year: "2026",
    summary: "A short one-line hook about this project.",
    description: "Explain the brief, your research, the process and the outcome. Recruiters love seeing how you think, not just the final result.",
    cover: "",
    images: [],
    color: "#e3c9bf",
  },
  {
    title: "Photography Project 2",
    category: "Photography",
    year: "2025",
    summary: "A short one-line hook about this project.",
    description: "Explain the brief, your research, the process and the outcome. Recruiters love seeing how you think, not just the final result.",
    cover: "",
    images: [],
    color: "#e3c9bf",
  },
  {
    title: "Videography Project 1",
    category: "Videography",
    year: "2026",
    summary: "A short one-line hook about this project.",
    description: "Explain the brief, your research, the process and the outcome. Recruiters love seeing how you think, not just the final result.",
    cover: "",
    images: [],
    color: "#b4c3cf",
  },
  {
    title: "Videography Project 2",
    category: "Videography",
    year: "2025",
    summary: "A short one-line hook about this project.",
    description: "Explain the brief, your research, the process and the outcome. Recruiters love seeing how you think, not just the final result.",
    cover: "",
    images: [],
    color: "#b4c3cf",
  },
  {
    title: "Branding Project 1",
    category: "Branding",
    year: "2026",
    summary: "A short one-line hook about this project.",
    description: "Explain the brief, your research, the process and the outcome. Recruiters love seeing how you think, not just the final result.",
    cover: "",
    images: [],
    color: "#b9c4b0",
  },
  {
    title: "Branding Project 2",
    category: "Branding",
    year: "2025",
    summary: "A short one-line hook about this project.",
    description: "Explain the brief, your research, the process and the outcome. Recruiters love seeing how you think, not just the final result.",
    cover: "",
    images: [],
    color: "#b9c4b0",
  },
  {
    title: "Graphic Design Project 1",
    category: "Graphic Design",
    year: "2026",
    summary: "A short one-line hook about this project.",
    description: "Explain the brief, your research, the process and the outcome. Recruiters love seeing how you think, not just the final result.",
    cover: "",
    images: [],
    color: "#d6dde4",
  },
  {
    title: "Graphic Design Project 2",
    category: "Graphic Design",
    year: "2025",
    summary: "A short one-line hook about this project.",
    description: "Explain the brief, your research, the process and the outcome. Recruiters love seeing how you think, not just the final result.",
    cover: "",
    images: [],
    color: "#d6dde4",
  },
]
