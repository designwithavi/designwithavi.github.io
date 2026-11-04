import { useLayoutEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { Lightbox, type GalleryImage } from "@/components/project-gallery"

/**
 * A shoot, laid out so every photograph gets its due: wide frames run the full
 * width on their own, tall frames sit in pairs at the same height. Each photo
 * rises in as it arrives and drifts gently inside its frame while the page
 * scrolls — the parallax lives inside the frame, so the layout stays still.
 */

type Img = { src: string; w?: number; h?: number }
type Placed = { img: Img; i: number }
const norm = (img: GalleryImage): Img => (typeof img === "string" ? { src: img } : img)
const ratio = (img: Img) => (img.w && img.h ? img.w / img.h : 2 / 3)
const isWide = (img: Img) => ratio(img) > 1.15

/** Wide photos alone; tall ones in pairs, borrowing the next tall photo if a wide one would leave it alone. */
function rowsOf(images: Img[]): Placed[][] {
  const queue: Placed[] = images.map((img, i) => ({ img, i }))
  const rows: Placed[][] = []
  while (queue.length) {
    const first = queue.shift()!
    if (isWide(first.img)) {
      rows.push([first])
      continue
    }
    const k = queue.findIndex((p) => !isWide(p.img))
    rows.push(k === -1 ? [first] : [first, queue.splice(k, 1)[0]])
  }
  return rows
}

function Photo({
  p,
  scroller,
  onOpen,
  flex,
  lone,
}: {
  p: Placed
  scroller: React.RefObject<HTMLElement | null>
  onOpen: (i: number) => void
  flex: number
  lone?: boolean
}) {
  const frame = useRef<HTMLButtonElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: frame, container: scroller, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-6%", "6%"])
  return (
    <motion.button
      ref={frame}
      type="button"
      onClick={() => onOpen(p.i)}
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ root: scroller, once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      // stacked on phones; side by side from sm up, each taking its shape's share of the row
      className={`group relative block w-full overflow-hidden rounded-2xl bg-ink/5 sm:w-auto sm:[flex:var(--share)_1_0] ${lone ? "mx-auto max-w-[640px] sm:max-w-[640px]" : ""}`}
      style={{ ["--share" as string]: flex, aspectRatio: String(ratio(p.img)) }}
      aria-label={`Open photo ${p.i + 1}`}
    >
      <motion.img
        src={p.img.src}
        width={p.img.w}
        height={p.img.h}
        alt=""
        loading="lazy"
        style={{ y, scale: reduce ? 1 : 1.14 }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
    </motion.button>
  )
}

export function ScrollGrid({ images, title }: { images: GalleryImage[]; title: string }) {
  const imgs = images.map(norm)
  const rows = rowsOf(imgs)
  const box = useRef<HTMLDivElement>(null)
  const scroller = useRef<HTMLElement | null>(null)
  const [ready, setReady] = useState(false)
  const [zoom, setZoom] = useState<number | null>(null)

  // the project page scrolls inside its own panel, not the window
  useLayoutEffect(() => {
    scroller.current = (box.current?.closest(".overflow-y-auto") as HTMLElement) ?? null
    setReady(true)
  }, [])

  return (
    <>
      <div ref={box} className="flex flex-col gap-4 sm:gap-6">
        {ready &&
          rows.map((row) => (
            <div key={row[0].img.src} className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              {row.map((p) => (
                // equal heights in a pair: each photo's share of the row follows its shape
                <Photo key={p.img.src} p={p} scroller={scroller} onOpen={setZoom} flex={ratio(p.img)} lone={row.length === 1 && !isWide(p.img)} />
              ))}
            </div>
          ))}
      </div>
      <AnimatePresence>
        {zoom !== null && <Lightbox images={imgs} index={zoom} onIndex={setZoom} onClose={() => setZoom(null)} title={title} />}
      </AnimatePresence>
    </>
  )
}
