import { useRef, useState } from "react"
import { AnimatePresence, motion, useScroll, useSpring, useMotionValueEvent } from "framer-motion"
import { Lightbox } from "@/components/project-gallery"

/**
 * A journey told as a vertical timeline — in the spirit of ibrandify's "Scroll
 * animated timeline" on 21st.dev: a line draws itself down the page as you
 * scroll, each milestone's dot lights up as the line reaches it, and the cards
 * rise in beside it (alternating sides on wide screens, all on the right on
 * phones). Any picture opens full screen.
 */

export type Milestone = {
  /** small label above the title: a date, a phase, a category */
  kicker: string
  title: string
  text: string
  image?: string
  /** marks the start and end of the journey */
  cap?: boolean
}

export function ScrollTimeline({ items, scroller }: { items: Milestone[]; scroller: React.RefObject<HTMLElement | null> }) {
  const track = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: track, container: scroller, offset: ["start 70%", "end 60%"] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  const [reached, setReached] = useState(-1)
  const dots = useRef<(HTMLDivElement | null)[]>([])
  useMotionValueEvent(progress, "change", (v) => {
    const t = track.current
    if (!t) return
    // how far down the track the drawn line reaches, against each dot's place on the track
    const box = t.getBoundingClientRect()
    const y = v * box.height
    let n = -1
    dots.current.forEach((d, i) => d && d.getBoundingClientRect().top - box.top + 11 <= y && (n = i))
    if (n !== reached) setReached(n)
  })
  const [zoom, setZoom] = useState<number | null>(null)
  const pics = items.filter((m) => m.image).map((m) => ({ src: m.image!, caption: m.title }))

  return (
    <div ref={track} className="relative">
      {/* the line: a faint track, and the part you've scrolled through drawn over it */}
      <div className="absolute bottom-0 left-[11px] top-0 w-px bg-line md:left-1/2 md:-translate-x-1/2" />
      <motion.div
        className="absolute left-[11px] top-0 w-[2px] origin-top -translate-x-[0.5px] bg-gradient-to-b from-[#3b5bff] via-[#6f8bff] to-[#ef8b2b] md:left-1/2 md:-translate-x-1/2"
        style={{ height: "100%", scaleY: progress }}
      />

      <ol className="relative space-y-14 md:space-y-20">
        {items.map((m, i) => {
          const right = i % 2 === 1
          const lit = i <= reached
          return (
            <li key={m.title} className="relative grid grid-cols-[24px_1fr] gap-5 md:grid-cols-[1fr_48px_1fr] md:gap-0">
              {/* the dot */}
              <div className="relative flex justify-center md:col-start-2 md:row-start-1">
                <div
                  ref={(el) => void (dots.current[i] = el)}
                  className={`mt-1.5 size-[23px] rounded-full border-2 transition-all duration-500 ${
                    lit ? "scale-100 border-[#6f8bff] bg-[#3b5bff] shadow-[0_0_18px_rgba(90,120,255,.8)]" : "scale-75 border-line bg-paper"
                  } ${m.cap ? "ring-4 ring-[#3b5bff]/20" : ""}`}
                />
              </div>
              {/* the card */}
              <motion.div
                initial={{ opacity: 0, y: 40, x: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ root: scroller, once: true, margin: "-12% 0px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={`min-w-0 md:row-start-1 ${right ? "md:col-start-3 md:pl-10" : "md:col-start-1 md:pr-10 md:text-right"}`}
              >
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8fa4ff]">{m.kicker}</p>
                <h4 className="mt-2 font-heading text-2xl leading-tight sm:text-3xl">{m.title}</h4>
                <p className={`mt-3 max-w-md text-[15px] leading-relaxed text-ink-3 ${right ? "" : "md:ml-auto"}`}>{m.text}</p>
                {m.image && (
                  <button
                    type="button"
                    onClick={() => setZoom(pics.findIndex((p) => p.src === m.image))}
                    className="group mt-5 block w-full overflow-hidden rounded-2xl border border-line bg-white"
                    aria-label={`View ${m.title} full screen`}
                  >
                    <img src={m.image} alt="" loading="lazy" className="block h-auto w-full transition-transform duration-700 group-hover:scale-[1.03]" />
                  </button>
                )}
              </motion.div>
            </li>
          )
        })}
      </ol>

      <AnimatePresence>
        {zoom !== null && <Lightbox images={pics} index={zoom} onIndex={setZoom} onClose={() => setZoom(null)} title="Internship at Sipwise" />}
      </AnimatePresence>
    </div>
  )
}
