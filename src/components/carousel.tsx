import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Lightbox, type GalleryImage } from "@/components/project-gallery"

/**
 * A row of slides you swipe or drag through, snapping one at a time, with the
 * next slide peeking in. Arrows, a counter and a progress bar sit underneath;
 * the slide in focus opens full screen.
 */

const srcOf = (img: GalleryImage) => (typeof img === "string" ? img : img.src)
const sizeOf = (img: GalleryImage) => (typeof img === "string" ? {} : { width: img.w, height: img.h })

export function Carousel({ images, title, label }: { images: GalleryImage[]; title: string; label?: string }) {
  const track = useRef<HTMLDivElement>(null)
  const [at, setAt] = useState(0)
  const [zoom, setZoom] = useState<number | null>(null)
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)

  const slides = () => Array.from(track.current?.children ?? []) as HTMLElement[]
  // the slide whose centre is nearest the track's centre
  const nearest = useCallback(() => {
    const t = track.current
    if (!t) return 0
    const mid = t.scrollLeft + t.clientWidth / 2
    let best = 0, dist = Infinity
    slides().forEach((s, i) => {
      const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - mid)
      if (d < dist) (dist = d), (best = i)
    })
    return best
  }, [])

  const goTo = (i: number, smooth = true) => {
    const t = track.current, s = slides()[Math.max(0, Math.min(images.length - 1, i))]
    if (!t || !s) return
    t.scrollTo({ left: s.offsetLeft - (t.clientWidth - s.offsetWidth) / 2, behavior: smooth ? "smooth" : "auto" })
  }

  useEffect(() => {
    const t = track.current
    if (!t) return
    let raf = 0
    const on = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setAt(nearest()))
    }
    t.addEventListener("scroll", on, { passive: true })
    return () => {
      t.removeEventListener("scroll", on)
      cancelAnimationFrame(raf)
    }
  }, [nearest])

  // mouse drag (touch already scrolls natively)
  const down = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !track.current) return
    drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false }
    track.current.style.scrollSnapType = "none"
  }
  const move = (e: React.PointerEvent) => {
    const d = drag.current, t = track.current
    if (!d || !t) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > 4) d.moved = true
    t.scrollLeft = d.left - dx
  }
  const up = () => {
    const d = drag.current, t = track.current
    if (!d || !t) return
    drag.current = null
    const target = nearest()
    t.style.scrollSnapType = ""
    if (d.moved) goTo(target)
    // swallow the click that ends a drag
    if (d.moved) window.addEventListener("click", (ev) => ev.stopPropagation(), { capture: true, once: true })
  }

  const btn =
    "grid size-10 place-items-center rounded-full border border-line bg-paper text-ink transition hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-30"

  return (
    <div>
      <div
        ref={track}
        className="flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [scrollbar-width:none] active:cursor-grabbing sm:gap-6 [&::-webkit-scrollbar]:hidden"
        // run to the screen edges, with the first slide still lined up with the text
        style={{ marginInline: "calc(50% - 50vw)", paddingInline: "max(1rem, calc(50vw - 50%))", scrollPaddingInline: "max(1rem, calc(50vw - 50%))" }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerLeave={up}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") (e.preventDefault(), goTo(at + 1))
          if (e.key === "ArrowLeft") (e.preventDefault(), goTo(at - 1))
        }}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={label ?? title}
      >
        {images.map((img, i) => (
          <button
            key={srcOf(img)}
            type="button"
            onClick={() => (i === at ? setZoom(i) : goTo(i))}
            className={`w-[86vw] max-w-[1000px] shrink-0 snap-center sm:w-[78vw] lg:w-[64vw] overflow-hidden rounded-2xl border border-line bg-white transition-opacity duration-500 ${i === at ? "opacity-100" : "opacity-50 hover:opacity-80"}`}
            aria-label={i === at ? `Open board ${i + 1} full screen` : `Go to board ${i + 1}`}
          >
            <img src={srcOf(img)} {...sizeOf(img)} alt={`${title}, ${i + 1}`} draggable={false} loading={i < 2 ? "eager" : "lazy"} className="block h-auto w-full select-none" />
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-4">
        <span className="w-16 font-mono text-xs tabular-nums text-ink-3">
          {String(at + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
        <div className="h-px flex-1 bg-line">
          <div className="h-full bg-ink transition-[width] duration-500" style={{ width: `${((at + 1) / images.length) * 100}%` }} />
        </div>
        <button type="button" className={btn} onClick={() => goTo(at - 1)} disabled={at === 0} aria-label="Previous">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button type="button" className={btn} onClick={() => goTo(at + 1)} disabled={at === images.length - 1} aria-label="Next">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <AnimatePresence>
        {zoom !== null && <Lightbox images={images} index={zoom} onIndex={(i) => (setZoom(i), goTo(i, false))} onClose={() => setZoom(null)} title={title} />}
      </AnimatePresence>
    </div>
  )
}
