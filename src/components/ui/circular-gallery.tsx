import React from "react"

/**
 * Circular Gallery — adapted from 21st.dev.
 *
 * Cards stand in a ring at `rotation` degrees. Changes from the original: the
 * ring is controlled from outside (the original span with the page scroll and
 * on its own), so its owner decides what turns it; the card facing you is fully
 * lit and clickable, the ones around the back fade, and their backs are hidden.
 */

interface CircularGalleryProps<T> {
  items: T[]
  render: (item: T, front: boolean) => React.ReactNode
  /** degrees the ring is turned */
  rotation: number
  /** px from the centre to the cards */
  radius: number
  cardW: number
  cardH: number
  keyOf: (item: T) => string
}

export function CircularGallery<T>({ items, render, rotation, radius, cardW, cardH, keyOf }: CircularGalleryProps<T>) {
  const per = 360 / items.length
  // which card is closest to facing us
  const facing = ((Math.round(-rotation / per) % items.length) + items.length) % items.length

  return (
    <div className="relative h-full w-full" style={{ perspective: "1800px" }}>
      <div className="absolute inset-0" style={{ transform: `translateZ(${-radius}px) rotateY(${rotation}deg)`, transformStyle: "preserve-3d" }}>
        {items.map((item, i) => {
          const angle = i * per
          const rel = (((angle + rotation) % 360) + 360) % 360
          const off = rel > 180 ? 360 - rel : rel // 0 = facing us
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
                pointerEvents: off < 20 ? "auto" : "none",
                zIndex: Math.round(180 - off),
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              {render(item, i === facing)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
