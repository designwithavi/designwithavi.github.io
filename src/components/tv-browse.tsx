import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Category, Project } from "@/content"

/**
 * The work, browsed like the Apple TV app: a cinematic featured hero that
 * rotates through a few projects, then shelves of cards you scroll sideways.
 * Cards lift, tilt toward the pointer and catch a sheen on hover — the tvOS
 * focus effect. Always dark: the artwork does the talking.
 */

export type Featured = { project: Project; backdrop: string; line?: string }

const SLIDE_MS = 7000
const ease = [0.22, 1, 0.36, 1] as const

/* ---------------- featured hero ---------------- */

function Hero({ items, onOpen, onCategory }: { items: Featured[]; onOpen: (p: Project) => void; onCategory: (name: string) => void }) {
  const [at, setAt] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduce = useReducedMotion()
  const go = useCallback((i: number) => setAt((i + items.length) % items.length), [items.length])

  useEffect(() => {
    if (paused || reduce) return
    const t = setTimeout(() => go(at + 1), SLIDE_MS)
    return () => clearTimeout(t)
  }, [at, paused, reduce, go])

  const f = items[at]
  return (
    <section
      className="relative h-[78svh] min-h-[520px] w-full overflow-hidden bg-black sm:h-[86svh]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured projects"
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={f.backdrop}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        >
          {/* a slow push-in, like a trailer still */}
          <motion.img
            src={f.backdrop}
            alt=""
            className="h-full w-full object-cover"
            initial={{ scale: 1.08 }}
            animate={{ scale: reduce ? 1.08 : 1 }}
            transition={{ duration: SLIDE_MS / 1000 + 1.5, ease: "linear" }}
          />
        </motion.div>
      </AnimatePresence>

      {/* legibility: a dark wash from the bottom and the left */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0b0c] via-[#0b0b0c]/40 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-14 sm:px-10 sm:pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={f.project.title}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease }}
            className="max-w-2xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
              {f.project.category}
              {f.project.year && ` · ${f.project.year}`}
            </p>
            <h2 className="mt-3 font-heading text-5xl leading-[0.95] text-white sm:text-7xl">{f.project.title}</h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">{f.line ?? f.project.summary}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onOpen(f.project)}
                className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition hover:scale-[1.03] hover:bg-white/90 active:scale-[.98]"
              >
                View project
              </button>
              <button
                type="button"
                onClick={() => onCategory(f.project.category)}
                className="rounded-full bg-white/15 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/25"
              >
                More {f.project.category}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* position: a pill per slide, the current one filling as it plays */}
        <div className="mt-10 flex items-center gap-2">
          {items.map((it, i) => (
            <button
              key={it.project.title}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show ${it.project.title}`}
              aria-current={i === at}
              className={`relative h-1.5 overflow-hidden rounded-full bg-white/30 transition-all duration-500 ${i === at ? "w-10" : "w-1.5 hover:bg-white/60"}`}
            >
              {i === at && !reduce && (
                <motion.span
                  key={`${at}-${paused}`}
                  className="absolute inset-y-0 left-0 bg-white"
                  initial={{ width: "0%" }}
                  animate={{ width: paused ? "0%" : "100%" }}
                  transition={{ duration: paused ? 0 : SLIDE_MS / 1000, ease: "linear" }}
                />
              )}
              {i === at && reduce && <span className="absolute inset-0 bg-white" />}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => go(at - 1)}
        aria-label="Previous featured"
        className="absolute left-3 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white backdrop-blur-md transition hover:bg-black/50 md:grid"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => go(at + 1)}
        aria-label="Next featured"
        className="absolute right-3 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white backdrop-blur-md transition hover:bg-black/50 md:grid"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </section>
  )
}

/* ---------------- a card with the tvOS focus effect ---------------- */

export function Card({ p, onOpen, fluid, bare }: { p: Project; onOpen: (p: Project) => void; fluid?: boolean; bare?: boolean }) {
  const el = useRef<HTMLButtonElement>(null)
  const reduce = useReducedMotion()
  const [tilt, setTilt] = useState({ x: 0, y: 0, on: false })

  const move = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse") return
    const r = el.current!.getBoundingClientRect()
    setTilt({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5, on: true })
  }

  return (
    <div className={fluid ? "w-full" : "w-[72vw] shrink-0 snap-start sm:w-[340px] lg:w-[380px]"}>
      <button
        ref={el}
        type="button"
        onClick={() => onOpen(p)}
        onPointerMove={move}
        onPointerLeave={() => setTilt({ x: 0, y: 0, on: false })}
        className="group relative block aspect-video w-full rounded-xl outline-none [perspective:900px]"
        aria-label={`${p.title}${p.year ? `, ${p.year}` : ""}`}
      >
        <span
          className="absolute inset-0 overflow-hidden rounded-xl bg-[#1d1d20] shadow-[0_10px_30px_-12px_rgba(0,0,0,.8)] ring-1 ring-white/5 transition-[transform,box-shadow] duration-300 ease-out group-hover:shadow-[0_30px_60px_-18px_rgba(0,0,0,.9)] group-focus-visible:shadow-[0_30px_60px_-18px_rgba(0,0,0,.9)] group-focus-visible:ring-2 group-focus-visible:ring-white"
          style={{
            transform: tilt.on
              ? `scale(1.06) rotateY(${tilt.x * 10}deg) rotateX(${-tilt.y * 8}deg)`
              : undefined,
            backgroundColor: p.color,
          }}
        >
          {p.cover && <img src={p.cover} alt="" loading="lazy" className="h-full w-full object-cover object-top" draggable={false} />}
          {/* the sheen that follows the pointer */}
          <span
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              opacity: tilt.on ? 1 : 0,
              background: `radial-gradient(circle at ${(tilt.x + 0.5) * 100}% ${(tilt.y + 0.5) * 100}%, rgba(255,255,255,.28), rgba(255,255,255,0) 55%)`,
            }}
          />
        </span>
      </button>
      {!bare && <div className="mt-3 px-0.5">
        <p className="truncate text-[15px] font-semibold text-white">{p.title}</p>
        <p className="mt-0.5 truncate text-[13px] text-white/50">
          {[p.category, p.year].filter(Boolean).join(" · ")}
        </p>
      </div>}
    </div>
  )
}

/* ---------------- a shelf ---------------- */

export function Shelf({ title, projects, onOpen, onSeeAll }: { title: string; projects: Project[]; onOpen: (p: Project) => void; onSeeAll?: () => void }) {
  const row = useRef<HTMLDivElement>(null)
  const [ends, setEnds] = useState({ start: true, end: false })
  const check = () => {
    const r = row.current
    if (r) setEnds({ start: r.scrollLeft < 8, end: r.scrollLeft + r.clientWidth > r.scrollWidth - 8 })
  }
  useEffect(check, [projects])
  const page = (d: 1 | -1) => row.current?.scrollBy({ left: d * row.current.clientWidth * 0.85, behavior: "smooth" })

  const arrow = "absolute top-0 z-10 hidden aspect-video w-12 place-items-center text-white opacity-0 transition-opacity group-hover/shelf:opacity-100 md:grid"
  return (
    <section className="group/shelf relative mt-12 first:mt-0">
      <div className="mx-auto max-w-7xl px-5 sm:px-10">
        {onSeeAll ? (
          <button type="button" onClick={onSeeAll} className="group/t inline-flex items-center gap-1 text-xl font-semibold text-white sm:text-2xl">
            {title}
            <ChevronRight className="h-5 w-5 text-white/50 transition-transform group-hover/t:translate-x-1" />
          </button>
        ) : (
          <h3 className="text-xl font-semibold text-white sm:text-2xl">{title}</h3>
        )}
      </div>
      <div className="relative mx-auto max-w-7xl">
        <div
          ref={row}
          onScroll={check}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 pt-4 [scroll-padding-inline:1.25rem] [scrollbar-width:none] sm:gap-6 sm:px-10 sm:[scroll-padding-inline:2.5rem] [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((p) => (
            <Card key={p.title} p={p} onOpen={onOpen} />
          ))}
        </div>
        {!ends.start && (
          <button type="button" onClick={() => page(-1)} aria-label={`Scroll ${title} back`} className={`${arrow} left-0 mt-4 bg-gradient-to-r from-[#0b0b0c] to-transparent`}>
            <ChevronLeft className="h-7 w-7" />
          </button>
        )}
        {!ends.end && (
          <button type="button" onClick={() => page(1)} aria-label={`Scroll ${title} on`} className={`${arrow} right-0 mt-4 bg-gradient-to-l from-[#0b0b0c] to-transparent`}>
            <ChevronRight className="h-7 w-7" />
          </button>
        )}
      </div>
    </section>
  )
}

/* ---------------- top 10: big rank numbers beside the cards ---------------- */

function TopTen({ projects, onOpen }: { projects: Project[]; onOpen: (p: Project) => void }) {
  const row = useRef<HTMLDivElement>(null)
  const page = (d: 1 | -1) => row.current?.scrollBy({ left: d * row.current.clientWidth * 0.85, behavior: "smooth" })
  return (
    <section className="group/shelf relative">
      <div className="mx-auto max-w-7xl px-5 sm:px-10">
        <h3 className="text-xl font-semibold text-white sm:text-2xl">Top 10 projects</h3>
        <p className="mt-1 text-sm text-white/45">Most viewed on Behance</p>
      </div>
      <div className="relative mx-auto max-w-7xl">
        <div
          ref={row}
          className="flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 pb-4 pt-4 [scroll-padding-inline:1.25rem] [scrollbar-width:none] sm:gap-4 sm:px-10 sm:[scroll-padding-inline:2.5rem] [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((p, i) => (
            <div key={p.title} className="shrink-0 snap-start">
              {/* the rank: a tall outlined numeral standing on the same line as the picture */}
              <div className="flex items-end">
                <span
                  aria-hidden="true"
                  className="relative z-0 -mr-1 select-none font-heading text-[120px] font-bold leading-[0.74] text-[#0b0b0c] sm:-mr-2 sm:text-[170px]"
                  style={{ WebkitTextStroke: "3px rgba(255,255,255,.5)", letterSpacing: i === 9 ? "-0.1em" : undefined }}
                >
                  {i + 1}
                </span>
                <div className="relative z-10">
                  <span className="sr-only">Number {i + 1}: </span>
                  <Card p={p} onOpen={onOpen} bare />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2 pl-1">
                <span className="font-mono text-xs text-white/40">#{i + 1}</span>
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold text-white">{p.title}</p>
                  <p className="truncate text-[13px] text-white/50">{(p.stats?.views ?? 0).toLocaleString("en-US")} views · {p.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => page(-1)} aria-label="Scroll top 10 back" className="absolute left-0 top-4 z-10 hidden aspect-video w-12 place-items-center bg-gradient-to-r from-[#0b0b0c] to-transparent text-white opacity-0 transition-opacity group-hover/shelf:opacity-100 md:grid">
          <ChevronLeft className="h-7 w-7" />
        </button>
        <button type="button" onClick={() => page(1)} aria-label="Scroll top 10 on" className="absolute right-0 top-4 z-10 hidden aspect-video w-12 place-items-center bg-gradient-to-l from-[#0b0b0c] to-transparent text-white opacity-0 transition-opacity group-hover/shelf:opacity-100 md:grid">
          <ChevronRight className="h-7 w-7" />
        </button>
      </div>
    </section>
  )
}

/* ---------------- the browse page ---------------- */

export function TvBrowse({
  featured,
  top,
  categories,
  projects,
  onOpen,
  onCategory,
}: {
  featured: Featured[]
  top: Project[]
  categories: Category[]
  projects: Project[]
  onOpen: (p: Project) => void
  onCategory: (c: Category) => void
}) {
  const byName = (name: string) => categories.find((c) => c.name === name)!
  return (
    <div id="work" className="scroll-mt-0 bg-[#0b0b0c] pb-24 text-white">
      <Hero items={featured} onOpen={onOpen} onCategory={(n) => onCategory(byName(n))} />
      <div className="relative z-10 -mt-6 sm:-mt-10">
        <TopTen projects={top} onOpen={onOpen} />
        <div className="h-12" />
        {categories.map((c) => {
          const items = projects.filter((p) => p.category === c.name)
          return items.length ? <Shelf key={c.name} title={c.name} projects={items} onOpen={onOpen} onSeeAll={() => onCategory(c)} /> : null
        })}
      </div>
    </div>
  )
}
