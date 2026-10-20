import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

/**
 * A project's images as an asymmetric grid of softly tinted cards — in the
 * spirit of uiable's "Portfolio Showcase Grid" on 21st.dev. The first image is
 * the wide feature; the rest pair up 7/5, then 5/7, and so on. Any image opens
 * full screen; arrow keys step through them.
 */

export type GalleryImage = string | { src: string; caption?: string }

const srcOf = (img: GalleryImage) => (typeof img === "string" ? img : img.src)
const captionOf = (img: GalleryImage) => (typeof img === "string" ? undefined : img.caption)

/** Column span (out of 12) and card height for each position in the grid. */
function layout(i: number, count: number) {
  if (i === 0) return { span: "md:col-span-12", height: "md:h-[560px]" }
  const k = i - 1
  const lastAlone = k === count - 2 && (count - 1) % 2 === 1
  if (lastAlone) return { span: "md:col-span-12", height: "md:h-[480px]" }
  const wideFirst = Math.floor(k / 2) % 2 === 0
  const wide = (k % 2 === 0) === wideFirst
  return { span: wide ? "md:col-span-7" : "md:col-span-5", height: "md:h-[420px]" }
}

export function ProjectGallery({ images, title, tint }: { images: GalleryImage[]; title: string; tint: string }) {
  const [zoom, setZoom] = useState<number | null>(null)
  const card = { background: `color-mix(in oklab, ${tint} 38%, var(--paper))` }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
        {images.map((img, i) => {
          const { span, height } = layout(i, images.length)
          const caption = captionOf(img)
          return (
            <motion.figure
              key={srcOf(img)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: (i % 2) * 0.08 }}
              className={`group flex flex-col overflow-hidden rounded-3xl p-3 sm:p-4 ${span} ${height}`}
              style={card}
            >
              <button
                type="button"
                onClick={() => setZoom(i)}
                className="relative flex min-h-0 flex-1 cursor-zoom-in items-center justify-center rounded-2xl"
                aria-label={`View ${caption ?? `image ${i + 1}`} of ${title} full screen`}
              >
                <img
                  src={srcOf(img)}
                  alt={caption ?? `${title}, image ${i + 1}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="mx-auto h-auto max-h-full w-auto max-w-full rounded-xl object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              </button>
              {caption && (
                <figcaption className="flex items-baseline justify-between gap-4 px-1 pt-3 text-xs uppercase tracking-[0.18em] text-ink-3">
                  <span>{caption}</span>
                  <span className="text-ink-4">{String(i + 1).padStart(2, "0")}</span>
                </figcaption>
              )}
            </motion.figure>
          )
        })}
      </div>

      <AnimatePresence>
        {zoom !== null && (
          <Lightbox images={images} index={zoom} onIndex={setZoom} onClose={() => setZoom(null)} title={title} />
        )}
      </AnimatePresence>
    </>
  )
}

function Lightbox({
  images,
  index,
  onIndex,
  onClose,
  title,
}: {
  images: GalleryImage[]
  index: number
  onIndex: (i: number) => void
  onClose: () => void
  title: string
}) {
  const step = useCallback((d: number) => onIndex((index + d + images.length) % images.length), [index, images.length, onIndex])

  useEffect(() => {
    // capture first, so Escape closes only the lightbox, not the project page underneath
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      else if (e.key === "ArrowRight") step(1)
      else if (e.key === "ArrowLeft") step(-1)
      else return
      e.stopPropagation()
      e.preventDefault()
    }
    window.addEventListener("keydown", onKey, true)
    return () => window.removeEventListener("keydown", onKey, true)
  }, [onClose, step])

  const img = images[index]
  const caption = captionOf(img)
  const btn = "absolute top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/20"

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4 sm:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — ${caption ?? `image ${index + 1}`}`}
    >
      <motion.img
        key={srcOf(img)}
        src={srcOf(img)}
        alt={caption ?? `${title}, image ${index + 1}`}
        className="max-h-full max-w-full rounded-lg object-contain"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      />
      <button type="button" onClick={onClose} className="absolute top-4 right-4 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20" aria-label="Close">
        <X className="h-5 w-5" />
      </button>
      {images.length > 1 && (
        <>
          <button type="button" className={`${btn} left-3 sm:left-6`} onClick={(e) => (e.stopPropagation(), step(-1))} aria-label="Previous image">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" className={`${btn} right-3 sm:right-6`} onClick={(e) => (e.stopPropagation(), step(1))} aria-label="Next image">
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.18em] text-white/60">
        {caption ? `${caption} · ` : ""}
        {index + 1} / {images.length}
      </p>
    </motion.div>
  )
}
