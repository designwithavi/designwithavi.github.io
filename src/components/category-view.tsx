import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import type { Category, Project } from "@/content"
import { Card } from "@/components/tv-browse"

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
      className="dark tv fixed inset-0 z-50 overflow-y-auto bg-paper text-ink"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-30 h-20 bg-gradient-to-b from-paper via-paper/85 to-transparent" />
      <button
        type="button"
        onClick={onBack}
        className="fixed top-4 left-4 z-40 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-xl ring-1 ring-white/10 hover:bg-white/25"
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

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.08 + i * 0.05 }}
            >
              <Card p={p} onOpen={onOpen} fluid />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
