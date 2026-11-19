import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { RotateCcw } from "lucide-react"

/**
 * A guided run through an app prototype, built from its real screens. Only the
 * next thing to tap glows and responds, so visitors follow the finished path
 * and never land in the parts that aren't built yet. Each tap moves the story
 * on by itself; the text beside the phone always says what to do next.
 * The full, live prototype (Figma) stays one click away.
 */

export type WalkScreen = {
  src: string
  /** what to do on this screen */
  say: string
  /** which part of the journey this belongs to (for the progress list) */
  stage: string
  /** the one place that responds: x, y, width, height in the 415 × 890 phone */
  spot?: [number, number, number, number]
  /** round glow (for circular things like ingredients) */
  round?: boolean
  /** the prototype's own animation after this tap, played before the next screen */
  clip?: string
}

const W = 415
const H = 890
const ease = [0.22, 1, 0.36, 1] as const

export function PrototypeGuide({ screens, link, title, label }: { screens: WalkScreen[]; link?: string; title: string; label: string }) {
  const [at, setAt] = useState(0)
  const [dir, setDir] = useState(1)
  const [nudge, setNudge] = useState(0) // bumps when someone taps outside the glow
  const reduce = useReducedMotion()
  const s = screens[at]
  const stages = [...new Set(screens.map((x) => x.stage))]
  const stage = stages.indexOf(s.stage)

  // the phone scales to its column
  const frame = useRef<HTMLDivElement>(null)
  const [k, setK] = useState(0.7)
  useEffect(() => {
    const el = frame.current
    if (!el) return
    // on phones the instructions sit above, so leave them room on screen
    const fit = () => setK(Math.min(el.clientWidth / W, (window.innerHeight * (window.innerWidth < 1024 ? 0.7 : 0.82)) / H, 1))
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // fetch the next screens ahead so every tap answers at once
  useEffect(() => {
    for (const x of screens.slice(at + 1, at + 4)) new Image().src = x.src
  }, [at, screens])

  // after a tap: play the prototype's own animation (if it has one), then show the next screen
  const [playing, setPlaying] = useState(false)
  const video = useRef<HTMLVideoElement>(null)
  const safety = useRef(0)
  const advance = () => {
    window.clearTimeout(safety.current)
    setPlaying(false)
    setDir(s.clip ? 0 : 1)
    setAt((i) => Math.min(i + 1, screens.length - 1))
  }
  const go = () => {
    if (at >= screens.length - 1 || playing) return
    const v = video.current
    if (s.clip && v && !reduce) {
      setPlaying(true)
      v.currentTime = 0
      v.play().catch(advance)
      // never get stuck if the clip stalls
      safety.current = window.setTimeout(advance, ((v.duration || 4) + 1.5) * 1000)
    } else advance()
  }
  const restart = () => {
    window.clearTimeout(safety.current)
    setPlaying(false)
    setDir(-1)
    setAt(0)
  }

  // count steps within a stage (the quiz questions) so people know where they are
  const sameStage = screens.filter((x) => x.stage === s.stage && x.spot)
  const within = sameStage.indexOf(s) + 1

  return (
    <section className="mt-12">
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <h3 className="font-heading text-3xl sm:text-4xl">{label}</h3>
        {link && (
          <a href={link} target="_blank" rel="noopener noreferrer" className="shrink-0 text-sm text-ink-3 underline underline-offset-4 hover:text-ink">
            Live Figma prototype ↗
          </a>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-14">
        {/* what to do */}
        <div className="lg:order-1">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#ef8b2b]">
            {s.stage}
            {sameStage.length > 2 && within > 0 ? ` · ${within} of ${sameStage.length}` : ""}
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={at}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease }}
              className="mt-2 min-h-[3.5rem] font-heading text-2xl leading-tight sm:text-3xl lg:mt-3 lg:min-h-0 lg:text-4xl"
            >
              {s.say}
            </motion.p>
          </AnimatePresence>
          {s.spot && <p className="mt-3 hidden text-sm text-ink-3 lg:block">Tap the glowing spot on the phone.</p>}

          {/* the journey */}
          <ol className="mt-8 hidden space-y-2.5 lg:block">
            {stages.map((st, i) => (
              <li key={st} className={`flex items-center gap-3 text-sm transition-colors ${i === stage ? "font-semibold text-white" : i < stage ? "text-ink-3" : "text-ink-4"}`}>
                <span className={`grid size-5 place-items-center rounded-full border text-[10px] ${i < stage ? "border-[#ef8b2b] bg-[#ef8b2b] text-black" : i === stage ? "border-[#ef8b2b] text-[#ef8b2b]" : "border-white/20"}`}>
                  {i < stage ? "✓" : i + 1}
                </span>
                {st}
              </li>
            ))}
          </ol>
          <button type="button" onClick={restart} className="mt-8 hidden items-center gap-1.5 text-sm font-semibold text-ink-3 hover:text-ink lg:inline-flex">
            <RotateCcw className="h-4 w-4" /> Start over
          </button>
        </div>

        {/* the phone */}
        <div ref={frame} className="mx-auto w-full max-w-[415px] lg:order-2 lg:w-[415px]">
          <div className="relative mx-auto overflow-hidden" style={{ width: W * k, height: H * k }}>
            <div className="absolute left-0 top-0 origin-top-left" style={{ width: W, height: H, transform: `scale(${k})` }}>
              <AnimatePresence initial={false} custom={dir}>
                <motion.img
                  key={at}
                  src={s.src}
                  alt={`${title}: ${s.say}`}
                  draggable={false}
                  // arriving from a clip, the clip's last frame is this screen: swap in place, no fade
                  initial={!dir ? false : reduce ? { opacity: 0 } : { opacity: 0, x: dir * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce || !dir ? { opacity: 0 } : { opacity: 0, x: -dir * 30 }}
                  transition={{ duration: dir ? 0.35 : 0, ease }}
                  className="absolute inset-0 h-full w-full select-none"
                />
              </AnimatePresence>

              {/* the prototype's own animation, waiting to play from this screen */}
              {s.clip && (
                <video
                  key={s.clip}
                  ref={video}
                  src={s.clip}
                  muted
                  playsInline
                  preload="auto"
                  onEnded={advance}
                  className={`absolute inset-0 h-full w-full ${playing ? "opacity-100" : "opacity-0"}`}
                />
              )}

              {/* everything but the spotlight is dimmed and doesn't respond */}
              {s.spot && !playing ? (
                <Spot key={at} spot={s.spot} round={s.round} nudge={nudge} onTap={go} onMiss={() => setNudge((n) => n + 1)} />
              ) : (
                <div className="absolute inset-0" />
              )}
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={restart}
              className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold ${s.spot ? "text-ink-3 hover:text-ink lg:hidden" : "bg-white text-black hover:bg-white/90"}`}
            >
              <RotateCcw className="h-4 w-4" /> {s.spot ? "Start over" : "Try it again"}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function Spot({ spot: [x, y, w, h], round, nudge, onTap, onMiss }: { spot: [number, number, number, number]; round?: boolean; nudge: number; onTap: () => void; onMiss: () => void }) {
  // a soft round spotlight on the middle of the thing to tap; the whole thing still answers the tap
  const cx = x + w / 2
  const cy = y + h / 2
  const r = round ? Math.max(w, h) / 2 + 8 : Math.min(54, Math.max(26, Math.min(w, h) / 2 + 10))
  return (
    <>
      <motion.div
        className="absolute inset-0"
        onClick={onMiss}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.15 }}
        style={{ background: `radial-gradient(circle at ${cx}px ${cy}px, rgba(0,0,0,0) ${r}px, rgba(0,0,0,.28) ${r + 26}px, rgba(0,0,0,.55) ${r + 120}px)` }}
      />
      {/* the light itself: a warm glow that breathes, and a ripple spreading from where to tap */}
      <motion.div
        className="pointer-events-none absolute rounded-full"
        style={{ left: cx - r, top: cy - r, width: r * 2, height: r * 2, background: "radial-gradient(circle, rgba(255,190,120,.35), rgba(239,139,43,.12) 60%, rgba(239,139,43,0) 72%)" }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0, 1, 0.75, 1], scale: [0.6, 1, 0.94, 1] }}
        transition={{ duration: 1.6, delay: 0.15, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
      <motion.span
        key={nudge}
        className="pointer-events-none absolute rounded-full border-2 border-[#ffb36b]"
        style={{ left: cx - r * 0.55, top: cy - r * 0.55, width: r * 1.1, height: r * 1.1 }}
        initial={{ opacity: 0.9, scale: 0.6 }}
        animate={{ opacity: 0, scale: 1.9 }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut", delay: nudge ? 0 : 0.4 }}
      />
      <button type="button" aria-label="Tap here" onClick={(e) => (e.stopPropagation(), onTap())} className="absolute cursor-pointer rounded-xl outline-none" style={{ left: x - 6, top: y - 6, width: w + 12, height: h + 12 }} />
    </>
  )
}
