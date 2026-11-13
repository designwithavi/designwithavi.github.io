import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion"

/**
 * "My design process" — the steps hang like garment tags from a rail. On wide
 * screens the section pins while scrolling, and the row slides sideways past
 * it; the tags sway with the speed of the scroll. On phones the row is swiped.
 */

export type ProcessStep = { title: string; text: string; art: React.ComponentType; tone?: "accent" | "paper" | "stone" }

const TONES = {
  accent: "bg-[#ef8b2b] text-[#1a1816]",
  paper: "bg-[#fbf8f2] text-[#1a1816]",
  stone: "bg-[#d9d4cc] text-[#1a1816]",
}

// a luggage tag: a flat top with its corners cut, rounded bottom
const TAG = "polygon(14% 0, 86% 0, 100% 9%, 100% 100%, 0 100%, 0 9%)"

function Tag({ step, i, sway }: { step: ProcessStep; i: number; sway: ReturnType<typeof useSpring> | null }) {
  const still = useSpring(0)
  const rotate = useTransform(sway ?? still, (v) => v * (i % 2 ? -1 : 1) * (0.8 + (i % 3) * 0.2))
  return (
    <div className="relative flex w-[78vw] max-w-[320px] shrink-0 snap-center flex-col items-center sm:w-[300px] lg:w-[330px]">
      {/* ring on the rail, and the string */}
      <span className="z-10 size-6 rounded-full border-[3px] border-ink-4/70 bg-paper" />
      <span className="h-12 w-px bg-ink-4/60" />
      <motion.div style={{ rotate, transformOrigin: "50% -60px" }} className="w-full">
        <div
          className={`relative rounded-b-[22px] px-5 pb-6 pt-9 shadow-[0_24px_40px_-24px_rgba(0,0,0,.45)] ${TONES[step.tone ?? "paper"]}`}
          style={{ clipPath: TAG }}
        >
          <span className="absolute left-1/2 top-3 size-3 -translate-x-1/2 rounded-full bg-paper ring-1 ring-black/15" />
          <div className="aspect-[4/3] overflow-hidden rounded-xl bg-[#fffdf8] p-2">
            <step.art />
          </div>
          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] opacity-70">Step {String(i + 1).padStart(2, "0")}</p>
          <h4 className="mt-1 font-heading text-3xl uppercase leading-none">{step.title}</h4>
          <p className="mt-3 text-[15px] leading-snug opacity-80">{step.text}</p>
        </div>
      </motion.div>
    </div>
  )
}

function useWide() {
  const q = "(min-width: 1024px)"
  const [wide, setWide] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const on = () => setWide(m.matches)
    m.addEventListener("change", on)
    return () => m.removeEventListener("change", on)
  }, [])
  return wide
}

function Heading({ count }: { count: number }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-ink-3">
          <span className="size-2 rounded-full bg-[#ef8b2b]" /> My process
        </p>
        <h3 className="font-heading text-5xl uppercase leading-[.9] sm:text-7xl">
          My design process<span className="text-[#ef8b2b]">.</span>
        </h3>
      </div>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-4">{count} steps · every project</p>
    </div>
  )
}

function Rail() {
  return <div className="absolute inset-x-0 top-[11px] h-[6px] rounded-full bg-gradient-to-b from-ink-4/30 via-ink-4/60 to-ink-4/30" />
}

/** Wide screens: pinned, scroll-driven. */
function Pinned({ steps }: { steps: ProcessStep[] }) {
  const section = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [travel, setTravel] = useState(0)

  useEffect(() => {
    const measure = () => {
      const t = track.current
      if (t) setTravel(Math.max(0, t.scrollWidth - t.clientWidth))
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] })
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -travel])
  const sway = useSpring(useTransform(useVelocity(x), [-1500, 0, 1500], [-5, 0, 5]), { stiffness: 120, damping: 12 })
  const progress = useTransform(scrollYProgress, [0.05, 0.95], ["0%", "100%"])

  return (
    <div ref={section} style={{ height: `calc(100vh + ${travel}px)` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-8">
          <Heading count={steps.length} />
        </div>
        <div className="relative">
          <Rail />
          <motion.div ref={track} style={{ x }} className="flex gap-8 px-[max(2rem,calc(50vw-36rem))]">
            {steps.map((s, i) => (
              <Tag key={s.title} step={s} i={i} sway={sway} />
            ))}
          </motion.div>
        </div>
        <div className="mx-auto mt-10 h-px w-full max-w-6xl bg-line px-8">
          <motion.div style={{ width: progress }} className="h-full bg-[#ef8b2b]" />
        </div>
      </div>
    </div>
  )
}

/** Phones and tablets: a row you swipe. */
function Swipe({ steps }: { steps: ProcessStep[] }) {
  return (
    <div className="py-16">
      <div className="px-4 sm:px-8">
        <Heading count={steps.length} />
      </div>
      <div className="relative">
        <Rail />
        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden">
          {steps.map((s, i) => (
            <Tag key={s.title} step={s} i={i} sway={null} />
          ))}
        </div>
      </div>
      <p className="mt-2 px-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-4 sm:px-8">Swipe →</p>
    </div>
  )
}

export function DesignProcess({ steps }: { steps: ProcessStep[] }) {
  const wide = useWide()
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  return wide && !reduce ? <Pinned steps={steps} /> : <Swipe steps={steps} />
}
