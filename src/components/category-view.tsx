import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import type { Category, Project } from "@/content"

/** A folder, opened: every project in it as a large card. */
export function CategoryView({
  category,
  projects,
  onOpen,
  onBack,
}: {
  category: Category
  projects: Project[]
  onOpen: (p: Project) => void
  onBack: () => void
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto bg-paper"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        type="button"
        onClick={onBack}
        className="fixed top-4 left-4 z-10 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm text-paper hover:opacity-80"
      >
        <ArrowLeft className="h-4 w-4" />
        All work
      </button>

      <div className="mx-auto max-w-6xl px-4 pt-24 pb-24 sm:px-8">
        <header className="mb-12 flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-6">
          <h2 className="font-heading text-5xl leading-none sm:text-7xl">{category.name}</h2>
          <span className="text-sm text-ink-4">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </span>
        </header>

        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <motion.button
              key={p.title}
              type="button"
              onClick={() => onOpen(p)}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.08 + i * 0.05 }}
              className="group text-left"
            >
              <div
                className="aspect-[4/3] overflow-hidden rounded-2xl"
                style={{ backgroundColor: p.color }}
              >
                {p.cover && (
                  <img
                    src={p.cover}
                    alt=""
                    loading={i < 6 ? "eager" : "lazy"}
                    className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                )}
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <h3 className="text-lg font-medium leading-snug text-ink">{p.title}</h3>
                <span className="shrink-0 text-xs text-ink-4">{p.year}</span>
              </div>
              {p.summary && <p className="mt-1 line-clamp-2 text-sm text-ink-3">{p.summary}</p>}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
