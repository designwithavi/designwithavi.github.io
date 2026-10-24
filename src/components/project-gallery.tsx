import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

/**
 * A project's images as an asymmetric grid — in the spirit of uiable's
 * "Portfolio Showcase Grid" on 21st.dev, without the tinted cards: each image
 * with its caption written underneath. Wide images (slides, landscape photos)
 * run full width so they stay readable; tall portrait photos pair up side by
 * side. Any image opens full screen; arrow keys step through them.
 */

/** A path, or { src, caption?, w?, h? } — w/h (pixel size) let portraits pair up. */
export type GalleryImage = string | { src: string; caption?: string; w?: number; h?: number }

const srcOf = (img: GalleryImage) => (typeof img === "string" ? img : img.src)
const captionOf = (img: GalleryImage) => (typeof img === "string" ? undefined : img.caption)

const isPortrait = (img: GalleryImage) => typeof img !== "string" && !!img.w && !!img.h && img.h > img.w * 1.1

/** Column span (out of 12) and card height for every image: full width, or a portrait pair. */
function layout(images: GalleryImage[]) {
  const out = images.map(() => ({ span: "md:col-span-12", height: "" }))
  for (let i = 1; i < images.length - 1; i++) {
    if (isPortrait(images[i]) && isPortrait(images[i + 1])) {
      out[i] = out[i + 1] = { span: "md:col-span-6", height: "md:h-[720px]" }
      i++
    }
  }
  return out
}

export function ProjectGallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const [zoom, setZoom] = useState<number | null>(null)
  const spans = layout(images)

  return (
    <>
      <div className="grid grid-cols-1 gap-x-5 gap-y-8 md:grid-cols-12 md:gap-y-10">
        {images.map((img, i) => {
          const { span, height } = spans[i]
          const caption = captionOf(img)
          return (
            <motion.figure
              key={srcOf(img)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: (i % 2) * 0.08 }}
              className={`group flex flex-col ${span} ${height}`}
            >
              <button
                type="button"
                onClick={() => setZoom(i)}
                className="relative flex min-h-0 flex-1 cursor-zoom-in items-center justify-center"
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
                <figcaption className="flex items-baseline justify-between gap-4 border-t border-line pt-3 mt-3 text-xs uppercase tracking-[0.18em] text-ink-3">
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
