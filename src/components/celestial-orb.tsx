import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"

/**
 * A glowing sun by day that turns and melts into a glowing moon by night.
 * Fills its parent; give the parent a size.
 */

const BLEND = { duration: 2, ease: [0.65, 0, 0.35, 1] as const }

const ORB_CSS = `
.orb { position: relative; width: 100%; height: 100%; }
.orb-halo { position: absolute; inset: -38%; border-radius: 50%; pointer-events: none; transition: opacity 2s ease; animation: orb-breathe 6s ease-in-out infinite; }
.orb-halo--sun { background: radial-gradient(circle, rgba(255, 196, 92, .55) 0%, rgba(255, 170, 70, .28) 34%, rgba(255, 160, 60, .08) 52%, transparent 68%); }
.orb-halo--moon { opacity: 0; background: radial-gradient(circle, rgba(196, 214, 255, .42) 0%, rgba(150, 178, 240, .18) 36%, rgba(130, 160, 230, .05) 54%, transparent 68%); }
.orb[data-night] .orb-halo--sun { opacity: 0; }
.orb[data-night] .orb-halo--moon { opacity: 1; }
@keyframes orb-breathe { 50% { transform: scale(1.06); } }

.orb-rays-wrap { position: absolute; inset: -16%; pointer-events: none; }
.orb-rays { width: 100%; height: 100%; animation: orb-spin 20s linear infinite; }
@keyframes orb-spin { to { transform: rotate(360deg); } }

.orb-disc { position: absolute; inset: 0; border-radius: 50%; }
.orb-face { position: absolute; inset: 0; border-radius: 50%; }
.orb-sun {
  background: radial-gradient(circle at 40% 35%, #fff6d2 0%, #ffd866 30%, #fbb240 68%, #ef8b2b 100%);
  box-shadow: 0 0 40px 6px rgba(255, 190, 90, .55), 0 0 120px 30px rgba(255, 170, 70, .25), inset -18px -22px 50px rgba(214, 104, 24, .35);
}
.orb-moon {
  background: radial-gradient(circle at 38% 32%, #fdfcf8 0%, #e9eaec 42%, #c9cfd9 78%, #a9b2c1 100%);
  box-shadow: 0 0 40px 6px rgba(205, 220, 255, .45), 0 0 120px 30px rgba(160, 185, 245, .2), inset -20px -24px 50px rgba(90, 104, 130, .35);
}
.orb-crater { position: absolute; border-radius: 50%; background: radial-gradient(circle at 60% 62%, rgba(255, 255, 255, .5), rgba(150, 160, 178, .55) 55%, rgba(120, 130, 150, .4)); box-shadow: inset 2px 3px 5px rgba(80, 90, 110, .35); }

@media (prefers-reduced-motion: reduce) {
  .orb-halo, .orb-rays { animation: none; }
}
`

/** Soft tapered rays around the sun. */
function Rays() {
  const rays = Array.from({ length: 16 }, (_, i) => i * (360 / 16))
  return (
    <svg className="orb-rays" viewBox="-100 -100 200 200" aria-hidden="true">
      <defs>
        <linearGradient id="orb-ray" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffcf6a" stopOpacity="0" />
          <stop offset=".55" stopColor="#ffc457" stopOpacity=".55" />
          <stop offset="1" stopColor="#ffb340" stopOpacity="0" />
        </linearGradient>
      </defs>
      {rays.map((a, i) => (
        <path
          key={a}
          d={i % 2 ? "M-2.4 -99 L0 -76 L2.4 -99 Z" : "M-4 -100 L0 -70 L4 -100 Z"}
          fill="url(#orb-ray)"
          transform={`rotate(${a})`}
        />
      ))}
    </svg>
  )
}

const CRATERS = [
  { x: 24, y: 30, s: 16 },
  { x: 56, y: 22, s: 9 },
  { x: 62, y: 52, s: 20 },
  { x: 34, y: 64, s: 11 },
  { x: 46, y: 42, s: 6 },
  { x: 74, y: 34, s: 7 },
  { x: 22, y: 50, s: 6 },
]

export function CelestialOrb({ night }: { night: boolean }) {
  const reduce = useReducedMotion()
  const t = reduce ? { duration: 0 } : BLEND
  // a whole turn on every change, always the same way round, so the light
  // (the highlight, top left) ends up where it started
  const [turns, setTurns] = useState(0)
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setTurns((n) => n + 1)
  }, [night])
  return (
    <div className="orb" data-night={night || undefined} aria-hidden="true">
      <style>{ORB_CSS}</style>
      <div className="orb-halo orb-halo--sun" />
      <div className="orb-halo orb-halo--moon" />
      {/* the rays draw in as the sun sets and fan out again at sunrise */}
      <motion.div
        className="orb-rays-wrap"
        initial={false}
        animate={{ opacity: night ? 0 : 1, scale: night ? 0.72 : 1 }}
        transition={t}
      >
        <Rays />
      </motion.div>
      {/* the disc turns a full revolution while the sun melts into the moon */}
      <motion.div className="orb-disc" initial={false} animate={{ rotate: turns * 360 }} transition={t}>
        <div className="orb-face orb-moon">
          {CRATERS.map((c) => (
            <span
              key={`${c.x}-${c.y}`}
              className="orb-crater"
              style={{ left: `${c.x}%`, top: `${c.y}%`, width: `${c.s}%`, height: `${c.s}%` }}
            />
          ))}
        </div>
        <motion.div className="orb-face orb-sun" initial={false} animate={{ opacity: night ? 0 : 1 }} transition={t} />
      </motion.div>
    </div>
  )
}
