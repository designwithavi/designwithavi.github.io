import { useLayoutEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion"
import { Lightbox, type GalleryImage } from "@/components/project-gallery"

/**
 * Photos in staggered columns that drift at different speeds as the page
 * scrolls past — the middle column against the outer ones. Any photo opens
 * full screen.
 */

type Img = { src: string; w?: number; h?: number }
const norm = (img: GalleryImage): Img => (typeof img === "string" ? { src: img } : img)

/** Fill columns in order, each photo going to the currently shortest column. */
function columnsOf(images: Img[], n: number) {
  const cols: { img: Img; i: number }[][] = Array.from({ length: n }, () => [])
  const heights = Array(n).fill(0)
  images.forEach((img, i) => {
    const c = heights.indexOf(Math.min(...heights))
    cols[c].push({ img, i })
    heights[c] += img.w && img.h ? img.h / img.w : 1.3
  })
  return cols
}

function useColumnCount() {
  const get = () => (window.innerWidth < 640 ? 2 : 3)
  const [n, setN] = useState(get)
  useLayoutEffect(() => {
    const on = () => setN(get())
    window.addEventListener("resize", on)
    return () => window.removeEventListener("resize", on)
  }, [])
  return n
}

function Column({ items, progress, range, onOpen }: { items: { img: Img; i: number }[]; progress: MotionValue<number>; range: [number, number]; onOpen: (i: number) => void }) {
  const y = useTransform(progress, [0, 1], range)
  return (
    <motion.div style={{ y }} className="flex flex-1 flex-col gap-3 sm:gap-5">
      {items.map(({ img, i }) => (
        <button key={img.src} type="button" onClick={() => onOpen(i)} className="group overflow-hidden rounded-xl bg-ink/5 sm:rounded-2xl" aria-label={`Open photo ${i + 1}`}>
          <img
            src={img.src}
            width={img.w}
            height={img.h}
            alt=""
            loading="lazy"
            className="block h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </button>
      ))}
    </motion.div>
  )
}

export function ScrollGrid({ images, title }: { images: GalleryImage[]; title: string }) {
  const imgs = images.map(norm)
  const n = useColumnCount()
  const cols = columnsOf(imgs, n)
  const grid = useRef<HTMLDivElement>(null)
  const scroller = useRef<HTMLElement | null>(null)
  const [ready, setReady] = useState(false)
  const reduce = useReducedMotion()
  const [zoom, setZoom] = useState<number | null>(null)

  // the project page scrolls inside its own panel, not the window
  useLayoutEffect(() => {
    scroller.current = (grid.current?.closest(".overflow-y-auto") as HTMLElement) ?? null
    setReady(true)
  }, [])

  return (
    <>
      <div ref={grid} className="overflow-hidden py-6">
        {ready && <Columns cols={cols} grid={grid} scroller={scroller} still={!!reduce} onOpen={setZoom} />}
      </div>
      <AnimatePresence>
        {zoom !== null && <Lightbox images={imgs} index={zoom} onIndex={setZoom} onClose={() => setZoom(null)} title={title} />}
      </AnimatePresence>
    </>
  )
}

function Columns({
  cols,
  grid,
  scroller,
  still,
  onOpen,
}: {
  cols: { img: Img; i: number }[][]
  grid: React.RefObject<HTMLDivElement | null>
  scroller: React.RefObject<HTMLElement | null>
  still: boolean
  onOpen: (i: number) => void
}) {
  const { scrollYProgress } = useScroll({ target: grid, container: scroller, offset: ["start end", "end start"] })
  const amp = still ? 0 : 90
  return (
    <div className="flex items-start gap-3 sm:gap-5">
      {cols.map((items, c) => (
        <Column key={c} items={items} progress={scrollYProgress} range={c % 2 ? [amp, -amp] : [-amp * 0.4, amp * 0.6]} onOpen={onOpen} />
      ))}
    </div>
  )
}
