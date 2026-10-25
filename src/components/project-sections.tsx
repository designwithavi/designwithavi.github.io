import { useEffect, useRef, useState } from "react"
import { Carousel } from "@/components/carousel"
import { ScrollGrid } from "@/components/scroll-grid"
import type { Project } from "@/content"

type Section = NonNullable<Project["sections"]>[number]
type Chapter = { nav: string; title: string; sections: Section[] }

/**
 * A project told in chapters. A sticky menu jumps between them and follows the
 * scroll. Sections that share a `group` (the looks) become one chapter shown as
 * vertical tabs; the rest are a heading, an intro and their images.
 */
export function ProjectSections({ sections, title }: { sections: Section[]; title: string }) {
  const chapters: Chapter[] = []
  for (const s of sections) {
    const last = chapters[chapters.length - 1]
    if (s.group && last?.title === s.group) last.sections.push(s)
    else chapters.push({ nav: s.group ? s.group.split(" ")[0] === "Look" ? "Looks" : s.group : s.nav, title: s.group ?? s.title, sections: [s] })
  }

  const refs = useRef<(HTMLElement | null)[]>([])
  const nav = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  // highlight the chapter in view
  useEffect(() => {
    const root = refs.current[0]?.closest(".overflow-y-auto") ?? null
    const io = new IntersectionObserver(
      (es) => {
        const seen = es.filter((e) => e.isIntersecting).map((e) => refs.current.indexOf(e.target as HTMLElement))
        if (seen.length) setActive(Math.min(...seen))
      },
      { root, rootMargin: "-20% 0px -70% 0px" },
    )
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [sections])

  const jump = (i: number) => {
    const el = refs.current[i]
    const scroller = el?.closest(".overflow-y-auto")
    if (!el || !scroller) return
    const top = () => el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 70
    scroller.scrollTo({ top: top(), behavior: "smooth" })
    // settle exactly on it once the smooth scroll has finished
    window.setTimeout(() => scroller.scrollTo({ top: top() }), 700)
  }

  return (
    <div className="mt-14">
      <div className="sticky top-0 z-30 -mx-4 border-b border-line bg-paper/90 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <div ref={nav} className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
          {chapters.map((c, i) => (
            <button
              key={c.title}
              type="button"
              onClick={() => jump(i)}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition ${
                i === active ? "border-ink bg-ink text-paper" : "border-line text-ink-3 hover:text-ink"
              }`}
            >
              <span className="mr-1.5 font-mono text-[11px] opacity-60">{String(i + 1).padStart(2, "0")}</span>
              {c.nav}
            </button>
          ))}
        </div>
      </div>

      {chapters.map((c, i) => {
        const num = String(i + 1).padStart(2, "0")
        const grouped = c.sections.length > 1
        return (
          <section key={c.title} ref={(el) => void (refs.current[i] = el)} className="mt-16 border-t border-line pt-14 first:mt-0 first:border-0">
            <header className="mb-8">
              <span className="font-mono text-sm text-ink-4">{num}</span>
              <h3 className="mt-2 font-heading text-4xl sm:text-6xl">{c.title}</h3>
              {!grouped && c.sections[0].intro && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-2">{c.sections[0].intro}</p>}
            </header>
            {grouped ? (
              <div className="space-y-16">
                {c.sections.map((s, k) => (
                  <div key={s.title}>
                    <div className="mb-6 grid gap-3 md:grid-cols-[auto_1fr] md:items-baseline md:gap-8">
                      <h4 className="flex items-baseline gap-3 font-heading text-3xl sm:text-4xl">
                        <span className="font-mono text-xs text-ink-4">/{String(k + 1).padStart(2, "0")}</span>
                        {s.title}
                      </h4>
                      {s.intro && <p className="max-w-xl text-ink-3 md:justify-self-end md:text-right">{s.intro}</p>}
                    </div>
                    <Carousel images={s.images} title={`${title} — ${s.title}`} />
                  </div>
                ))}
              </div>
            ) : c.sections[0].layout === "scroll-grid" ? (
              <ScrollGrid images={c.sections[0].images} title={`${title} — ${c.title}`} />
            ) : (
              <Carousel images={c.sections[0].images} title={`${title} — ${c.title}`} />
            )}
          </section>
        )
      })}
    </div>
  )
}
