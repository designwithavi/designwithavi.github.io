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
  return (
    <div
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
          className="z-20 order-2 text-center lg:order-1 lg:text-left"
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
        <div className="relative order-1 flex h-full min-h-[380px] items-center justify-center lg:order-2 md:min-h-[520px]">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="absolute z-0 h-[260px] w-[260px] md:h-[360px] md:w-[360px] lg:h-[440px] lg:w-[440px]"
          >
            {orb ?? <div className="h-full w-full rounded-full bg-yellow-400/90" />}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.5 }}
            className="pointer-events-none absolute left-1/2 top-1/2 z-[5] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[19vw] lg:text-[clamp(4.5rem,10.5vw,11rem)] leading-none font-extrabold tracking-tighter text-ink"
          >
            {name}
          </motion.h1>

          <motion.img
            src={imageSrc}
            alt={imageAlt}
            className="relative z-10 h-auto max-h-[70svh] w-56 object-contain md:w-72 lg:w-80"
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
          className="z-20 order-3 text-center lg:ml-auto lg:max-w-[16rem] lg:text-right"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-ink/60">{sideText.title}</p>
          <p className="mt-2 font-heading text-2xl italic text-ink">{sideText.detail}</p>
        </motion.div>
      </div>

      {/* Footer Elements */}
      <footer className="z-30 mt-8 flex w-full max-w-7xl items-center justify-between">
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
