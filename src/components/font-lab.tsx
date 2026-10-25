import { useEffect, useState } from "react"

/**
 * Font lab — preview only (never in the published site). Swaps the heading and
 * body typefaces across the whole site so combinations can be compared on the
 * real pages. Remember the pick with the arrows; delete this file once chosen.
 */

const COMBOS = [
  { name: "Current", heading: "Instrument Serif", body: "Figtree", h: "", b: "" },
  { name: "Fashion magazine", heading: "Bodoni Moda", body: "Jost", h: "Bodoni+Moda:opsz,wght@6..96,400..600", b: "Jost:wght@300..600" },
  { name: "Quiet luxury editorial", heading: "Cormorant Garamond", body: "Inter", h: "Cormorant+Garamond:wght@400;500;600", b: "Inter:wght@300..600" },
  { name: "Contemporary studio", heading: "Syne", body: "Manrope", h: "Syne:wght@500..800", b: "Manrope:wght@300..600" },
  { name: "Warm & characterful", heading: "Fraunces", body: "Figtree", h: "Fraunces:opsz,wght@9..144,300..600", b: "" },
  { name: "Playful grotesque", heading: "Bricolage Grotesque", body: "DM Sans", h: "Bricolage+Grotesque:opsz,wght@12..96,400..700", b: "DM+Sans:opsz,wght@9..40,300..600" },
  { name: "Swiss & clean", heading: "Inter Tight", body: "Inter", h: "Inter+Tight:wght@500..800", b: "Inter:wght@300..600" },
  { name: "Archival / literary", heading: "Newsreader", body: "Hanken Grotesk", h: "Newsreader:opsz,wght@6..72,400..600", b: "Hanken+Grotesk:wght@300..600" },
]

// headings set in a sans read better a little heavier and tighter
const SANS_HEADINGS = new Set(["Syne", "Bricolage Grotesque", "Inter Tight"])

export function FontLab() {
  const [i, setI] = useState(() => {
    try {
      return Math.min(COMBOS.length - 1, Number(localStorage.getItem("font-lab")) || 0)
    } catch {
      return 0
    }
  })

  useEffect(() => {
    const families = COMBOS.flatMap((c) => [c.h, c.b]).filter(Boolean)
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = `https://fonts.googleapis.com/css2?${[...new Set(families)].map((f) => `family=${f}`).join("&")}&display=swap`
    document.head.appendChild(link)
    return () => link.remove()
  }, [])

  useEffect(() => {
    const c = COMBOS[i]
    const root = document.documentElement.style
    const body = c.body === "Figtree" ? "'Figtree Variable'" : `"${c.body}"`
    root.setProperty("--heading-family", `"${c.heading}", serif`)
    root.setProperty("--body-family", `${body}, ui-sans-serif, system-ui, sans-serif`)
    const sans = SANS_HEADINGS.has(c.heading)
    root.setProperty("--heading-weight", sans ? "600" : "400")
    root.setProperty("--heading-tracking", sans ? "-0.03em" : "-0.01em")
    try {
      localStorage.setItem("font-lab", String(i))
    } catch {
      /* fine */
    }
  }, [i])

  const c = COMBOS[i]
  const step = (d: number) => setI((x) => (x + d + COMBOS.length) % COMBOS.length)
  return (
    <div className="fixed bottom-4 left-4 z-[90] flex items-center gap-1 rounded-full border border-line bg-paper/95 p-1 pl-4 text-ink shadow-lg backdrop-blur">
      <div className="mr-2 leading-tight">
        <div className="text-[10px] uppercase tracking-[0.15em] text-ink-4">
          Fonts {i + 1}/{COMBOS.length} · {c.name}
        </div>
        <div className="text-xs">
          <span className="font-heading text-base">{c.heading}</span> + {c.body}
        </div>
      </div>
      <button type="button" onClick={() => step(-1)} className="grid size-9 place-items-center rounded-full hover:bg-ink hover:text-paper" aria-label="Previous fonts">
        ←
      </button>
      <button type="button" onClick={() => step(1)} className="grid size-9 place-items-center rounded-full hover:bg-ink hover:text-paper" aria-label="Next fonts">
        →
      </button>
    </div>
  )
}
