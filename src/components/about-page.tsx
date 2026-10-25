import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { AnalyticsBento } from "@/components/ui/analytics-bento"
import { categories, projects, site } from "@/content"
import { slug } from "@/route"

/**
 * The About page: who Avishkar is, then the work by the numbers. Every figure
 * is worked out from content.ts — projects, years, skills, Behance stats — so
 * it stays true as projects are added.
 */

const SKILLS = ["Photography", "Styling", "Props", "Branding", "Typography", "Editorial", "UX", "3D"]

// one colour per folder, picked from its glass-folder swirl
const FOLDER_COLORS: Record<string, { color: string; ink: "dark" | "light" }> = {
  "Visual Merchandising": { color: "#c9a3d6", ink: "dark" },
  "Photography & Videography": { color: "#f2b8a8", ink: "dark" },
  Branding: { color: "#a9cfa4", ink: "dark" },
  "Graphics & Publication Design": { color: "#c3d3e4", ink: "dark" },
  "UX Design": { color: "#2f3d6e", ink: "light" },
  "Product Design": { color: "#6b4e71", ink: "light" },
}

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)
/** "Studio Photography: Buldak Ramen" → "Buldak Ramen", "Shorona: Costume Styling" → "Shorona" */
const short = (title: string) => {
  const [head, tail] = title.split(/:\s*/)
  return tail && /^(Product Advertisement|Studio Photography)$/i.test(head) ? tail : head
}
const fmt = (n: number) => n.toLocaleString("en-US")

function useNumbers() {
  const years = [...new Set(projects.map((p) => +p.year))].sort()
  const imagesOf = (p: (typeof projects)[number]) => (p.cover ? 1 : 0) + p.images.length
  const views = (p: (typeof projects)[number]) => p.stats?.views ?? 0
  const apps = (p: (typeof projects)[number]) => p.stats?.appreciations ?? 0
  const upTo = (y: number) => projects.filter((p) => +p.year <= y)

  const top = [...projects].sort((a, b) => views(b) - views(a))[0]
  const thisYear = years[years.length - 1]

  return {
    years,
    projects: {
      value: projects.length,
      series: years.map((y) => ({ label: `By ${y}`, value: upTo(y).length })),
      newest: projects.filter((p) => +p.year === thisYear).length,
      thisYear,
    },
    views: {
      total: sum(projects.map(views)),
      hands: years.map((y) => sum(projects.filter((p) => +p.year === y && p.medium === "hands").map(views))),
      screen: years.map((y) => sum(projects.filter((p) => +p.year === y && p.medium === "screen").map(views))),
    },
    disciplines: {
      groups: categories.map((c) => ({ id: slug(c.name), name: c.name, ...FOLDER_COLORS[c.name] })),
      items: projects.map((p) => ({ name: short(p.title), group: slug(p.category), values: [views(p), apps(p), imagesOf(p)] })),
      totals: [sum(projects.map(views)), sum(projects.map(apps)), sum(projects.map(imagesOf))],
      rows: categories.map((c) => {
        const ps = projects.filter((p) => p.category === c.name)
        return { label: c.name, values: [String(ps.length), fmt(sum(ps.map(views))), fmt(sum(ps.map(apps)))] }
      }),
    },
    range: years.slice(1).map((y) => {
      const ps = upTo(y)
      return {
        label: String(y),
        values: SKILLS.map((s) => ps.filter((p) => p.skills?.includes(s)).length),
        stats: [
          { label: "Appreciations", value: sum(ps.map(apps)), note: "on Behance" },
          { label: "Team projects", value: ps.filter((p) => p.team).length, note: `of ${ps.length}` },
        ],
        rows: [
          { label: "Disciplines", value: String(new Set(ps.map((p) => p.category)).size) },
          { label: "Skills used", value: String(SKILLS.filter((s) => ps.some((p) => p.skills?.includes(s))).length) },
        ],
      }
    }).reverse(),
    top,
  }
}

export function AboutPage({ onBack }: { onBack: () => void }) {
  const n = useNumbers()
  const ease = [0.22, 1, 0.36, 1] as const
  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto bg-paper"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
    >
      <button
        type="button"
        onClick={onBack}
        className="fixed top-4 left-4 z-10 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm text-paper hover:opacity-80"
      >
        <ArrowLeft className="h-4 w-4" />
        Home
      </button>

      <div className="mx-auto max-w-6xl px-4 pt-24 pb-24 sm:px-8">
        {/* who */}
        <section className="grid items-end gap-10 border-b border-line pb-14 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink-4">About</p>
            <h2 className="mt-3 font-heading text-6xl leading-none sm:text-8xl">{site.name}</h2>
            <p className="mt-3 text-sm uppercase tracking-[0.2em] text-ink-4">{site.role}</p>
            <p className="mt-8 max-w-2xl text-xl leading-relaxed text-ink-2 sm:text-2xl">{site.about}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={site.cvFile}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-ink px-6 py-3 text-sm text-paper transition hover:opacity-80"
              >
                Download CV ↓
              </a>
              <a
                href={`mailto:${site.contact.email}`}
                className="rounded-full border border-line px-6 py-3 text-sm text-ink transition hover:bg-ink hover:text-paper"
              >
                Get in touch
              </a>
            </div>
          </div>
          <img
            src={site.portrait}
            alt={`Portrait of ${site.name}`}
            className="mx-auto w-64 md:w-80"
            style={{ maskImage: "linear-gradient(to bottom, #000 75%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, #000 75%, transparent)" }}
          />
        </section>

        {/* background */}
        <section className="grid gap-10 border-b border-line py-14 sm:grid-cols-2">
          <div>
            <h3 className="mb-5 text-xs uppercase tracking-[0.2em] text-ink-4">Education & Experience</h3>
            <ul className="space-y-5">
              {site.education.map((e) => (
                <li key={e.title} className="flex items-baseline justify-between gap-6 border-t border-line pt-4">
                  <div>
                    <p className="font-medium text-ink">{e.title}</p>
                    <p className="text-sm text-ink-3">{e.detail}</p>
                  </div>
                  <span className="shrink-0 font-mono text-sm text-ink-4">{e.years}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-5 text-xs uppercase tracking-[0.2em] text-ink-4">Skills & Tools</h3>
            <div className="flex flex-wrap gap-2">
              {site.skills.map((s) => (
                <span key={s} className="rounded-full border border-line px-3 py-1 text-sm text-ink-2">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* by the numbers */}
        <section className="pt-14">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
            <h3 className="font-heading text-4xl sm:text-5xl">By the numbers</h3>
            <p className="text-sm text-ink-4">Behance views and appreciations as of 25 Oct 2026 · hover for details</p>
          </div>
          <AnalyticsBento
            currency=""
            credit={false}
            fontFamily="'Figtree Variable', ui-sans-serif, system-ui, sans-serif"
            monoFamily="'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace"
            colors={{
              revenue: ["#f6c453", "#ef8b2b"],
              desktop: ["#ffcf6a", "#ef8b2b"],
              mobile: ["#8fb2ff", "#5b4bd6"],
              radar: "#ef8b2b",
            }}
            revenue={{
              label: "Projects",
              value: n.projects.value,
              seriesLabel: "Projects",
              caption: `${n.years[0]} – ${n.years[n.years.length - 1]}`,
              note: (
                <>
                  across <span className="text-foreground/80">{categories.length} disciplines</span> · {n.projects.newest} in {n.projects.thisYear}
                </>
              ),
              series: n.projects.series,
            }}
            sessions={{
              label: "Views on Behance",
              value: n.views.total,
              note: (
                <>
                  Most viewed: <span className="text-foreground/80">{short(n.top.title)}</span> ({fmt(n.top.stats?.views ?? 0)})
                </>
              ),
              desktop: [n.views.hands],
              mobile: [n.views.screen],
              xLabels: n.years.map((y) => `Projects from ${y}`),
              labels: { desktop: "Made by hand / shot", mobile: "Made on screen", prior: "", current: "" },
            }}
            categories={{
              title: "Work by discipline",
              groups: n.disciplines.groups,
              periods: [
                { label: "Views", total: n.disciplines.totals[0], compare: "on Behance" },
                { label: "Appreciations", total: n.disciplines.totals[1], compare: "on Behance" },
                { label: "Images", total: n.disciplines.totals[2], compare: "in the case studies" },
              ],
              items: n.disciplines.items,
              table: { columns: ["Discipline", "Projects", "Views", "Appreciations"], rows: n.disciplines.rows },
            }}
            seasonality={{
              title: "Range",
              axis: SKILLS,
              valueLabel: "Projects",
              years: n.range,
            }}
          />
        </section>
      </div>
    </motion.div>
  )
}
