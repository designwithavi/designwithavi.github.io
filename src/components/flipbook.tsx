import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react"
import { animate, motion, useMotionValue, useTransform, type MotionValue } from "framer-motion"

/**
 * A magazine you can page through. Laid out like the printed issue: the front
 * cover alone on the right, then two-page spreads, then the back cover alone
 * on the left — the book slides so a lone cover sits in the middle. A turned
 * page swings over the spine like paper: it lifts and bends a little as it
 * goes, and casts a soft shadow on the page beneath. Drag a page and it follows
 * your finger (let go past a third of the way and it turns, otherwise it falls
 * back); click or tap a page, or use the arrows (buttons or keys).
 * On narrow screens it shows one page at a time.
 */

type Spread = [string | null, string | null]
type Flip = { dir: 1 | -1; from: number }

/** a page turn: slow to lift, quick across the middle, settling softly */
const TURN = { duration: 0.95, ease: [0.3, 0.08, 0.22, 1] as const }

/** Front cover alone, then pairs, then a lone back cover if one is left over. */
function spreadsOf(pages: string[], single: boolean): Spread[] {
  if (single) return pages.map((p) => [null, p])
  const out: Spread[] = [[null, pages[0]]]
  for (let i = 1; i < pages.length; i += 2) out.push([pages[i], pages[i + 1] ?? null])
  return out
}

function useNarrow(query = "(max-width: 639px)") {
  const [narrow, setNarrow] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const m = window.matchMedia(query)
    const on = () => setNarrow(m.matches)
    m.addEventListener("change", on)
    return () => m.removeEventListener("change", on)
  }, [query])
  return narrow
}

/** true when every page is already a whole spread: its fold runs down the middle */
const WholeSpreads = createContext(false)

function Page({ src, side, eager }: { src: string | null; side: "l" | "r"; eager?: boolean }) {
  const whole = useContext(WholeSpreads)
  if (!src) return null
  return (
    <div className="absolute inset-0 overflow-hidden bg-white">
      <img src={src} alt="" draggable={false} loading={eager ? "eager" : "lazy"} className="h-full w-full select-none object-cover" />
      {/* the fold: a soft shadow into the spine */}
      {whole ? (
        <div
          className="pointer-events-none absolute inset-y-0 left-1/2 w-[12%] -translate-x-1/2"
          style={{ background: "linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,.14) 50%, rgba(0,0,0,0))" }}
        />
      ) : (
      <div
        className="pointer-events-none absolute inset-y-0 w-[12%]"
        style={{
          [side === "l" ? "right" : "left"]: 0,
          background: `linear-gradient(to ${side === "l" ? "left" : "right"}, rgba(0,0,0,.18), rgba(0,0,0,0))`,
        }}
      />
      )}
    </div>
  )
}

export function Flipbook({ pages, ratio, title, single: onePage, spreads: whole }: { pages: string[]; ratio: number; title: string; single?: boolean; spreads?: boolean }) {
  const narrow = useNarrow()
  const single = narrow || !!onePage || !!whole
  const spreads = spreadsOf(pages, single)
  const [at, setAt] = useState(0)
  const [flip, setFlip] = useState<Flip | null>(null)
  const [full, setFull] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const book = useRef<HTMLDivElement>(null)
  // how far the leaf has turned, 0 → 1, driven by a finger or an animation (no re-render per frame)
  const progress = useMotionValue(0)
  const dir = useRef<1 | -1>(1)
  const busy = useRef(false)

  // switching between one-page and two-page view starts again from the cover
  useLayoutEffect(() => {
    setAt(0)
    setFlip(null)
    progress.set(0)
    busy.current = false
  }, [single, progress])

  const canTurn = (d: 1 | -1) => !busy.current && at + d >= 0 && at + d < spreads.length
  const begin = (d: 1 | -1) => {
    busy.current = true
    dir.current = d
    progress.set(0)
    setFlip({ dir: d, from: at })
  }
  // finish (or fall back), then lay the page down
  const settle = (to: 0 | 1, from: number, d: 1 | -1, velocity = 0) => {
    const rest = { ...TURN, duration: TURN.duration * Math.max(0.35, Math.abs(to - progress.get())) }
    animate(progress, to, velocity ? { type: "spring", stiffness: 140, damping: 22, velocity } : rest).then(() => {
      if (to === 1) setAt(from + d)
      setFlip(null)
      progress.set(0)
      busy.current = false
    })
  }

  const turn = useCallback(
    (d: 1 | -1) => {
      if (!canTurn(d)) return
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setAt(at + d)
        return
      }
      begin(d)
      settle(1, at, d)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [at, spreads.length],
  )

  // dragging a page: it follows the finger, sideways only (up and down still scroll the page)
  const drag = useRef<{ x: number; y: number; started: boolean; last: number; t: number; v: number } | null>(null)
  const onDown = (e: React.PointerEvent) => {
    if (busy.current || e.button > 0) return
    drag.current = { x: e.clientX, y: e.clientY, started: false, last: e.clientX, t: performance.now(), v: 0 }
  }
  const onMove = (e: React.PointerEvent) => {
    const g = drag.current
    if (!g) return
    const dx = e.clientX - g.x, dy = e.clientY - g.y
    if (!g.started) {
      if (Math.hypot(dx, dy) < 8) return
      const d: 1 | -1 = dx < 0 ? 1 : -1
      if (Math.abs(dx) < Math.abs(dy) || !canTurn(d)) {
        drag.current = null
        return
      }
      g.started = true
      begin(d)
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    }
    const w = book.current?.clientWidth ?? 600
    const span = single ? w * 0.85 : w * 0.5
    progress.set(Math.min(1, Math.max(0, (-dx * dir.current) / span)))
    const now = performance.now(), dt = Math.max(1, now - g.t)
    g.v = 0.7 * ((-(e.clientX - g.last) * dir.current) / span / dt) * 1000 + 0.3 * g.v
    g.last = e.clientX
    g.t = now
  }
  const onUp = () => {
    const g = drag.current
    drag.current = null
    if (!g?.started || !flip) return
    const go = progress.get() > 0.33 || g.v > 1.2
    settle(go && g.v > -1.2 ? 1 : 0, flip.from, flip.dir, g.v)
    // the click that ends a drag shouldn't also turn a page
    window.addEventListener("click", (ev) => ev.stopPropagation(), { capture: true, once: true })
  }

  // fetch the pages either side, so turning never waits on an image
  useEffect(() => {
    for (const s of [spreads[at + 1], spreads[at - 1]]) s?.forEach((src) => src && (new Image().src = src))
  }, [at, spreads])

  useEffect(() => {
    const on = () => setFull(document.fullscreenElement === box.current)
    document.addEventListener("fullscreenchange", on)
    return () => document.removeEventListener("fullscreenchange", on)
  }, [])

  const cur = spreads[at]
  const next = flip ? spreads[flip.from + flip.dir] : null
  // what lies flat while a page is turning
  const left = flip?.dir === -1 ? next![0] : cur[0]
  const right = flip?.dir === 1 ? next![1] : cur[1]
  // the turning leaf: its face is the page being turned, its back the page it reveals
  const face = flip ? (flip.dir === 1 ? cur[1] : cur[0]) : null
  const back = flip ? (flip.dir === 1 ? next![0] : next![1]) : null

  // a lone cover sits in the middle: slide the book half a page
  const shown = flip ? next! : cur
  const shift = single ? -50 : !shown[0] ? -25 : !shown[1] ? 25 : 0

  const label = (() => {
    const s = spreads[at]
    const n = (src: string | null) => (src ? pages.indexOf(src) + 1 : null)
    const a = n(s[0]), b = n(s[1])
    if (b === 1) return "Cover"
    if (a === pages.length && !b) return "Back cover"
    return [a, b].filter(Boolean).join("–") + ` / ${pages.length}`
  })()

  const btn =
    "grid size-10 place-items-center rounded-full border border-line bg-paper text-ink transition hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-30"

  return (
    <WholeSpreads.Provider value={!!whole}>
    <div
      ref={box}
      className={`outline-none ${full ? "flex flex-col justify-center bg-paper p-6" : ""}`}
      tabIndex={0}
      role="region"
      aria-roledescription="flipbook"
      aria-label={`${title}, ${label}`}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") (e.preventDefault(), turn(1))
        if (e.key === "ArrowLeft") (e.preventDefault(), turn(-1))
      }}
    >
      <div
        className="relative mx-auto touch-pan-y select-none overflow-hidden"
        style={{ aspectRatio: String(single ? ratio : ratio * 2), width: "100%", maxWidth: `calc((100vh - ${full ? 140 : 190}px) * ${single ? ratio : ratio * 2})` }}
        ref={book}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <div
          className="absolute inset-y-0 transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{
            width: single ? "200%" : "100%",
            left: 0,
            transform: `translateX(${shift}%)`,
            perspective: "2400px",
          }}
        >
          {/* left page */}
          <button
            type="button"
            aria-label="Previous page"
            onClick={() => turn(-1)}
            className="absolute inset-y-0 left-0 w-1/2 cursor-w-resize"
            style={{ boxShadow: left ? "0 20px 40px -24px rgba(0,0,0,.45)" : undefined }}
          >
            <Page src={left} side="l" eager />
          </button>
          {/* right page */}
          <button
            type="button"
            aria-label="Next page"
            onClick={() => turn(1)}
            className="absolute inset-y-0 left-1/2 w-1/2 cursor-e-resize"
            style={{ boxShadow: right ? "0 20px 40px -24px rgba(0,0,0,.45)" : undefined }}
          >
            <Page src={right} side="r" eager />
          </button>

          {/* the shadow the lifting page casts on the one it uncovers */}
          {flip && <CastShadow progress={progress} dir={flip.dir} />}
          {/* the page being turned */}
          {flip && <Leaf progress={progress} dir={flip.dir} face={face} back={back} />}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-4">
        <button type="button" className={btn} onClick={() => turn(-1)} disabled={at === 0 && !flip} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="min-w-[7rem] text-center font-mono text-xs uppercase tracking-[0.15em] text-ink-3">{label}</span>
        <button type="button" className={btn} onClick={() => turn(1)} disabled={at === spreads.length - 1 && !flip} aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={`${btn} ml-2`}
          onClick={() => (full ? document.exitFullscreen() : box.current?.requestFullscreen())}
          aria-label={full ? "Exit full screen" : "Full screen"}
        >
          {full ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
    </WholeSpreads.Provider>
  )
}

/** The turning page. It lifts off the spine, bends slightly through the middle of the turn, and darkens as it tilts away from the light. */
function Leaf({ progress, dir, face, back }: { progress: MotionValue<number>; dir: 1 | -1; face: string | null; back: string | null }) {
  const transform = useTransform(progress, (v) => {
    const lift = Math.sin(v * Math.PI)
    return `rotateY(${-dir * 180 * v}deg) translateZ(${lift * 26}px) skewY(${-dir * lift * 2.4}deg) scaleX(${1 - lift * 0.05})`
  })
  // the face turns away from the light, the back turns towards it
  const faceShade = useTransform(progress, (v) => Math.min(0.55, v * 1.1))
  const backShade = useTransform(progress, (v) => Math.min(0.5, Math.max(0, (1 - v) * 1.1)))
  // a soft highlight sweeping across the paper as it curves
  const sheen = useTransform(progress, (v) => Math.sin(v * Math.PI) * 0.5)
  const toSpine = dir === 1 ? "left" : "right"
  return (
    <motion.div
      className="pointer-events-none absolute inset-y-0 w-1/2"
      style={{
        left: dir === 1 ? "50%" : 0,
        transformOrigin: dir === 1 ? "left center" : "right center",
        transformStyle: "preserve-3d",
        transform,
        zIndex: 5,
      }}
    >
      <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
        <Page src={face} side={dir === 1 ? "r" : "l"} eager />
        <motion.div className="absolute inset-0" style={{ opacity: faceShade, background: `linear-gradient(to ${toSpine}, rgba(0,0,0,.55), rgba(0,0,0,.08) 70%)` }} />
        <motion.div className="absolute inset-0" style={{ opacity: sheen, background: `linear-gradient(to ${toSpine}, rgba(255,255,255,0) 30%, rgba(255,255,255,.45) 55%, rgba(255,255,255,0) 80%)` }} />
      </div>
      <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
        {back ? <Page src={back} side={dir === 1 ? "l" : "r"} eager /> : <div className="absolute inset-0 bg-white" />}
        <motion.div className="absolute inset-0" style={{ opacity: backShade, background: `linear-gradient(to ${dir === 1 ? "right" : "left"}, rgba(0,0,0,.5), rgba(0,0,0,.05) 70%)` }} />
      </div>
    </motion.div>
  )
}

/** Darkness on the page being uncovered, strongest by the spine and at mid-turn. */
function CastShadow({ progress, dir }: { progress: MotionValue<number>; dir: 1 | -1 }) {
  const opacity = useTransform(progress, (v) => Math.sin(v * Math.PI) * 0.7)
  return (
    <motion.div
      className="pointer-events-none absolute inset-y-0 w-1/2"
      style={{
        left: dir === 1 ? "50%" : 0,
        opacity,
        zIndex: 4,
        background: `linear-gradient(to ${dir === 1 ? "right" : "left"}, rgba(0,0,0,.55), rgba(0,0,0,.15) 45%, rgba(0,0,0,0) 85%)`,
      }}
    />
  )
}
