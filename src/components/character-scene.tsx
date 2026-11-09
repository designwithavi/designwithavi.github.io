import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"
import { RotateCcw } from "lucide-react"

/**
 * The LEGO-style Avishkar acts out his day: walks in, jumps, sits, works on the
 * laptop, builds a model, then takes a picture (with a flash). Frames come from
 * sprite sheets — 6 columns × 2 rows of 256 × 512, front view on top, side view
 * (facing right) below. It plays when it scrolls into view and pauses off screen.
 * Below it, every pose stands in a line.
 */

type Action = "idle" | "walk" | "jump" | "sit" | "laptop" | "build" | "photo"
type View = "front" | "side"
type Step = { action: Action; view: View; frames: number[]; fps: number; move?: [number, number] }

const SHEET = (a: Action) => `about/anim/${a}.webp`

// the order he does things in; walking moves him from the left edge to the middle
const SCRIPT: Step[] = [
  { action: "walk", view: "side", frames: [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5], fps: 8, move: [-8, 50] },
  { action: "idle", view: "front", frames: [0, 1], fps: 5 },
  { action: "jump", view: "front", frames: [0, 1, 2, 3, 4, 5, 0], fps: 8 },
  { action: "sit", view: "front", frames: [0, 1, 2, 3, 4, 5, 5, 5], fps: 7 },
  { action: "laptop", view: "front", frames: [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5], fps: 7 },
  { action: "build", view: "front", frames: [0, 1, 2, 3, 4, 5, 5, 5, 5], fps: 6 },
  { action: "photo", view: "front", frames: [0, 1, 2, 3, 4, 5, 5, 5, 5, 5], fps: 8 },
  { action: "idle", view: "front", frames: [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5], fps: 5 },
]
const FLASH_AT = { action: "photo" as Action, frame: 3 }

const LINEUP: { action: Action; label: string; frame: number }[] = [
  { action: "walk", label: "Walk in", frame: 1 },
  { action: "jump", label: "Jump", frame: 3 },
  { action: "sit", label: "Sit", frame: 5 },
  { action: "laptop", label: "Design", frame: 2 },
  { action: "build", label: "Build", frame: 4 },
  { action: "photo", label: "Shoot", frame: 3 },
]

/** One frame of a sheet, drawn as a background so a single image holds all twelve. */
function Sprite({ action, view, frame, className = "", style }: { action: Action; view: View; frame: number; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        aspectRatio: "1 / 2",
        backgroundImage: `url(${SHEET(action)})`,
        backgroundSize: "600% 200%",
        backgroundPosition: `${(frame / 5) * 100}% ${view === "front" ? 0 : 100}%`,
        backgroundRepeat: "no-repeat",
        ...style,
      }}
    />
  )
}

export function CharacterScene() {
  const reduce = useReducedMotion()
  const box = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [run, setRun] = useState(0) // bump to replay
  const [pos, setPos] = useState({ step: 0, i: 0 })
  const [x, setX] = useState(SCRIPT[0].move?.[0] ?? 50)
  const [flash, setFlash] = useState(false)

  // preload every sheet once
  useEffect(() => {
    for (const a of ["idle", "walk", "jump", "sit", "laptop", "build", "photo"] as Action[]) new Image().src = SHEET(a)
  }, [])

  // play only while on screen
  useEffect(() => {
    const el = box.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // the timeline
  useEffect(() => {
    if (!visible || reduce) return
    let step = 0, i = 0, timer = 0
    const tick = () => {
      const s = SCRIPT[step]
      setPos({ step, i })
      if (s.move) setX(s.move[0] + ((s.move[1] - s.move[0]) * (i + 1)) / s.frames.length)
      if (s.action === FLASH_AT.action && s.frames[i] === FLASH_AT.frame && (i === 0 || s.frames[i - 1] !== FLASH_AT.frame)) {
        setFlash(true)
        window.setTimeout(() => setFlash(false), 180)
      }
      i++
      if (i >= s.frames.length) {
        i = 0
        step++
        if (step >= SCRIPT.length) {
          // a breath, then the day starts again
          step = 0
          timer = window.setTimeout(() => {
            setX(SCRIPT[0].move?.[0] ?? 50)
            tick()
          }, 1800)
          return
        }
      }
      timer = window.setTimeout(tick, 1000 / SCRIPT[i === 0 ? step : step].fps)
    }
    setX(SCRIPT[0].move?.[0] ?? 50)
    tick()
    return () => clearTimeout(timer)
  }, [visible, reduce, run])

  const s = reduce ? { action: "photo" as Action, view: "front" as View, frames: [5], fps: 1 } : SCRIPT[pos.step]
  const frame = s.frames[reduce ? 0 : pos.i] ?? 0
  const caption = ({ walk: "Walking in", idle: "Hello", jump: "Excited", sit: "Settling in", laptop: "Designing", build: "Building", photo: "Shooting" } as const)[s.action]

  return (
    <section ref={box} className="relative">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-ink-3">
            <span className="size-2 rounded-full bg-[#ef8b2b]" /> A day in the studio
          </p>
          <h3 className="font-heading text-4xl leading-none sm:text-5xl">How I spend it</h3>
        </div>
        {!reduce && (
          <button
            type="button"
            onClick={() => setRun((n) => n + 1)}
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-ink-2 transition hover:bg-ink hover:text-paper"
          >
            <RotateCcw className="h-4 w-4" /> Replay
          </button>
        )}
      </div>

      {/* the stage */}
      <div className="relative h-[300px] overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-[#161618] to-[#0e0e10] sm:h-[380px]">
        <div className="absolute inset-x-0 bottom-[14%] h-px bg-white/10" />
        <div className="absolute inset-x-0 bottom-0 h-[14%] bg-white/[0.02]" />
        <div className="absolute bottom-[6%] -translate-x-1/2" style={{ left: `${reduce ? 50 : x}%`, transition: "left 120ms linear" }}>
          {/* a soft shadow under his feet */}
          <div className="absolute bottom-[3%] left-1/2 h-3 w-24 -translate-x-1/2 rounded-full bg-black/50 blur-md" />
          <Sprite action={s.action} view={s.view} frame={frame} className="relative h-[250px] sm:h-[320px]" />
        </div>
        <p className="absolute left-5 top-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">{caption}</p>
        {/* the camera flash */}
        <div className="pointer-events-none absolute inset-0 bg-white transition-opacity duration-150" style={{ opacity: flash ? 0.85 : 0 }} />
      </div>

      {/* everyone in a line */}
      <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-4">
        {LINEUP.map((l) => (
          <div key={l.action} className="flex flex-col items-center rounded-2xl border border-line bg-white/[0.02] px-2 pt-3 pb-3">
            <Sprite action={l.action} view={l.action === "walk" ? "side" : "front"} frame={l.frame} className="h-[130px] sm:h-[150px]" />
            <span className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">{l.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
