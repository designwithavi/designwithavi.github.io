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
    summary: "An editorial shoot for a designer collection, built on mood and atmosphere.",
    description: "An editorial-style fashion shoot for a designer collection, focusing on mood and atmosphere.",
    behance: "https://www.behance.net/gallery/250810673/Fashion-Editorial-Shoot",
    cover: "work/photography-videography/fashion-editorial/01.webp",
    images: [
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
    color: "#cfc4d9",
  },  {
    title: "Shorona: Costume Styling",
    category: "Photography & Videography",
    year: "2026",
    summary: "Helena from A Midsummer Night's Dream, reimagined in 1880s colonial Bengal.",
    description: "This project reimagines A Midsummer Night's Dream by adapting the character of Helena into the setting of 1880s colonial Bengal (Alipore, Calcutta). The goal was to reconstruct her identity within a new cultural and historical context, blending Bengali traditions with British colonial influences. Through character study and research on textiles, folktales, and social dynamics, a new visual interpretation of Helena was developed. The final outcome is expressed through a cohesive styling approach, translating the character into a fully realised visual narrative. Team: Aashana Ramavati, Avishkar Kale, Prajakta Mahindrakar, Paraj Parikh, Sanskruti Zankar.",
    behance: "https://www.behance.net/gallery/248551049/Shorona-Costume-Styling",
    cover: "work/photography-videography/shorona/01.webp",
    images: [
      { src: "work/photography-videography/shorona/02.webp", w: 1600, h: 1067 },
      { src: "work/photography-videography/shorona/03.webp", w: 1600, h: 2133 },
      { src: "work/photography-videography/shorona/04.webp", w: 1600, h: 900 },
      { src: "work/photography-videography/shorona/05.webp", w: 1600, h: 900 },
      { src: "work/photography-videography/shorona/06.webp", w: 1600, h: 900 },
      { src: "work/photography-videography/shorona/07.webp", w: 1600, h: 900 },
      { src: "work/photography-videography/shorona/08.webp", w: 1600, h: 900 },
      { src: "work/photography-videography/shorona/09.webp", w: 1600, h: 900 },
      { src: "work/photography-videography/shorona/10.webp", w: 1600, h: 900 },
      { src: "work/photography-videography/shorona/11.webp", w: 1600, h: 900 },
      { src: "work/photography-videography/shorona/12.webp", w: 1600, h: 900 },
      { src: "work/photography-videography/shorona/13.webp", w: 1600, h: 900 },
      { src: "work/photography-videography/shorona/14.webp", w: 1600, h: 900 },
      { src: "work/photography-videography/shorona/15.webp", w: 1600, h: 900 },
      { src: "work/photography-videography/shorona/16.webp", w: 1600, h: 900 },
      { src: "work/photography-videography/shorona/17.webp", w: 1600, h: 900 },
      { src: "work/photography-videography/shorona/18.webp", w: 1600, h: 900 },
      { src: "work/photography-videography/shorona/19.webp", w: 1600, h: 900 },
      { src: "work/photography-videography/shorona/20.webp", w: 1600, h: 1067 },
      { src: "work/photography-videography/shorona/21.webp", w: 1600, h: 1067 },
      { src: "work/photography-videography/shorona/22.webp", w: 1600, h: 1067 },
      { src: "work/photography-videography/shorona/23.webp", w: 1600, h: 900 },
      { src: "work/photography-videography/shorona/24.webp", w: 1600, h: 900 },
    ],
    color: "#d9b8b0",
  },  {
    title: "Studio Photography: Keibu Keioiba",
    category: "Photography & Videography",
    year: "2025",
    summary: "Characters from the Manipuri folktale Keibu Keioiba, brought to life in the studio.",
    // DRAFT — written from the images; check it
    description: "A studio photography project that showcases characters from the Manipuri folklore Keibu Keioiba — from the story and its characters to the moodboard, makeup and final portraits.",
    behance: "https://www.behance.net/gallery/248127531/STUDIO-PHOTOGRAPHY-KEIBU-KEIOIBA",
    cover: "work/photography-videography/keibu-keioiba/01.webp",
    images: [
      { src: "work/photography-videography/keibu-keioiba/02.webp", w: 1600, h: 900 },
      { src: "work/photography-videography/keibu-keioiba/03.webp", w: 1600, h: 900 },
      { src: "work/photography-videography/keibu-keioiba/04.webp", w: 1600, h: 900 },
      { src: "work/photography-videography/keibu-keioiba/05.webp", w: 1600, h: 900 },
      { src: "work/photography-videography/keibu-keioiba/06.webp", w: 1600, h: 900 },
      { src: "work/photography-videography/keibu-keioiba/07.webp", w: 1600, h: 900 },
      { src: "work/photography-videography/keibu-keioiba/08.webp", w: 1600, h: 1067 },
      { src: "work/photography-videography/keibu-keioiba/09.webp", w: 1356, h: 1868 },
      { src: "work/photography-videography/keibu-keioiba/10.webp", w: 1600, h: 1202 },
      { src: "work/photography-videography/keibu-keioiba/11.webp", w: 1600, h: 1600 },
      { src: "work/photography-videography/keibu-keioiba/12.webp", w: 1600, h: 1067 },
      { src: "work/photography-videography/keibu-keioiba/13.webp", w: 1600, h: 1629 },
      { src: "work/photography-videography/keibu-keioiba/14.webp", w: 1354, h: 2030 },
    ],
    color: "#d9cbb6",
  },  {
    title: "Studio Photography: Buldak Ramen",
    category: "Photography & Videography",
    year: "2025",
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
  },  {
    title: "Faredoon's Food Photography",
    category: "Photography & Videography",
    year: "2025",
    summary: "Food photography and styling for Faredoon's, from moodboard to a planned set.",
    // DRAFT — written from the images; check it
    description: "A food photography and styling project for Faredoon's — from the moodboard and colour palette to a 3D-planned set and the final shoot. Shot on a Sony A7 III and edited in Capture One, Lightroom and Photoshop.",
    behance: "https://www.behance.net/gallery/256987947/Faredoons-Food-Photography",
    cover: "work/photography-videography/faredoons/01.webp",
    images: [
      { src: "work/photography-videography/faredoons/02.webp", w: 1600, h: 585 },
      { src: "work/photography-videography/faredoons/03.webp", w: 1600, h: 806 },
      { src: "work/photography-videography/faredoons/04.webp", w: 1600, h: 1032 },
      { src: "work/photography-videography/faredoons/05.webp", w: 1600, h: 1013 },
      { src: "work/photography-videography/faredoons/06.webp", w: 1600, h: 913 },
      { src: "work/photography-videography/faredoons/07.webp", w: 1400, h: 874 },
      { src: "work/photography-videography/faredoons/08.webp", w: 1600, h: 1603 },
      { src: "work/photography-videography/faredoons/09.webp", w: 1600, h: 1608 },
      { src: "work/photography-videography/faredoons/10.webp", w: 1600, h: 2147 },
      { src: "work/photography-videography/faredoons/11.webp", w: 1600, h: 428 },
      { src: "work/photography-videography/faredoons/12.webp", w: 1600, h: 2326 },
      { src: "work/photography-videography/faredoons/13.webp", w: 1600, h: 2307 },
    ],
    color: "#e2d0b0",
  },  {
    title: "Experience Nashik: Photobook",
    category: "Photography & Videography",
    year: "2024",
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
  },  {
    title: "Product Advertisement: Sprite Can",
    category: "Photography & Videography",
    year: "2023",
    summary: "A bold product poster for Sprite, made in Semester 1 of the Foundation Programme at NIFT Hyderabad.",
    description: "A product advertisement for Sprite, made for the Digital Design and Communication course in Semester 1 of the Foundation Programme at NIFT Hyderabad.",
    behance: "https://www.behance.net/gallery/203334665/Product-advertisement-Sprite-Can",
    cover: "work/photography-videography/sprite-can/01.webp",
    images: [],
    color: "#cfe3c4",
  },  {
    title: "Product Advertisement: Zudio Nail Paint",
    category: "Photography & Videography",
    year: "2023",
    summary: "A product poster for Zudio's nail paint, made in Semester 1 at NIFT Hyderabad.",
    description: "A product advertisement for Zudio nail paint, made for the Digital Design and Communication course in Semester 1 of the Foundation Programme at NIFT Hyderabad.",
    behance: "https://www.behance.net/gallery/203398089/Product-Advertisement-Zudio-Nail-Paint",
    cover: "work/photography-videography/zudio-nail-paint/01.webp",
    images: [],
    color: "#e7c4cf",
  },







  {
    title: "Flash Cryogenics",
    category: "Branding",
    year: "2024",
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
    title: "Verve Magazine Design",
    category: "Graphic Design",
    year: "2024",
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
    category: "Graphic Design",
    year: "2024",
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
    summary: "Perfume reimagined as a journey of self-discovery.",
    description: "Novus reimagines perfume as a journey of self-discovery. Instead of choosing a fragrance, users create one that reflects who they are. The project tackles a key challenge: translating scent into a digital experience. Through an archetype-based quiz and cross-sensory design (visuals, motion, and sound), Novus allows users to 'feel' a fragrance before it exists. Extending beyond screens, the physical store becomes a customization lab where users interact, experiment, and co-create their signature scent. Minimal, calm, and intentional, Novus turns perfume from a product into a personal expression. Team: Aashana Ramavati, Keerti Manojna, Avishkar Kale, Jyotsana K, Sivnandan KS.",
    behance: "https://www.behance.net/gallery/248288401/NOVUS-User-Experience-Design",
    cover: "work/ux-design/novus/01.webp",
    images: [
      { src: "work/ux-design/novus/02.webp", w: 1600, h: 900 },
      { src: "work/ux-design/novus/03.webp", w: 1600, h: 900 },
      { src: "work/ux-design/novus/04.webp", w: 1600, h: 900 },
      { src: "work/ux-design/novus/05.webp", w: 1600, h: 900 },
      { src: "work/ux-design/novus/06.webp", w: 1600, h: 900 },
      { src: "work/ux-design/novus/07.webp", w: 1600, h: 900 },
      { src: "work/ux-design/novus/08.webp", w: 1600, h: 900 },
      { src: "work/ux-design/novus/09.webp", w: 1600, h: 900 },
      { src: "work/ux-design/novus/10.webp", w: 1600, h: 900 },
      { src: "work/ux-design/novus/11.webp", w: 1600, h: 900 },
      { src: "work/ux-design/novus/12.webp", w: 1600, h: 900 },
      { src: "work/ux-design/novus/13.webp", w: 1600, h: 900 },
      { src: "work/ux-design/novus/14.webp", w: 1600, h: 900 },
      { src: "work/ux-design/novus/15.webp", w: 1600, h: 900 },
      { src: "work/ux-design/novus/16.webp", w: 1600, h: 900 },
      { src: "work/ux-design/novus/17.webp", w: 1600, h: 900 },
      { src: "work/ux-design/novus/18.webp", w: 1600, h: 900 },
      { src: "work/ux-design/novus/19.webp", w: 1600, h: 900 },
      { src: "work/ux-design/novus/20.webp", w: 1600, h: 900 },
      { src: "work/ux-design/novus/21.webp", w: 1600, h: 900 },
      { src: "work/ux-design/novus/22.webp", w: 1600, h: 900 },
      { src: "work/ux-design/novus/23.webp", w: 1600, h: 900 },
      { src: "work/ux-design/novus/24.webp", w: 1600, h: 900 },
    ],
    color: "#c8cfe0",
  },
  {
    title: "ECO-Amphi: Emergency Medical Transport",
    category: "Product Design",
    year: "2024",
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
