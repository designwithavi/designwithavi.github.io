import React, { useEffect, useRef, useState } from "react"
import { useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion"

/**
 * Circular Gallery — adapted from 21st.dev.
 *
 * Cards stand in a ring and the ring turns with the scroll through its own
 * (pinned) section — forward going down, back going up — and by dragging. It
 * can also drift on its own (autoRotateSpeed > 0). The card facing you is fully
 * lit and clickable; the ones around the back fade.
 */

interface CircularGalleryProps<T> {
  items: T[]
  render: (item: T, front: boolean) => React.ReactNode
  /** px from the centre to the cards */
  radius: number
  cardW: number
  cardH: number
  /** degrees per frame when idle */
  autoRotateSpeed?: number
  /** the section whose scroll turns the ring */
  scrollTarget: React.RefObject<HTMLElement | null>
  /** scroll offsets for that section (framer-motion useScroll); default: while it passes through the screen */
  scrollOffset?: [string, string]
  /** how far one full scroll through the section turns the ring, in degrees */
  scrollTurn?: number
  /** settle on each card: hold it facing you for part of the scroll, then turn to the next */
  snap?: boolean
  keyOf: (item: T) => string
}

export function CircularGallery<T>({ items, render, radius, cardW, cardH, autoRotateSpeed = 0, scrollTarget, scrollOffset = ["start end", "end start"], scrollTurn = 360, snap = false, keyOf }: CircularGalleryProps<T>) {
  const reduce = useReducedMotion()
  const [rotation, setRotation] = useState(0)
  const base = useRef(0) // from scrolling
  const extra = useRef(0) // from idling and dragging
  const busyUntil = useRef(0)
  const drag = useRef<{ x: number; start: number } | null>(null)
  const hovering = useRef(false) // a mouse over the ring holds it still, so a card can be clicked

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { scrollYProgress } = useScroll({ target: scrollTarget, offset: scrollOffset as any })
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const steps = items.length - 1
    let t = v
    if (snap && steps > 0) {
      // within each step: hold for the first and last quarter, turn smoothly in between
      const x = v * steps, i = Math.min(steps - 1, Math.floor(x)), f = x - i
      const u = Math.min(1, Math.max(0, (f - 0.25) / 0.5))
      t = (i + u * u * (3 - 2 * u)) / steps
    }
    base.current = -t * scrollTurn
    busyUntil.current = performance.now() + 200
    setRotation(base.current + extra.current)
  })

  useEffect(() => {
    if (reduce || !autoRotateSpeed) return
    let raf = 0
    const tick = (now: number) => {
      if (now > busyUntil.current && !drag.current && !hovering.current) {
        extra.current -= autoRotateSpeed
        setRotation(base.current + extra.current)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [autoRotateSpeed, reduce])

  const per = 360 / items.length
  // which card is closest to facing us
  const facing = (((Math.round(-rotation / per) % items.length) + items.length) % items.length)

  return (
    <div
      className="relative h-full w-full touch-pan-y select-none"
      style={{ perspective: "1800px" }}
      onPointerEnter={(e) => e.pointerType === "mouse" && (hovering.current = true)}
      onPointerDown={(e) => (drag.current = { x: e.clientX, start: extra.current })}
      onPointerMove={(e) => {
        if (!drag.current) return
        extra.current = drag.current.start + (e.clientX - drag.current.x) * 0.25
        setRotation(base.current + extra.current)
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerLeave={() => ((drag.current = null), (hovering.current = false))}
      onPointerCancel={() => (drag.current = null)}
    >
      <div className="absolute inset-0" style={{ transform: `translateZ(${-radius}px) rotateY(${rotation}deg)`, transformStyle: "preserve-3d" }}>
        {items.map((item, i) => {
          const angle = i * per
          const rel = (((angle + rotation) % 360) + 360) % 360
          const off = rel > 180 ? 360 - rel : rel // 0 = facing us
          const front = i === facing
          return (
            <div
              key={keyOf(item)}
              className="absolute left-1/2 top-1/2"
              style={{
                width: cardW,
                height: cardH,
                marginLeft: -cardW / 2,
                marginTop: -cardH / 2,
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                opacity: Math.max(0.18, 1 - off / 140),
                pointerEvents: off < 40 ? "auto" : "none",
                zIndex: Math.round(180 - off),
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              {render(item, front)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
