import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import GlassFolder from "@/components/ui/glass-folder-cards"
import { OwlSwitch, useIsDark } from "@/components/owl-switch"
import { BehanceIcon, InstagramIcon, LinkedInIcon } from "@/components/brand-icons"
import { CelestialOrb } from "@/components/celestial-orb"
import { MinimalistHero, useFitWidth } from "@/components/ui/minimalist-hero"
import { ProjectGallery } from "@/components/project-gallery"
import { categories, projects, site, type Category, type Project } from "@/content"
import { CategoryView } from "@/components/category-view"
import { useRoute } from "@/route"
import { PageLoader, preload } from "@/components/page-loader"

function Cover({ project, className = "" }: { project: Project; className?: string }) {
  if (project.cover) {
    return (
      <img
        src={project.cover}
        alt={project.title}
        loading="lazy"
        className={`h-full w-full object-cover ${className}`}
      />
    )
  }
  return (
    <div
      className={`flex h-full w-full items-end p-6 ${className}`}
      style={{ backgroundColor: project.color }}
    >
      <span className="font-heading text-4xl text-black/40">{project.title}</span>
    </div>
  )
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-paper/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <a href="#top" className="font-heading text-xl sm:text-2xl">
          {site.name}
        </a>
        <div className="flex items-center gap-4 text-sm text-ink-3 sm:gap-6">
          <a href="#work" className="hover:text-ink">Work</a>
          <a href="#about" className="hover:text-ink">About</a>
          <a href="#contact" className="hover:text-ink">Contact</a>
        </div>
      </nav>
    </header>
  )
}

function Hero() {
  const dark = useIsDark()
  return (
    <section id="top">
      <MinimalistHero
        name={site.nickname}
        mainText={site.tagline}
        readMoreLink="#about"
        readMoreLabel="About me"
        imageSrc={site.portrait}
        fallbackImageSrc="me-placeholder.svg"
        imageAlt={`Portrait of ${site.name}`}
        sideText={{ title: site.role, detail: site.availability }}
        socialLinks={[
          { icon: InstagramIcon, href: site.contact.instagram, label: "Instagram" },
          { icon: LinkedInIcon, href: site.contact.linkedin, label: "LinkedIn" },
          { icon: BehanceIcon, href: site.contact.behance, label: "Behance" },
        ]}
        locationText={site.location}
        orb={<CelestialOrb night={dark} />}
      />
    </section>
  )
}

function useFolderWidth() {
  const fit = () => Math.min(340, window.innerWidth - 32)
  const [width, setWidth] = useState(fit)
  useEffect(() => {
    const onResize = () => setWidth(fit())
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])
  return width
}

function Work({ onEnter, onOpen }: { onEnter: (c: Category) => void; onOpen: (c: Category, p: Project) => void }) {

  const width = useFolderWidth()
  const dark = useIsDark()
  return (
    <section id="work" className="relative scroll-mt-20 overflow-hidden py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1.1px, transparent 1.4px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-8">
        <div className="mb-14 flex items-baseline justify-between border-b border-line pb-4">
          <h2 className="font-heading text-4xl">Selected Work</h2>
          <span className="text-sm text-ink-4">{projects.length} projects</span>
        </div>
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-end justify-center gap-x-8 gap-y-12">
          {categories.map((c, i) => {
            // the folder shows its last file at the front, so reverse: the first project listed sits on top
            const items = projects.filter((p) => p.category === c.name).reverse()
            return (
              <GlassFolder
                key={c.name}
                label={c.name}
                art={c.art}
                tone={dark ? "dark" : c.tone}
                image={c.image || undefined}
                seed={i * 7 + 3}
                action="none"
                width={width}
                appearDelay={i * 120}
                // a tapped folder goes straight to its page; it never fans out here
                open={false}
                onOpenChange={(o) => o && onEnter(c)}
                files={items.map((p) => ({
                  name: p.title,
                  meta: p.year,
                  image: p.cover || undefined,
                  art: p.cover ? undefined : c.art,
                }))}
                onFileSelect={(_, index) => onOpen(c, items[index])}
              />
            )
          })}
        </div>
        <p className="mt-14 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink-4">
          Open a folder to see its projects
        </p>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8">
      <div className="grid gap-12 border-t border-line pt-10 md:grid-cols-[1fr_2fr]">
        <h2 className="font-heading text-4xl">About</h2>
        <div>
          <p className="text-xl leading-relaxed text-ink-2 sm:text-2xl">{site.about}</p>

          <div className="mt-12 grid gap-10 sm:grid-cols-2">
            <div>
              <h3 className="mb-4 text-xs uppercase tracking-[0.2em] text-ink-4">Education & Experience</h3>
              <ul className="space-y-4">
                {site.education.map((e) => (
                  <li key={e.title}>
                    <p className="font-medium">{e.title}</p>
                    <p className="text-sm text-ink-3">
                      {e.detail} · {e.years}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xs uppercase tracking-[0.2em] text-ink-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {site.skills.map((s) => (
                  <span key={s} className="rounded-full border border-line px-3 py-1 text-sm">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <a
            href={site.cvFile}
            target="_blank"
            rel="noreferrer"
            className="mt-12 inline-block rounded-full bg-ink px-6 py-3 text-sm text-paper transition hover:opacity-80"
          >
            Download CV ↓
          </a>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const links = [
    ["Instagram", site.contact.instagram],
    ["LinkedIn", site.contact.linkedin],
    ["Behance", site.contact.behance],
  ]
  return (
    <section id="contact" className="scroll-mt-20 bg-night text-night-ink">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">Let's work together</p>
        <a
          href={`mailto:${site.contact.email}`}
          className="mt-6 block break-words font-heading text-5xl hover:opacity-70 sm:text-7xl"
        >
          {site.contact.email}
        </a>
        {site.contact.phone && <p className="mt-4 text-white/60">{site.contact.phone}</p>}
        <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-6 text-sm">
          {links.map(([label, url]) => (
            <a key={label} href={url} target="_blank" rel="noreferrer" className="hover:opacity-70">
              {label} ↗
            </a>
          ))}
          <span className="ml-auto text-white/40">
            © {new Date().getFullYear()} {site.name}
          </span>
        </div>
      </div>
    </section>
  )
}

/** A project's opening screen: its name across the width, the cut-out rising in front. */
function ProjectHero({ project, hero }: { project: Project; hero: string }) {
  const box = useRef<HTMLElement>(null)
  const name = useRef<HTMLSpanElement>(null)
  useFitWidth(box, name)
  const ease = [0.22, 1, 0.36, 1] as const
  return (
    <section ref={box} className="relative h-[78svh] overflow-hidden px-4 sm:px-8 md:h-[100svh]">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="pt-20 text-center text-xs uppercase tracking-[0.2em] text-ink-4"
      >
        {project.category} · {project.year}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease, delay: 0.15 }}
        className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-display font-black uppercase leading-[.78] tracking-[-0.01em] text-ink"
      >
        <span ref={name} className="inline-block">
          {project.title}
        </span>
      </motion.h2>
      <motion.img
        src={hero}
        alt={project.title}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease, delay: 0.3 }}
        className="absolute bottom-0 left-1/2 z-10 max-h-[62svh] w-[min(96vw,880px)] max-w-none -translate-x-1/2 object-contain object-bottom"
      />
    </section>
  )
}

function ProjectView({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[55] overflow-y-auto bg-paper animate-in fade-in duration-300">
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-10 rounded-full bg-ink px-4 py-2 text-sm text-paper hover:opacity-80"
      >
        Close ✕
      </button>
      {project.hero && <ProjectHero project={project} hero={project.hero} />}
      <article className={`mx-auto max-w-6xl px-4 pb-24 sm:px-8 ${project.hero ? "pt-14" : "pt-20"}`}>
        {!project.hero && (
          <>
            <p className="text-xs uppercase tracking-[0.2em] text-ink-4">
              {project.category} · {project.year}
            </p>
            <h2 className="mt-3 font-heading text-5xl sm:text-7xl">{project.title}</h2>
          </>
        )}
        <p className={`mx-auto max-w-2xl text-center text-lg leading-relaxed text-ink-2 ${project.hero ? "" : "mt-6"}`}>
          {project.description}
        </p>
        <div className="mt-12">
          {project.cover ? (
            <ProjectGallery
              images={[{ src: project.cover, caption: project.coverCaption }, ...project.images]}
              title={project.title}
            />
          ) : (
            <div className="aspect-[16/10] overflow-hidden rounded-3xl">
              <Cover project={project} />
            </div>
          )}
        </div>
        {project.behance && (
          <div className="mt-20 flex flex-col items-center gap-5 border-t border-line pt-14 text-center">
            <p className="font-heading text-3xl text-ink sm:text-4xl">Check out the entire project</p>
            <p className="max-w-md text-sm text-ink-3">See the full story of this project on Behance.</p>
            <a
              href={project.behance}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-2 inline-flex items-center gap-3 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper transition hover:opacity-85"
            >
              <BehanceIcon className="h-5 w-5" />
              View on Behance
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        )}
      </article>
    </div>
  )
}

function App() {
  const { route, go: goNow, up } = useRoute()
  const inWork = !!route.category

  // going forward into a folder or project passes through the loading curtain;
  // the page switches underneath it while its first images load
  const [loading, setLoading] = useState<{ label: string; kicker?: string } | null>(null)
  const go = (c: Category, p?: Project) => {
    const images = p
      ? [p.hero, p.cover].filter((x): x is string => !!x)
      : projects.filter((x) => x.category === c.name).slice(0, 6).map((x) => x.cover).filter(Boolean)
    setLoading(p ? { label: p.title, kicker: c.name } : { label: c.name })
    // switch once the curtain has covered the screen
    setTimeout(() => goNow(c, p), 450)
    preload(images).then(() => setTimeout(() => setLoading(null), 150))
  }

  // the page underneath shouldn't scroll while a folder or project is open; Escape goes up a level
  useEffect(() => {
    if (!inWork) return
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && up()
    document.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      document.removeEventListener("keydown", onKey)
    }
  }, [inWork, up])

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Nav />
      <OwlSwitch />
      <main>
        <Hero />
        <Work onEnter={(c) => go(c)} onOpen={(c, p) => go(c, p)} />
        <About />
      </main>
      <Contact />
      {route.category && (
        <CategoryView
          key={route.category.name}
          category={route.category}
          projects={projects.filter((p) => p.category === route.category!.name)}
          onOpen={(p) => go(route.category!, p)}
          onBack={up}
        />
      )}
      {route.project && <ProjectView key={route.project.title} project={route.project} onClose={up} />}
      <PageLoader label={loading?.label ?? null} kicker={loading?.kicker} />
    </div>
  )
}

export default App
