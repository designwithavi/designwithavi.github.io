import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

/**
 * The curtain between pages: a paper panel sweeps up, shows where you're going
 * with a line filling underneath, then lifts away once the page's first images
 * are in.
 */

const MIN_MS = 550
const MAX_MS = 1500
const ease = [0.76, 0, 0.24, 1] as const

/** Resolves when the images have loaded (or failed), but never sooner than MIN_MS or later than MAX_MS. */
export function preload(srcs: string[]) {
  const loads = Promise.all(
    srcs.map(
      (src) =>
        new Promise<void>((done) => {
          const img = new Image()
          img.onload = img.onerror = () => done()
          img.src = src
        }),
    ),
  )
  const atLeast = new Promise((r) => setTimeout(r, MIN_MS))
  const atMost = new Promise((r) => setTimeout(r, MAX_MS))
  return Promise.race([Promise.all([loads, atLeast]), atMost])
}

export function PageLoader({ label, kicker }: { label: string | null; kicker?: string }) {
  const reduce = useReducedMotion()
  return (
    <AnimatePresence>
      {label && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-ink px-6 text-center"
          initial={reduce ? { opacity: 0 } : { y: "100%" }}
          animate={reduce ? { opacity: 1 } : { y: 0 }}
          exit={reduce ? { opacity: 0 } : { y: "-100%" }}
          transition={{ duration: 0.45, ease }}
          aria-live="polite"
          aria-label={`Loading ${label}`}
        >
          {kicker && (
            <motion.p
              className="mb-4 text-xs uppercase tracking-[0.2em] text-paper/60"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              {kicker}
            </motion.p>
          )}
          <motion.p
            className="font-heading text-5xl leading-none text-paper sm:text-7xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            {label}
          </motion.p>
          <div className="mt-8 h-px w-40 overflow-hidden bg-paper/20">
            <motion.div
              className="h-full bg-paper"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: MAX_MS / 1000, ease: [0.3, 0.6, 0.4, 1], delay: 0.25 }}
              style={{ transformOrigin: "0 50%" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
