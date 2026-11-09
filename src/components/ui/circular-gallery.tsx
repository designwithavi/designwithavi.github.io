import React, { useState } from "react"
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion"

/**
 * Circular Gallery — adapted from 21st.dev.
 *
 * Cards stand in a ring turned by `rotation` (degrees, a motion value). Changes
 * from the original: the ring is driven from outside (the original span with
 * the page scroll and on its own), and it moves on the compositor without
 * re-rendering React each frame; the card facing you is fully lit and
 * clickable, the ones around the back fade, and their backs are hidden.
 */

interface CircularGalleryProps<T> {
  items: T[]
  render: (item: T, front: boolean) => React.ReactNode
  rotation: MotionValue<number>
  /** px from the centre to the cards */
  radius: number
  cardW: number
  cardH: number
  keyOf: (item: T) => string
}

function Slot({ angle, rotation, radius, cardW, cardH, children }: { angle: number; rotation: MotionValue<number>; radius: number; cardW: number; cardH: number; children: React.ReactNode }) {
  // how far this card is from facing us, 0–180°
  const off = useTransform(rotation, (r) => {
    const rel = (((angle + r) % 360) + 360) % 360
    return rel > 180 ? 360 - rel : rel
  })
  const opacity = useTransform(off, (o) => Math.max(0.18, 1 - o / 140))
  const zIndex = useTransform(off, (o) => Math.round(180 - o))
  const pointerEvents = useTransform(off, (o) => (o < 20 ? "auto" : "none"))
  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{
        width: cardW,
        height: cardH,
        marginLeft: -cardW / 2,
        marginTop: -cardH / 2,
        transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
        opacity,
        zIndex,
        pointerEvents,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      {children}
    </motion.div>
  )
}

export function CircularGallery<T>({ items, render, rotation, radius, cardW, cardH, keyOf }: CircularGalleryProps<T>) {
  const per = 360 / items.length
  const facingOf = (r: number) => ((Math.round(-r / per) % items.length) + items.length) % items.length
  const [facing, setFacing] = useState(() => facingOf(rotation.get()))
  useMotionValueEvent(rotation, "change", (r) => {
    const f = facingOf(r)
    if (f !== facing) setFacing(f)
  })
  const ring = useTransform(rotation, (r) => `translateZ(${-radius}px) rotateY(${r}deg)`)

  return (
    <div className="relative h-full w-full" style={{ perspective: "1800px" }}>
      <motion.div className="absolute inset-0" style={{ transform: ring, transformStyle: "preserve-3d" }}>
        {items.map((item, i) => (
          <Slot key={keyOf(item)} angle={i * per} rotation={rotation} radius={radius} cardW={cardW} cardH={cardH}>
            {render(item, i === facing)}
          </Slot>
        ))}
      </motion.div>
    </div>
  )
}
