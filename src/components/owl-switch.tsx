import { useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"

/**
 * The day/night switch: an owl on a branch at the right edge of the screen.
 *
 * Day (the default): the owl sleeps. Tap it and it wakes, flies off across
 * the screen and back, and night spreads out from it like ink as it goes.
 * Tap it again and it goes back to sleep as the day returns.
 */

const STORAGE_KEY = "theme"
const FLIGHT_MS = 3000
const OUT_END = 0.5 // the outbound swoop ends (off-screen left) here…
const BACK_START = 0.56 // …and the owl turns round and heads home from here
const FEATHER = 220 // softness of night's edge, px

function setDark(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark)
  try {
    localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light")
  } catch {
    /* private mode — the theme just won't be remembered */
  }
}

/** True while the page is in night mode; follows the class on <html>. */
export function useIsDark() {
  const [dark, setDarkState] = useState(() => document.documentElement.classList.contains("dark"))
  useEffect(() => {
    const html = document.documentElement
    const mo = new MutationObserver(() => setDarkState(html.classList.contains("dark")))
    mo.observe(html, { attributes: true, attributeFilter: ["class"] })
    return () => mo.disconnect()
  }, [])
  return dark
}

// ---------------------------------------------------------------------------
// The flight path

type Pt = { x: number; y: number }
const bezier = (a: Pt, b: Pt, c: Pt, u: number): Pt => ({
  x: (1 - u) ** 2 * a.x + 2 * (1 - u) * u * b.x + u * u * c.x,
  y: (1 - u) ** 2 * a.y + 2 * (1 - u) * u * b.y + u * u * c.y,
})
const easeInOut = (u: number) => (u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2)
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

/** Out: a swoop down and away to the left. Back: a higher, flatter glide home. */
function flight(perch: Pt, W: number, H: number) {
  const off = -160
  const out = (u: number) =>
    bezier(perch, { x: W * 0.62, y: perch.y + H * 0.8 }, { x: off, y: perch.y + H * 0.3 }, easeInOut(u))
  const back = (u: number) =>
    bezier({ x: off, y: perch.y + H * 0.2 }, { x: W * 0.45, y: perch.y + H * 0.04 }, perch, easeInOut(u))
  return { out, back }
}

// ---------------------------------------------------------------------------
// Drawings

/** Perched, facing you, wings folded. */
function PerchedOwl({ awake }: { awake: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full overflow-visible" aria-hidden="true">
      <path d="M13 17 11 5l10 7z" fill="#6f533f" />
      <path d="M51 17 53 5l-10 7z" fill="#6f533f" />
      <path d="M32 8C18 8 11 18 11 31c0 14 8 25 21 25s21-11 21-25C53 18 46 8 32 8z" fill="#8a6a50" />
      <ellipse cx="32" cy="44" rx="11" ry="10" fill="#d9c4a5" />
      <path
        d="M27 41l1.5 1.5 1.5-1.5M34 41l1.5 1.5 1.5-1.5M30.5 46l1.5 1.5 1.5-1.5"
        fill="none"
        stroke="#a88a68"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path d="M12 30c-2 10 1 19 7 23 1-9 0-17-7-23z" fill="#6f533f" />
      <path d="M52 30c2 10-1 19-7 23-1-9 0-17 7-23z" fill="#6f533f" />
      <circle cx="24" cy="27" r="9.5" fill="#efe3cf" />
      <circle cx="40" cy="27" r="9.5" fill="#efe3cf" />
      {awake ? (
        <g className="owl-eyes">
          <circle cx="24" cy="27" r="6" fill="#f4bf3a" />
          <circle cx="40" cy="27" r="6" fill="#f4bf3a" />
          <circle cx="24.6" cy="27.4" r="3" fill="#1a1816" />
          <circle cx="40.6" cy="27.4" r="3" fill="#1a1816" />
          <circle cx="25.6" cy="26" r="1" fill="#fff" />
          <circle cx="41.6" cy="26" r="1" fill="#fff" />
        </g>
      ) : (
        <g fill="none" stroke="#5a4232" strokeWidth="1.8" strokeLinecap="round">
          <path d="M19 27.5q5 3.6 10 0" />
          <path d="M35 27.5q5 3.6 10 0" />
        </g>
      )}
      <path d="M30 31.5h4l-2 4.2z" fill="#d98f2b" />
      <path d="M27 56v3M25 59h4M37 56v3M35 59h4" stroke="#d98f2b" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/** In flight, side on, facing left. Mirrored to fly right. */
function FlyingOwl() {
  return (
    <svg viewBox="0 0 100 70" className="h-full w-full overflow-visible" aria-hidden="true">
      {/* far wing */}
      <path className="owl-wing owl-wing--far" d="M50 32C54 10 72 2 90 4c-8 6-12 11-14 18 5 1 8 3 10 6-12 1-24 4-36 4z" fill="#5b4433" />
      {/* tail */}
      <path d="M74 38l20-6-3 8 3 7-20-3z" fill="#6f533f" />
      {/* body */}
      <path d="M30 36c4-10 22-14 38-10 9 2 11 9 8 15-4 8-18 12-32 10-10-1-16-7-14-15z" fill="#8a6a50" />
      <path d="M34 42c8 7 24 8 36 2-6 7-20 9-30 6-4-1-6-4-6-8z" fill="#d9c4a5" />
      {/* tucked feet */}
      <path d="M50 51l6 3M56 50l6 3" stroke="#d98f2b" strokeWidth="2" strokeLinecap="round" />
      {/* head */}
      <path d="M38 17l3-9 4 10z" fill="#6f533f" />
      <circle cx="32" cy="29" r="14" fill="#8a6a50" />
      <ellipse cx="26" cy="30" rx="8.5" ry="10" fill="#efe3cf" />
      <circle cx="24.5" cy="28.5" r="4.6" fill="#f4bf3a" />
      <circle cx="23.4" cy="28.8" r="2.4" fill="#1a1816" />
      <circle cx="22.8" cy="27.6" r=".9" fill="#fff" />
      <path d="M19 32l-4 2.4 4 2.6z" fill="#d98f2b" />
      {/* near wing */}
      <path className="owl-wing owl-wing--near" d="M46 32C50 8 70-2 92 0c-9 6-13 12-15 20 6 1 9 3 11 7-14 2-28 5-42 5z" fill="#6f533f" />
    </svg>
  )
}

/** A short branch growing out of the right edge of the screen. */
function Branch() {
  return (
    <svg viewBox="0 0 110 40" className="owl-branch" aria-hidden="true">
      <path d="M110 26C80 24 50 27 6 22" fill="none" stroke="#6b5240" strokeWidth="5" strokeLinecap="round" />
      <path d="M40 25c-6-6-8-12-6-18" fill="none" stroke="#6b5240" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M34 7c-6-1-10 2-11 7 6 1 10-2 11-7z" fill="#7d9a6a" />
      <path d="M14 23c-4-5-9-6-13-4 3 5 8 6 13 4z" fill="#8fae79" />
      <path d="M76 25c2 6 7 9 12 8-1-6-6-9-12-8z" fill="#7d9a6a" />
    </svg>
  )
}

const OWL_CSS = `
@property --owl-x { syntax: "<length>"; inherits: false; initial-value: 0px; }
@property --owl-y { syntax: "<length>"; inherits: false; initial-value: 0px; }
@property --owl-r { syntax: "<length>"; inherits: false; initial-value: 0px; }

.owl-roost { position: fixed; right: 0; top: 66px; z-index: 45; width: 110px; height: 70px; pointer-events: none; view-transition-name: owl-roost; }
.owl-branch { position: absolute; right: 0; bottom: 0; width: 110px; height: 40px; }
.owl-perch {
  position: absolute; right: 38px; bottom: 20px; width: 46px; height: 46px;
  pointer-events: auto; cursor: pointer; border-radius: 12px; -webkit-tap-highlight-color: transparent;
}
.owl-perch:focus-visible { outline: 2px solid var(--ink); outline-offset: 4px; }
.owl-perch > svg { transition: transform .4s cubic-bezier(.34, 1.4, .5, 1); transform-origin: 50% 100%; }
.owl-perch:hover > svg { transform: rotate(-6deg) scale(1.06); }
.owl-perch[data-asleep] > svg { animation: owl-breathe 3.6s ease-in-out infinite; }
@keyframes owl-breathe { 50% { transform: scale(1.035, .97); } }
.owl-eyes { transform-box: fill-box; transform-origin: center; animation: owl-blink 4.5s infinite; }
@keyframes owl-blink { 0%, 92%, 100% { transform: scaleY(1); } 95% { transform: scaleY(.1); } }
.owl-z { position: absolute; left: -2px; top: -4px; font: italic 600 12px/1 ui-serif, Georgia, serif; color: var(--ink-4); pointer-events: none; opacity: 0; animation: owl-z 3s ease-out infinite; }
.owl-z:nth-of-type(2) { animation-delay: 1s; font-size: 10px; }
.owl-z:nth-of-type(3) { animation-delay: 2s; font-size: 8px; }
@keyframes owl-z { 0% { opacity: 0; translate: 0 0; } 20% { opacity: 1; } 100% { opacity: 0; translate: -12px -18px; } }

.owl-sky { position: fixed; inset: 0; z-index: 60; pointer-events: none; view-transition-name: owl-sky; }
.owl-flyer { position: absolute; left: -55px; top: -38px; width: 110px; height: 77px; will-change: transform; }
.owl-wing { transform-box: view-box; animation: owl-flap .3s ease-in-out infinite alternate; }
.owl-wing--near { transform-origin: 48px 32px; }
.owl-wing--far { transform-origin: 52px 32px; animation-delay: -.04s; }
@keyframes owl-flap { from { transform: rotate(-4deg) scaleY(1); } to { transform: rotate(6deg) scaleY(-.75); } }

::view-transition-group(owl-sky),
::view-transition-old(owl-sky),
::view-transition-new(owl-sky),
::view-transition-group(owl-roost),
::view-transition-new(owl-roost) { animation: none; }
/* the branch is drawn live during the flight, so the owl isn't left behind on it */
::view-transition-old(owl-roost) { display: none; }
html.owl-night::view-transition-old(root),
html.owl-night::view-transition-new(root) { animation: none; mix-blend-mode: normal; }
html.owl-night::view-transition-new(root) {
  -webkit-mask-image: radial-gradient(circle at var(--owl-x) var(--owl-y), #000 var(--owl-r), transparent calc(var(--owl-r) + ${FEATHER}px));
  mask-image: radial-gradient(circle at var(--owl-x) var(--owl-y), #000 var(--owl-r), transparent calc(var(--owl-r) + ${FEATHER}px));
}
html.owl-day::view-transition-old(root),
html.owl-day::view-transition-new(root) { animation-duration: .8s; }

@media (prefers-reduced-motion: reduce) {
  .owl-perch > svg, .owl-eyes, .owl-z { animation: none !important; }
}
`

export function OwlSwitch() {
  const isDark = useIsDark()
  const [awake, setAwake] = useState(isDark)
  const [flying, setFlying] = useState(false)
  const busy = useRef(false)
  const perchRef = useRef<HTMLButtonElement>(null)
  const flyerRef = useRef<HTMLDivElement>(null)

  const fly = async () => {
    const r = perchRef.current!.getBoundingClientRect()
    const perch = { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    const W = window.innerWidth
    const H = window.innerHeight
    const { out, back } = flight(perch, W, H)
    const html = document.documentElement
    // night spreads from the owl through a soft mask; that needs view transitions
    // and animatable custom properties, otherwise the page simply switches mid-flight
    const canSpread = "startViewTransition" in document && typeof CSS !== "undefined" && "registerProperty" in CSS

    // the owl's pose at a point on the path, facing the way it is flying
    const pose = (p: Pt, prev: Pt, facingLeft: boolean, scale: number) => {
      const dx = p.x - prev.x
      const dy = p.y - prev.y
      const bank = clamp((Math.atan2(dy, Math.abs(dx) || 1) * 180) / Math.PI * 0.5, -22, 22)
      return `translate(${p.x}px, ${p.y}px) rotate(${facingLeft ? -bank : bank}deg) scale(${scale}) scaleX(${facingLeft ? 1 : -1})`
    }

    const N = 28
    const frames: Keyframe[] = []
    let prev = out(0)
    for (let i = 0; i <= N; i++) {
      const u = i / N
      const p = out(u)
      frames.push({ transform: pose(p, i ? prev : out(0.01), true, 0.45 + 0.55 * clamp(u / 0.15, 0, 1)), offset: u * OUT_END })
      prev = p
    }
    prev = back(0)
    for (let i = 0; i <= N; i++) {
      const u = i / N
      const p = back(u)
      const landing = 0.45 + 0.55 * clamp((1 - u) / 0.15, 0, 1)
      frames.push({ transform: pose(p, i ? prev : back(0.01) , false, landing), offset: BACK_START + u * (1 - BACK_START) })
      prev = p
    }

    // wake up, look around, then take off
    setAwake(true)
    await new Promise((r) => setTimeout(r, 450))

    const takeOff = () => {
      flushSync(() => {
        setFlying(true)
        setDark(true)
      })
      flyerRef.current!.style.transform = frames[0].transform as string
    }

    let transition: ViewTransition | null = null
    if (canSpread) {
      html.classList.add("owl-night")
      transition = document.startViewTransition(takeOff)
      await transition.ready.catch(() => {})
    } else {
      flushSync(() => setFlying(true))
      flyerRef.current!.style.transform = frames[0].transform as string
      setTimeout(() => setDark(true), FLIGHT_MS * OUT_END * 0.5)
    }

    const anim = flyerRef.current!.animate(frames, { duration: FLIGHT_MS, fill: "forwards" })

    if (transition) {
      const reach = Math.hypot(W + 200, H + 200)
      const ink: Keyframe[] = []
      for (let i = 0; i <= N; i++) {
        const u = i / N
        const p = out(u)
        ink.push({ "--owl-x": `${p.x}px`, "--owl-y": `${p.y}px`, "--owl-r": `${reach * u ** 1.4 - FEATHER * (1 - u)}px` })
      }
      html.animate(ink, { duration: FLIGHT_MS * OUT_END, pseudoElement: "::view-transition-new(root)", fill: "forwards" })
      transition.finished.finally(() => html.classList.remove("owl-night"))
    }

    await anim.finished
    setFlying(false)
  }

  const sleep = async () => {
    const html = document.documentElement
    setAwake(false)
    await new Promise((r) => setTimeout(r, 300))
    if ("startViewTransition" in document) {
      html.classList.add("owl-day")
      const t = document.startViewTransition(() => setDark(false))
      t.finished.finally(() => html.classList.remove("owl-day"))
    } else {
      setDark(false)
    }
  }

  const onTap = async () => {
    if (busy.current) return
    busy.current = true
    try {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (isDark) await sleep()
      else if (reduce) {
        setAwake(true)
        setDark(true)
      } else await fly()
    } finally {
      busy.current = false
    }
  }

  return (
    <>
      <style>{OWL_CSS}</style>
      <div className="owl-roost">
        <Branch />
        <button
          ref={perchRef}
          type="button"
          onClick={onTap}
          className="owl-perch"
          data-asleep={!awake || undefined}
          aria-label={isDark ? "Switch to light mode (the owl goes to sleep)" : "Switch to dark mode (wake the owl)"}
          title={isDark ? "Let the owl sleep" : "Wake the owl"}
          style={{ visibility: flying ? "hidden" : undefined }}
        >
          <PerchedOwl awake={awake} />
          {!awake && (
            <>
              <span className="owl-z">z</span>
              <span className="owl-z">z</span>
              <span className="owl-z">z</span>
            </>
          )}
        </button>
      </div>
      {flying && (
        <div className="owl-sky" aria-hidden="true">
          <div ref={flyerRef} className="owl-flyer">
            <FlyingOwl />
          </div>
        </div>
      )}
    </>
  )
}
