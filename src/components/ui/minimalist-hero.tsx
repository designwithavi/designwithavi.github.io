import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * Minimalist Hero — adapted from 21st.dev.
 *
 * Changes from the original: the header is left out (the site has its own
 * fixed nav), the plain yellow circle is a slot (`orb`) so it can be anything,
 * and the big headline sits in the centre, behind the cut-out portrait.
 */

type IconType = React.ComponentType<{ className?: string }>

interface MinimalistHeroProps {
  /** The big word in the middle, behind the portrait. */
  name: string
  mainText: string
  readMoreLink: string
  readMoreLabel?: string
  imageSrc: string
  imageAlt: string
  /** Shown if `imageSrc` fails to load. */
  fallbackImageSrc?: string
  /** The small block on the right. */
  sideText: { title: string; detail: string }
  socialLinks: { icon: IconType; href: string; label: string }[]
  locationText: string
  /** What sits behind the portrait. Defaults to the original yellow circle. */
  orb?: React.ReactNode
  className?: string
}

const ease = [0.22, 1, 0.36, 1] as const

/**
 * Sizes `text` so it spans `box`'s content width exactly, edge to edge.
 * Text width scales linearly with font size, so one measurement is enough.
 */
export function useFitWidth(box: React.RefObject<HTMLElement | null>, text: React.RefObject<HTMLElement | null>) {
  React.useLayoutEffect(() => {
    const b = box.current
    const t = text.current
    if (!b || !t) return
    const fit = () => {
      const cs = getComputedStyle(b)
      const target = b.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      t.style.fontSize = "100px"
      const w = t.scrollWidth
      if (w > 0) t.style.fontSize = `${(100 * target) / w}px`
    }
    fit()
    document.fonts?.ready.then(fit) // re-measure once the real font has loaded
    const ro = new ResizeObserver(fit)
    ro.observe(b)
    return () => ro.disconnect()
  }, [box, text])
}

const SocialIcon = ({ href, icon: Icon, label }: { href: string; icon: IconType; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="text-ink/60 transition-colors hover:text-ink"
  >
    <Icon className="h-5 w-5" />
  </a>
)

export const MinimalistHero = ({
  name,
  mainText,
  readMoreLink,
  readMoreLabel = "Read More",
  imageSrc,
  imageAlt,
  fallbackImageSrc,
  sideText,
  socialLinks,
  locationText,
  orb,
  className,
}: MinimalistHeroProps) => {
  const heroRef = React.useRef<HTMLDivElement>(null)
  const nameRef = React.useRef<HTMLSpanElement>(null)
  const titleRef = React.useRef<HTMLHeadingElement>(null)
  const leftRef = React.useRef<HTMLDivElement>(null)
  const rightRef = React.useRef<HTMLDivElement>(null)
  const footRef = React.useRef<HTMLElement>(null)

  // The name spans the full width — unless the screen is too short for that:
  // on wide layouts it must sit wholly between the two side texts above and the
  // footer below, so it shrinks (and moves down) to fit that band.
  React.useLayoutEffect(() => {
    const hero = heroRef.current, t = nameRef.current, h1 = titleRef.current
    if (!hero || !t || !h1) return
    const fit = () => {
      const cs = getComputedStyle(hero)
      const target = hero.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      t.style.fontSize = "100px"
      const w = t.scrollWidth
      if (!w) return
      let size = (100 * target) / w
      h1.style.top = ""
      const left = leftRef.current, right = rightRef.current, foot = footRef.current
      if (window.innerWidth >= 1024 && left && right && foot) {
        // measure where things sit without their entrance offsets
        const bottomOf = (e: HTMLElement) => e.offsetTop + e.offsetHeight
        const parent = h1.offsetParent as HTMLElement
        const origin = parent.getBoundingClientRect().top - hero.getBoundingClientRect().top
        const gap = 28
        const top = Math.max(bottomOf(left), bottomOf(right)) + (left.offsetParent as HTMLElement).offsetTop + gap
        const bottom = foot.offsetTop - gap
        const lead = 0.78 // the title's line height
        size = Math.min(size, Math.max(120, (bottom - top) / lead))
        t.style.fontSize = `${size}px`
        const half = (size * lead) / 2
        // stay centred if there's room; otherwise sit just below the side texts
        const centre = parent.offsetHeight / 2 + origin
        const y = Math.min(Math.max(centre, top + half), bottom - half)
        h1.style.top = `${y - origin}px`
        return
      }
      t.style.fontSize = `${size}px`
    }
    fit()
    document.fonts?.ready.then(fit) // re-measure once the real font has loaded
    const ro = new ResizeObserver(fit)
    ro.observe(hero)
    return () => ro.disconnect()
  }, [])
  return (
    <div
      ref={heroRef}
      className={cn(
        "relative flex min-h-[100svh] w-full flex-col items-center justify-between overflow-hidden px-5 pt-24 pb-8 font-sans sm:px-8 md:px-12",
        className,
      )}
    >
      {/* Main Content Area */}
      <div className="relative grid w-full max-w-7xl flex-grow grid-cols-1 items-center gap-8 lg:grid-cols-3 lg:gap-0">
        {/* Left Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          ref={leftRef}
          className="z-20 order-2 text-center lg:order-1 lg:self-start lg:pt-16 lg:text-left"
        >
          <p className="mx-auto max-w-xs text-sm leading-relaxed text-ink/80 lg:mx-0">{mainText}</p>
          <a
            href={readMoreLink}
            className="mt-4 inline-block text-sm font-medium text-ink underline decoration-from-font underline-offset-4"
          >
            {readMoreLabel}
          </a>
        </motion.div>

        {/* Centre: orb, name, portrait */}
        <div className="relative order-1 mb-14 flex h-full min-h-[380px] items-center justify-center md:min-h-[520px] lg:order-2 lg:mb-0">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="absolute z-0 h-[260px] w-[260px] md:h-[360px] md:w-[360px] lg:h-[440px] lg:w-[440px]"
          >
            {orb ?? <div className="h-full w-full rounded-full bg-yellow-400/90" />}
          </motion.div>

          <motion.h1
            ref={titleRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.5 }}
            className="pointer-events-none absolute left-1/2 top-1/2 z-[5] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-display leading-[.78] font-black uppercase tracking-[-0.01em] text-ink dark:[text-shadow:0_4px_28px_rgba(0,0,0,.42)]"
          >
            <span ref={nameRef} className="inline-block">
              {name}
            </span>
          </motion.h1>

          <motion.img
            src={imageSrc}
            alt={imageAlt}
            className="hero-portrait relative z-10 h-auto max-h-[78svh] w-[min(92vw,360px)] max-w-none shrink-0 object-contain md:w-[440px] lg:w-[540px] translate-y-14 lg:translate-y-16"
            style={{ maskImage: "linear-gradient(to bottom, #000 78%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, #000 78%, transparent 100%)" }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.4 }}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.onerror = null
              if (fallbackImageSrc) target.src = fallbackImageSrc
            }}
          />
        </div>

        {/* Right Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          ref={rightRef}
          className="z-20 order-3 text-center lg:ml-auto lg:max-w-[16rem] lg:self-start lg:pt-16 lg:text-right"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-ink/60">{sideText.title}</p>
          <p className="mt-2 font-heading text-2xl text-ink">{sideText.detail}</p>
        </motion.div>
      </div>

      {/* Footer Elements */}
      <footer ref={footRef} className="z-30 mt-8 flex w-full max-w-7xl items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="flex items-center space-x-4"
        >
          {socialLinks.map((link) => (
            <SocialIcon key={link.label} href={link.href} icon={link.icon} label={link.label} />
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="text-sm font-medium text-ink/80"
        >
          {locationText}
        </motion.div>
      </footer>
    </div>
  )
}
