import { useLayoutEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion"
import { Lightbox, type GalleryImage } from "@/components/project-gallery"

/**
 * Photos in two big staggered columns that drift against each other as the
 * page scrolls past.
 * Any photo opens full screen.
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
  const get = () => (window.innerWidth < 640 ? 1 : 2)
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
    <motion.div style={{ y }} className="flex flex-1 flex-col gap-4 sm:gap-6">
      {items.map(({ img, i }) => (
        <button
          key={img.src}
          type="button"
          onClick={() => onOpen(i)}
          className="group overflow-hidden rounded-xl bg-ink/5 sm:rounded-2xl"
          aria-label={`Open photo ${i + 1}`}
        >
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
  const [ready, setReady] = useState(false)
  const reduce = useReducedMotion()
  const [zoom, setZoom] = useState<number | null>(null)

  // start the drift once the grid is on the page
  useLayoutEffect(() => setReady(true), [])

  return (
    <>
      <div ref={grid} className="overflow-hidden py-6">
        {ready && <Columns cols={cols} grid={grid} still={!!reduce} onOpen={setZoom} />}
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
  still,
  onOpen,
}: {
  cols: { img: Img; i: number }[][]
  grid: React.RefObject<HTMLDivElement | null>
  still: boolean
  onOpen: (i: number) => void
}) {
  const { scrollYProgress } = useScroll({ target: grid, offset: ["start end", "end start"] })
  // one column: nothing to drift against
  const amp = still || cols.length < 2 ? 0 : 110
  return (
    <div className="flex items-start gap-4 sm:gap-6">
      {cols.map((items, c) => (
        <Column key={c} items={items} progress={scrollYProgress} range={c % 2 ? [amp, -amp] : [-amp * 0.5, amp * 0.5]} onOpen={onOpen} />
      ))}
    </div>
  )
}
