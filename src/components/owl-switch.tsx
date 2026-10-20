import { useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"

/**
 * The day/night switch: an owl perched in the top-right corner.
 *
 * Day (the default): the owl sleeps. Tap it and it wakes, flies across the
 * screen and back, and night follows it across the page. Tap it again and it
 * goes back to sleep as the day returns.
 */

const STORAGE_KEY = "theme"
const FLIGHT_MS = 2600
const OUTBOUND = 0.45 // share of the flight spent crossing the screen
const EASE = "cubic-bezier(.45, 0, .4, 1)"

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

function OwlFace({ awake }: { awake: boolean }) {
  return (
    <>
      {/* facial discs */}
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
      {/* beak */}
      <path d="M30 31.5h4l-2 4.2z" fill="#d98f2b" />
    </>
  )
}

function OwlBody() {
  return (
    <>
      {/* ear tufts */}
      <path d="M13 17 11 5l10 7z" fill="#6f533f" />
      <path d="M51 17 53 5l-10 7z" fill="#6f533f" />
      {/* body */}
      <path d="M32 8C18 8 11 18 11 31c0 14 8 25 21 25s21-11 21-25C53 18 46 8 32 8z" fill="#8a6a50" />
      {/* belly */}
      <ellipse cx="32" cy="44" rx="11" ry="10" fill="#d9c4a5" />
      <g fill="none" stroke="#a88a68" strokeWidth="1.2" strokeLinecap="round">
        <path d="M27 41l1.5 1.5 1.5-1.5M34 41l1.5 1.5 1.5-1.5M30.5 46l1.5 1.5 1.5-1.5" />
      </g>
    </>
  )
}

/** The owl on its perch, wings folded. */
function PerchedOwl({ awake }: { awake: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full overflow-visible" aria-hidden="true">
      <OwlBody />
      {/* folded wings */}
      <path d="M12 30c-2 10 1 19 7 23 1-9 0-17-7-23z" fill="#6f533f" />
      <path d="M52 30c2 10-1 19-7 23-1-9 0-17 7-23z" fill="#6f533f" />
      <OwlFace awake={awake} />
      {/* feet */}
      <g stroke="#d98f2b" strokeWidth="2" strokeLinecap="round">
        <path d="M27 56v3M25 59h4M37 56v3M35 59h4" />
      </g>
    </svg>
  )
}

/** The owl in flight, wings out and flapping. */
function FlyingOwl() {
  return (
    <svg viewBox="-24 -6 112 76" className="h-full w-full overflow-visible" aria-hidden="true">
      <g className="owl-wing owl-wing--left">
        <path d="M14 28C2 20-10 18-22 24c8 2 12 6 14 10-6 0-10 2-12 6 10-2 20 0 30-2z" fill="#6f533f" />
      </g>
      <g className="owl-wing owl-wing--right">
        <path d="M50 28c12-8 24-10 36-4-8 2-12 6-14 10 6 0 10 2 12 6-10-2-20 0-30-2z" fill="#6f533f" />
      </g>
      <OwlBody />
      <OwlFace awake />
      <g stroke="#d98f2b" strokeWidth="2" strokeLinecap="round">
        <path d="M28 55l-1 4M36 55l1 4" />
      </g>
    </svg>
  )
}

const OWL_CSS = `
.owl-perch { position: relative; width: 40px; height: 40px; flex: none; cursor: pointer; border-radius: 12px; -webkit-tap-highlight-color: transparent; }
.owl-perch:focus-visible { outline: 2px solid currentColor; outline-offset: 4px; }
.owl-perch > svg { transition: transform .4s cubic-bezier(.34, 1.4, .5, 1); transform-origin: 50% 100%; }
.owl-perch:hover > svg { transform: rotate(-6deg) scale(1.06); }
.owl-perch[data-asleep] > svg { animation: owl-breathe 3.6s ease-in-out infinite; }
@keyframes owl-breathe { 50% { transform: scale(1.035, .97); } }
.owl-eyes { transform-box: fill-box; transform-origin: center; animation: owl-blink 4.5s infinite; }
@keyframes owl-blink { 0%, 92%, 100% { transform: scaleY(1); } 95% { transform: scaleY(.1); } }
.owl-z { position: absolute; right: -4px; top: -4px; font: italic 600 11px/1 ui-serif, Georgia, serif; color: var(--ink-4); pointer-events: none; opacity: 0; animation: owl-z 3s ease-out infinite; }
.owl-z:nth-of-type(2) { animation-delay: 1s; font-size: 9px; }
.owl-z:nth-of-type(3) { animation-delay: 2s; font-size: 7px; }
@keyframes owl-z { 0% { opacity: 0; translate: 0 0; } 20% { opacity: 1; } 100% { opacity: 0; translate: 10px -16px; } }

.owl-sky { position: fixed; inset: 0; z-index: 60; pointer-events: none; view-transition-name: owl-sky; }
.owl-flyer { position: absolute; left: 0; top: 0; }
.owl-wing { transform-box: view-box; animation: owl-flap .26s ease-in-out infinite alternate; }
.owl-wing--left { transform-origin: 14px 28px; }
.owl-wing--right { transform-origin: 50px 28px; }
@keyframes owl-flap { from { transform: scaleY(1) rotate(0deg); } to { transform: scaleY(-.55) rotate(0deg); } }

::view-transition-group(owl-sky),
::view-transition-old(owl-sky),
::view-transition-new(owl-sky) { animation: none; }
html.owl-night::view-transition-old(root),
html.owl-night::view-transition-new(root) { animation: none; mix-blend-mode: normal; }
html.owl-day::view-transition-old(root),
html.owl-day::view-transition-new(root) { animation-duration: .7s; }

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
  const xRef = useRef<HTMLDivElement>(null)
  const yRef = useRef<HTMLDivElement>(null)

  const fly = async () => {
    const perch = perchRef.current!.getBoundingClientRect()
    const cx = perch.left + perch.width / 2
    const cy = perch.top + perch.height / 2
    const H = window.innerHeight
    const off = -90 // just past the left edge
    const html = document.documentElement
    const canTransition = "startViewTransition" in document

    // wake up, then take off
    setAwake(true)
    await new Promise((r) => setTimeout(r, 420))

    const takeOff = () => {
      flushSync(() => {
        setFlying(true)
        setDark(true)
      })
      // start on the perch, so the first frame doesn't flash in the corner
      xRef.current!.style.transform = `translateX(${cx}px)`
      yRef.current!.style.transform = `translateY(${cy}px) scale(.5)`
    }

    let transition: ViewTransition | null = null
    if (canTransition) {
      html.classList.add("owl-night")
      transition = document.startViewTransition(takeOff)
      await transition.ready
    } else {
      flushSync(() => setFlying(true))
      xRef.current!.style.transform = `translateX(${cx}px)`
      yRef.current!.style.transform = `translateY(${cy}px) scale(.5)`
      setTimeout(() => setDark(true), FLIGHT_MS * OUTBOUND * 0.5)
    }

    const timing = { duration: FLIGHT_MS, easing: "linear", fill: "forwards" as const }
    // across and back; x and y move separately so the night edge can follow x exactly
    const xAnim = xRef.current!.animate(
      [
        { transform: `translateX(${cx}px)`, easing: EASE },
        { transform: `translateX(${off}px)`, offset: OUTBOUND },
        { transform: `translateX(${off}px)`, offset: 0.55, easing: EASE },
        { transform: `translateX(${cx}px)` },
      ],
      timing,
    )
    yRef.current!.animate(
      [
        { transform: `translateY(${cy}px) scale(.5)`, easing: "ease-out" },
        { transform: `translateY(${cy + H * 0.3}px) scale(1.1)`, offset: 0.22, easing: "ease-in-out" },
        { transform: `translateY(${cy + H * 0.2}px) scale(1)`, offset: OUTBOUND },
        { transform: `translateY(${cy + H * 0.12}px) scale(1)`, offset: 0.55, easing: "ease-in-out" },
        { transform: `translateY(${cy + H * 0.16}px) scale(.9)`, offset: 0.8, easing: "ease-in" },
        { transform: `translateY(${cy}px) scale(.5)` },
      ],
      timing,
    )

    if (transition) {
      // night spreads behind the owl as it crosses
      html.animate(
        { clipPath: [`inset(0 0 0 ${cx}px)`, `inset(0 0 0 ${off}px)`] },
        { duration: FLIGHT_MS * OUTBOUND, easing: EASE, pseudoElement: "::view-transition-new(root)" },
      )
      transition.finished.finally(() => html.classList.remove("owl-night"))
    }

    await xAnim.finished
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
      {flying && (
        <div className="owl-sky" aria-hidden="true">
          <div ref={xRef} className="owl-flyer">
            <div ref={yRef} style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, margin: 0 }}>
              <div style={{ position: "absolute", width: 124, height: 84, left: -62, top: -42 }}>
                <FlyingOwl />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
