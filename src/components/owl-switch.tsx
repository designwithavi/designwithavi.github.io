import { useEffect, useId, useRef, useState } from "react"
import { flushSync } from "react-dom"

/**
 * The day/night switch: an owl on a branch at the right edge of the screen.
 *
 * Day (the default): the owl sleeps. Tap it and it wakes, crouches, flies off
 * across the screen and back, and night spreads out from it like ink as it
 * goes. Home again, it flares, turns to face you, hovers on beating wings and
 * drops onto the branch. Awake, it watches the cursor. Tap it again and it
 * goes back to sleep as the day returns.
 */

const STORAGE_KEY = "theme"
const FLIGHT_MS = 4800
// the flight, as shares of FLIGHT_MS
const OUT_END = 0.32 // swoop out, ending off-screen left
const BACK_START = 0.38 // turn round off-screen, then glide home
const FLARE_START = 0.64 // brake, nose up
const HOVER_START = 0.73 // turned to face you: hover on beating wings
const DROP_START = 0.88 // drop onto the branch
const FRAME_MS = 16 // keyframes are sampled about once per screen refresh
const FEATHER = 220 // softness of night's edge, px
const FROST_FADE_MS = 350 // folders' glass swaps to a snapshot-safe frost over this long
const SKY_BLEND_MS = 2000 // how long the landing page's sun takes to become the moon (see celestial-orb)

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * The folders' frosted glass (backdrop-filter) doesn't survive view-transition
 * snapshots and is costly to redraw every frame, so for the length of a switch
 * a pre-blurred copy fades in over it and the live blur is switched off.
 */
let frostTimer = 0
function frostOn() {
  const html = document.documentElement
  clearTimeout(frostTimer)
  html.classList.add("owl-frost")
  frostTimer = window.setTimeout(() => html.classList.add("owl-frost-on"), FROST_FADE_MS)
}
/** Call only once everything has stopped moving: bringing the live blur back costs a frame or two. */
function frostOff() {
  const html = document.documentElement
  clearTimeout(frostTimer)
  html.classList.remove("owl-frost-on")
  // let the live blur come back under the cover, then fade the cover away
  requestAnimationFrame(() => requestAnimationFrame(() => html.classList.remove("owl-frost")))
}

const THEME_EVENT = "owl-theme"

function setDark(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark)
  try {
    localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light")
  } catch {
    /* private mode — the theme just won't be remembered */
  }
  // tell listeners synchronously, so inside flushSync the whole page (folders
  // included) is redrawn in the new theme before the transition snapshots it
  window.dispatchEvent(new Event(THEME_EVENT))
}

/** True while the page is in night mode; follows the class on <html>. */
export function useIsDark() {
  const [dark, setDarkState] = useState(() => document.documentElement.classList.contains("dark"))
  useEffect(() => {
    const sync = () => setDarkState(document.documentElement.classList.contains("dark"))
    window.addEventListener(THEME_EVENT, sync)
    return () => window.removeEventListener(THEME_EVENT, sync)
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
const lerp = (a: Pt, b: Pt, u: number): Pt => ({ x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u })
const easeInOut = (u: number) => (u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2)
const easeOut = (u: number) => 1 - (1 - u) ** 2
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

/**
 * Out: a swoop down and away to the left. Home: a high glide into an approach
 * left of the branch, a flare up to a point just above it, a hover there,
 * and a gentle drop onto it.
 */
function flight(perch: Pt, W: number, H: number) {
  const off = -160
  const approach = { x: perch.x - 90, y: perch.y - 10 }
  const above = { x: perch.x, y: perch.y - 38 }
  return {
    above,
    out: (u: number) =>
      bezier(perch, { x: W * 0.62, y: perch.y + H * 0.8 }, { x: off, y: perch.y + H * 0.3 }, easeInOut(u)),
    glide: (u: number) =>
      bezier({ x: off, y: perch.y + H * 0.2 }, { x: W * 0.42, y: perch.y + H * 0.16 }, approach, easeInOut(u)),
    flare: (u: number) => bezier(approach, { x: perch.x - 20, y: perch.y - 10 }, above, easeOut(u)),
    // a gentle bob on each wingbeat, drifting a little
    hover: (u: number) => ({ x: above.x + Math.sin(u * Math.PI) * 3, y: above.y + Math.sin(u * Math.PI * 4) * 3 }),
    drop: (u: number) => lerp(above, perch, easeInOut(u)),
  }
}

// ---------------------------------------------------------------------------
// Drawings — one palette, shared shading

const C = {
  dark: "#4a3628",
  wing: "#6b4f3b",
  bar: "#d8c3a3",
  disc: "#efe2cc",
  ruff: "#5a4231",
  beak: "#c98a2e",
  talon: "#d6a24a",
  claw: "#2a1f17",
}

function Shading({ id }: { id: string }) {
  return (
    <defs>
      <radialGradient id={`${id}-body`} cx=".5" cy=".38" r=".7">
        <stop offset="0" stopColor="#a6845f" />
        <stop offset=".65" stopColor="#7f5f46" />
        <stop offset="1" stopColor="#5c4333" />
      </radialGradient>
      <radialGradient id={`${id}-belly`} cx=".5" cy=".35" r=".7">
        <stop offset="0" stopColor="#f1e4cd" />
        <stop offset="1" stopColor="#cfb48f" />
      </radialGradient>
      <radialGradient id={`${id}-disc`} cx=".5" cy=".45" r=".6">
        <stop offset="0" stopColor="#f8efe0" />
        <stop offset=".7" stopColor="#e6d3b5" />
        <stop offset="1" stopColor="#c7aa85" />
      </radialGradient>
      <radialGradient id={`${id}-iris`} cx=".42" cy=".38" r=".62">
        <stop offset="0" stopColor="#ffe48a" />
        <stop offset=".55" stopColor="#f6b42a" />
        <stop offset="1" stopColor="#cf7d14" />
      </radialGradient>
      <linearGradient id={`${id}-wing`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#755842" />
        <stop offset="1" stopColor="#4e392b" />
      </linearGradient>
    </defs>
  )
}

/** Speckles and chevrons down the chest. */
function Chest({ id }: { id: string }) {
  return (
    <>
      <path d="M32 33c-8 0-12 6-12 12 0 6 5 10 12 10s12-4 12-10c0-6-4-12-12-12z" fill={`url(#${id}-belly)`} />
      <g fill="none" stroke="#8d6f52" strokeWidth="1.1" strokeLinecap="round" opacity=".85">
        <path d="M25.5 40.5l1.2 1.4 1.2-1.4M30.8 39l1.2 1.4 1.2-1.4M36.1 40.5l1.2 1.4 1.2-1.4" />
        <path d="M23.8 45.5l1.2 1.4 1.2-1.4M28.6 44.5l1.2 1.4 1.2-1.4M33.4 44.5l1.2 1.4 1.2-1.4M38.2 45.5l1.2 1.4 1.2-1.4" />
        <path d="M27 50l1.2 1.3 1.2-1.3M32 50.6l1.2 1.3 1.2-1.3" />
      </g>
    </>
  )
}

/** The face: heart-shaped disc, brows, eyes (or closed lids) and a hooked beak. */
function Face({ id, awake, pupilsRef }: { id: string; awake: boolean; pupilsRef?: React.Ref<SVGGElement> }) {
  return (
    <>
      <path
        d="M32 34c-5 4-17 4-18-6-1-9 8-12 13-10 2 1 4 2 5 3 1-1 3-2 5-3 5-2 14 1 13 10-1 10-13 10-18 6z"
        fill={`url(#${id}-disc)`}
        stroke={C.ruff}
        strokeWidth="1.1"
      />
      {awake ? (
        <g className="owl-eyes">
          <circle cx="24" cy="26.5" r="6.2" fill={C.claw} />
          <circle cx="40" cy="26.5" r="6.2" fill={C.claw} />
          <circle cx="24" cy="26.5" r="5.4" fill={`url(#${id}-iris)`} />
          <circle cx="40" cy="26.5" r="5.4" fill={`url(#${id}-iris)`} />
          <g ref={pupilsRef} className="owl-pupils">
            <circle cx="24" cy="26.5" r="2.9" fill="#120c08" />
            <circle cx="40" cy="26.5" r="2.9" fill="#120c08" />
            <circle cx="25.1" cy="25.2" r="1.05" fill="#fff" />
            <circle cx="41.1" cy="25.2" r="1.05" fill="#fff" />
          </g>
        </g>
      ) : (
        <g>
          <path d="M18 26.5q6 4.4 12 0q-6-3.2-12 0z" fill="#c9ad87" />
          <path d="M34 26.5q6 4.4 12 0q-6-3.2-12 0z" fill="#c9ad87" />
          <g fill="none" stroke={C.ruff} strokeWidth="1.5" strokeLinecap="round">
            <path d="M18.4 26.8q5.6 3.8 11.2 0" />
            <path d="M34.4 26.8q5.6 3.8 11.2 0" />
          </g>
        </g>
      )}
      {/* brows: the V that gives an owl its look */}
      <g fill="none" stroke={C.dark} strokeWidth="1.5" strokeLinecap="round">
        <path d="M17.5 21.5q6-4.2 13 .6" />
        <path d="M46.5 21.5q-6-4.2-13 .6" />
      </g>
      <path d="M30.3 29.6q1.7-1 3.4 0l-1 4.6q-.7 1.4-1.4 0z" fill={C.beak} stroke="#8a5a1a" strokeWidth=".5" />
    </>
  )
}

/** Feathered tufts and the round body. */
function Body({ id }: { id: string }) {
  return (
    <>
      <path d="M14.5 17C12 11 11.5 7 12.5 3.5c3 2.6 6.2 5.6 8.6 9z" fill={C.wing} />
      <path d="M49.5 17C52 11 52.5 7 51.5 3.5c-3 2.6-6.2 5.6-8.6 9z" fill={C.wing} />
      <path d="M32 8C18 8 11 18 11 31c0 14 8 25 21 25s21-11 21-25C53 18 46 8 32 8z" fill={`url(#${id}-body)`} />
      {/* crown speckles */}
      <g fill={C.bar} opacity=".7">
        <circle cx="26" cy="13" r=".8" />
        <circle cx="31" cy="11.5" r=".8" />
        <circle cx="36.5" cy="12.5" r=".8" />
        <circle cx="29" cy="15.5" r=".6" />
        <circle cx="34.5" cy="15.5" r=".6" />
      </g>
    </>
  )
}

/** A folded wing, with pale bars and scalloped primaries. */
function FoldedWing({ side }: { side: "l" | "r" }) {
  const flip = side === "r" ? "translate(64 0) scale(-1 1)" : undefined
  return (
    <g transform={flip}>
      <g className={`owl-fold owl-fold--${side}`}>
        <path d="M12 29c-3 9-1 19 6 25l1.4-2.4 1 2c.6-9-.6-18-8.4-24.6z" fill={C.wing} />
        <g fill="none" stroke={C.bar} strokeWidth="1" strokeLinecap="round" opacity=".75">
          <path d="M13.5 36.5l3.2 1.4M13.2 41.5l3.8 1.2M14 46.5l3.8.8" />
        </g>
      </g>
    </g>
  )
}

/** Talons gripping the branch. */
function Talons() {
  return (
    <g>
      <g stroke={C.talon} strokeWidth="1.7" strokeLinecap="round" fill="none">
        <path d="M27.5 55.5v3.4M25.4 58.8q2.1-1 4.2 0M36.5 55.5v3.4M34.4 58.8q2.1-1 4.2 0" />
      </g>
      <g fill={C.claw}>
        <circle cx="25.2" cy="59.4" r=".7" />
        <circle cx="29.8" cy="59.4" r=".7" />
        <circle cx="34.2" cy="59.4" r=".7" />
        <circle cx="38.8" cy="59.4" r=".7" />
      </g>
    </g>
  )
}

/** Perched, facing you, wings folded. Pupils and lean are driven from outside. */
function PerchedOwl({
  awake,
  lookRef,
  pupilsRef,
}: {
  awake: boolean
  lookRef: React.Ref<SVGGElement>
  pupilsRef: React.Ref<SVGGElement>
}) {
  const id = "owl" + useId().replace(/:/g, "")
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full overflow-visible" aria-hidden="true">
      <Shading id={id} />
      <g ref={lookRef} className="owl-look">
        <Body id={id} />
        <Chest id={id} />
        <FoldedWing side="l" />
        <FoldedWing side="r" />
        <Face id={id} awake={awake} pupilsRef={pupilsRef} />
      </g>
      <Talons />
    </svg>
  )
}

/** An open wing, for hovering. Drawn as the left wing; mirrored for the right. */
function OpenWing({ side, id }: { side: "l" | "r"; id: string }) {
  const flip = side === "r" ? "translate(64 0) scale(-1 1)" : undefined
  return (
    <g transform={flip}>
      <g className="owl-hwing">
        <path
          d="M14 30C5 19-11 11-30 12c5 3 4 5-3 7 7 1 7 4 0 6 7 1 6 4-1 6 8 1 7 4 1 6 10 0 21 2 34 6z"
          fill={`url(#${id}-wing)`}
        />
        <g fill="none" stroke={C.bar} strokeWidth="1.1" strokeLinecap="round" opacity=".7">
          <path d="M6 22l-3 6M-2 18l-3 7M-10 16l-3 7M-18 15l-2 6" />
        </g>
      </g>
    </g>
  )
}

/** Hovering in front of you, wings beating, talons out for the branch. */
function HoverOwl() {
  const id = "owlh" + useId().replace(/:/g, "")
  return (
    <svg viewBox="-36 -4 136 68" className="h-full w-full overflow-visible" aria-hidden="true">
      <Shading id={id} />
      <OpenWing side="l" id={id} />
      <OpenWing side="r" id={id} />
      <Body id={id} />
      <Chest id={id} />
      <Face id={id} awake />
      <g className="owl-reach">
        <Talons />
      </g>
    </svg>
  )
}

/** In flight, side on, facing left. Mirrored to fly right. */
function FlyingOwl() {
  const id = "owlf" + useId().replace(/:/g, "")
  return (
    <svg viewBox="0 0 100 70" className="h-full w-full overflow-visible" aria-hidden="true">
      <Shading id={id} />
      {/* far wing */}
      <path className="owl-wing owl-wing--far" d="M50 32C54 10 72 2 90 4c-8 6-12 11-14 18 5 1 8 3 10 6-12 1-24 4-36 4z" fill="#4a3628" />
      {/* tail, barred */}
      <path d="M74 38l20-6-3 8 3 7-20-3z" fill={C.wing} />
      <path d="M80 37.5l1 6M86 35.5l1 9" stroke={C.bar} strokeWidth="1" opacity=".6" />
      {/* body */}
      <path d="M30 36c4-10 22-14 38-10 9 2 11 9 8 15-4 8-18 12-32 10-10-1-16-7-14-15z" fill={`url(#${id}-body)`} />
      <path d="M34 42c8 7 24 8 36 2-6 7-20 9-30 6-4-1-6-4-6-8z" fill={`url(#${id}-belly)`} />
      <path d="M44 46.5l1.2 1.3 1.2-1.3M52 47.5l1.2 1.3 1.2-1.3M60 46.5l1.2 1.3 1.2-1.3" fill="none" stroke="#8d6f52" strokeWidth="1" />
      {/* feet: tucked in flight, swung down for landing */}
      <g className="owl-feet">
        <path d="M50 51l6 3M56 50l6 3" stroke={C.talon} strokeWidth="2" strokeLinecap="round" />
      </g>
      {/* head */}
      <path d="M37.5 17.5C38 13 39.5 10 41.5 8c1 3.5 1.6 6.6 1.6 10z" fill={C.wing} />
      <circle cx="32" cy="29" r="14" fill={`url(#${id}-body)`} />
      <path d="M33 30c0 7-5 11-10 10-5-1-7-6-6-11 1-6 6-9 10-8 4 1 6 4 6 9z" fill={`url(#${id}-disc)`} stroke={C.ruff} strokeWidth="1" />
      <circle cx="24.5" cy="28.5" r="5" fill={C.claw} />
      <circle cx="24.5" cy="28.5" r="4.3" fill={`url(#${id}-iris)`} />
      <circle cx="23.4" cy="28.8" r="2.3" fill="#120c08" />
      <circle cx="22.8" cy="27.6" r=".9" fill="#fff" />
      <path d="M18.5 24.2q5-3 10.5 1" fill="none" stroke={C.dark} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M19 31.5l-4 2.6 3.6 3q.8-2.6.4-5.6z" fill={C.beak} />
      {/* near wing, barred */}
      <g className="owl-wing owl-wing--near">
        <path d="M46 32C50 8 70-2 92 0c-9 6-13 12-15 20 6 1 9 3 11 7-14 2-28 5-42 5z" fill={`url(#${id}-wing)`} />
        <path d="M60 18l5 6M70 11l5 7M80 6l4 7" stroke={C.bar} strokeWidth="1.1" strokeLinecap="round" opacity=".7" />
      </g>
    </svg>
  )
}

/** A short branch growing out of the right edge of the screen. */
function Branch() {
  return (
    <svg viewBox="0 0 110 40" className="owl-branch" aria-hidden="true">
      <path d="M110 26C80 24 50 27 6 22" fill="none" stroke="#6b5240" strokeWidth="5" strokeLinecap="round" />
      <path d="M110 25C82 23 52 26 10 21" fill="none" stroke="#8a6c55" strokeWidth="1.2" strokeLinecap="round" opacity=".6" />
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
/* talons sit on the top of the branch */
.owl-perch {
  position: absolute; right: 38px; bottom: 14px; width: 46px; height: 46px;
  pointer-events: auto; cursor: pointer; border-radius: 12px; -webkit-tap-highlight-color: transparent;
}
.owl-perch:focus-visible { outline: 2px solid var(--ink); outline-offset: 4px; }
.owl-perch > svg { transition: transform .4s cubic-bezier(.34, 1.4, .5, 1); transform-origin: 50% 100%; }
.owl-perch:hover > svg { transform: scale(1.06); }
.owl-perch[data-asleep] > svg { animation: owl-breathe 3.6s ease-in-out infinite; }
@keyframes owl-breathe { 50% { transform: scale(1.035, .97); } }

/* crouch before take-off; settle and fold the wings after landing */
.owl-perch[data-crouch] > svg { animation: owl-crouch .22s ease-in forwards; }
@keyframes owl-crouch { to { transform: translateY(2px) scale(1.1, .84); } }
.owl-perch[data-landed] > svg { animation: owl-settle .7s cubic-bezier(.3, 1.2, .5, 1); }
@keyframes owl-settle {
  0% { transform: none; }
  30% { transform: translateY(1px) scale(1.07, .9); }
  60% { transform: scale(.98, 1.02); }
  100% { transform: none; }
}
.owl-fold { transform-box: fill-box; transform-origin: 35% 0; } /* the shoulder, in the wing's own (possibly mirrored) space */
.owl-perch[data-landed] .owl-fold { animation: owl-fold .75s cubic-bezier(.3, 1.2, .5, 1); }
@keyframes owl-fold { from { transform: rotate(80deg) scaleY(1.3); } 55% { transform: rotate(-6deg); } }

/* watching the cursor */
.owl-look { transform-box: view-box; transform-origin: 32px 56px; transition: transform .22s cubic-bezier(.2, .8, .3, 1); }
.owl-pupils { transition: transform .05s linear; }
.owl-eyes { transform-box: fill-box; transform-origin: center; animation: owl-blink 4.5s infinite; }
@keyframes owl-blink { 0%, 92%, 100% { transform: scaleY(1); } 95% { transform: scaleY(.1); } }

.owl-z { position: absolute; left: -2px; top: -4px; font: italic 600 12px/1 ui-serif, Georgia, serif; color: var(--ink-4); pointer-events: none; opacity: 0; animation: owl-z 3s ease-out infinite; }
.owl-z:nth-of-type(2) { animation-delay: 1s; font-size: 10px; }
.owl-z:nth-of-type(3) { animation-delay: 2s; font-size: 8px; }
@keyframes owl-z { 0% { opacity: 0; translate: 0 0; } 20% { opacity: 1; } 100% { opacity: 0; translate: -12px -18px; } }

/* in flight: side-on, then turned to face you for the hover */
.owl-sky { position: fixed; inset: 0; z-index: 60; pointer-events: none; view-transition-name: owl-sky; }
.owl-flyer { position: absolute; left: -55px; top: -38.5px; width: 110px; height: 77px; will-change: transform; }
.owl-side { position: absolute; inset: 0; }
/* sized so the body matches the perched owl exactly (46px per 64 units) */
.owl-front { position: absolute; left: 6.1px; top: 12.6px; width: 97.75px; height: 48.875px; transform: scaleX(0); opacity: 0; }
.owl-flyer[data-pose="front"] .owl-side { display: none; }
.owl-flyer[data-pose="front"] .owl-front { opacity: 1; animation: owl-face .2s ease-out forwards; }
@keyframes owl-face { from { transform: scaleX(0); } to { transform: scaleX(1); } }

.owl-wing { transform-box: view-box; animation: owl-flap .3s ease-in-out infinite alternate; }
.owl-wing--near { transform-origin: 48px 32px; }
.owl-wing--far { transform-origin: 52px 32px; animation-delay: -.04s; }
@keyframes owl-flap { from { transform: rotate(-4deg) scaleY(1); } to { transform: rotate(6deg) scaleY(-.75); } }
/* braking: quick, deep beats, feet swung down */
.owl-flyer[data-flare] .owl-wing { animation-duration: .13s; }
.owl-feet { transform-box: view-box; transform-origin: 52px 50px; transition: transform .3s ease-out; }
.owl-flyer[data-flare] .owl-feet { transform: rotate(55deg) translate(-2px, 2px); }
/* hovering: big round strokes, talons reaching for the branch */
.owl-hwing { transform-box: fill-box; transform-origin: 100% 61%; animation: owl-hflap .2s ease-in-out infinite alternate; }
@keyframes owl-hflap { from { transform: rotate(30deg) scaleY(1); } to { transform: rotate(-26deg) scaleY(.8); } }
.owl-reach { transform-box: view-box; transform-origin: 32px 55px; transform: translateY(1.5px) scaleY(1.15); }

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
  .owl-perch > svg, .owl-eyes, .owl-z, .owl-fold { animation: none !important; }
}
`

export function OwlSwitch() {
  const isDark = useIsDark()
  const [awake, setAwake] = useState(isDark)
  const [flying, setFlying] = useState(false)
  const [crouch, setCrouch] = useState(false)
  const [landed, setLanded] = useState(false)
  const busy = useRef(false)
  const perchRef = useRef<HTMLButtonElement>(null)
  const flyerRef = useRef<HTMLDivElement>(null)
  const lookRef = useRef<SVGGElement>(null)
  const pupilsRef = useRef<SVGGElement>(null)

  // ---- awake on the branch, the owl watches the cursor ---------------------
  useEffect(() => {
    if (!awake || flying) return
    let idle = 0
    const look = (x: number, y: number) => {
      const r = perchRef.current?.getBoundingClientRect()
      if (!r) return
      const dx = x - (r.left + r.width / 2)
      const dy = y - (r.top + r.height * 0.45)
      const d = Math.hypot(dx, dy) || 1
      const reach = Math.min(1, d / 90) // close in: the eyes barely move; far off: as far as they go
      const ex = (dx / d) * 2.2 * reach
      const ey = (dy / d) * 2 * reach
      if (pupilsRef.current) pupilsRef.current.style.transform = `translate(${ex}px, ${ey}px)`
      // lean the head a touch towards where it's looking
      if (lookRef.current) lookRef.current.style.transform = `rotate(${clamp(dx / 60, -7, 7)}deg)`
    }
    const center = () => {
      if (pupilsRef.current) pupilsRef.current.style.transform = ""
      if (lookRef.current) lookRef.current.style.transform = ""
    }
    // with no cursor about (touch screens, or a still mouse) it looks around on its own
    const wander = () => {
      const r = perchRef.current?.getBoundingClientRect()
      if (!r) return
      const a = Math.PI * (0.45 + Math.random() * 0.75) // somewhere below and to the left
      const d = 120 + Math.random() * 300
      look(r.left + Math.cos(a) * d, r.top + Math.sin(a) * d)
    }
    let timer = window.setInterval(wander, 2600)
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      look(e.clientX, e.clientY)
      window.clearInterval(timer)
      window.clearTimeout(idle)
      idle = window.setTimeout(() => {
        center()
        timer = window.setInterval(wander, 2600)
      }, 4000)
    }
    window.addEventListener("pointermove", onMove)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.clearInterval(timer)
      window.clearTimeout(idle)
    }
  }, [awake, flying])

  const fly = async () => {
    const r = perchRef.current!.getBoundingClientRect()
    const perch = { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    const W = window.innerWidth
    const H = window.innerHeight
    const path = flight(perch, W, H)
    const html = document.documentElement
    // night spreads from the owl through a soft mask; that needs view transitions
    // and animatable custom properties, otherwise the page simply switches mid-flight
    const canSpread = "startViewTransition" in document && typeof CSS !== "undefined" && "registerProperty" in CSS

    // side-on pose at a point on the path, facing the way it is flying
    const side = (p: Pt, prev: Pt, facingLeft: boolean, scale: number, pitch?: number, turn = 1) => {
      const dx = p.x - prev.x
      const dy = p.y - prev.y
      const bank = pitch ?? clamp(((Math.atan2(dy, Math.abs(dx) || 1) * 180) / Math.PI) * 0.5, -22, 22)
      return `translate(${p.x}px, ${p.y}px) rotate(${facingLeft ? -bank : bank}deg) scale(${scale}) scaleX(${(facingLeft ? 1 : -1) * turn})`
    }
    // facing you: the drawing is already at perched size
    const front = (p: Pt) => `translate(${p.x}px, ${p.y}px)`

    const frames: Keyframe[] = []
    const segment = (
      at: (u: number) => Pt,
      from: number,
      to: number,
      shape: (u: number, p: Pt, prev: Pt) => string,
    ) => {
      const steps = Math.max(2, Math.round(((to - from) * FLIGHT_MS) / FRAME_MS))
      let prev = at(0)
      for (let i = 0; i <= steps; i++) {
        const u = i / steps
        const p = at(u)
        frames.push({ transform: shape(u, p, i ? prev : at(0.002)), offset: from + u * (to - from) })
        prev = p
      }
    }
    // out, low and fast, growing as it leaves the branch
    segment(path.out, 0, OUT_END, (u, p, prev) => side(p, prev, true, 0.45 + 0.55 * clamp(u / 0.15, 0, 1)))
    // home: a long glide…
    segment(path.glide, BACK_START, FLARE_START, (_, p, prev) => side(p, prev, false, 1))
    // …a flare up to just above the branch: nose up, shrinking, turning to face you…
    segment(path.flare, FLARE_START, HOVER_START, (u, p) =>
      side(p, p, false, 1 - 0.35 * u, -8 - 24 * u, 1 - clamp((u - 0.7) / 0.3, 0, 1)),
    )
    // …a hover on beating wings…
    segment(path.hover, HOVER_START, DROP_START, (_, p) => front(p))
    // …and a gentle drop onto the branch
    segment(path.drop, DROP_START, 1, (_, p) => front(p))

    // fade the folders' glass over to a frost that survives the snapshot
    if (canSpread) frostOn()

    // wake up, crouch, then take off
    setAwake(true)
    await wait(Math.max(260, FROST_FADE_MS - 200))
    setCrouch(true)
    await wait(220)

    const takeOff = (dark: boolean) => {
      flushSync(() => {
        setCrouch(false)
        setFlying(true)
        if (dark) setDark(true)
      })
      flyerRef.current!.style.transform = frames[0].transform as string
    }

    let transition: ViewTransition | null = null
    if (canSpread) {
      html.classList.add("owl-night")
      transition = document.startViewTransition(() => takeOff(true))
      await transition.ready.catch(() => {})
    } else {
      takeOff(false) // without the ink, night simply falls half-way across
      setTimeout(() => setDark(true), FLIGHT_MS * OUT_END * 0.5)
    }

    const anim = flyerRef.current!.animate(frames, { duration: FLIGHT_MS, fill: "forwards" })
    const cues = [
      setTimeout(() => flyerRef.current?.setAttribute("data-flare", ""), FLIGHT_MS * (FLARE_START - 0.02)),
      setTimeout(() => flyerRef.current?.setAttribute("data-pose", "front"), FLIGHT_MS * HOVER_START),
    ]

    if (transition) {
      const reach = Math.hypot(W + 200, H + 200)
      const ink: Keyframe[] = []
      const steps = Math.round((OUT_END * FLIGHT_MS) / FRAME_MS)
      for (let i = 0; i <= steps; i++) {
        const u = i / steps
        const p = path.out(u)
        ink.push({ "--owl-x": `${p.x}px`, "--owl-y": `${p.y}px`, "--owl-r": `${reach * u ** 1.4 - FEATHER * (1 - u)}px` })
      }
      html.animate(ink, { duration: FLIGHT_MS * OUT_END, pseudoElement: "::view-transition-new(root)", fill: "forwards" })
      transition.finished.finally(() => html.classList.remove("owl-night"))
    }

    await anim.finished
    cues.forEach(clearTimeout)
    if (canSpread) setTimeout(frostOff, 900) // after the landing has settled
    flushSync(() => {
      setFlying(false)
      setLanded(true)
    })
    setTimeout(() => setLanded(false), 800) // the settle plays on; the owl can be tapped again now
  }

  const sleep = async () => {
    const html = document.documentElement
    const canTransition = "startViewTransition" in document
    if (canTransition) frostOn()
    setAwake(false)
    await wait(FROST_FADE_MS)
    if (canTransition) {
      html.classList.add("owl-day")
      const t = document.startViewTransition(() => flushSync(() => setDark(false)))
      t.finished.finally(() => html.classList.remove("owl-day"))
      // the sun starts turning back once the page has switched; restore the glass after it has
      t.finished.catch(() => {}).then(() => wait(SKY_BLEND_MS + 150)).then(frostOff)
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
          data-crouch={crouch || undefined}
          data-landed={landed || undefined}
          aria-label={isDark ? "Switch to light mode (the owl goes to sleep)" : "Switch to dark mode (wake the owl)"}
          title={isDark ? "Let the owl sleep" : "Wake the owl"}
          style={{ visibility: flying ? "hidden" : undefined }}
        >
          <PerchedOwl awake={awake} lookRef={lookRef} pupilsRef={pupilsRef} />
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
            <div className="owl-side">
              <FlyingOwl />
            </div>
            <div className="owl-front">
              <HoverOwl />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
