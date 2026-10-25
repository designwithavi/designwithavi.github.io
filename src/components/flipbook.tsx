import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react"

/**
 * A magazine you can page through. Laid out like the printed issue: the front
 * cover alone on the right, then two-page spreads, then the back cover alone
 * on the left — the book slides so a lone cover sits in the middle. A turned
 * page swings over the spine in 3D. On narrow screens it shows one page at a
 * time. Click or tap a page, use the arrows (buttons or keys), or swipe.
 */

type Spread = [string | null, string | null]
type Flip = { dir: 1 | -1; from: number; run: boolean }

const TURN_MS = 750

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

function Page({ src, side, eager }: { src: string | null; side: "l" | "r"; eager?: boolean }) {
  if (!src) return null
  return (
    <div className="absolute inset-0 overflow-hidden bg-white">
      <img src={src} alt="" draggable={false} loading={eager ? "eager" : "lazy"} className="h-full w-full select-none object-cover" />
      {/* the fold: a soft shadow into the spine */}
      <div
        className="pointer-events-none absolute inset-y-0 w-[12%]"
        style={{
          [side === "l" ? "right" : "left"]: 0,
          background: `linear-gradient(to ${side === "l" ? "left" : "right"}, rgba(0,0,0,.18), rgba(0,0,0,0))`,
        }}
      />
    </div>
  )
}

export function Flipbook({ pages, ratio, title }: { pages: string[]; ratio: number; title: string }) {
  const single = useNarrow()
  const spreads = spreadsOf(pages, single)
  const [at, setAt] = useState(0)
  const [flip, setFlip] = useState<Flip | null>(null)
  const [full, setFull] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const startX = useRef<number | null>(null)

  // switching between one-page and two-page view starts again from the cover
  useLayoutEffect(() => {
    setAt(0)
    setFlip(null)
  }, [single])

  const turn = useCallback(
    (dir: 1 | -1) => {
      if (flip) return
      const to = at + dir
      if (to < 0 || to >= spreads.length) return
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setAt(to)
        return
      }
      setFlip({ dir, from: at, run: false })
    },
    [at, flip, spreads.length],
  )

  // start the swing a frame after the leaf is in place…
  const turning = flip !== null && !flip.run
  useEffect(() => {
    if (!turning) return
    const r = requestAnimationFrame(() => requestAnimationFrame(() => setFlip((f) => (f ? { ...f, run: true } : f))))
    return () => cancelAnimationFrame(r)
  }, [turning])
  // …and lay it down once it has turned
  const target = flip ? flip.from + flip.dir : null
  useEffect(() => {
    if (target === null) return
    const t = window.setTimeout(() => {
      setAt(target)
      setFlip(null)
    }, TURN_MS + 60)
    return () => clearTimeout(t)
  }, [target])

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
        className="relative mx-auto overflow-hidden"
        style={{ aspectRatio: String(single ? ratio : ratio * 2), width: "100%", maxWidth: `calc((100vh - ${full ? 140 : 190}px) * ${single ? ratio : ratio * 2})` }}
        onPointerDown={(e) => (startX.current = e.clientX)}
        onPointerUp={(e) => {
          const dx = startX.current === null ? 0 : e.clientX - startX.current
          startX.current = null
          if (Math.abs(dx) > 40) turn(dx < 0 ? 1 : -1)
        }}
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

          {/* the page being turned */}
          {flip && (
            <div
              className="pointer-events-none absolute inset-y-0 w-1/2"
              style={{
                left: flip.dir === 1 ? "50%" : 0,
                transformOrigin: flip.dir === 1 ? "left center" : "right center",
                transformStyle: "preserve-3d",
                transform: `rotateY(${flip.run ? flip.dir * -180 : 0}deg)`,
                transition: `transform ${TURN_MS}ms cubic-bezier(.45,.05,.3,1)`,
                zIndex: 5,
              }}
            >
              <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
                <Page src={face} side={flip.dir === 1 ? "r" : "l"} eager />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to ${flip.dir === 1 ? "left" : "right"}, rgba(0,0,0,.28), rgba(0,0,0,0) 60%)`,
                    opacity: flip.run ? 1 : 0,
                    transition: `opacity ${TURN_MS / 2}ms ease-in`,
                  }}
                />
              </div>
              <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                {back ? <Page src={back} side={flip.dir === 1 ? "l" : "r"} eager /> : <div className="absolute inset-0 bg-white" />}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to ${flip.dir === 1 ? "right" : "left"}, rgba(0,0,0,.25), rgba(0,0,0,0) 55%)`,
                    opacity: flip.run ? 0 : 1,
                    transition: `opacity ${TURN_MS}ms ease-out`,
                  }}
                />
              </div>
            </div>
          )}
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
  )
}
