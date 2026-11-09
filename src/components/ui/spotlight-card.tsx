import React, { useEffect, useRef, type ReactNode } from "react"

/**
 * Spotlight (glow) card — adapted from 21st.dev.
 *
 * A soft spotlight that follows the pointer, lighting the card's border and,
 * faintly, its face. Changes from the original: the light is placed in the
 * card's own coordinates rather than the window's (the original used
 * `background-attachment: fixed`, which breaks inside 3D-rotated parents), the
 * hue can be any number, and with no pointer about (phones) the light slowly
 * travels around the edge on its own.
 */

interface GlowCardProps {
  children: ReactNode
  className?: string
  /** colour of the light, as a hue 0–360 */
  hue?: number
  /** how far the hue shifts across the card */
  spread?: number
  style?: React.CSSProperties
}

const CSS = `
@property --gx { syntax: "<number>"; inherits: true; initial-value: 0; }
@property --gy { syntax: "<number>"; inherits: true; initial-value: 0; }
[data-glow-card] {
  --border: 2px;
  --spot: 240px;
  --radius: 16px;
  --h: calc(var(--hue) + (var(--gx) / 400 * var(--spread)));
  position: relative;
  border-radius: var(--radius);
  animation: glow-orbit 9s linear infinite;
}
[data-glow-card][data-follow] { animation: none; }
/* the edge: a ring the exact shape of the card (rounded corners and all) —
   a faint even line in the project's colour, brighter where the light is */
[data-glow-card]::before {
  pointer-events: none;
  content: "";
  position: absolute;
  border-radius: inherit;
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
}
[data-glow-card]::before {
  inset: 0;
  padding: var(--border);
  z-index: 2;
  background:
    radial-gradient(calc(var(--spot) * .55) calc(var(--spot) * .55) at calc(var(--gx) * 1px) calc(var(--gy) * 1px), hsl(0 0% 100% / .95), transparent 100%),
    radial-gradient(var(--spot) var(--spot) at calc(var(--gx) * 1px) calc(var(--gy) * 1px), hsl(var(--h) 100% 62%), transparent 100%),
    hsl(var(--hue) 70% 70% / .22);
}
/* the card's content sits below the lit edge */
[data-glow-card] > * { position: relative; z-index: 1; }
/* with no pointer: the light walks the edge — top, right, bottom, left */
@keyframes glow-orbit {
  0%   { --gx: 0;   --gy: 0; }
  25%  { --gx: var(--w); --gy: 0; }
  50%  { --gx: var(--w); --gy: var(--hgt); }
  75%  { --gx: 0;   --gy: var(--hgt); }
  100% { --gx: 0;   --gy: 0; }
}
@media (prefers-reduced-motion: reduce) { [data-glow-card] { animation: none; --gx: 0; --gy: 0; } }
`

export function GlowCard({ children, className = "", hue = 30, spread = 120, style }: GlowCardProps) {
  const card = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = card.current
    if (!el) return
    // the edge path the light orbits along
    const size = () => {
      el.style.setProperty("--w", String(el.offsetWidth))
      el.style.setProperty("--hgt", String(el.offsetHeight))
    }
    size()
    const ro = new ResizeObserver(size)
    ro.observe(el)
    // follow the pointer, in the card's own (unrotated) coordinates
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      const r = el.getBoundingClientRect()
      if (!r.width) return
      const sx = el.offsetWidth / r.width
      const sy = el.offsetHeight / r.height
      el.style.setProperty("--gx", ((e.clientX - r.left) * sx).toFixed(1))
      el.style.setProperty("--gy", ((e.clientY - r.top) * sy).toFixed(1))
      el.setAttribute("data-follow", "")
    }
    document.addEventListener("pointermove", move)
    return () => {
      ro.disconnect()
      document.removeEventListener("pointermove", move)
    }
  }, [])

  return (
    <>
      <style>{CSS}</style>
      <div ref={card} data-glow-card className={className} style={{ ["--hue" as string]: hue, ["--spread" as string]: spread, ...style }}>
        {children}
      </div>
    </>
  )
}
