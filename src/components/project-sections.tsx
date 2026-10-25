import { useEffect, useRef, useState } from "react"
import { ProjectGallery } from "@/components/project-gallery"
import type { Project } from "@/content"

type Section = NonNullable<Project["sections"]>[number]

/**
 * A project told in chapters. A sticky menu jumps between them and follows the
 * scroll; chapters that share a `group` (the looks) sit under one heading.
 */
export function ProjectSections({ sections, title }: { sections: Section[]; title: string }) {
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

  // keep the active chip visible in the menu
  useEffect(() => {
    const chip = nav.current?.children[active] as HTMLElement | undefined
    chip?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" })
  }, [active])

  const jump = (i: number) => {
    const el = refs.current[i]
    const scroller = el?.closest(".overflow-y-auto")
    if (!el || !scroller) return
    const top = () => el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 70
    scroller.scrollTo({ top: top(), behavior: "smooth" })
    // settle exactly on it once the smooth scroll has finished
    window.setTimeout(() => scroller.scrollTo({ top: top() }), 700)
  }

  // number the chapters: each group counts as one
  let n = 0
  const numbers = sections.map((s, i) => (i > 0 && s.group && s.group === sections[i - 1].group ? n : ++n))

  return (
    <div className="mt-14">
      <div className="sticky top-0 z-10 -mx-4 border-b border-line bg-paper/90 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <div ref={nav} className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
          {sections.map((s, i) => (
            <button
              key={s.title}
              type="button"
              onClick={() => jump(i)}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition ${
                i === active ? "border-ink bg-ink text-paper" : "border-line text-ink-3 hover:text-ink"
              }`}
            >
              {s.nav}
            </button>
          ))}
        </div>
      </div>

      {sections.map((s, i) => {
        const firstOfGroup = s.group && (i === 0 || sections[i - 1].group !== s.group)
        return (
          <section key={s.title} ref={(el) => void (refs.current[i] = el)} className="pt-14">
            {firstOfGroup && (
              <div className="mb-10 flex items-baseline gap-4 border-t border-line pt-14">
                <span className="font-mono text-sm text-ink-4">{String(numbers[i]).padStart(2, "0")}</span>
                <h3 className="font-heading text-4xl sm:text-6xl">{s.group}</h3>
              </div>
            )}
            <header className={`mb-8 ${s.group ? "" : "border-t border-line pt-14"}`}>
              {s.group ? (
                <p className="text-xs uppercase tracking-[0.2em] text-ink-4">{s.nav}</p>
              ) : (
                <span className="font-mono text-sm text-ink-4">{String(numbers[i]).padStart(2, "0")}</span>
              )}
              <h3 className={`mt-2 font-heading ${s.group ? "text-3xl sm:text-4xl" : "text-4xl sm:text-6xl"}`}>{s.title}</h3>
              {s.intro && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-2">{s.intro}</p>}
            </header>
            <ProjectGallery images={s.images} title={`${title} — ${s.title}`} columns={s.columns} />
          </section>
        )
      })}
    </div>
  )
}
