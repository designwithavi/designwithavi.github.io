import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react"

/**
 * A clickable prototype (Figma) with a guided tour beside it. Prototypes only
 * work along the paths that were wired up, so instead of letting visitors tap
 * around, each step says what to do and a little phone map shows exactly where
 * to tap. The frame can't tell us what was tapped, so the visitor moves the
 * steps along themselves; "Start over" reloads the prototype at the beginning.
 */

export type GuideStep = {
  title: string
  text: string
  /** where to tap, as fractions across and down the phone screen */
  tap?: [number, number]
  /** what the thing they tap says, shown beside the dot */
  label?: string
}

const ease = [0.22, 1, 0.36, 1] as const

/** A tiny phone with a pulsing dot where to tap. */
function TapMap({ tap, label }: { tap?: [number, number]; label?: string }) {
  return (
    <div className="relative mx-auto aspect-[9/19] w-[92px] shrink-0 rounded-[18px] border-2 border-white/25 bg-white/[.04] sm:w-[104px] lg:w-[128px]">
      <div className="absolute left-1/2 top-1.5 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/30" />
      <div className="absolute inset-x-2.5 top-5 h-[3px] rounded bg-white/15" />
      <div className="absolute inset-x-2.5 top-7 h-[3px] w-1/2 rounded bg-white/10" />
      {tap && (
        <motion.div
          key={`${tap[0]}-${tap[1]}`}
          className="absolute"
          style={{ left: `${tap[0] * 100}%`, top: `${tap[1] * 100}%` }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease }}
        >
          <span className="absolute -left-3 -top-3 size-6 animate-ping rounded-full bg-[#ef8b2b]/60" />
          <span className="absolute -left-2 -top-2 size-4 rounded-full border-2 border-white bg-[#ef8b2b] shadow-[0_0_12px_rgba(239,139,43,.9)]" />
          {label && (
            <span className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-black ${tap[0] > 0.6 ? "right-4" : "left-4"}`}>
              {label}
            </span>
          )}
        </motion.div>
      )}
    </div>
  )
}

export function PrototypeGuide({ src, link, title, label, steps }: { src: string; link?: string; title: string; label: string; steps: GuideStep[] }) {
  const [at, setAt] = useState(0)
  const [run, setRun] = useState(0) // bump to reload the prototype from the start
  const s = steps[at]
  const restart = () => {
    setAt(0)
    setRun((n) => n + 1)
  }
  const btn = "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-30"

  return (
    <section className="mt-12">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h3 className="font-heading text-3xl sm:text-4xl">{label}</h3>
        <a href={link ?? src} target="_blank" rel="noopener noreferrer" className="shrink-0 text-sm text-ink-3 underline underline-offset-4 hover:text-ink">
          Open full screen ↗
        </a>
      </div>
      <p className="mb-6 max-w-2xl text-sm leading-relaxed text-ink-3">
        A working prototype, so not every button is wired up yet. Follow the steps and the orange dot shows exactly where to tap.
      </p>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-stretch">
        {/* the guide */}
        <div className="flex flex-col rounded-2xl border border-line bg-white/[.03] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#ef8b2b]">
              Step {at + 1} of {steps.length}
            </p>
            <button type="button" onClick={restart} className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-3 hover:text-ink">
              <RotateCcw className="h-3.5 w-3.5" /> Start over
            </button>
          </div>
          {/* progress */}
          <div className="mt-3 flex gap-1">
            {steps.map((st, i) => (
              <button
                key={st.title}
                type="button"
                onClick={() => setAt(i)}
                aria-label={`Step ${i + 1}: ${st.title}`}
                className={`h-1 flex-1 rounded-full transition-colors ${i <= at ? "bg-[#ef8b2b]" : "bg-white/15 hover:bg-white/30"}`}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-1 items-start gap-5">
            <TapMap tap={s.tap} label={s.label} />
            <AnimatePresence mode="wait">
              <motion.div key={at} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.3, ease }} className="min-w-0">
                <h4 className="font-heading text-2xl leading-tight sm:text-3xl">{s.title}</h4>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{s.text}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* the whole route at a glance; any step can be jumped to */}
          <ol className="mt-6 hidden gap-x-4 gap-y-1.5 border-t border-line pt-5 text-sm lg:grid lg:grid-cols-2">
            {steps.map((st, i) => (
              <li key={st.title}>
                <button
                  type="button"
                  onClick={() => setAt(i)}
                  className={`flex w-full items-baseline gap-2 text-left transition-colors ${i === at ? "text-white" : i < at ? "text-ink-3" : "text-ink-4 hover:text-ink-2"}`}
                >
                  <span className={`font-mono text-[11px] ${i === at ? "text-[#ef8b2b]" : ""}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={i === at ? "font-semibold" : ""}>{st.title}</span>
                </button>
              </li>
            ))}
          </ol>

          <div className="mt-6 flex items-center justify-between gap-3">
            <button type="button" onClick={() => setAt((i) => Math.max(0, i - 1))} disabled={at === 0} className={`${btn} bg-white/10 text-white hover:bg-white/20`}>
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {at < steps.length - 1 ? (
              <button type="button" onClick={() => setAt((i) => i + 1)} className={`${btn} bg-white text-black hover:bg-white/90`}>
                Done, next step <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button type="button" onClick={restart} className={`${btn} bg-white text-black hover:bg-white/90`}>
                <RotateCcw className="h-4 w-4" /> Try again
              </button>
            )}
          </div>
        </div>

        {/* the prototype */}
        <div className="h-[640px] overflow-hidden rounded-2xl border border-line bg-black sm:h-[720px] lg:h-[760px]">
          <iframe key={run} src={src} title={`${title} — ${label}`} loading="lazy" allowFullScreen className="h-full w-full" />
        </div>
      </div>
    </section>
  )
}
