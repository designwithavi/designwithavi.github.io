import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"

/**
 * A glowing sun by day (a soft orb, like the moon) that turns and melts into a glowing moon by night.
 * Fills its parent; give the parent a size.
 */

const BLEND = { duration: 2, ease: [0.65, 0, 0.35, 1] as const }

const ORB_CSS = `
.orb { position: relative; width: 100%; height: 100%; }
.orb-halo { position: absolute; inset: -38%; border-radius: 50%; pointer-events: none; transition: opacity 2s ease; animation: orb-breathe 6s ease-in-out infinite; }
.orb-halo--sun { background: radial-gradient(circle, rgba(255, 200, 110, .5) 0%, rgba(255, 176, 80, .24) 36%, rgba(255, 160, 60, .06) 54%, transparent 68%); }
.orb-halo--moon { opacity: 0; background: radial-gradient(circle, rgba(196, 214, 255, .42) 0%, rgba(150, 178, 240, .18) 36%, rgba(130, 160, 230, .05) 54%, transparent 68%); }
.orb[data-night] .orb-halo--sun { opacity: 0; }
.orb[data-night] .orb-halo--moon { opacity: 1; }
@keyframes orb-breathe { 50% { transform: scale(1.06); } }

.orb-disc { position: absolute; inset: 0; border-radius: 50%; }

/* at night the moon floats, its glow breathes, and its face turns very slowly */
.orb-float { position: absolute; inset: 0; }
.orb[data-night] .orb-float { animation: orb-float 9s ease-in-out infinite; }
@keyframes orb-float { 0%, 100% { transform: translate(0, 0); } 30% { transform: translate(4px, -10px); } 65% { transform: translate(-3px, -4px); } }
.orb-halo--sun, .orb[data-night] .orb-halo--moon { animation: orb-moonglow 5s ease-in-out infinite; }
@keyframes orb-moonglow { 0%, 100% { transform: scale(1); filter: brightness(1); } 50% { transform: scale(1.12); filter: brightness(1.35); } }
.orb-moon-face { position: absolute; inset: 0; border-radius: 50%; overflow: hidden; }
.orb[data-night] .orb-moon-face { animation: orb-spin 160s linear infinite; }
.orb-face { position: absolute; inset: 0; border-radius: 50%; }
.orb-sun {
  background: radial-gradient(circle at 38% 32%, #fffaf0 0%, #ffe4a3 40%, #fcc56b 76%, #f2a14a 100%);
  box-shadow: 0 0 40px 6px rgba(255, 200, 110, .5), 0 0 120px 30px rgba(255, 176, 80, .22), inset -20px -24px 50px rgba(205, 120, 40, .3);
}
.orb-moon {
  background: radial-gradient(circle at 38% 32%, #fdfcf8 0%, #e9eaec 42%, #c9cfd9 78%, #a9b2c1 100%);
  box-shadow: 0 0 40px 6px rgba(205, 220, 255, .45), 0 0 120px 30px rgba(160, 185, 245, .2), inset -20px -24px 50px rgba(90, 104, 130, .35);
}
.orb-crater { position: absolute; border-radius: 50%; background: radial-gradient(circle at 60% 62%, rgba(255, 255, 255, .5), rgba(150, 160, 178, .55) 55%, rgba(120, 130, 150, .4)); box-shadow: inset 2px 3px 5px rgba(80, 90, 110, .35); }

@media (prefers-reduced-motion: reduce) {
  .orb-halo, .orb-float, .orb-moon-face { animation: none !important; }
}
`

const CRATERS = [
  { x: 24, y: 30, s: 16 },
  { x: 56, y: 22, s: 9 },
  { x: 62, y: 52, s: 20 },
  { x: 34, y: 64, s: 11 },
  { x: 46, y: 42, s: 6 },
  { x: 74, y: 34, s: 7 },
  { x: 22, y: 50, s: 6 },
]

/**
 * While the page is switching theme it's drawn from snapshots (see owl-switch),
 * and an orb changing underneath them shows up half sun, half moon. So the orb
 * follows the theme only once the switch has finished.
 */
function useSettled(night: boolean) {
  const [shown, setShown] = useState(night)
  useEffect(() => {
    const html = document.documentElement
    let raf = 0
    const check = () => {
      if (html.classList.contains("owl-night") || html.classList.contains("owl-day")) raf = requestAnimationFrame(check)
      else setShown(night)
    }
    check()
    return () => cancelAnimationFrame(raf)
  }, [night])
  return shown
}

export function CelestialOrb({ night: theme }: { night: boolean }) {
  const night = useSettled(theme)
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
      {/* the disc turns a full revolution while the sun melts into the moon */}
      <div className="orb-float">
        <motion.div className="orb-disc" initial={false} animate={{ rotate: turns * 360 }} transition={t}>
          <div className="orb-face orb-moon">
            <div className="orb-moon-face">
              {CRATERS.map((c) => (
                <span
                  key={`${c.x}-${c.y}`}
                  className="orb-crater"
                  style={{ left: `${c.x}%`, top: `${c.y}%`, width: `${c.s}%`, height: `${c.s}%` }}
                />
              ))}
            </div>
          </div>
          <motion.div className="orb-face orb-sun" initial={false} animate={{ opacity: night ? 0 : 1 }} transition={t} />
        </motion.div>
      </div>
    </div>
  )
}
