import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Category, Project } from "@/content"
import { Lightbox } from "@/components/project-gallery"
import { CircularGallery } from "@/components/ui/circular-gallery"
import { GlowCard } from "@/components/ui/spotlight-card"

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
      className="relative w-full overflow-hidden bg-[#0b0b0c] md:h-[86svh] md:min-h-[560px] md:bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Highlights"
    >
      {/* the picture: its own block on phones, the whole backdrop from md up */}
      <div className="relative aspect-[4/3] w-full overflow-hidden md:absolute md:inset-0 md:aspect-auto">
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
      {/* legibility: a dark wash from the bottom (and the left, where the text sits on wide screens) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0b0b0c] to-transparent md:inset-0 md:h-auto md:via-[#0b0b0c]/40" />
      <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-black/70 via-black/20 to-transparent md:block" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-2 sm:px-10 md:absolute md:inset-x-0 md:bottom-0 md:pb-20 md:pt-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={f.project.title}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease }}
            className="min-h-[248px] max-w-2xl sm:min-h-0"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
              {f.project.category}
              {f.project.year && ` · ${f.project.year}`}
            </p>
            <h2 className="mt-3 font-heading text-4xl leading-[0.95] text-white sm:text-6xl md:text-7xl">{f.project.title}</h2>
            <p className="mt-4 line-clamp-3 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">{f.line ?? f.project.summary}</p>
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
        <div className="mt-8 flex items-center gap-2 md:mt-10">
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

export function Card({ p, onOpen, fluid, bare, big }: { p: Project; onOpen: (p: Project) => void; fluid?: boolean; bare?: boolean; big?: boolean }) {
  const el = useRef<HTMLButtonElement>(null)
  const reduce = useReducedMotion()
  const [tilt, setTilt] = useState({ x: 0, y: 0, on: false })

  const move = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse") return
    const r = el.current!.getBoundingClientRect()
    setTilt({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5, on: true })
  }

  return (
    <div className={fluid ? "w-full" : big ? "w-[84vw] shrink-0 snap-start sm:w-[520px] lg:w-[600px]" : "w-[72vw] shrink-0 snap-start sm:w-[340px] lg:w-[380px]"}>
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
        {big && p.summary && <p className="mt-2 line-clamp-2 max-w-md text-sm leading-snug text-white/70">{p.summary}</p>}
      </div>}
    </div>
  )
}

/* ---------------- a shelf ---------------- */

export function Shelf({ title, subtitle, projects, onOpen, onSeeAll, big }: { title: string; subtitle?: string; projects: Project[]; onOpen: (p: Project) => void; onSeeAll?: () => void; big?: boolean }) {
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
          <h3 className={`font-semibold text-white ${big ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>{title}</h3>
        )}
        {subtitle && <p className="mt-1 text-sm text-white/45">{subtitle}</p>}
      </div>
      <div className="relative mx-auto max-w-7xl">
        <div
          ref={row}
          onScroll={check}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 pt-4 [scroll-padding-inline:1.25rem] [scrollbar-width:none] sm:gap-6 sm:px-10 sm:[scroll-padding-inline:2.5rem] [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((p) => (
            <Card key={p.title} p={p} onOpen={onOpen} big={big} />
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

/* ---------------- featured: a turning ring of glowing cards ---------------- */

export type FeaturedPick = { project: Project; image: string; pos?: string }

/** "#ef8b2b" → its hue, so each card glows in its project's colour */
function hueOf(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16)
  const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
  if (!d) return 30
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  return Math.round(((h * 60) + 360) % 360)
}

function useRingSize() {
  const get = () => {
    const w = window.innerWidth
    if (w < 640) return { cardW: Math.min(260, w * 0.68), cardH: Math.min(360, w * 0.94), radius: 470, height: Math.min(420, w * 1.08) }
    if (w < 1024) return { cardW: 320, cardH: 440, radius: 580, height: 520 }
    return { cardW: 360, cardH: 490, radius: 650, height: 570 }
  }
  const [s, setS] = useState(get)
  useEffect(() => {
    const on = () => setS(get())
    window.addEventListener("resize", on)
    return () => window.removeEventListener("resize", on)
  }, [])
  return s
}

/**
 * The ring turns only sideways — swipe or drag left/right, a sideways trackpad
 * swipe, the arrow buttons or ← → keys — and settles on the nearest card. Up
 * and down always scroll the page, untouched.
 */
function FeaturedRing({ picks, onOpen }: { picks: FeaturedPick[]; onOpen: (p: Project) => void }) {
  const size = useRingSize()
  const n = picks.length
  const per = 360 / n
  const reduce = useReducedMotion()
  // the ring's angle: follows a finger or trackpad 1:1, then glides to rest on a card
  const rotation = useMotionValue(0)
  const [at, setAt] = useState(0)
  useMotionValueEvent(rotation, "change", (r) => {
    const i = ((Math.round(-r / per) % n) + n) % n
    if (i !== at) setAt(i)
  })
  const settle = (to: number, velocity = 0) =>
    animate(rotation, to, reduce ? { duration: 0 } : { type: "spring", stiffness: 170, damping: 26, velocity })
  // the nearest card to an angle, optionally carried on by a flick
  const nearest = (r: number) => Math.round(r / per) * per
  const go = (d: number) => settle(nearest(rotation.get()) - d * per)

  // finger / mouse: only a mostly-sideways gesture turns the ring; up/down is the page's
  const drag = useRef<{ x: number; y: number; id: number; dir: "x" | "y" | null; start: number; last: number; t: number; v: number } | null>(null)
  const degPerPx = per / (size.cardW * 0.9)
  const onDown = (e: React.PointerEvent) => {
    rotation.stop()
    drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId, dir: null, start: rotation.get(), last: e.clientX, t: performance.now(), v: 0 }
  }
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    const dx = e.clientX - d.x, dy = e.clientY - d.y
    if (!d.dir && Math.hypot(dx, dy) > 6) {
      d.dir = Math.abs(dx) > Math.abs(dy) ? "x" : "y"
      if (d.dir === "x") (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    }
    if (d.dir !== "x") return
    rotation.set(d.start + dx * degPerPx)
    // track the swipe's speed for the throw
    const now = performance.now(), dt = Math.max(1, now - d.t)
    d.v = 0.8 * (((e.clientX - d.last) * degPerPx) / dt) * 1000 + 0.2 * d.v
    d.last = e.clientX
    d.t = now
  }
  const onUp = () => {
    const d = drag.current
    drag.current = null
    if (!d) return
    if (d.dir !== "x") return
    // carry the throw on a little, then come to rest on a card
    const projected = rotation.get() + d.v * 0.18
    settle(nearest(projected), d.v)
    if (Math.abs(rotation.get() - d.start) > 2) window.addEventListener("click", (ev) => ev.stopPropagation(), { capture: true, once: true })
  }

  // trackpad: a sideways two-finger swipe turns the ring with the fingers, then it settles; vertical is the page's
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = box.current
    if (!el) return
    let idle = 0
    const wheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault()
      rotation.stop()
      rotation.set(rotation.get() - e.deltaX * degPerPx * 0.9)
      clearTimeout(idle)
      idle = window.setTimeout(() => settle(nearest(rotation.get())), 120)
    }
    el.addEventListener("wheel", wheel, { passive: false })
    return () => {
      el.removeEventListener("wheel", wheel)
      clearTimeout(idle)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [degPerPx])

  const arrow = "grid size-11 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/15 backdrop-blur-md transition hover:bg-white/20 active:scale-95"
  return (
    <section className="relative pt-4">
      <div className="mx-auto flex max-w-7xl items-end justify-between gap-4 px-5 sm:px-10">
        <div>
          <h3 className="text-3xl font-semibold text-white sm:text-5xl">Featured projects</h3>
          <p className="mt-2 text-sm text-white/50">Swipe sideways to browse · tap the front card to open</p>
        </div>
        <div className="hidden shrink-0 items-center gap-3 sm:flex">
          <button type="button" className={arrow} onClick={() => go(-1)} aria-label="Previous featured project">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" className={arrow} onClick={() => go(1)} aria-label="Next featured project">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div
        ref={box}
        style={{ height: size.height, touchAction: "pan-y" }}
        className="relative mt-4 cursor-grab select-none overflow-hidden outline-none active:cursor-grabbing"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={() => {
          drag.current = null
          settle(nearest(rotation.get()))
        }}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured projects"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") (e.preventDefault(), go(1))
          if (e.key === "ArrowLeft") (e.preventDefault(), go(-1))
        }}
      >
        <CircularGallery
          items={picks}
          keyOf={(f) => f.image}
          rotation={rotation}
          radius={size.radius}
          cardW={size.cardW}
          cardH={size.cardH}
          render={(f, front) => (
            <GlowCard hue={hueOf(f.project.color)} spread={30} className="h-full w-full shadow-[0_40px_80px_-24px_rgba(0,0,0,.9)]">
              <button
                type="button"
                onClick={() => onOpen(f.project)}
                className="!absolute inset-0 overflow-hidden rounded-[13px] text-left"
                aria-label={`Open ${f.project.title}`}
                tabIndex={front ? 0 : -1}
              >
                <img src={f.image} alt="" draggable={false} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: f.pos ?? "center" }} />
                <span className="absolute inset-x-0 bottom-0 block bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 pt-20">
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                    {f.project.category}
                    {f.project.year && ` · ${f.project.year}`}
                  </span>
                  <span className="mt-1 block font-heading text-2xl leading-tight text-white sm:text-3xl">{f.project.title}</span>
                  {front && <span className="mt-3 inline-block rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black">View project →</span>}
                </span>
              </button>
            </GlowCard>
          )}
        />
      </div>
      {/* where you are round the ring */}
      <div className="mt-3 flex justify-center gap-1.5">
        {picks.map((f, i) => (
          <button
            key={f.image}
            type="button"
            onClick={() => go(((i - at + n + n / 2) % n) - n / 2)}
            aria-label={`Show ${f.project.title}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === at ? "w-6 bg-white" : "w-1.5 bg-white/30 hover:bg-white/60"}`}
          />
        ))}
      </div>
    </section>
  )
}

/* ---------------- photo gallery ---------------- */

export type GalleryPhoto = { src: string; w: number; h: number; project: Project }

function PhotoGallery({ photos, onOpen }: { photos: GalleryPhoto[]; onOpen: (p: Project) => void }) {
  const [zoom, setZoom] = useState<number | null>(null)
  const images = photos.map((ph) => ({ src: ph.src, w: ph.w, h: ph.h, caption: ph.project.title }))
  return (
    <section className="mx-auto mt-20 max-w-7xl px-5 sm:px-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3 border-t border-white/10 pt-12">
        <div>
          <h3 className="text-2xl font-semibold text-white sm:text-3xl">Photo gallery</h3>
          <p className="mt-1 text-sm text-white/45">Frames from the shoots</p>
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-white/35">{photos.length} photographs</p>
      </div>
      {/* columns of photos at their own shapes; tap to see one large */}
      <div className="columns-2 gap-3 sm:gap-4 lg:columns-3">
        {photos.map((ph, i) => (
          <motion.button
            key={ph.src}
            type="button"
            onClick={() => setZoom(i)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease, delay: (i % 3) * 0.06 }}
            className="group relative mb-3 block w-full overflow-hidden rounded-xl bg-white/5 break-inside-avoid sm:mb-4"
            aria-label={`Photo from ${ph.project.title}`}
          >
            <img src={ph.src} width={ph.w} height={ph.h} alt="" loading="lazy" className="block h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2.5 pt-8 text-left text-xs font-medium text-white/90 opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
              {ph.project.title}
            </span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {zoom !== null && (
          <Lightbox images={images} index={zoom} onIndex={setZoom} onClose={() => setZoom(null)} title="Photo gallery" action={{ label: "View project", onClick: () => (setZoom(null), onOpen(photos[zoom].project)) }} />
        )}
      </AnimatePresence>
    </section>
  )
}

/* ---------------- the browse page ---------------- */

export function TvBrowse({
  featured,
  picks,
  photos,
  categories,
  projects,
  onOpen,
  onCategory,
}: {
  featured: Featured[]
  picks: FeaturedPick[]
  photos: GalleryPhoto[]
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
        <FeaturedRing picks={picks} onOpen={onOpen} />
        <PhotoGallery photos={photos} onOpen={onOpen} />
        <div className="mx-auto mt-20 max-w-7xl border-t border-white/10 px-5 pt-12 sm:px-10">
          <h3 className="text-2xl font-semibold text-white sm:text-3xl">All projects</h3>
          <p className="mt-1 text-sm text-white/45">By discipline</p>
        </div>
        <div className="h-8" />
        {categories.map((c) => {
          const items = projects.filter((p) => p.category === c.name)
          return items.length ? <Shelf key={c.name} title={c.name} projects={items} onOpen={onOpen} onSeeAll={() => onCategory(c)} /> : null
        })}
      </div>
    </div>
  )
}
