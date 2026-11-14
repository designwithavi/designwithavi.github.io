import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { OwlSwitch, useIsDark } from "@/components/owl-switch"
import { BehanceIcon, InstagramIcon, LinkedInIcon } from "@/components/brand-icons"
import { CelestialOrb } from "@/components/celestial-orb"
import { MinimalistHero, useFitWidth } from "@/components/ui/minimalist-hero"
import { ProjectGallery } from "@/components/project-gallery"
import { Flipbook } from "@/components/flipbook"
import { ProjectSections } from "@/components/project-sections"
import { categories, featured, featuredProjects, gallery, projects, site, type Category, type Project } from "@/content"
import { Shelf, TvBrowse } from "@/components/tv-browse"
import { CategoryView } from "@/components/category-view"
import { useRoute } from "@/route"
import { PageLoader, preload } from "@/components/page-loader"
import { AboutPage } from "@/components/about-page"

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

function Nav({ overlay }: { overlay: boolean }) {
  // over the dark Work section the bar turns to dark glass, like Apple's — and it stays
  // on top of every page (folders, projects, About), so the menu is always there
  const [onWork, setOnWork] = useState(false)
  useEffect(() => {
    const work = document.getElementById("work")
    if (!work) return
    const io = new IntersectionObserver(([e]) => setOnWork(e.isIntersecting), { rootMargin: "0px 0px -94% 0px" })
    io.observe(work)
    return () => io.disconnect()
  }, [])
  const onDark = onWork || overlay
  // from a folder, project or About: close it, then glide to that part of the page
  const jump = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!overlay) return
    e.preventDefault()
    const to = e.currentTarget.getAttribute("href")!
    location.hash = to
    setTimeout(() => document.querySelector(to)?.scrollIntoView({ behavior: "smooth" }), 60)
  }
  return (
    <header
      className={`fixed inset-x-0 top-0 z-[58] border-b backdrop-blur-xl transition-colors duration-500 ${
        onDark ? "border-white/10 bg-[#0b0b0c]/70 text-white" : "border-line bg-paper/80"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <a href="#top" onClick={jump} className="font-heading text-xl sm:text-2xl">
          {site.name}
        </a>
        <div className={`flex items-center gap-4 text-sm sm:gap-6 ${onDark ? "text-white/70" : "text-ink-3"}`}>
          <a href="#work" onClick={jump} className={onDark ? "hover:text-white" : "hover:text-ink"}>Work</a>
          <a href="#/about" className={onDark ? "hover:text-white" : "hover:text-ink"}>About</a>
          <a href="#contact" onClick={jump} className={onDark ? "hover:text-white" : "hover:text-ink"}>Contact</a>
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
        readMoreLink="#/about"
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
        className="pt-28 text-center text-xs uppercase tracking-[0.2em] text-ink-4"
      >
        {project.category}{project.year && ` · ${project.year}`}
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

/** The widest picture a project has: its featured backdrop, else the first landscape image, else its cover. */
function backdropOf(project: Project) {
  const f = featured.find((x) => x.title === project.title)
  if (f) return f.backdrop
  if (project.backdrop) return project.backdrop
  const all = [...project.images, ...(project.sections ?? []).flatMap((s) => s.images)]
  const wide = all.find((i) => typeof i !== "string" && i.w && i.h && i.w / i.h > 1.3 && i.w / i.h < 2)
  return (wide && typeof wide !== "string" ? wide.src : undefined) ?? project.video?.poster ?? project.cover
}

/** A highlight pill, e.g. "Internship". */
export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#3b5bff] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_6px_20px_-6px_rgba(59,91,255,.8)]">
      <span className="size-1.5 rounded-full bg-white" />
      {children}
    </span>
  )
}

/** A soft band at the top of a dark page, so floating buttons never sit on text. */
export function TopFade() {
  return <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-30 h-28 bg-gradient-to-b from-paper via-paper/85 to-transparent" />
}

/** An Apple TV title page: the project's picture full-bleed, its name and details over it. */
function TitleHero({ project, onPlay }: { project: Project; onPlay?: () => void }) {
  const ease = [0.22, 1, 0.36, 1] as const
  const meta = [project.badge ? undefined : project.category, project.year, project.team && "Team project"].filter(Boolean)
  return (
    <section className="relative w-full overflow-hidden bg-paper md:h-[82svh] md:min-h-[520px] md:bg-black">
      {/* the picture: its own block on phones, the whole backdrop from md up */}
      <div className="relative aspect-[4/3] w-full overflow-hidden md:absolute md:inset-0 md:aspect-auto">
        <motion.img
          src={backdropOf(project)}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-paper to-transparent md:inset-0 md:h-auto md:via-paper/40" />
        <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-black/70 via-black/20 to-transparent md:block" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.2 }}
        className="relative mx-auto max-w-6xl px-4 pb-6 pt-1 sm:px-8 md:absolute md:inset-x-0 md:bottom-0 md:pb-14 md:pt-0"
      >
        {project.badge && <Badge>{project.badge}</Badge>}
        <h2 className="max-w-4xl font-heading text-4xl leading-[0.95] text-white sm:text-6xl md:text-7xl">{project.title}</h2>
        <p className="mt-4 flex flex-wrap items-center gap-x-2 text-sm font-medium text-white/70">
          {meta.map((m, i) => (
            <span key={String(m)} className="flex items-center gap-2">
              {i > 0 && <span className="text-white/30">·</span>}
              {m}
            </span>
          ))}
        </p>
        {project.summary && <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">{project.summary}</p>}
        <div className="mt-7 flex flex-wrap gap-3">
          {onPlay && (
            <button type="button" onClick={onPlay} className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition hover:scale-[1.03]">
              ▶ Play film
            </button>
          )}
          {project.behance && (
            <a
              href={project.behance}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition ${onPlay ? "bg-white/15 text-white backdrop-blur-md hover:bg-white/25" : "bg-white text-black hover:scale-[1.03]"}`}
            >
              <BehanceIcon className="h-4 w-4" />
              View on Behance
            </a>
          )}
        </div>
      </motion.div>
    </section>
  )
}

function ProjectView({ project, onClose, onOpen }: { project: Project; onClose: () => void; onOpen: (p: Project) => void }) {
  const film = useRef<HTMLVideoElement>(null)
  const more = projects.filter((p) => p.category === project.category && p.title !== project.title)
  const play = () => {
    film.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    film.current?.play().catch(() => {})
  }
  return (
    <div className="dark tv relative min-h-screen bg-paper text-ink animate-in fade-in duration-300">
      <TopFade />
      <button
        onClick={onClose}
        className="fixed top-[68px] right-4 z-40 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/10 backdrop-blur-xl hover:bg-white/25"
      >
        Close ✕
      </button>
      {project.hero ? <ProjectHero project={project} hero={project.hero} /> : <TitleHero project={project} onPlay={project.video ? play : undefined} />}
      <article className={`mx-auto max-w-6xl px-4 pb-16 sm:px-8 ${project.hero ? "pt-14" : "pt-10"}`}>
        {project.description && (
          <p className={`max-w-3xl text-lg leading-relaxed text-ink-2 ${project.hero ? "mx-auto text-center" : ""}`}>
            {project.description}
          </p>
        )}
        {project.video && (
          <section className="mt-12">
            <video
              ref={film}
              src={project.video.src}
              poster={project.video.poster}
              controls
              playsInline
              preload="metadata"
              className="aspect-video w-full rounded-2xl bg-black"
            />
          </section>
        )}
        {project.flipbook && !project.sections && (
          <section className="mt-12">
            <h3 className="mb-6 font-heading text-3xl sm:text-4xl">{project.flipbook.label}</h3>
            <Flipbook pages={project.flipbook.pages} ratio={project.flipbook.ratio} title={project.title} single={project.flipbook.single} spreads={project.flipbook.spreads} />
          </section>
        )}
        {project.embed && (
          <section className="mt-12">
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <h3 className="font-heading text-3xl sm:text-4xl">{project.embed.label}</h3>
              <a href={project.embed.src} target="_blank" rel="noopener noreferrer" className="shrink-0 text-sm text-ink-3 underline underline-offset-4 hover:text-ink">
                Open full screen ↗
              </a>
            </div>
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-ink/5 sm:aspect-[16/10]">
              <iframe
                src={project.embed.src}
                title={`${project.title} — ${project.embed.label}`}
                loading="lazy"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </section>
        )}
        {project.sections ? (
          <>
            <ProjectSections sections={project.sections} title={project.title} />
        {project.flipbook && (
          <section className="mt-20 border-t border-line pt-14">
            <h3 className="mb-6 font-heading text-3xl sm:text-4xl">{project.flipbook.label}</h3>
            <Flipbook pages={project.flipbook.pages} ratio={project.flipbook.ratio} title={project.title} single={project.flipbook.single} spreads={project.flipbook.spreads} />
          </section>
        )}
          </>
        ) : (
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
        )}
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
      {more.length > 0 && (
        <div className="border-t border-line pt-12 pb-24">
          <Shelf title={`More from ${project.category}`} projects={more} onOpen={onOpen} />
        </div>
      )}
    </div>
  )
}

function App() {
  const { route, go: goNow, goAbout: goAboutNow, up } = useRoute()
  const inWork = !!route.category || route.about

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
  const goAbout = () => {
    setLoading({ label: "About" })
    setTimeout(goAboutNow, 450)
    preload([site.portrait]).then(() => setTimeout(() => setLoading(null), 150))
  }

  // every link to #/about (menu, the hero's "About me") opens the About page
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('a[href="#/about"]')
      if (!a) return
      e.preventDefault()
      goAbout()
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  })

  // Escape goes up a level
  useEffect(() => {
    if (!inWork) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && up()
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [inWork, up])

  // Folders, projects and About are ordinary pages on the window (so pinch-zoom
  // behaves as on any site). Each remembers how far down you were: back on a
  // page you've seen, you land where you left it; a new one opens at the top.
  const where = route.about ? "about" : route.project ? `p:${route.project.title}` : route.category ? `c:${route.category.name}` : "home"
  const scrolls = useRef<Record<string, number>>({})
  const current = useRef(where)
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual"
    const save = () => (scrolls.current[current.current] = window.scrollY)
    window.addEventListener("scroll", save, { passive: true })
    return () => window.removeEventListener("scroll", save)
  }, [])
  useLayoutEffect(() => {
    if (current.current === where) return
    current.current = where
    window.scrollTo(0, scrolls.current[where] ?? 0)
  }, [where])

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Nav overlay={inWork} />
      <div className={inWork ? "hidden" : ""}>
      <OwlSwitch />
      <main>
        <Hero />
        <TvBrowse
          featured={featured.map((f) => ({ ...f, project: projects.find((p) => p.title === f.title)! })).filter((f) => f.project)}
          picks={[...featuredProjects.map((f) => ({ ...f })), ...featuredProjects.map((f) => ({ ...f, title: f.title2 ?? f.title, image: f.image2, pos: f.pos2 }))].map((f) => ({ image: f.image, pos: f.pos, project: projects.find((p) => p.title === f.title)! })).filter((f) => f.project)}
          categories={categories}
          projects={projects}
          onOpen={(p) => go(categories.find((c) => c.name === p.category)!, p)}
          onCategory={(c) => go(c)}
        />
      </main>
      <Contact />
      </div>
      {route.category && (
        <div className={route.project ? "hidden" : ""}>
        <CategoryView
          key={route.category.name}
          category={route.category}
          projects={projects.filter((p) => p.category === route.category!.name)}
          onOpen={(p) => go(route.category!, p)}
          onBack={up}
          photos={route.category.name === "Photography & Videography" ? gallery.map((g) => ({ ...g, project: projects.find((p) => p.title === g.project)! })).filter((g) => g.project) : undefined}
        />
        </div>
      )}
      {route.project && <ProjectView key={route.project.title} project={route.project} onClose={up} onOpen={(p) => go(route.category!, p)} />}
      {route.about && <AboutPage onBack={up} />}
      <PageLoader label={loading?.label ?? null} kicker={loading?.kicker} />
    </div>
  )
}

export default App
