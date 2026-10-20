// ─────────────────────────────────────────────────────────────
//  EDIT THIS FILE to change everything written on your portfolio.
//  Only change the text inside the quotes "like this".
//  Save the file and the website updates by itself.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: "Avishkar Kale",
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
    phone: "+91 00000 00000",
    instagram: "https://instagram.com/yourhandle",
    linkedin: "https://linkedin.com/in/yourname",
    behance: "https://behance.net/yourname",
  },
}

// ─────────────────────────────────────────────────────────────
//  PROJECTS
//  To add images: put them in  public/work/<project-folder>/
//  then write the file names below, e.g.  "work/kalamkari/cover.jpg"
//  Leave  cover: ""  to show a coloured placeholder instead.
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
    title: "Project One",
    category: "Collection",
    year: "2026",
    summary: "A short one-line hook about this project.",
    description:
      "Explain the brief, your research, the process and the outcome. " +
      "Recruiters love seeing how you think, not just the final result.",
    cover: "",
    images: [],
    color: "#d9c8b4",
  },
  {
    title: "Project Two",
    category: "Craft Documentation",
    year: "2026",
    summary: "A short one-line hook about this project.",
    description: "Explain the brief, your research, the process and the outcome.",
    cover: "",
    images: [],
    color: "#b9c4b0",
  },
  {
    title: "Project Three",
    category: "Branding",
    year: "2025",
    summary: "A short one-line hook about this project.",
    description: "Explain the brief, your research, the process and the outcome.",
    cover: "",
    images: [],
    color: "#c9b8c8",
  },
  {
    title: "Project Four",
    category: "Textile",
    year: "2025",
    summary: "A short one-line hook about this project.",
    description: "Explain the brief, your research, the process and the outcome.",
    cover: "",
    images: [],
    color: "#b4c3cf",
  },
  {
    title: "Project Five",
    category: "Illustration",
    year: "2024",
    summary: "A short one-line hook about this project.",
    description: "Explain the brief, your research, the process and the outcome.",
    cover: "",
    images: [],
    color: "#d6c9a6",
  },
  {
    title: "Project Six",
    category: "Photography",
    year: "2024",
    summary: "A short one-line hook about this project.",
    description: "Explain the brief, your research, the process and the outcome.",
    cover: "",
    images: [],
    color: "#c8b0a6",
  },
]
