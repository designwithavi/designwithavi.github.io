"use client"

import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Vertical Tabs — adapted from 21st.dev.
 *
 * A numbered list on the left; the active item's images on the right. Changes
 * from the original: items come in as props, each item has several images that
 * the panel steps through (the progress line tracks them), autoplay stops for
 * good once the visitor takes over, and it uses framer-motion + lucide icons,
 * which the site already has, instead of motion + hugeicons.
 */

export type VerticalTabItem = {
  title: string
  description?: string
  images: { src: string; w?: number; h?: number }[]
}

const SLIDE_MS = 3500

export function VerticalTabs({
  items,
  heading,
  kicker,
  ratio = 16 / 9,
}: {
  items: VerticalTabItem[]
  heading: string
  kicker?: string
  /** image panel width ÷ height on large screens */
  ratio?: number
}) {
  const [look, setLook] = useState(0)
  const [slide, setSlide] = useState(0)
  const [direction, setDirection] = useState(1)
  const [hovered, setHovered] = useState(false)
  const [manual, setManual] = useState(false) // the visitor has taken over: no more autoplay
  const playing = !hovered && !manual
  const images = items[look].images

  const go = useCallback(
    (d: 1 | -1) => {
      setDirection(d)
      const next = slide + d
      if (next >= 0 && next < images.length) return setSlide(next)
      // past either end: move to the neighbouring look
      const l = (look + d + items.length) % items.length
      setLook(l)
      setSlide(d === 1 ? 0 : items[l].images.length - 1)
    },
    [slide, look, images.length, items],
  )

  const pick = (i: number) => {
    setManual(true)
    if (i === look) return
    setDirection(i > look ? 1 : -1)
    setLook(i)
    setSlide(0)
  }

  useEffect(() => {
    if (!playing) return
    const t = setTimeout(() => go(1), SLIDE_MS)
    return () => clearTimeout(t)
  }, [playing, go, look, slide])

  // fetch the next board early
  useEffect(() => {
    const n = images[slide + 1] ?? items[(look + 1) % items.length].images[0]
    if (n) new Image().src = n.src
  }, [look, slide, images, items])

  const variants = {
    enter: (d: number) => ({ y: d > 0 ? "-100%" : "100%", opacity: 0 }),
    center: { zIndex: 1, y: 0, opacity: 1 },
    exit: (d: number) => ({ zIndex: 0, y: d > 0 ? "100%" : "-100%", opacity: 0 }),
  }
  const current = images[slide]

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
        {/* the list */}
        <div className="order-2 flex flex-col pt-2 lg:order-1 lg:col-span-5">
          <div className="mb-8 space-y-1">
            <h3 className="font-heading text-4xl text-ink sm:text-6xl">{heading}</h3>
            {kicker && <span className="ml-0.5 block text-[10px] font-medium uppercase tracking-[0.3em] text-ink-4">({kicker})</span>}
          </div>

          <div className="flex flex-col pl-4 md:pl-6">
            {items.map((item, index) => {
              const active = index === look
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => pick(index)}
                  aria-pressed={active}
                  className={cn(
                    "group relative flex items-start gap-4 border-t border-line py-5 text-left transition-colors duration-500 first:border-0 md:py-6",
                    active ? "text-ink" : "text-ink-4 hover:text-ink",
                  )}
                >
                  {/* progress through this look's boards */}
                  <div className="absolute inset-y-0 -left-4 w-[2px] bg-line md:-left-6">
                    {active && (
                      <motion.div
                        className="absolute left-0 top-0 w-full origin-top bg-ink"
                        initial={false}
                        animate={{ height: `${((slide + 1) / images.length) * 100}%` }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                      />
                    )}
                  </div>

                  <span className="mt-1.5 font-mono text-[10px] tabular-nums opacity-60">/{String(index + 1).padStart(2, "0")}</span>

                  <div className="flex flex-1 flex-col gap-2">
                    <span className="font-heading text-2xl md:text-3xl lg:text-4xl">{item.title}</span>
                    <AnimatePresence initial={false}>
                      {active && item.description && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-sm pb-1 text-sm leading-relaxed text-ink-3 md:text-base">{item.description}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* the boards */}
        <div className="order-1 lg:sticky lg:top-24 lg:order-2 lg:col-span-7">
          <div
            className="relative overflow-hidden rounded-3xl border border-line bg-white md:rounded-[2rem]"
            style={{ aspectRatio: String(ratio) }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.button
                type="button"
                key={`${look}-${slide}`}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ y: { type: "spring", stiffness: 260, damping: 32 }, opacity: { duration: 0.4 } }}
                className="absolute inset-0 block h-full w-full"
                onClick={() => (setManual(true), go(1))}
                aria-label="Next board"
              >
                <img src={current.src} alt={`${items[look].title}, board ${slide + 1}`} className="h-full w-full object-contain" />
              </motion.button>
            </AnimatePresence>

            <div className="absolute bottom-4 left-4 z-20 rounded-full bg-paper/85 px-3 py-1.5 font-mono text-[11px] tabular-nums text-ink-3 backdrop-blur md:bottom-6 md:left-6">
              {slide + 1} / {images.length}
            </div>
            <div className="absolute bottom-4 right-4 z-20 flex gap-2 md:bottom-6 md:right-6 md:gap-3">
              {([-1, 1] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setManual(true)
                    go(d)
                  }}
                  className="flex size-10 items-center justify-center rounded-full border border-line bg-paper/85 text-ink backdrop-blur transition hover:bg-paper active:scale-90 md:size-12"
                  aria-label={d === 1 ? "Next board" : "Previous board"}
                >
                  {d === 1 ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VerticalTabs
