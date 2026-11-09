import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"

/**
 * The LEGO-style Avishkar crosses a baseline: walks in from the left, jumps,
 * sits, works on the laptop, builds a model, takes a picture (the scene
 * flashes), then walks out to the right. After a pause he comes back from the
 * right, does it all again facing the other way, and leaves to the left — so
 * he never jumps across the screen between rounds.
 * Frames come from sprite sheets: 6 columns × 2 rows of 256 × 512, front view
 * on top, side view (facing right) below. Plays only while on screen.
 */

type Action = "idle" | "walk" | "jump" | "sit" | "laptop" | "build" | "photo"
type View = "front" | "side"
type Step = { action: Action; view: View; frames: number[]; fps: number; move?: [number, number] }

const SHEET = (a: Action) => `about/anim/${a}.webp`
const loop = (times: number) => Array.from({ length: times * 6 }, (_, i) => i % 6)

// where he stops to work, as % across the baseline, and the two off-stage spots
const STOP = 30
const LEFT = -6
const RIGHT = 106

/** One round. Entering from the left he stops at STOP; from the right, at the mirror spot. */
function script(fromLeft: boolean): Step[] {
  const [start, stop, end] = fromLeft ? [LEFT, STOP, RIGHT] : [RIGHT, 100 - STOP, LEFT]
  return [
    { action: "walk", view: "side", frames: loop(4), fps: 8, move: [start, stop] },
    { action: "idle", view: "front", frames: [0, 1], fps: 5 },
    { action: "jump", view: "front", frames: [0, 1, 2, 3, 4, 5, 0], fps: 8 },
    { action: "sit", view: "front", frames: [0, 1, 2, 3, 4, 5, 5, 5], fps: 7 },
    { action: "laptop", view: "front", frames: loop(3), fps: 7 },
    { action: "build", view: "front", frames: [0, 1, 2, 3, 4, 5, 5, 5, 5], fps: 6 },
    { action: "photo", view: "front", frames: [0, 1, 2, 3, 4, 5, 5, 5], fps: 8 },
    { action: "idle", view: "front", frames: [0, 1, 2], fps: 5 },
    { action: "walk", view: "side", frames: loop(7), fps: 8, move: [stop, end] },
  ]
}
const ROUNDS = [script(true), script(false)]
const FLASH_FRAME = 3 // the shutter, in the photo frames

function Sprite({ action, view, frame, flip, className = "" }: { action: Action; view: View; frame: number; flip?: boolean; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        // the side frames face right; mirror them to walk left
        scale: flip ? "-1 1" : undefined,
        aspectRatio: "1 / 2",
        backgroundImage: `url(${SHEET(action)})`,
        backgroundSize: "600% 200%",
        backgroundPosition: `${(frame / 5) * 100}% ${view === "front" ? 0 : 100}%`,
        backgroundRepeat: "no-repeat",
      }}
    />
  )
}

/**
 * Drop inside a positioned container: the baseline runs along its bottom.
 * `onFlash` fires once at the camera's shutter.
 */
export function CharacterWalker({ onFlash, className = "" }: { onFlash?: () => void; className?: string }) {
  const reduce = useReducedMotion()
  const box = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ round: 0, step: 0, i: 0 })
  const [x, setX] = useState(LEFT)
  // where he is in the story survives pauses, so scrolling away and back resumes rather than restarts
  const at = useRef({ round: 0, step: 0, i: 0 })
  const flash = useRef(onFlash)
  flash.current = onFlash

  useEffect(() => {
    for (const a of ["idle", "walk", "jump", "sit", "laptop", "build", "photo"] as Action[]) new Image().src = SHEET(a)
  }, [])

  useEffect(() => {
    const el = box.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || reduce) return
    let timer = 0
    const tick = () => {
      const a = at.current
      const s = ROUNDS[a.round][a.step]
      setPos({ ...a })
      if (s.move) setX(s.move[0] + ((s.move[1] - s.move[0]) * (a.i + 1)) / s.frames.length)
      if (s.action === "photo" && s.frames[a.i] === FLASH_FRAME && s.frames[a.i - 1] !== FLASH_FRAME) flash.current?.()
      if (++a.i >= s.frames.length) {
        a.i = 0
        if (++a.step >= ROUNDS[a.round].length) {
          // he's off stage on the far side: a pause, then he comes back from there
          a.step = 0
          a.round = 1 - a.round
          timer = window.setTimeout(tick, 2200)
          return
        }
      }
      timer = window.setTimeout(tick, 1000 / ROUNDS[a.round][a.step].fps)
    }
    tick()
    return () => clearTimeout(timer)
  }, [visible, reduce])

  const s = reduce ? { action: "idle" as Action, view: "front" as View, frames: [0], fps: 1 } : ROUNDS[pos.round][pos.step]
  const frame = s.frames[reduce ? 0 : pos.i] ?? 0
  const flip = !reduce && s.view === "side" && pos.round === 1

  return (
    <div ref={box} className={`pointer-events-none absolute inset-x-0 bottom-0 ${className}`} aria-hidden="true">
      {/* the baseline */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/25" />
      <div className="absolute bottom-0 -translate-x-1/2" style={{ left: `${reduce ? STOP : x}%`, transition: "left 125ms linear" }}>
        <div className="absolute bottom-[1%] left-1/2 h-2 w-16 -translate-x-1/2 rounded-full bg-black/60 blur-[6px]" />
        {/* the frames have a little empty space below the feet: tuck it under the line */}
        <Sprite action={s.action} view={s.view} frame={frame} flip={flip} className="relative h-[150px] translate-y-[6.5%] sm:h-[190px]" />
      </div>
    </div>
  )
}
